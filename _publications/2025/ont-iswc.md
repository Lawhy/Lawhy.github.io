---
title:          "Language Models as Ontology Encoders"
date:           2025-07-18 00:01:00 +0800
selected:       false
pub:            "ISWC"
# pub_pre:        "Submitted to "
# pub_post:       'Under review.'
# pub_last:       ' <span class="badge badge-pill badge-publication badge-success">Poster</span>'
pub_date:       "2025"

tldr: Extension of HiT towards complex concept modeling in OWL ontologies.

abstract: >-
  OWL (Web Ontology Language) ontologies which are able to formally represent complex knowledge and support semantic reasoning have been widely adopted across various domains such as healthcare and bioinformatics.
  Recently, ontology embeddings have gained wide attention due to its potential to infer plausible new knowledge and approximate complex reasoning. However, existing methods face notable limitations: geometric model-based embeddings typically overlook valuable textual information, resulting in suboptimal performance, while the approaches that incorporate text, which are often based on language models, fail to preserve the logical structure. In this work, we propose a new ontology embedding method OnT, which tunes a Pretrained Language Model (PLM) via geometric modeling in a hyperbolic space for effectively incorporating textual labels and simultaneously preserving class hierarchies and other logical relationships of Description Logic EL. Extensive experiments on four real-world ontologies show that OnT consistently outperforms the baselines including the state-of-the-art across both tasks of prediction and inference of axioms. OnT also demonstrates strong potential in real-world applications, indicated by its robust transfer learning abilities and effectiveness in real cases of constructing a new ontology from SNOMED CT.

cover: 
authors:
    - Hui Yang
    - Jiaoyan Chen
    - <b>Yuan He</b>
    - Yongsheng Gao 
    - Ian Horrocks	

links:
  Preprint: https://www.arxiv.org/abs/2507.14334
---
