---
title:          "Distilling Tool Knowledge into Language Models via Back-Translated Traces"
date:           2025-06-13 00:01:00 +0800
selected:       false
pub:            "MAS@ICML"
# pub_pre:        "Submitted to "
# pub_post:       'Under review.'
# pub_last:       ' <span class="badge badge-pill badge-publication badge-success">Poster</span>'
pub_date:       "2025"

tldr: We introduce a tool-integrated reasoning pipeline for LLMs to learn mathematical reasoning.

abstract: >-
  Large language models (LLMs) often struggle with mathematical problems that require exact computation or multi-step algebraic reasoning. Tool-integrated reasoning (TIR) offers a promising solution by leveraging external tools such as code interpreters to ensure correctness, but it introduces inference-time dependencies that hinder scalability and deployment. In this work, we propose a new paradigm for distilling tool knowledge into LLMs purely through natural language. We first construct a Solver Agent that solves math problems by interleaving planning, symbolic tool calls, and reflective reasoning. Then, using a back-translation pipeline powered by multiple LLM-based agents, we convert interleaved TIR traces into natural language reasoning traces. A Translator Agent generates explanations for individual tool calls, while a Rephrase Agent merges them into a fluent and globally coherent narrative. Empirically, we show that fine-tuning a small open-source model on these synthesized traces enables it to internalize both tool knowledge and structured reasoning patterns, yielding gains on competition-level math benchmarks without requiring tool access at inference.

cover: /assets/images/papers/mathtool-mas.png
authors:
    - Xingyue Huang 
    - Xianglong Hu
    - Zifeng Ding
    - <b>Yuan He</b>
    - Rishabh
    - Waleed Alzarooni
    - Ziyu Ye
    - Wendong Fan
    - Bailan He
    - Haige Bo
    - Changran Hu
    - Guohao Li

links:
  Preprint: http://arxiv.org/abs/2506.19171
  OpenReview: https://openreview.net/forum?id=B92cb9JLfC
---
