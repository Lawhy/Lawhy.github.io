---
layout: post
title: "Paper Notes: Augmenting Ontology Alignment by Semantic Embedding and Distant Supervision"
date: 2021-1-10
excerpt: "This paper (submitted to ESWC 2021) is associated with the ARF project initiated by SRUK."
tags: [ontology_alignment, semantic_embedding, distant_supervision, siamese_neural_network, SRUK]
comments: false
---

### What is Ontology Alignment?

**Ontology alignment** or ontology matching is the task for integrating knowledge across different ontologies. This paper focues on studying the **equivalent** or **sub-class** 
relationship among the classes from different ontologies. The intuitive motivations for ontology alignment are that (1) a single ontology is commonly **incomplete** even for only one domain, (2) and cross-domain knowledge is essential for many real world applications.

### Research Gap

SOTA systems such as *LogMap* and *AgreementMakerLight (AML)* often combine multiple strategies such as (1) *lexical matching*, (2) *structural matching*, and (3) *logical reasoning*. Such systems typically use (1) as their starting point, but it fails to capture the **contextual meaning of words**. Also, (3) often **wrongly rejects some valid mappings** even though it improves the quality of retrieved mappings. **Hand-craft matching methods** are often required to achieve good performance for a new task.

### Preliminaries

**1. LogMap**: [LogMap1](https://www.cs.ox.ac.uk/isg/projects/LogMap/papers/paper_ISWC2011.pdf), [LogMap2](https://www.cs.ox.ac.uk/files/4801/LogMap_ecai2012.pdf).

------

### References

- Unpublished yet.
