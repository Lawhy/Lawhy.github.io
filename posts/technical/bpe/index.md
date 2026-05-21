---
title: Building BPE from Scratch
date: 2026-05-20
slug: bpe
summary: ""
authors: '<a href="https://www.yuanhe.wiki/">Yuan He</a>'
---

Modern language models don't read text — they read sequences of integer IDs. The tokenizer is the bridge: it splits a string into chunks and maps each chunk to a vocabulary index. The design question is what those chunks should be.

Word-level tokenization needs a huge vocabulary and still hits out-of-vocabulary failures on misspellings, neologisms, and non-English text. Character-level avoids OOVs but inflates sequence lengths and forces the model to relearn morphology every batch. **Byte-Pair Encoding (BPE)** sits in the middle: start from the smallest possible alphabet, then *learn* from a training corpus which adjacent pairs deserve to become single tokens. Common patterns like ` the` or `ing` collapse into single IDs; rare strings stay decomposed. The vocabulary size is a knob you turn, and the algorithm fills it with whatever the data says is worth a token.

## Why bytes, not characters

The "smallest possible alphabet" for natural text is debatable — characters? Unicode code points? — but byte-level BPE sidesteps the question. Three properties matter:

- **OOV-free.** Any UTF-8 text decomposes into bytes, so the tokenizer never encounters an input it can't represent.
- **Small and standardized.** Exactly 256 byte values, regardless of script. Compare to Unicode's ~150 000 code points, most of which any single corpus will never touch.
- **Language-agnostic.** English, Chinese, code, and emoji reduce to the same alphabet. No per-language design baked into the tokenizer.

The cost: every piece of linguistic structure — word boundaries, common suffixes, anything a script-aware tokenizer would get for free — has to be *discovered* through merges. That's the trade BPE accepts.

## The training algorithm

Given a corpus and a target vocabulary size, training is the loop below:

<figure class="algorithm">
  <div class="algorithm__title">Algorithm 1 — BPE Training</div>
  <div class="algorithm__io">
    <div><span class="algorithm__label">Input</span> corpus C, target vocab size V</div>
    <div><span class="algorithm__label">Output</span> vocab, merges</div>
  </div>
  <ol>
    <li>vocab &larr; {0, 1, &hellip;, 255} <span class="algorithm__cmt">one ID per byte</span></li>
    <li>merges &larr; [ ] <span class="algorithm__cmt">ordered list, not a set</span></li>
    <li>while |vocab| &lt; V do</li>
    <li class="indent">(a, b) &larr; argmax<sub>p</sub> freq(p, C) <span class="algorithm__cmt">most frequent pair across C</span></li>
    <li class="indent">t &larr; concat(a, b)</li>
    <li class="indent">C &larr; replace(C, (a, b), t) <span class="algorithm__cmt">collapse every (a, b) in one pass</span></li>
    <li class="indent">vocab.add(t)</li>
    <li class="indent">merges.append((a, b))</li>
    <li>return vocab, merges</li>
  </ol>
</figure>

Inference replays the merges in order<sup class="margin-marker"><a href="#note-1">1</a></sup><span class="margin-note" id="note-1"><span class="margin-note__label">Note 1</span>`merges` is a *sequence*, not a set: `(ab, c)` only becomes possible after `(a, b) → ab` has fired. Lose the order and the encoder's output diverges from training.</span>: starting from the byte sequence, apply each learned merge wherever it matches.

That's the entire idea. Every line of the production implementation exists to make this loop run on gigabytes of text without taking days.

## A worked example

Walking the merge loop on a toy corpus<sup class="margin-marker"><a href="#note-2">2</a></sup><span class="margin-note" id="note-2"><span class="margin-note__label">Note 2</span>After pre-tokenization (covered later), the corpus is stored as `{tuple(bytes_in_pretoken): count}` — each pre-token contributes its `count` to every pair it contains.</span> &mdash; each letter is its single-byte atom, ties break by preferring the lexicographically greater pair<sup class="margin-marker"><a href="#note-3">3</a></sup><span class="margin-note" id="note-3"><span class="margin-note__label">Note 3</span>Any deterministic rule works — lex-greater is the ecosystem convention (GPT-2, HuggingFace, tiktoken) so reference implementations yield byte-identical merge lists.</span>:

