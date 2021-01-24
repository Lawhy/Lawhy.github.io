---
layout: post
title: "Refining Node Embeddings via Semantic Proximity"
date: 2020-12-17
excerpt: "Notes on the paper about node embeddings enhanced with semantic proximity."
tags: [graph_embedding, node_embedding, semantic_proximity, paper_reading]
comments: false
highlight: false
maths: false
review: false
paper: true
---

**1. Research Gap** 

(1) Previous random walks based approaches mainly find the structural information without considering the semantics; (2) Other approaches rely on complex inputs (e.g. meaningful metapaths, that is, sequences of node types) or implicit semantic information (e.g. prior distribution specific to a dataset); (3) None of the approaches can learn embeddings of **semantic neighbors**, even if not directly connected (i.e. not structural neighbors).

**2. Contributions**: A novel approach that (1) leverages edge relatedness to derive the embedding construction (better than using nodes), (2) learns domain-specific embeddings by using some input predicates, (3) requires simpler input, and (4) considers an embedding refinement strategy based on penalty functions and semantic proximity.

**2. Preliminaries**

- *Heterogeneous Networks*: A graph $$G = (V,E)$$ with node and edge type mapping functions $$\tau_V : V \mapsto T_V$$ and $$\tau_E: E \mapsto T_E$$ is called *heterogeneous* if nodes (resp. edges) of the graph have different types, i.e., $$\lvert T_V \rvert > 1$$ (resp. $$T_E > 1$$). 
The work of this paper considers mainly *knowledge graphs* (KGs) aka *heterogeneous information networks*. A KG is a <u>directed</u> <u>node and edge labeled</u> <u>multi-graph</u> $$G = (V, E, U)$$ i.e. (entities, predicates, triples representing directed labeled edges).

- *Graph Embedding*: A graph embedding model $$h: v \mapsto \mathbb{R}^d$$ projects nodes into a low dimensional vector space where $$d \ll \lvert V \rvert$$.

- *Predicate Relatedness*: Given a KG $$G = (V, E, U)$$ and a pair of predicates $$(p_i, p_j) \in E$$, the relatedness measure is based on:
  - **Triple Frequency**: $$TF(p_i, p_j) = \log(1 + C_{i, j})$$, and
  - **Inverse Triple Frequency**: $$ITF(p_j, E) = \log \frac{\lvert E \rvert}{\lvert \{ p_k: C_{k. j} > 0 \} \rvert}$$, 

  where $$C_{i, j}$$ counts the **number of times** the predicates $$p_i$$ and $$p_j$$ link the **same subjects and objects**. Based on $$TF$$ and $$ITF$$, we can build a symmetric matrix   $$A$$ where $$A(i,j) = TF(p_i, p_j) \times ITF(p_j, E)$$. The final predicate relatedness matrix is constructed as:
  \\[ 
  R(i, j) = \cos(A[i,:]^T, A[j, :]^T).
  \\]
  
  > **Note**: $$TF$$ indicates how often the predicates $$p_i$$ and $$p_j$$ are shared by the same subject-object pairs; $$ITF$$ penalizes the score for $$p_j$$ if it is too   common or overloaded. Overall, each cell in $$A$$ indicates how **special** of $$p_j$$ is to $$p_i$$. And the relatedness score indicates the **similarity** between the predicates.
  
**3. Relatedness-Driven Walk Generation**

>**Note**: From the recommender, this section is not worth detailed reading as it contains many small logical problems and the techniques are of minal improvement.

Let $$IP$$, the input predicates for generating domain-driven embeddings. Let $$u \in V$$ be the current node and $$v \in Ne(u)$$ be the next node to be chosen from the neighbors of $$u$$. Let $$E(u)$$ be the set of predicates between $$u$$ and its neighbors.

- *Semantic Relatedness Driven Walk*: (1)  Compute the relatedness between each **predicate linked to the neighbors** and all the **input predicates**; (2) The strategy picks the next node via the the highest relatedness scores. Mathematically, \\[ v = \text{argmax}_{p_i \in E(u), p_j \in IP, v \in Ne(u)} R(p_i, p_j)  \\]

  > **Note**: The paper's original mathematical expressions are WRONG in my understanding.

- *Relatedness Driven Jump and Stay Walk*: The first approach is somewhat biased because it considers only the highest relatedness score. To overcome, (1) for the first $$M$$ steps if any $$R(p_i, p_j) > \alpha$$, we **stay** (using the equation above), otherwise we **jump** (choosing a random neighbor); (2) starting from $$(M+1)$$th step, for every move we choose a random node.

  > **Note**: The confusion here is whether or not we choose a random node in the neighbors or any others in (2). In my understanding, (2) corresponds to a **jump**.

- *Randomized Relatedness Driven Walk*: Select the next node in the subset of neighbors with top-$$k$$ highest relatedness scores randomly.

  > **Note**: The subset of neighbors might be of size smaller than $$k$$ when a neighbor $$v$$ has more than $$1$$ top-$$k$$ scores.
  
- *Probabilistic Relatedness Driven Walk*: Sample $$v$$ from the distribution of the highest relatedness scores.

**4. Learning Node Embeddings**

Use [Skip-gram](https://web.stanford.edu/class/cs224n/readings/cs224n-2019-notes01-wordvecs1.pdf) with [Negative Sampling](https://aegis4048.github.io/optimize_computational_efficiency_of_skip-gram_with_negative_sampling) to **maximize** the co-occurence probability among nodes that **appear in a walk** exsited in the corpus and **minimize** that for node pairs that **do not exist**.

**5. NESP: Embedding Refinement via Semantic Proximity**

The loss function is refined by adding constraints that each context node is selected from the **semantic neighbors** of the center node, and minimizing the **radius of the neighborhood** for each center node. Special regularization is employeed to convert the *non-convex constrained* (?) optimization problem into an *unconstrained* one.


-------------

### References

- Chekol, Melisachew Wudage and G. Pirrò. “Refining Node Embeddings via Semantic Proximity.” SEMWEB (2020).
