---
title:          "Predicate-Conditional Conformalized Answer Sets for Knowledge Graph Embeddings"
date:           2025-05-16 00:01:00 +0800
selected:       false
pub:            "ACL Findings"
# pub_pre:        "Submitted to "
# pub_post:       'Under review.'
# pub_last:       ' <span class="badge badge-pill badge-publication badge-success">Poster</span>'
pub_date:       "2025"

tldr: Uncertainty quantification in Knowledge Graph Embedding.

abstract: >-
  Uncertainty quantification in Knowledge Graph Embedding (KGE) methods is crucial for ensuring the reliability of downstream applications. A recent work applies conformal prediction to KGE methods, providing uncertainty estimates by generating a set of answers that is guaranteed to include the true answer with a predefined confidence level. However, existing methods provide probabilistic guarantees averaged over a reference set of queries and answers (marginal coverage guarantee). In high-stakes applications such as medical diagnosis, a stronger guarantee is often required: the predicted sets must provide consistent coverage per query (conditional coverage guarantee). We propose CondKGCP, a novel method that approximates predicate-conditional coverage guarantees while maintaining compact prediction sets. CondKGCP merges predicates with similar vector representations and augments calibration with rank information. We prove the theoretical guarantees and demonstrate empirical effectiveness of CondKGCP by comprehensive evaluations.

cover: 
authors:
  - Yuqicheng Zhu
  - Daniel Hernández
  - <b>Yuan He</b>
  - Zifeng Ding
  - Bo Xiong
  - Evgeny Kharlamov
  - Steffen Staab

links:
  OpenReview: https://openreview.net/forum?id=878fSDbW7t
---