<figure class="algorithm-stepper" aria-label="BPE training trace on toy corpus">
  <div class="algorithm-stepper__header">
    <span class="algorithm-stepper__title">Trace &mdash; setup + 4 iterations</span>
    <button class="algorithm-stepper__play" type="button" aria-pressed="false" aria-label="Play">&#9654;</button>
    <div class="algorithm-stepper__nav">
      <button class="algorithm-stepper__prev" type="button" aria-label="Previous step">&lsaquo;</button>
      <span class="algorithm-stepper__dots" role="tablist" aria-label="Steps">
        <button class="algorithm-stepper__dot" type="button" aria-label="Setup (initial state)"></button>
        <button class="algorithm-stepper__dot" type="button" aria-label="Iteration 1"></button>
        <button class="algorithm-stepper__dot" type="button" aria-label="Iteration 2"></button>
        <button class="algorithm-stepper__dot" type="button" aria-label="Iteration 3"></button>
        <button class="algorithm-stepper__dot" type="button" aria-label="Iteration 4"></button>
      </span>
      <button class="algorithm-stepper__next" type="button" aria-label="Next step">&rsaquo;</button>
    </div>
  </div>
  <div class="algorithm-stepper__frames">
    <div class="algorithm-stepper__frame">
      <div class="algorithm-stepper__row"><span class="algorithm-stepper__row-label">init</span><span class="algorithm-stepper__meta">byte-level atoms, no merges yet</span></div>
      <div class="algorithm-stepper__row"><span class="algorithm-stepper__row-label">corpus</span>(l, o, w) &times; 2&nbsp;&nbsp;&nbsp;&nbsp;(l, o, w, e, r) &times; 1</div>
      <div class="algorithm-stepper__row"><span class="algorithm-stepper__row-label">pairs</span>(l, o): 3&nbsp;&nbsp;&nbsp;&nbsp;(o, w): 3&nbsp;&nbsp;&nbsp;&nbsp;(w, e): 1&nbsp;&nbsp;&nbsp;&nbsp;(e, r): 1</div>
    </div>
    <div class="algorithm-stepper__frame">
      <div class="algorithm-stepper__row"><span class="algorithm-stepper__row-label">merge</span><span class="pair-hl">(o, w)</span><span class="algorithm-stepper__meta">tied with (l, o) at 3; lex-greater wins</span></div>
      <div class="algorithm-stepper__row"><span class="algorithm-stepper__row-label">corpus</span>(l, <span class="pair-hl">ow</span>) &times; 2&nbsp;&nbsp;&nbsp;&nbsp;(l, <span class="pair-hl">ow</span>, e, r) &times; 1</div>
      <div class="algorithm-stepper__row"><span class="algorithm-stepper__row-label">pairs</span>(l, <span class="pair-hl">ow</span>): 3&nbsp;&nbsp;&nbsp;&nbsp;(<span class="pair-hl">ow</span>, e): 1&nbsp;&nbsp;&nbsp;&nbsp;(e, r): 1</div>
    </div>
    <div class="algorithm-stepper__frame">
      <div class="algorithm-stepper__row"><span class="algorithm-stepper__row-label">merge</span><span class="pair-hl">(l, ow)</span><span class="algorithm-stepper__meta">count 3, uncontested</span></div>
      <div class="algorithm-stepper__row"><span class="algorithm-stepper__row-label">corpus</span>(<span class="pair-hl">low</span>,) &times; 2&nbsp;&nbsp;&nbsp;&nbsp;(<span class="pair-hl">low</span>, e, r) &times; 1</div>
      <div class="algorithm-stepper__row"><span class="algorithm-stepper__row-label">pairs</span>(<span class="pair-hl">low</span>, e): 1&nbsp;&nbsp;&nbsp;&nbsp;(e, r): 1</div>
    </div>
    <div class="algorithm-stepper__frame">
      <div class="algorithm-stepper__row"><span class="algorithm-stepper__row-label">merge</span><span class="pair-hl">(low, e)</span><span class="algorithm-stepper__meta">tied with (e, r) at 1; lex-greater wins</span></div>
      <div class="algorithm-stepper__row"><span class="algorithm-stepper__row-label">corpus</span>(low,) &times; 2&nbsp;&nbsp;&nbsp;&nbsp;(<span class="pair-hl">lowe</span>, r) &times; 1</div>
      <div class="algorithm-stepper__row"><span class="algorithm-stepper__row-label">pairs</span>(<span class="pair-hl">lowe</span>, r): 1</div>
    </div>
    <div class="algorithm-stepper__frame">
      <div class="algorithm-stepper__row"><span class="algorithm-stepper__row-label">merge</span><span class="pair-hl">(lowe, r)</span><span class="algorithm-stepper__meta">count 1</span></div>
      <div class="algorithm-stepper__row"><span class="algorithm-stepper__row-label">corpus</span>(low,) &times; 2&nbsp;&nbsp;&nbsp;&nbsp;(<span class="pair-hl">lower</span>,) &times; 1</div>
      <div class="algorithm-stepper__row"><span class="algorithm-stepper__row-label">pairs</span>&empty;&nbsp;&nbsp;&rarr;&nbsp;&nbsp;stop</div>
    </div>
  </div>
