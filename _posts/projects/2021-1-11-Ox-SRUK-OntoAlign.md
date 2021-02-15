---
layout: post
title: "Oxford-SRUK Ontology Alignment "
date: 2021-1-11
excerpt: "Notes on the plans and progress for the Oxford-SRUK-OntoAlign project ranged from January 2021 to June 2021 (tentative)."
tags: [ontology_alignment, ontology_matching, symbolic, machine_learning, SRUK, research_project]
comments: false
project: true
---

This post records the project diaries for the collaborative research project concerning the Ontology Alignment Task. Key research directions include *cross-ontology class disjointness algorithm* and *machine learning based ontology mapping model*. 

### Important Links

- Idea Collection is available [here](https://unioxfordnexus-my.sharepoint.com/:w:/r/personal/coml0713_ox_ac_uk/_layouts/15/guestaccess.aspx?e=fjtPw5&CID=0f8a821f-2a74-676f-aae6-8d2d57f275a0&share=ER6fOsSh5rVIowB_l1W9ZQkBNqEE9CF83BsGKJ8_SnxQcw).  

- Reference code from previous HeLis-FoodOn is available [here](https://gitlab.com/chen00217/pathontoalignment/-/tree/master/).

- Understand the Huggingface implementation of BERT embeddings in the post [here](https://mccormickml.com/2019/05/14/BERT-word-embeddings-tutorial/).

- Huggingface BERT model explanation [here](https://huggingface.co/transformers/model_doc/bert.html#bertmodel).

- **Research plan** is available [here](https://app.diagrams.net/#G1g0NrHV2qaAn5pEbqdgR9pef0nFqIgf8P). 

  

### Colours Usage for highlighting papers in Mendeley

1. <span style="color:yellow">Yellow</span>: normal notes;
2. <span style="color:red">Red</span>: highlight points;
3. <span style="color:green">Green</span>: word definition;
4. <span style="color:blue">Blue</span>: external information;
5. <span style="color:Purple">Purple</span>: questions.



---------------------

### [1] Meeting with SRUK 11/01/2021

**Key Points**

- Ontology packages: (1) [Java Based]: JAVA OWL API; Apache Jena; (2) [Python Based]: [OwlReady2](https://pythonhosted.org/Owlready2/);
- Consider the following "meta" issues: (1) what would success look like? (Presumably a published paper; (2) what datasets/evaluation will you use to measure success? (3) can existing results give some insights into what the problems are? (4) how can you quickly evaluate candidate ideas for Class Disjointness?

**To Do List**

[$$\checkmark$$] Ask Jiaoyan detailed questions regarding to the previous submission -- the ML extension of LogMap.

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



**Further thoughts and questions**

- <del>About the LogMap-java: </del>
  - <del>"Illegal Access" warnings during experiments? </del>
  - <del>Incomplete rdf output? </del>
  - <del>Relation ">"?</del>
  - <del>Prominent discrepancy between the reported results and our results?</del>

- About Entity Alignment survey:
  - About Entity Alignment survey:
    - Can we use part of the UMLS mappings as seed? Ans: Nope, stick on the unsupervised setting.
    - Previous work unsupervised/semi-supervised?  Ans: It's distant supervision (considered as unsupervised).

-------------

### [3] Meeting with Jiaoyan 02/02/2021

**Key Points**

- [Google LogMap](https://code.google.com/archive/p/logmap-matcher/wikis) was used in LogMap+ML work. 
- Focus on the word embeddings solution for now.

**To Do List**

[ $$\checkmark$$] Ask Ernesto about the LogMap errors (**All solved**).

```bash
# example command
java -Xms500M -Xmx4400M -DentityExpansionLimit=100000000 -jar target/logmap-matcher-4.0.jar MATCHER file:/C://Users/lawhy/Work/Oxford-SRUK-OntoAlign/largebio-dataset/oaei_FMA_whole_ontology.owl file:/C://Users/lawhy/Work/Oxford-SRUK-OntoAlign/largebio-dataset/oaei_NCI_whole_ontology.owl /C://Users/lawhy/Work/Oxford-SRUK-OntoAlign/oaei-java/logmap-matcher/results/fma2nci/ true
```

[ ]  Check if the evaluation script is correctly written (using OAEI results).

[$$\checkmark$$] Get familiar with [BioBert](https://github.com/noc-lab/clinical-kb-bert).

[ ] Study the embedding improvement papers: DeepAlignment, Osteoma.



**Further thoughts and questions**

- [BioBert paper] What is section 3.3 talking about? Forcing the concept 1 and 3, 2 and 4 of the same semantics type?  Ans: Because of the sparsity, forcing the head/tail concepts are of the same type (e.g. both are countries) can render a better hyperplane because the **negative samples are closer to the positive one** $$\star$$. 
- Stopwords matter in the class embedding? Consider removing them in the sentence embedding? Try experiments.
- [Observation]  BioBert does not have good embeddings for abbreviated terminology such as *ACE2 (angiotensin converting enzyme 2) *. It will be broken down into a sequence: *"_ace" "2"*.
- [Observation] BioBert gives smaller distance for similar meanings of "bank" and larger distance for different meanings of "bank" in the example sentence (0.94 vs. 0.79 and 0.69 vs. 0.59). Not sure how good it is on the professional concepts. The pooling strategy and layer choice is ablation study, but **second-to-last is suggested sweet point**.

-------------

### [4] Meeting with Jiaoyan 07/02/2021

**Key Points**

- CERLIB challenges [here](https://biochallenge.bio2vec.net/).
- Document Embedding Technique post [here](https://towardsdatascience.com/document-embedding-techniques-fed3e7a6a25d).
- Learn BERT and KB-BERT and share something next week.

**To Do List**

[$$\checkmark$$] Learn BERT and KB-BERT related materials. 

[ ] Learn Document Embedding Techs [here](https://towardsdatascience.com/document-embedding-techniques-fed3e7a6a25d)..

[$$\checkmark$$] Figure out DeepAlignment + Counter-fitting ([code](https://github.com/nmrksic/counter-fitting)).



**Further thoughts and questions**

- [DeepAlignment paper] Is the rectifier activation necessary for SR? For VSP, the trained distance $$d'$$ will be forced to be smaller than the original distance $$d$$, instead of being closer. My solution is to use **L1 Norm** in Pytorch which gives zero gradient at the turning point.
- For the following meetings, since I have started to use Mendeley, most of the thoughts and questions will be directly attached to the papers.

-----------------------------

### [5] Meeting with Jiaoyan 14/02/2021

**Key Points**

- Discussed Counter-fitting method and KG BERT models.
- Discussed the research plan for the next few months.

**To Do List**

[$$\checkmark$$] Come up with a research plan.

[ ] Start to write the code for some baseline experiments.

[ ] Learn BERT in depth.


