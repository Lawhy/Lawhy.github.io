# Design: From Agent Loops to Trainable Environments

## Building Blocks: Agent Loops and Hooks

An agent loop can be abstracted as:

```python
while not done:
    response = model.generate(prompt)
    tool_calls = parse_tools(response)
    results = execute_tools(tool_calls)
    prompt = append(prompt, results)
```

But for customizability, we need flexible intervensions in different "events". e.g.,

- early stop if tool call budget is exceeded
- cancel tool calls when too many
- simulate human feedback at the end to extend the episode
- call context manager when context window is about to exceed

```python
# BeforeAgentInvoke
while not done:
    # BeforeModeCall
    response = model.generate(prompt)
    # AfterModelCall
    # BeforeToolCall
    tool_calls = parse_tools(response)
    # AfterToolCall
    results = execute_tools(tool_calls)
    # OnMessageAdded
    prompt = append(prompt, results)
# AfterAgentInvoke
```



But the moment you want to **train** on this loop, you need answers to questions the simple abstraction doesn't address **correctness**, **reliability**, and **efficiency**:

- **How do you track the token trajectory faithfully for on-policy training?** Model outputs and environment inputs (tool results, user prompts, context injections, etc.) interleave across multi-turn interactions. You need aligned token IDs, logprobs, and loss masks for the full episode — without retokenization drift.

- **How do you handle diverse chat templates and tool call formats?** Different model families (Qwen, GLM, Kimi, etc.) use different chat templates and emit tool calls in incompatible formats (JSON, XML, special tokens). The system needs a clean way to handle each when needed.
    - <tool_call> within <think> - how to treat it?

- **How is the episode terminated?** Max tokens? Context overflow? Tool limit? Timeout? Each termination mode has different implications for reward shaping, and the training pipeline needs well-classified reasons.

- **How do you compute reward?** Reward often depends on the full output trajectory. Rule-based (verifiable) and LLM-as-judge rewards have different latency and reliability profiles.

- **How do you execute tools efficiently?** `async` is the default solution for I/O-boud executions (e.g., API calls) butwe also need true parallelsim (e.g., `multiprocessing`) where appropriate


## Everyone can Construct an Agent Environment, But

And the moment you want to train on **multiple tasks**, it compounds:

- A unified interface makes things easier for mixed-task trainin (e.g., multi-task agentic RL, multi-teacher OPD) without ad-hoc mixing set-ups per-rollout all differently
- Evaluation and training should share the same `env.step()` — maintaining two codepaths that can drift is a liability.



## The Gym-Like Interface

The core abstraction is borrowed from OpenAI Gym but adapted for agentic RL:

```
step(action) -> (observation, reward, termination_reason, metrics)
```

The key difference from Gym: each `step()` is not a single model call but a **full agent episode** — prompt in, multi-turn tool-calling loop, final answer out. The environment wraps the entire agent loop.

### Action

An `Action` carries a user message and a `TaskContext`:

```python
class Action(BaseModel):
    message: str | Message
    task_context: TaskContext  # ground_truth, conversation_history, arbitrary metadata

class TaskContext(BaseModel):
    model_config = ConfigDict(extra="allow")  # arbitrary task-specific fields
    id: str
    ground_truth: Any = None
    conversation_history: Messages = []
```

The `extra="allow"` on `TaskContext` is deliberate — different tasks need different metadata (difficulty level, domain, expected tool sequence, etc.) and forcing a fixed schema would make the interface rigid.

### Observation

An `Observation` bundles what the environment produced:

```python
class Observation(BaseModel):
    messages: Messages           # conversation messages from this step
    tokens: TokenObservation     # TITO: token_ids, loss_mask, logprobs, prompt_length
    metrics: dict[str, Any]      # tool counts, latencies, cache hit rate
    routed_experts: str | None   # MoE expert indices for R3 (optional)
```

`TokenObservation` splits cleanly into initial prompt vs. rollout:

```python
class TokenObservation(BaseModel):
    token_ids: list[int]
    prompt_length: int             # everything before this is the initial prompt
    loss_mask: list[int]           # 0 = prompt/tool result, 1 = model output
    logprobs: list[float | None]
```

The `prompt_length` split matters for RL: `token_ids[:prompt_length]` is the context the model was conditioned on; `token_ids[prompt_length:]` is the rollout where loss is computed.

### StepResult

```python
class StepResult(BaseModel):
    observation: Observation
    reward: RewardResult | None = None
    termination_reason: TerminationReason
```


## The Event-Based Hook System

The Strands Agent SDK has an event loop that emits typed events:

- `MessageAddedEvent` — fires when a message (assistant or user/tool-result) is appended
- `BeforeToolCallEvent` — fires before each tool execution

Hooks register callbacks on these events without modifying the agent core. This is the extensibility mechanism that makes environments "portal components."

### ToolLimiter: The Canonical Hook

`ToolLimiter` is the cleanest example of how hooks compose with the environment:

```python
class ToolLimiter(HookProvider):
    def register_hooks(self, registry: HookRegistry, **kwargs):
        registry.add_callback(MessageAddedEvent, self._on_message_added)
        registry.add_callback(BeforeToolCallEvent, self._on_before_tool_call)
```

It observes two events:

1. **`MessageAddedEvent` with role=assistant + toolUse** — increments the iteration counter and the individual call counter.
2. **`MessageAddedEvent` with role=user + toolResult** — checks limits and raises `MaxToolIterationsReachedError` or `MaxToolCallsReachedError` if exceeded.
3. **`BeforeToolCallEvent`** — if the parallel call limit is exceeded, cancels the tool call by setting `event.cancel_tool` with an error message.

The key design choice: it raises **after the iteration completes** (on tool result), not mid-generation. This ensures the token trajectory is clean — no truncated tokens that would corrupt the loss mask.

### How the Environment Connects Hooks to Termination

The `Environment.step()` wraps the agent invocation in a try/except and maps exceptions to structured termination reasons:

```python
async def step(self, action):
    ...
    error = None
    try:
        await agent.invoke_async(message)
    except Exception as e:
        error = e
    termination_reason = TerminationReason.from_error(error)
```

`TerminationReason.from_error()` walks the `__cause__` chain — because Strands re-raises a fresh `EventLoopException` at every recursive `event_loop_cycle`, deep tool-call paths produce multi-level wrappings:

```python
@classmethod
def from_error(cls, error):
    cause = error
    while isinstance(cause, EventLoopException) and cause.__cause__ is not None:
        cause = cause.__cause__

    match cause:
        case MaxTokensReachedException():        return cls.MAX_TOKENS_REACHED
        case ContextWindowOverflowException():   return cls.CONTEXT_WINDOW_OVERFLOW
        case MaxToolIterationsReachedError():     return cls.MAX_TOOL_ITERATIONS_REACHED
        case MaxToolCallsReachedError():          return cls.MAX_TOOL_CALLS_REACHED
        case RecursionError():                    return cls.RECURSION_DEPTH_EXCEEDED
        case e if cls._is_timeout(e):             return cls.TIMEOUT
        case e if cls._is_connection_error(e):    return cls.CONNECTION_ERROR
        case _:                                   return cls.UNCLASSIFIED_ERROR
```

This is the **event dispatch mechanism**: hooks raise exceptions inside the event loop, the environment catches and classifies them. The environment author doesn't need to know which hooks are active or what they might raise — the mapping is centralized and exhaustive.


## Extending Environments: The Override Points

The base `Environment` class defines five override points:

| Method | Purpose | Default |
|---|---|---|
| `get_tools()` | Tools available to the agent | `[]` |
| `get_hooks()` | Additional agent hooks (beyond ToolLimiter) | `[]` |
| `get_conversation_manager()` | Context window handling strategy | `NullConversationManager()` |
| `reset()` | Async resource initialization (containers, sessions) | no-op |
| `cleanup()` | Async resource teardown | no-op |

### Minimal Environment: CalculatorEnv

```python
class CalculatorEnv(Environment):
    default_system_prompt_path = Path(__file__).parent / "system_prompt.md"

    def get_tools(self):
        return [calculator]
```

That's it. 8 lines. The environment inherits token tracking, termination handling, metrics collection, and reward computation. The author only specifies what's unique to their task.

### Complex Environment: WebSearchEnv

```python
class WebSearchConfig(EnvironmentConfig, total=False):
    search_provider: WebSearchAPIProvider
    search_timeout: int
    blocked_domains: list[str]
    scrape_enabled: bool
    scrape_timeout: int
    scrape_token_budget: int

class WebSearchEnv(Environment):
    def __init__(
        self, *,
        model_factory: ModelFactory,
        reward_fn: RewardFunction | None = None,
        search_concurrency: asyncio.Semaphore | int = 10,     # non-serializable
        scrape_concurrency: asyncio.Semaphore | int = 10,      # non-serializable
        summarizer_model_factory: ModelFactory | None = None,   # non-serializable
        **config: Unpack[WebSearchConfig],                      # serializable
    ):
        super().__init__(model_factory=model_factory, reward_fn=reward_fn, **config)
        self.search_toolkit = WebSearchToolkit(
            timeout=self.config.get("search_timeout", 10),
            concurrency=search_concurrency,
            ...
        )
        ...

    def get_tools(self):
        tools = [self.search_tool]
        if self.scrape_tool:
            tools.append(self.scrape_tool)
        return tools

    async def cleanup(self):
        await self.search_toolkit.cleanup()
        ...
```

This shows the **config serialization boundary**: JSON-serializable settings (`search_timeout`, `blocked_domains`) go in the TypedDict and can cross process boundaries (CLI args, Ray actors). Non-serializable dependencies (`asyncio.Semaphore`, `ModelFactory`) are named `__init__` params.


## The ModelFactory Pattern: Fresh Model Per Step

```python
ModelFactory = Callable[[], Model]
```

Each `step()` calls `self.model_factory()` to get a **fresh** Model instance. Why?