</figure>

The final vocabulary gained `ow`, `low`, `lowe`, `lower` in that order, with `merges = [(o,w), (l,ow), (low,e), (lowe,r)]`. Two things worth noticing:

- By iteration 2, the atoms being counted aren't all single bytes — `low` is a three-byte merged atom that participates in pair counting just like a single byte does. What you're counting at iteration 50 is *atom pairs*, not byte pairs in any literal sense.
- The deterministic tiebreak fires at iterations 1 and 3 and produces a stable, reproducible merge order. At inference time, replaying these four merges on a fresh occurrence of "lower" walks the input through the same four-step collapse.

## From algorithm to system

Forty lines of Python implement everything above. At realistic scale — vocab 32 000 on an 11 GB OpenWebText corpus — the naive version is unusable: counting every adjacent pair across the whole corpus every iteration is roughly $O(N \cdot V)$ where $N$ is the corpus size in bytes and $V$ is the vocab size, and $N$ dominates.

The rest of this post is about the engineering moves that turn the loop above into a tokenizer that finishes in minutes instead of days.

## Vocab initialization and pre-tokenization

Two preparation steps run before the merge loop: build the initial vocab, and split the corpus into pre-tokens.

```python
vocab: dict[int, bytes] = {i: bytes([i]) for i in range(256)}
for s in special_tokens:
    vocab[len(vocab)] = s.encode("utf-8")
```

256 byte-value entries plus one per special token (e.g., `<|endoftext|>`, document separators), assigned sequential IDs. Each later merge appends one more; training stops at `vocab_size`.

Pre-tokenization splits the corpus into word-like units *before* the merge loop sees the data, and the contract is **no merge can ever span a pre-token boundary**. Without that fence, the most frequent byte pair in English text is something like `b' t'` (space then `t` — every *the / to / that / this / there* contributes). The first few merges would absorb whitespace into tokens (`b' the '`), and subsequent merges would happily cross word boundaries (`b' of the '`). The vocab budget burns on byte-frequency junk instead of linguistic units.

The standard splitter is the GPT-2 regex:

```python
PAT = re.compile(r"""'(?:[sdmt]|ll|ve|re)| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+""")
```

Six alternatives in order — contractions, letter runs, digit runs, punctuation, trailing whitespace, any other whitespace. The load-bearing branch is `' ?\p{L}+'`: an optional leading space followed by a run of letters. **That leading space is the trick that holds the whole tokenizer together** — it absorbs the preceding whitespace into the word, so `" the"` becomes one pre-token with a single canonical form, instead of splitting vocab across `the` / `' the'` / `' the '`.

Each pre-token is stored as a tuple of single-byte `bytes` objects:

```python
# bytes iterates as ints (0–255); bytes([t]) wraps each back to a 1-byte bytes object.
token = tuple(bytes([t]) for t in match.group(0).encode("utf-8"))
```

The tempting one-character variant silently breaks:

```python
# WRONG because character c doesn't necessarily map to a single byte
token = tuple(c.encode("utf-8") for c in match.group(0))
```

