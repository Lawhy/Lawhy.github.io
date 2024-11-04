---
title:          "Contextual Semantic Embeddings for Ontology Subsumption Prediction"
date:           2023-05-02 00:01:00 +0800
selected:       true
pub:            "World Wide Web"
# pub_pre:        "Submitted to "
# pub_post:       'Under review.'
# pub_last:       ' <span class="badge badge-pill badge-publication badge-success">Poster</span>'
pub_date:       "2023"

tldr: Fine-tuning BERT for ontology subsumption prediction.

abstract: >-
  Automating ontology construction and curation is an important but challenging task in knowledge engineering and artificial intelligence. Prediction by machine learning techniques such as contextual semantic embedding is a promising direction, but the relevant research is still preliminary especially for expressive ontologies in Web Ontology Language (OWL). In this paper, we present a new subsumption prediction method named BERTSubs for classes of OWL ontology. It exploits the pre-trained language model BERT to compute contextual embeddings of a class, where customized templates are proposed to incorporate the class context (e.g., neighbouring classes) and the logical existential restriction. BERTSubs is able to predict multiple kinds of subsumers including named classes from the same ontology or another ontology, and existential restrictions from the same ontology. Extensive evaluation on five real-world ontologies for three different subsumption tasks has shown the effectiveness of the templates and that BERTSubs can dramatically outperform the baselines that use (literal-aware) knowledge graph embeddings, non-contextual word embeddings and the state-of-the-art OWL ontology embeddings.


cover: /assets/images/papers/bertsubs-wwwj.png
authors:
  - Jiaoyan Chen
  - <b>Yuan He</b>
  - Ernesto Jiménez-Ruiz
  - Hang Dong
  - Ian Horrocks

links:
  Preprint: https://arxiv.org/abs/2202.09791
  Paper: https://link.springer.com/article/10.1007/s11280-023-01169-9
---