1. **State isolation.** SGLangModel accumulates `token_manager`, `message_count`, `tool_parse_errors`. Sharing across steps would leak state between episodes.
2. **Concurrent safety.** Multiple steps can run concurrently (via asyncio or Ray). Fresh instances eliminate shared-state races.
3. **Backend agnosticism.** The environment doesn't know whether the factory returns an SGLangModel, BedrockModel, or OpenAIModel. It just calls the factory.

But **expensive, thread-safe objects are shared** across factory calls:

```python
def sglang_model_factory(*, client, tokenizer, tool_parser, ...):
    # client, tokenizer, tool_parser are closed over — shared across all calls
    return lambda: SGLangModel(
        client=client,           # shared SGLangClient (connection pool)
        tokenizer=tokenizer,     # shared HF tokenizer
        tool_parser=tool_parser, # shared parser instance
        ...
    )
```

The principle: **share what's stateless and expensive; create fresh what's stateful and cheap.**

| Object | Shared? | Why |
|---|---|---|
| `SGLangClient` | Yes | Connection pool, thread-safe, expensive to create |
| `tokenizer` | Yes | Read-only after init, expensive to load |
| `tool_parser` | Yes | Stateless (no instance state between `parse()` calls) |
| `SGLangModel` | No | Accumulates `token_manager`, `message_count`, `tool_parse_errors` |
| `ToolLimiter` | No | Accumulates `tool_iter_count`, `tool_call_count` |

Both `get_client()` and `get_tokenizer()` in `strands_sglang.utils` are `@cache`-backed singletons — calling them repeatedly with the same arguments returns the same instance.


## Reward Functions

```python
class RewardFunction(ABC):
    @abstractmethod
    async def compute(self, action: Action, step_result: StepResult) -> RewardResult:
        ...

class RewardResult(BaseModel):
    reward: float
    info: dict[str, Any] = {}
```

Reward functions receive both the action (with ground truth and task context) and the full step result (observation, tokens, termination reason). This supports:

- **Exact match** — compare `observation.final_response` to `action.task_context.ground_truth`
- **Math equivalence** — SymPy-based symbolic comparison (e.g., `MathVerifyReward`)
- **LLM-as-judge** — use a separate model to grade the response (e.g., `LLMJudgeReward`)
- **Process reward** — inspect the full message trace or token trajectory, not just the final answer

Reward is computed **after** the step completes and the observation is assembled — the reward function is a pure observer, never modifying the trajectory.


## Async + Ray: Local Concurrency vs. Distributed Parallelism

Two concurrency strategies serve different scales:

### Local: asyncio for I/O concurrency

```python
# In Evaluator
async with asyncio.Semaphore(max_concurrency):
    results = await asyncio.gather(*[evaluate_sample(a) for a in actions])
```

Tools use async I/O (aiohttp for web search, async AWS calls for code sandbox). The event loop multiplexes tool executions across concurrent episodes. Good for single-machine evaluation.

### Distributed: Ray for true parallelism

```python
@ray.remote
class EnvironmentActor:
    def __init__(self, env_hook_path, env_hook_config):
        hook = load_env_factory_hook(env_hook_path)
        self.env_factory = hook(**env_hook_config)

    async def step(self, action):
        env = await self.env_factory(action)
        await env.reset()
        return await env.step(action)
```

Each actor runs in its own process with a separate GIL and event loop. The `EnvironmentActorPool` distributes actors across Ray nodes with `NodeAffinitySchedulingStrategy`. The bridge between async and Ray is `asyncio.to_thread(ray.get, ...)` — avoids blocking the caller's event loop.

Why the env hook is a dotted path string, not a lambda: **you can't pickle lambdas across Ray process boundaries.** The hook function is a regular function that can be imported by path, and it creates the env factory dynamically inside each actor process. No cross-process object sharing.


## The Design As a Whole

The invariant across all of this:

> **The environment author specifies what's unique to their task. Everything else — token tracking, termination handling, model lifecycle, metrics, distribution — is inherited.**

The layered architecture:

```
Environment (gym-like interface: step/reset/cleanup)
    ├── Agent (Strands SDK: event loop, tool dispatch, message management)
    │     ├── Model (SGLang/Bedrock/OpenAI — swappable via ModelFactory)
    │     ├── Tools (defined by the environment via get_tools())
    │     └── Hooks (ToolLimiter + custom hooks via get_hooks())
    ├── RewardFunction (applied after step completes)
    └── Evaluator / Ray Actor Pool (orchestration layer)
```

The event-based hook system is what makes this composable rather than monolithic. Hooks observe and influence the agent loop without the environment or the model knowing about each other. The exception-to-termination mapping unifies diverse failure modes into a structured enum. The factory pattern separates "what model" from "how it's created." And the config serialization boundary (`TypedDict` for JSON-safe, named params for objects) enables the same environment to run locally or distributed without code changes.


tool parser: <think> as draft

async not enough? When to use distributed: even api calls from 512 batch size 5s to <1s