It iterates by character, so a non-ASCII character (e.g. `"€"` → `b"\xe2\x82\xac"`) becomes a single 3-byte atom that doesn't exist in the 256-byte vocab and can never be built up from merges. ASCII-only tests pass; real input produces garbage IDs.

## Parallel pre-tokenization

The previous section established *what* pre-tokenization computes. On gigabytes of text, *how fast* it computes matters. Single-threaded pre-tokenization on the OpenWebText corpus is minutes-to-an-hour of pure regex; parallelizing it across CPU cores drops that to seconds.

Since pre-tokenization parallelizes into similar-size chunks and each chunk's processing is CPU-bound (regex scans, dict updates, byte-tuple construction), `ProcessPoolExecutor`<sup class="margin-marker"><a href="#note-4">4</a></sup><span class="margin-note" id="note-4"><span class="margin-note__label">Note 4</span>`asyncio.to_thread` (or raw threading) only delivers concurrency when the work *releases the GIL* — blocking I/O syscalls like `socket.recv`/`file.read` do, and C extensions like NumPy or PyTorch do during their compute kernels. Pure-Python CPU work doesn't. Pre-tokenization is regex + dict updates in Python — GIL held throughout, threads serialize. Processes get separate interpreters with separate GILs, so they actually parallelize.</span> is the natural fit.

For the workers to be independent, each chunk must start (and end) on a special-token boundary. Otherwise a document gets sliced across two workers, and the worker that owns the second half sees a pre-token that started mid-word — bad data.

The naive approach is to read the whole file and split on the special-token byte string. For an 11 GB corpus that's slow and memory-hungry. The cleverer move: start from N+1 uniformly spaced byte offsets, then *snap each offset forward* to the next occurrence of the first special token, scanning a small window at a time.

```python
mini_chunk_size = 4096  # scan ahead in 4 KB increments
file.seek(initial_position)
while True:
    mini_chunk = file.read(mini_chunk_size)
    if mini_chunk == b"":
        chunk_boundaries[bi] = file_size
        break
    found_at = mini_chunk.find(split_special_token)
    if found_at != -1:
        chunk_boundaries[bi] = initial_position + found_at
        break
    initial_position += mini_chunk_size
```

Read 4 KB. Search for the delimiter byte string. Hit → snap the boundary to that byte offset, done. Miss → advance the position and try the next window. Total I/O per boundary is roughly the average distance from a uniform guess to the next delimiter — typically kilobytes, not gigabytes. The outer routine handles the boundary array, the EOF case, and dedup (two guesses can snap to the same delimiter, especially near document-sparse regions).

So the entire parallelism story reduces to: find chunk boundaries, then process each chunk in its own worker<sup class="margin-marker"><a href="#note-5">5</a></sup><span class="margin-note" id="note-5"><span class="margin-note__label">Note 5</span>Concretely: pre-tokenization on the TinyStories validation set (~22 MB plain text) finishes in ~5 s with 4 workers.</span>. Pre-tokenization itself is $O(N)$ in corpus bytes — roughly $O(N / P)$ wall-clock with $P$ workers, until disk bandwidth becomes the binding constraint. The merge loop is up next, and that's where the algorithm's real cost lives.

## The merge loop, made tractable

The naive merge loop recomputes pair counts from scratch every iteration: scan the whole corpus, count every adjacent pair, pick the max. With $N$ corpus bytes and $V$ merges, that's $O(N \cdot V)$. For OpenWebText (~11 GB ≈ $10^{10}$ bytes) and vocab 32 000, $N \cdot V$ is on the order of $10^{14}$ counter increments — many hours on a single core, with most of the work redundant: the corpus state at iteration $K{+}1$ is nearly identical to iteration $K$'s.

The fix is to maintain pair statistics *incrementally* across iterations. Two indices, both keyed by adjacent pair:

```python
pair_counts: dict[tuple[bytes, bytes], int]                          # forward: pair → count
pair_to_pretokens: dict[tuple[bytes, bytes], set[tuple[bytes, ...]]] # reverse: pair → pre-tokens containing it
```

`pair_counts` gives the current frequency of every pair. `pair_to_pretokens` is the load-bearing trick: for any pair, it names *exactly which pre-token shapes currently contain it*. When a merge fires, only those pre-tokens need updating — typically a tiny fraction of distinct shapes.

