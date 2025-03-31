---
title:          "Supposedly Equivalent Facts That Aren’t? Entity Frequency in Pre-training Induces Asymmetry in LLMs"
date:           2025-03-27 00:01:00 +0800
selected:       true
pub:            "Arxiv"
# pub_pre:        "Submitted to "
# pub_post:       'Under review.'
# pub_last:       ' <span class="badge badge-pill badge-publication badge-success">Poster</span>'
pub_date:       "2025"

tldr: This work demonstrates that the asymmetry in how large language models recognise equivalent facts stems from inherent biases in their pre-training data, particularly through differences in entity frequency.

abstract: >-
    Understanding and mitigating hallucinations in Large Language Models (LLMs) is crucial for ensuring reliable content generation. While previous research has primarily focused on "when" LLMs hallucinate, our work explains "why" and directly links model behaviour to the pre-training data that forms their prior knowledge. Specifically, we demonstrate that an asymmetry exists in the recognition of logically equivalent facts, which can be attributed to frequency discrepancies of entities appearing as subjects versus objects. Given that most pre-training datasets are inaccessible, we leverage the fully open-source OLMo series by indexing its Dolma dataset to estimate entity frequencies. Using relational facts (represented as triples) from Wikidata5M, we construct probing datasets to isolate this effect. Our experiments reveal that facts with a high-frequency subject and a low-frequency object are better recognised than their inverse, despite their logical equivalence. The pattern reverses in low-to-high frequency settings, and no statistically significant asymmetry emerges when both entities are high-frequency. These findings highlight the influential role of pre-training data in shaping model predictions and provide insights for inferring the characteristics of pre-training data in closed or partially closed LLMs.

cover: /assets/images/papers/factprobe.png
authors:
  - <b>Yuan He</b>
  - Bailan He
  - Zifeng Ding
  - Alisia Maria Lupidi
  - Yuqicheng Zhu
  - Shuo Chen
  - Caiqi Zhang
  - Jiaoyan Chen
  - Yunpu Ma
  - Volker Tresp
  - Ian Horrocks

links:
  Preprint: https://arxiv.org/abs/2503.22362
---