---
layout: post
title: "Paper Notes: Refining Node Embeddings via Semantic Proximity"
date: 2020-12-17
excerpt: "Notes on the paper about node embeddings enhanced with semantic proximity."
tags: [graph_embedding, node_embedding, semantic_proximity, paper_reading]
comments: false
---

**1. Research Gap**: (1) Previous random walks based approaches mainly find the structural information without considering the semantics; (2) Other approaches rely on complex inputs (e.g. meaningful metapaths, that is, sequences of node types) or implicit semantic information (e.g. prior distribution specific to a dataset); (3) None of the approaches can learn embeddings of **semantic neighbors**, even if not directly connected (i.e. not structural neighbors).

**2. Contributions**: A novel approach that (1) leverages edge relatedness to derive the embedding construction (better than using nodes), (2) learns domain-specific embeddings by using some input predicates, (3) requires simpler input, and (4) considers an embedding refinement strategy based on penalty functions and semantic proximity.

**2. Preliminaries**:

- *Heterogeneous Networks*: A graph $$G = (V,E)$$ with node and edge type mapping functions $$\tau_V : V \mapsto T_V$$ and $$\tau_E: E \mapsto T_E$$ is called *heterogeneous* if nodes (resp. edges) of the graph have different types, i.e., $$|T_V| > 1$$ (resp. $$T_E > 1$$). The work of this paper considers mainly *knowledge graphs* (KGs) aka *heterogeneous information networks*. A KG is a *[directed]* *[node and edge labeled]* *[multi-graph]* $$G = (V, E, U)$$ i.e. (entities, predicates, triples representing directed labeled edges).

- *Graph Embedding*: A graph embedding model $$h: v \mapts \mathbb{R}^d$$ projects nodes into a low dimensional vector space where $$d << |V|$$.
