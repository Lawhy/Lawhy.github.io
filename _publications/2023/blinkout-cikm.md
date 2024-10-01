---
title:          "Reveal the Unknown: Out-of-Knowledge-Base Mention Discovery with Entity Linking"
date:           2023-09-01 00:01:00 +0800
selected:       false
pub:            "CIKM"
# pub_pre:        "Submitted to "
# pub_post:       'Under review.'
# pub_last:       ' <span class="badge badge-pill badge-publication badge-success">Poster</span>'
pub_date:       "2023"

tldr: We introduce BLINKout, an extension of the BLINK entity linking system to detect out-of-KB entities.

abstract: >-
  Discovering entity mentions that are out of a Knowledge Base (KB) from texts plays a critical role in KB maintenance, but has not yet been fully explored. The current methods are mostly limited to the simple threshold-based approach and feature-based classification, and the datasets for evaluation are relatively rare. We propose BLINKout, a new BERT-based Entity Linking (EL) method which can identify mentions that do not have corresponding KB entities by matching them to a special NIL entity. To better utilize BERT, we propose new techniques including NIL entity representation and classification, with synonym enhancement. We also apply KB Pruning and Versioning strategies to automatically construct out-of-KB datasets from common in-KB EL datasets. Results on five datasets of clinical notes, biomedical publications, and Wikipedia articles in various domains show the advantages of BLINKout over existing methods to identify out-of-KB mentions for the medical ontologies, UMLS, SNOMED CT, and the general KB, WikiData.

cover: /assets/images/papers/blinkout-cikm.png
authors:
  - Hang Dong
  - Jiaoyan Chen
  - <b>Yuan He</b>
  - Yinan Liu
  - Ian Horrocks

links:
  Preprint: https://arxiv.org/abs/2302.07189
  Paper: https://dl.acm.org/doi/10.1145/3583780.3615036
---
