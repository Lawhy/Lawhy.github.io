---
title:          "Language Models for Ontology Engineering"
date:           2024-09-19 00:01:00 +0800
selected:       false
pub:            "University of Oxford (PhD Thesis)"
# pub_pre:        "Submitted to "
# pub_post:       'Under review.'
# pub_last:       ' <span class="badge badge-pill badge-publication badge-success">Poster</span>'
pub_date:       "2024"

tldr: My PhD Thesis.

abstract: >-
  
  Ontology, originally a philosophical term, refers to the study of being and existence. The concept was introduced to Artificial Intelligence (AI) as a knowledge-based system that can model and share knowledge about entities and their relationships in a machine-readable format. Ontologies offer a structured and logical formalism of human knowledge, enabling expressive representations and reliable reasoning within defined domains. Meanwhile, modern deep learning-based language models (LMs) represent a significant milestone in the field of Natural Language Processing (NLP), as they incorporate substantial background knowledge from the vast and complex distribution of textual data. This thesis explores the synergy between these two paradigms, focusing primarily on the use of LMs in ontology engineering and, more broadly, in knowledge engineering. The goal is to automate or semi-automate the process of ontology construction and curation.

  Ontology engineering includes a wide array of tasks within the life cycle of ontology development. This thesis concentrates on three key aspects: (i) ontology alignment, which seeks to align equivalent concepts across different ontologies to achieve data integration; (ii) ontology completion, which focuses on filling in missing subsumption relationships between ontology concepts; and (iii) hierarchy embedding, which aims to develop versatile and interpretable neural representations for hierarchical structures derived not only from ontologies but also applicable to other forms of hierarchical data. These representations can facilitate a broad spectrum of downstream ontology engineering tasks, such as (i) and (ii), and are adaptable for more general applications in hierarchy-aware contexts.

  This thesis is organised into three parts. The first part establishes the foundations necessary for understanding ontologies and LMs. The chapter on ontologies initiates with a basic overview of computational ontologies, then provides an introduction of the description logic formalisms that underpin them. It concludes with the formal definitions of the three ontology engineering tasks this thesis focuses on. Transitioning to LMs, the subsequent chapter begins with a chronological overview of their evolution, followed by detailed exposition of various typical LMs along this evolution. The discussion then proceeds to contemporary transformer-based LMs, elaborating on their architecture and different learning paradigms they adopt. The chapter concludes with a review of how LMs and knowledge bases (including ontologies) interact and influence each other, highlighting the mutual benefits of this integration for both fields of study.

  With the comprehensive background provided in the first part, the second part of the thesis delves into specific methodologies that have been developed. This part comprises three chapters, each corresponding to the application of LMs in ontology alignment, ontology completion, and hierarchy embedding, respectively. In the chapter on LMs for ontology alignment, we introduce BERTMap, a novel pipeline system that employs LM fine-tuning for improved alignment prediction and ontology semantics for alignment refinement. We will also mention the Bio-ML track of the Ontology Alignment Evaluation Initiative (OAEI), which has emerged as a benchmarking platform for a variety of ontology alignment systems over the past two years. The chapter on LMs for ontology completion presents OntoLAMA, a collection of LM probing datasets and a prompt-based LM probing approach that effectively predicts subsumptions, even with limited training resources. Lastly, the section on LMs for hierarchy embedding discusses the re-training of LMs as Hierarchy Transformer encoders (HiT), addressing the limitations of LMs in explicitly interpreting and encoding hierarchies, including those extracted from ontologies.

  The third part of the thesis details the practical implementations. We mainly present DeepOnto, a Python package designed for ontology engineering utilising deep learning, with an emphasis on LMs. DeepOnto offers a range of basic to advanced ontology processing functionalities to support deep learning-based ontology engineering development. This package also includes polished implementations of our systems and resources mentioned in Part II.

  In summary, this thesis advocates for a more holistic approach in AI development, where the integration of LMs and ontologies can lead to a more advanced, explainable, and useful paradigm in knowledge engineering and beyond.

cover:          /assets/images/papers/thesis.png
authors:
  - <b>Yuan He</b>

links:
  Thesis: http://dx.doi.org/10.5287/ora-pd7q5y157
---
