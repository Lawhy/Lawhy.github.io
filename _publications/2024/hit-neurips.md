---
title:          "Language Models as Hierarchy Encoders"
date:           2024-09-26 00:01:00 +0800
selected:       true
pub:            "Advances in Neural Information Processing Systems (NeurIPS)"
# pub_pre:        "Submitted to "
# pub_post:       'Under review.'
# pub_last:       ' <span class="badge badge-pill badge-publication badge-success">Poster</span>'
pub_date:       "2024"

tldr: We introduce a novel approach to re-train transformer encoder-based language models as Hierarchy Transformer encoders (HiTs), leveraging the expansive nature of hyperbolic psace.

abstract: >-
  Interpreting hierarchical structures latent in language is a key limitation of current language models (LMs). While previous research has implicitly leveraged these hierarchies to enhance LMs, approaches for their explicit encoding are yet to be explored. To address this, we introduce a novel approach to re-train transformer encoder-based LMs as Hierarchy Transformer encoders (HiTs), harnessing the expansive nature of hyperbolic space. Our method situates the output embedding space of pre-trained LMs within a Poincaré ball with a curvature that adapts to the embedding dimension, followed by training on hyperbolic clustering and centripetal losses. These losses are designed to effectively cluster related entities (input as texts) and organise them hierarchically. We evaluate HiTs against pre-trained LMs, standard fine-tuned LMs, and several hyperbolic embedding baselines, focusing on their capabilities in simulating transitive inference, predicting subsumptions, and transferring knowledge across hierarchies. The results demonstrate that HiTs consistently outperform all baselines in these tasks, underscoring the effectiveness and transferability of our re-trained hierarchy encoders.
cover:          /assets/images/papers/hit-neurips.png
authors:
  - <b>Yuan He</b>
  - Zhangdie Yuan
  - Jiaoyan Chen
  - Ian Horrocks
links:
  Preprint: https://arxiv.org/abs/2401.11374
  Code: https://github.com/KRR-Oxford/HierarchyTransformers
  Model: https://huggingface.co/Hierarchy-Transformers
---
