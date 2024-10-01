---
title:          "BERTMap: A BERT-based Ontology Alignment System"
date:           2022-06-28 00:01:00 +0800
selected:       true
pub:            "AAAI"
# pub_pre:        "Submitted to "
# pub_post:       'Under review.'
# pub_last:       ' <span class="badge badge-pill badge-publication badge-success">Best Resource Paper Candidate</span>'
pub_date:       "2022"

tldr: We introduce BERTMap, a pipeline ontology alignment system that leverages textual information from input ontologies to fine-tune BERT for lexical matching, structural and logical information to further refine the output mappings.

abstract: >-
  Ontology alignment (a.k.a ontology matching (OM)) plays a critical role in knowledge integration. Owing to the success of machine learning in many domains, it has been applied in OM. However, the existing methods, which often adopt ad-hoc feature engineering or non-contextual word embeddings, have not yet outperformed rule-based systems especially in an unsupervised setting. In this paper, we propose a novel OM system named BERTMap which can support both unsupervised and semi-supervised settings. It first predicts mappings using a classifier based on fine-tuning the contextual embedding model BERT on text semantics corpora extracted from ontologies, and then refines the mappings through extension and repair by utilizing the ontology structure and logic. Our evaluation with three alignment tasks on biomedical ontologies demonstrates that BERTMap can often perform better than the leading OM systems LogMap and AML.


cover: /assets/images/papers/bertmap-aaai.png
authors:
  - <b>Yuan He</b>
  - Jiaoyan Chen
  - Denvar Antonyrajah
  - Ian Horrocks

links:
  Preprint: https://arxiv.org/abs/2112.02682
  Paper: https://ojs.aaai.org/index.php/AAAI/article/view/20510
---
