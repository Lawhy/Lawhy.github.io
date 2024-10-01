---
title:          "Ontology Enrichment from Texts: A Biomedical Dataset for Concept Discovery and Placement"
date:           2023-09-01 00:01:00 +0800
selected:       false
pub:            "CIKM"
# pub_pre:        "Submitted to "
# pub_post:       'Under review.'
pub_last:       ' <span class="badge badge-pill badge-publication badge-success">Best Resource Paper Runner-Up</span>'
pub_date:       "2023"

tldr: A dataset for biomedical ontology concept discovery and placement.

abstract: >-
  Mentions of new concepts appear regularly in texts and require automated approaches to harvest and place them into Knowledge Bases (KB), e.g., ontologies and taxonomies. Existing datasets suffer from three issues, (i) mostly assuming that a new concept is pre-discovered and cannot support out-of-KB mention discovery; (ii) only using the concept label as the input along with the KB and thus lacking the contexts of a concept label; and (iii) mostly focusing on concept placement w.r.t a taxonomy of atomic concepts, instead of complex concepts, i.e., with logical operators. To address these issues, we propose a new benchmark, adapting MedMentions dataset (PubMed abstracts) with SNOMED CT versions in 2014 and 2017 under the Diseases sub-category and the broader categories of Clinical finding, Procedure, and Pharmaceutical / biologic product. We provide usage on the evaluation with the dataset for out-of-KB mention discovery and concept placement, adapting recent Large Language Model based methods.

cover: /assets/images/papers/oet-cikm.png
authors:
  - Hang Dong
  - Jiaoyan Chen
  - <b>Yuan He</b>
  - Ian Horrocks

links:
  Preprint: https://arxiv.org/abs/2306.14704
  Paper: https://dl.acm.org/doi/10.1145/3583780.3615126
  Certificate: /assets/images/certificates/cikm_resource.jpg
---