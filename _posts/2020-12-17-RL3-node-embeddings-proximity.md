---
layout: post
title: "Paper Notes: Refining Node Embeddings via Semantic Proximity"
date: 2020-12-17
excerpt: "Notes on the paper about node embeddings enhanced with semantic proximity."
tags: [graph_embedding, node_embedding, semantic_proximity, paper_reading]
comments: false
---

**1. Research Gap**: (1) Previous random walks based approaches mainly find the structural information without considering the semantics; (2) Other approaches rely on complex inputs (e.g. meaningful metapaths, that is, sequences of node types) or implicit semantic information (e.g. prior distribution specific to a dataset); (3) None of the approaches can learn embeddings of **semantic neighbors**, even if not directly connected (i.e. not structural neighbors).

**2. Preliminaries**:
