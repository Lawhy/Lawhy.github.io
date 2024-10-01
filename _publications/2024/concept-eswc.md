---
title:          "A Language Model based Framework for New Concept Placement in Ontologies"
date:           2024-01-10 00:01:00 +0800
selected:       false
pub:            "The 21st Extended Semantic Web Conference (ESWC)"
# pub_pre:        "Submitted to "
# pub_post:       'Under review.'
# pub_last:       ' <span class="badge badge-pill badge-publication badge-success">Poster</span>'
pub_date:       "2024"

tldr: Re-trieve and Re-rank pipeline (with LLMs) for ontology concept placement.

abstract: >-
  We investigate the task of inserting new concepts extracted from texts into an ontology using language models. We explore an approach with three steps: edge search which is to find a set of candidate locations to insert (i.e., subsumptions between concepts), edge formation and enrichment which leverages the ontological structure to produce and enhance the edge candidates, and edge selection which eventually locates the edge to be placed into. In all steps, we propose to leverage neural methods, where we apply embedding-based methods and contrastive learning with Pre-trained Language Models (PLMs) such as BERT for edge search, and adapt a BERT fine-tuning-based multi-label Edge-Cross-encoder, and Large Language Models (LLMs) such as GPT series, FLAN-T5, and Llama 2, for edge selection. We evaluate the methods on recent datasets created using the SNOMED CT ontology and the MedMentions entity linking benchmark. The best settings in our framework use fine-tuned PLM for search and a multi-label Cross-encoder for selection. Zero-shot prompting of LLMs is still not adequate for the task, and we propose explainable instruction tuning of LLMs for improved performance. Our study shows the advantages of PLMs and highlights the encouraging performance of LLMs that motivates future studies.

cover: 
authors:
  - Hang Dong
  - Jiaoyan Chen
  - <b>Yuan He</b>
  - Yongsheng Gao
  - Ian Horrocks
links:
  Preprint: https://arxiv.org/abs/2402.17897
  Paper: https://link.springer.com/chapter/10.1007/978-3-031-60626-7_5
---
