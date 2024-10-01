---
title:          "DyGMamba: Efficiently Modeling Long-Term Temporal Dependency on Continuous-Time Dynamic Graphs with State Space Models"
date:           2024-09-05 00:01:00 +0800
selected:       true
pub:            "Arxiv"
# pub_pre:        "Submitted to "
# pub_post:       'Under review.'
# pub_last:       ' <span class="badge badge-pill badge-publication badge-success">Poster</span>'
pub_date:       "2024"

tldr: We introduce DyGMamba, a model that utilizes state space models (SSMs) for continuous-time dynamic graph (CTDG) representation learning. 

abstract: >-
  Learning useful representations for continuous-time dynamic graphs (CTDGs) is challenging, due to the concurrent need to span long node interaction histories and grasp nuanced temporal details. In particular, two problems emerge: (1) Encoding longer histories requires more computational resources, making it crucial for CTDG models to maintain low computational complexity to ensure efficiency; (2) Meanwhile, more powerful models are needed to identify and select the most critical temporal information within the extended context provided by longer histories. To address these problems, we propose a CTDG representation learning model named DyGMamba, originating from the popular Mamba state space model (SSM). DyGMamba first leverages a node-level SSM to encode the sequence of historical node interactions. Another time-level SSM is then employed to exploit the temporal patterns hidden in the historical graph, where its output is used to dynamically select the critical information from the interaction history. We validate DyGMamba experimentally on the dynamic link prediction task. The results show that our model achieves state-of-the-art in most cases. DyGMamba also maintains high efficiency in terms of computational resources, making it possible to capture long temporal dependencies with a limited computation budget.

cover: /assets/images/papers/dygmamba.png
authors:
  - Zifeng Ding
  - Yifeng Li
  - <b>Yuan He</b>
  - Antonio Norelli
  - Jingcheng Wu
  - Volker Tresp
  - Yunpu Ma
  - Michael Bronstein.

links:
  Preprint: https://arxiv.org/abs/2406.10964
---
