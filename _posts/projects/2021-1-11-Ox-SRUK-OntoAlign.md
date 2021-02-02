---
layout: post
title: "Oxford-SRUK Ontology Alignment "
date: 2021-1-11
excerpt: "Notes on the plans and progress for the Oxford-SRUK-OntoAlign project ranged from January 2021 to June 2021 (tentative)."
tags: [ontology_alignment, ontology_matching, symbolic, machine_learning, SRUK, research_project]
comments: false
project: true
---

This post records the project diaries for the collaborative research project concerning the Ontology Alignment Task. Key research directions include *cross-ontology class disjointness algorithm* and *machine learning based ontology mapping model*. Idea Collection is available [here](https://unioxfordnexus-my.sharepoint.com/:w:/r/personal/coml0713_ox_ac_uk/_layouts/15/guestaccess.aspx?e=fjtPw5&CID=0f8a821f-2a74-676f-aae6-8d2d57f275a0&share=ER6fOsSh5rVIowB_l1W9ZQkBNqEE9CF83BsGKJ8_SnxQcw).  Reference code from previous HeLis-FoodOn is available [here](https://gitlab.com/chen00217/pathontoalignment/-/tree/master/).

---------------------

### [1] Meeting with SRUK 11/01/2021

**Key Points**

- Ontology packages: (1) [Java Based]: JAVA OWL API; Apache Jena; (2) [Python Based]: [OwlReady2](https://pythonhosted.org/Owlready2/);
- Consider the following "meta" issues: (1) what would success look like? (Presumably a published paper; (2) what datasets/evaluation will you use to measure success? (3) can existing results give some insights into what the problems are? (4) how can you quickly evaluate candidate ideas for Class Disjointness?

**To Do List**

[$$\checkmark$$] Ask Jiaojian detailed questions regarding to the previous submission -- the ML extension of LogMap.

[ ] Take a look on LogMap paper but don't dive into it as the whole system will be re-implemented from scratch.

[$$\checkmark$$] Go through the SiamNN model.

[$$\checkmark$$] Go through the tutorial of [Protege OWL Visualisation Tool](http://mowl-power.cs.man.ac.uk/protegeowltutorial/resources/ProtegeOWLTutorialP4_v1_3.pdf).

[$$\checkmark$$] Go through the [OAEI datasets](http://oaei.ontologymatching.org/).

---------------------

### [2] Meeting with KRR 27/01/2021

**Key Points**

- Decided to focus on the [LargeBio](http://www.cs.ox.ac.uk/isg/projects/SEALS/oaei/2020/) dataset which contains abundant ontologies.
- Although NLP techniques can be used, should focus more on the ontology itself.

**To Do List**

[$$\checkmark$$]  Download  [LargeBio](http://www.cs.ox.ac.uk/isg/projects/SEALS/oaei/2020/) dataset and figure out the evaluation script in Java.

[$$\checkmark$$] Learn OwlReady2 for Python.

[$$\checkmark$$] Conduct basic experiments on ontology matching, e.g. <del>string matching</del> LogMap, and evaluate it using the <del>OAEI script</del> evaluation script written by myself.

[$$\checkmark$$] Read the survey of Entity Alignment in KGs, gain some ideas for ontology alignment.

-------------

### [3] Meeting with Jiaoyan 02/02/2021

**Questions**

- <del>About the LogMap-java: </del>
  - <del>"Illegal Access" warnings during experiments? </del>
  - <del>Incomplete rdf output? </del>
  - <del>Relation ">"?</del>
  - <del>Prominent discrepancy between the reported results and our results?</del>

- About Entity Alignment survey:
  - Can we use part of the UMLS mappings as seed? **Nope, stick on the unsupervised setting.**
  - Previous work unsupervised/semi-supervised?  **It's distant supervision (considered as unsupervised).**

**Key Points**

- [Google LogMap](https://code.google.com/archive/p/logmap-matcher/wikis) was used in LogMap+ML work. 
- Focus on the word embeddings solution for now.

**To Do List**

[ $$\checkmark$$] Ask Ernesto about the LogMap errors (**All solved**).

```java
# example command
java -Xms500M -Xmx4400M -DentityExpansionLimit=100000000 -jar target/logmap-matcher-4.0.jar MATCHER file:/C:/Users/lawhy/Work/Oxford-SRUK-OntoAlign/largebio-dataset/oaei_FMA_whole_ontology.owl file:/C:/Users/lawhy/Work/Oxford-SRUK-OntoAlign/largebio-dataset/oaei_NCI_whole_ontology.owl /C:/Users/lawhy/Work/Oxford-SRUK-OntoAlign/oaei-java/logmap-matcher/results/fma2nci/ true
```

[ ]  Check if the evaluation script is correctly written (using OAEI results).

[ ] Study the word embeddings approaches such as Word2Vec, BERT and [BioBert](https://www.aclweb.org/anthology/2020.coling-main.57.pdf).

[ ] Study the embedding improvement papers: DeepAlignment, OntoEmma.

[ ] Take a look on Jiaoyan's paper and understand the influence of seed mappings.

-------------
