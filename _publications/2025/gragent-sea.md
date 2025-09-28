---
title:          "GR-Agent: Adaptive Graph Reasoning Agent under Incomplete Knowledge"
date:           2025-09-27 00:01:00 +0800
selected:       false
pub:            "SEA@NeurIPS"
pub_date:       "2025"

tldr: We introduce GR-Agent, an adaptive reasoning agent that addresses KGQA under incomplete knowledge graphs by interacting with a graph reasoning environment.

abstract: >-
  Large language models (LLMs) achieve strong results on knowledge graph question answering (KGQA), but most benchmarks assume complete knowledge graphs (KGs) where direct supporting triples exist. This reduces evaluation to shallow retrieval and overlooks the reality of incomplete KGs, where many facts are missing and answers must be inferred from existing facts. We bridge this gap by proposing a methodology for constructing benchmarks under KG incompleteness, which removes direct supporting triples while ensuring that alternative reasoning paths required to infer the answer remain. Experiments on benchmarks constructed using our methodology show that existing methods suffer consistent performance degradation under incompleteness, highlighting their limited reasoning ability. To overcome this limitation, we present the Adaptive Graph Reasoning Agent (GR-Agent). It first constructs an interactive environment from the KG, and then formalizes KGQA as agent-environment interaction within this environment. GR-Agent operates over an action space comprising graph reasoning tools and maintains a memory of potential supporting reasoning evidence, including relevant relations and reasoning paths. Extensive experiments demonstrate that GR-Agent outperforms non-training baselines and performs comparably to training-based methods under both complete and incomplete settings.

cover:
authors:
    - Dongzhuoran Zhou
    - Yuqicheng Zhu
    - Xiaxia Wang
    - Hongkuan Zhou
    - Jiaoyan Chen
    - Steffen Staab
    - <b>Yuan He</b>
    - Evgeny Kharlamov

links:
  OpenReview: https://openreview.net/forum?id=p30azkwIer
---