The merge loop body:

```python
best_pair = max(pair_counts, key=lambda p: (pair_counts[p], p))
merged_token = best_pair[0] + best_pair[1]
merges.append(best_pair)
vocab[len(vocab)] = merged_token

affected_pretokens = pair_to_pretokens.pop(best_pair)
pair_counts.pop(best_pair)

for old_pretoken in affected_pretokens:
    n = pretoken_counts.pop(old_pretoken)

    # withdraw: subtract old contributions to every pair except best_pair
    for a, b in zip(old_pretoken, old_pretoken[1:]):
        if (a, b) == best_pair:
            continue
        pair_counts[(a, b)] -= n
        if pair_counts[(a, b)] <= 0:
            pair_counts.pop((a, b))
        containing = pair_to_pretokens.get((a, b))
        if containing is not None:
            containing.discard(old_pretoken)
            if not containing:
                pair_to_pretokens.pop((a, b))

    # rewrite: collapse best_pair in one left-to-right pass
    new_pretoken = _apply_merge(old_pretoken, best_pair, merged_token)

    # register: add the new shape's contributions
    for a, b in zip(new_pretoken, new_pretoken[1:]):
        pair_counts[(a, b)] = pair_counts.get((a, b), 0) + n
        pair_to_pretokens.setdefault((a, b), set()).add(new_pretoken)

    pretoken_counts[new_pretoken] = pretoken_counts.get(new_pretoken, 0) + n
```

Three phases per affected pre-token: **withdraw** the old shape's pair contributions, **rewrite** the pre-token with the merge applied, **register** the new shape's contributions<sup class="margin-marker"><a href="#note-6">6</a></sup><span class="margin-note" id="note-6"><span class="margin-note__label">Note 6</span>Withdraw and register *look* symmetric but aren't. For pairs that survive the merge — `(y, z)` in `(x, a, b, y, z) → (x, ab, y, z)` — the count round-trips to net zero, but the pre-token reference in `pair_to_pretokens` swaps `old → new`. Pairs destroyed by the merge (`(x, a)`, `(b, y)`) only fire withdraw; pairs newly created (`(x, ab)`, `(ab, y)`) only fire register. Handling all three cases uniformly is simpler than diffing old-pairs against new-pairs.</span>. Cost per iteration becomes $O(|\text{affected}|)$ instead of $O(N)$ — typically well under 5% of distinct pre-token shapes.

Two correctness details. `best_pair` is popped *wholesale* from both indices before the withdraw loop runs — per-pre-token deduction would just drive its count to zero and require removal anyway, so the wholesale pop saves the bookkeeping. Cleanup pops on zero-count and empty-set keep the invariant: every key in either index represents live state in the current corpus. Without them, `max(pair_counts, ...)` could pick a stale zero-count entry.

The rewrite step uses `_apply_merge`, a single left-to-right scan:

```python
def _apply_merge(pretoken, pair, merged_token):
    out, i = [], 0
    while i < len(pretoken):
        if i < len(pretoken) - 1 and (pretoken[i], pretoken[i + 1]) == pair:
            out.append(merged_token)
            i += 2
        else:
            out.append(pretoken[i])
            i += 1
    return tuple(out)
```

The non-obvious correctness point: for a pre-token like `(b'a', b'b', b'a', b'b')` merging `(b'a', b'b')`, this collapses cleanly to `(b'ab', b'ab')` in one pass — both occurrences resolved together. A "find first occurrence and recurse" approach would produce chained partial variants, and the corpus state would drift away from what training intended.

One more compounding optimization sits behind all of this. The corpus is stored as `{pretoken_tuple: frequency}`, not as a flat list of N duplicates. The multiplier `n` rides through every counter update (`pair_counts[(a, b)] -= n`), so the merge loop iterates *distinct pre-token shapes* — tens of thousands for OpenWebText — rather than *total occurrences* — billions. Compounded with the inverted index, this is what drops merge-loop wall time from "single-core, days" to "single-core, minutes".

## Training on TinyStories

Putting it all together on TinyStories — a ~2 GB English corpus of children's stories, `vocab_size = 10 000`, 4 worker processes for pre-tokenization, single `<|endoftext|>` as the document-separator special token. End-to-end:

| Metric              | Value                                                |
| ------------------- | ---------------------------------------------------- |
| Wall time           | ~700 s (11 min 41 s)                                 |
| Peak process RSS    | ~125 MiB                                             |
| Final vocab         | 10,000 = 256 bytes + 1 special + 9,743 merges        |
| Longest token       | `b' accomplishment'` (15 bytes)                      |

The longest token is empirical confirmation of the leading-space trick from earlier. `' accomplishment'` is the canonical form because the `' ?\p{L}+'` branch absorbed the preceding space at pre-tokenization time — every occurrence of " accomplishment" in the corpus shares that one pre-token shape, and 9 743 merges of vocab budget could afford to collapse it all the way down to a single atom. Without leading-space absorption, the budget would have split across `accomplishment`, `' accomplishment'`, `' accomplishment '`, and would have run out long before this depth.

Where does the wall time actually go? After the incremental pair-count optimization, pre-tokenization (~5 s parallel across 4 workers) and the merge loop are within an order of magnitude of each other on the full training run. Before that optimization, the naive merge loop was 95%+ of wall time, growing as $O(N \cdot V)$. The inverted index didn't make the merge loop free — it dropped per-iteration cost to $O(|\text{affected}|)$, which is what brought the merge loop into balance with pre-tok.

What ships out of training is a `BPETokenizer(vocab, merges, special_tokens)` instance — a few hundred KB of durable state (the dict + the ordered list of merge pairs + the special-token list), ready to encode arbitrary text. The training scratch (`pair_counts`, `pair_to_pretokens`, `pretoken_counts`) lives only as locals inside `train()` and is discarded when the function returns. Encoding and decoding are what the next section is about.

## Encoding and decoding

`encode(text)` runs three steps: split on special tokens, pre-tokenize each non-special segment with the same GPT-2 regex as training, and replay the learned merges on each pre-token.

The first step uses `re.split` with the special-token pattern wrapped in a capturing group:

```python
re.compile("(" + "|".join(map(re.escape, sorted_specials)) + ")")
```

The capturing group is the load-bearing detail: without it, `re.split` discards the delimiters; *with* it, the delimiters come back interleaved with the text segments. That's what lets `encode` emit each special token's pre-assigned vocab ID directly, bypassing the merge replay (special tokens aren't learned merges and shouldn't go through the GPT-2 regex). One subtle gotcha: special tokens are sorted by length descending before joining, because regex alternation is **leftmost-wins, not longest-wins** — without sorting, `<|endoftext|>` could match before `<|endoftext|><|endoftext|>` and emit two single-special tokens instead of one double-special token.

For non-special segments, pre-tokenization uses the same regex and the same `tuple(bytes([t]) for t in ...)` representation as training. Each pre-token is then collapsed through the learned merges:

```python
while len(token_bytes) > 1:
    priority_pair = None
    priority_pair_index = -1
    for i in range(len(token_bytes) - 1):
        pair = (token_bytes[i], token_bytes[i + 1])
        if pair in self.merge_priorities:
            if (priority_pair is None
                or self.merge_priorities[pair] < self.merge_priorities[priority_pair]):
                priority_pair = pair
                priority_pair_index = i
    if priority_pair_index == -1:
        break
    token_bytes = (
        token_bytes[:priority_pair_index]
        + [priority_pair[0] + priority_pair[1]]
        + token_bytes[priority_pair_index + 2:]
    )
```

Find the adjacent pair with the smallest `merge_priorities` value (earliest learned at training time), apply just that one merge, repeat. The loop terminates when no adjacent pair has a learned merge — typically 0–10 iterations for short pre-tokens.

The non-obvious correctness point: the merge picked is the **earliest-learned applicable merge**, not the leftmost applicable one. Greedy left-to-right is wrong. Worked counter-example: pre-token `[a, b, c]` with `merges = [(b, c), (a, b)]` (so `(b, c)` has priority 0, `(a, b)` has priority 1).

- **Greedy left-to-right**: scan from the left, find `(a, b)` first, merge → `[ab, c]`. No further merges. Done.
- **Priority-based**: scan all pairs, `(b, c)` has lower priority (0 < 1), pick it, merge → `[a, bc]`. No further merges. Done.

