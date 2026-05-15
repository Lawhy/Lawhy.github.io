---
title: Bridging Agent Scaffolding and RL Training with Strands-SGLang
date: 2026-01-14
tags: [AI Agents, Agent Scaffolds, Agentic RL, SGLang, slime]
slug: strands-sglang
summary: ""
---

**Authors**: [Yuan He](https://www.yuanhe.wiki/), [Chengxing Xie](https://yitianlian.github.io/)
**GitHub**: [strands-rl/strands-sglang](https://github.com/strands-rl/strands-sglang)
**Page on Strands**: [SGLang](https://strandsagents.com/docs/community/model-providers/sglang/)
**Example on Slime**: [slime/examples/strands_sglang](https://github.com/THUDM/slime/tree/main/examples/strands_sglang)

---

> **TL;DR:** Existing agent scaffolds like **Strands-Agents** [1] make it easy to serve tool-using agents but face a key challenge: they operate on **text** (usually with OpenAI endpoint) while RL training requires exact **token IDs** (token-in, token-out). This mismatch causes **retokenization drift** [2] — the tokens used for computing logprobs/gradients no longer match the tokens that were actually generated — leading to effectively **off-policy** updates and potentially unstable RL training. **Strands-SGLang** bridges this gap by extending **Strands-Agents** with SGLang's native endpoint [3] while keeping the same customizable agent loop.

| Component | Agent scaffold / loop | Token-in/token-out |
|---|---|---|
| Strands-Agents | ✅ | ❌ (text-based) |
| SGLang | ❌ | ✅ |
| **Strands-SGLang** | ✅ | ✅ |

## The challenge: making agent scaffolds training-ready

Most agent scaffolds provide a great **agent loop** (tool orchestration, iteration control, tracing), but their model interface is typically **text-based**. For RL training, text alone is insufficient: the training pipeline must consume the *exact* **token-level trajectory** produced by the backend.

If token IDs are reconstructed later by retokenizing the rendered text messages, **retokenization drift** can occur, making updates effectively **off-policy** and potentially destabilizing RL training.

**Strands-SGLang addresses this by bridging both worlds:**

- ✅ **Strands** for the customizable agent scaffold / loop
- ✅ **SGLang** native generation for **end-to-end token-in/token-out** rollouts

So you can keep the same agent loop for **serving** while producing **training-ready** trajectories by construction.

<details>
<summary>Optional read: Differences between agent serving and training</summary>

Agent **serving** and agent **training** look similar on the surface (both run an agent loop that calls tools and produces answers), but they optimize for *different aspects and failure modes*.

| Aspect | Agent Servicing (production) | Agent Training (RL / post-training) |
|---|---|---|
| **Response I/O** | Text messages | Token IDs |
| **Tool Parsing** | Lenient (with post-processing fallbacks) | Strict (respects true policy distribution) |
| **Client** | Optimized for reliability + UX | Optimized for high-throughput rollouts |
| **Streaming** | Optional (for UX) | No (reducing client overhead) |

</details>

## What Strands-SGLang provides

Strands-SGLang implements a new model class `SGLangModel` backed by SGLang's native `/generate` endpoint, so you can reuse Strands' agent loop while exposing RL-relevant internals:

- **Token-in/token-out rollouts** (token IDs + logprobs/masks): no retokenization drift
- **Strict, on-policy tool-call parsing**: no heuristic repair or post-processing; tool calls are parsed exactly as emitted by the model
- **Native SGLang API**: high-throughput, non-streaming rollouts

## Minimal example

You run a normal Strands agent — but now you can directly read token-level artifacts from the model:

```python
from transformers import AutoTokenizer
from strands import Agent
from strands_tools import calculator
from strands_sglang import SGLangModel

# Suppose Qwen3-8B is served at http://localhost:30000
agent = Agent(
    model=SGLangModel(
        tokenizer=AutoTokenizer.from_pretrained("Qwen/Qwen3-8B"),
        base_url="http://localhost:30000"),
    tools=[calculator],
)
result = await agent.invoke_async("What is (25 * 17)^3 ?")

tm = model.token_manager
print("token_ids:", tm.token_ids)
print("loss_mask:", tm.loss_mask)
print("logprobs:", tm.logprobs)
```

This is the key: the rollout is *already* in the form that RL training wants, and you don't need to worry about writing ad-hoc agent loop code.

## Experiments

We demonstrate the impact of maintaining token-in/token-out (TITO) using a math reasoning agent (with a Python execution tool) with a [Qwen3-8B (thinking)](https://huggingface.co/Qwen/Qwen3-8B) backend.

### Implementations

- TITO implementation: [slime/examples/strands_sglang](https://github.com/THUDM/slime/tree/main/examples/strands_sglang)
- Non-TITO implementation: replacing `SGLangModel` with `OpenAIModel` and applying retokenization

### Results

Without TITO, training collapsed before step 50 despite a similar initial reward increase.

![](images/training-1.png)

![](images/training-2.png)

---

## References

- [1] Strands Agents SDK: <https://github.com/strands-agents/sdk-python>
- [2] [No More Retokenization Drift: Returning Token IDs via the OpenAI Compatible API Matters in Agent RL](https://blog.vllm.ai/2025/10/22/agent-lightning.html)
- [3] SGLang: <https://docs.sglang.io/>
- [4] Slime: <https://github.com/THUDM/slime/tree/main>