Only the priority version replays what training would have produced — training learned `(b, c)` first, so it would have fired before `(a, b)` could be considered. Greedy left-to-right yields an output that no training run could have produced; the encoder and the trained vocab diverge<sup class="margin-marker"><a href="#note-7">7</a></sup><span class="margin-note" id="note-7"><span class="margin-note__label">Note 7</span>The contract from Note 1 made flesh: `merges` is an ordered sequence, and inference must respect that order. A later merge can depend on an earlier one (`(ab, c)` only exists after `(a, b) → ab` has fired) — replaying by priority is how we preserve that dependency at encode time.</span>.

In production, encoding is rarely a single `encode()` call on a short string — it's batch-tokenizing entire corpora into integer ID files for downstream model training. The same fence rule that justified parallelism at training time applies here: non-special segments are independent of each other, and pre-tokens within a segment are independent of each other. So you can hand each document (or each segment) to its own worker process and get bit-identical output. Production tokenizers like HuggingFace's `tokenizers` and OpenAI's `tiktoken` parallelize batch encoding across documents internally, and both are Rust-backed to release the GIL during the CPU-bound work.

`decode` is a one-liner:

```python
def decode(self, token_ids):
    return b"".join(self.vocab[i] for i in token_ids).decode("utf-8", errors="replace")
```

Concatenate the vocab bytes for each ID and decode as UTF-8. `errors="replace"` handles the case where a user constructs ID sequences whose bytes don't form valid UTF-8 — those positions become `U+FFFD` instead of raising. Round-tripping `encode → decode` is always valid by construction, so the fallback only fires for hand-built ID lists.

## What we built, what's next

What ships from training is small: a `vocab` dict (a few hundred KB at vocab 32 000), an ordered `merges` list, and the special-token list. The encode/decode pair operates on those artifacts and nothing else. The training scratch — `pair_counts`, `pair_to_pretokens`, `pretoken_counts` — lives only inside `train()` and is thrown away. Four engineering moves carried the loop from "single-core, days" to "single-core, minutes": 

1. parallel pre-tokenization across worker processes, snapping chunk boundaries forward to the next special token; 
2. an inverted index (`pair_to_pretokens`) so each merge only touches the pre-tokens that contain it; 
3. a three-phase **withdraw → rewrite → register** update that keeps both indices live; 
4. a `{shape: count}` corpus representation so the merge loop iterates distinct pre-token shapes (tens of thousands) instead of total occurrences (billions).

What's next, honestly: a larger real-world pre-training corpus wasn't actually run end-to-end. Beyond Python, no Rust port — production tokenizers like `tiktoken` and HuggingFace `tokenizers` are typically 10–100× faster per core because they release the GIL and avoid Python's per-op interpreter overhead.

The implementation here is correct, trains end-to-end on TinyStories in eleven minutes on a laptop, and is structured the way a production tokenizer is.

---

## References

<ol class="references">
  <li id="ref-1">[1] Sennrich, R., Haddow, B., &amp; Birch, A. (2015). <em>Neural Machine Translation of Rare Words with Subword Units</em>. <a href="https://arxiv.org/abs/1508.07909">arXiv:1508.07909</a> &mdash; the paper that brought BPE from data compression into NLP.</li>
  <li id="ref-2">[2] Radford, A., Wu, J., Child, R., Luan, D., Amodei, D., &amp; Sutskever, I. (2019). <em>Language Models are Unsupervised Multitask Learners</em>. <a href="https://github.com/openai/gpt-2">github.com/openai/gpt-2</a> &mdash; the GPT-2 release; source of the pre-tokenization regex used throughout this post.</li>
  <li id="ref-3">[3] OpenAI. <em>tiktoken</em>. <a href="https://github.com/openai/tiktoken">github.com/openai/tiktoken</a> &mdash; Rust implementation of byte-level BPE; canonical fast reference for OpenAI-family tokenizers.</li>
  <li id="ref-4">[4] HuggingFace. <em>tokenizers</em>. <a href="https://github.com/huggingface/tokenizers">github.com/huggingface/tokenizers</a> &mdash; Rust-backed Python tokenizer library covering BPE, WordPiece, and Unigram.</li>
</ol>
