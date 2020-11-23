---
layout: post
title: "Important Definitions for Knowledge Graphs"
date: 2020-11-18
excerpt: "A collection of definitions in Knowledge Graphs (KGs)."
tags: [knowledge_graph, literature_review, definition]
comments: false
---

This post collects the important definitions in Knowledge Graphs and it will be updated every now and then.

1. **Knowledge Graph**

    A graph of data intended to accumulate and convey knowledge of the real world, whose nodes represent `entities` of interest and whose `edges` represent relations between these entities.


2. **Interpretation**

    Mapping the nodes and edges in the `data graph` to those (respectively) of the `domain graph`.


3. **Model**

    The interpretations that satisfy a graph are called `models` of the graph.


4. **Entailment**

    One graph `entails` another *iff* any model of the former graph is also a model of the latter graph.
    
5. **Graph Pattern**

    Data graphs allowing `variables` as terms.
    
6. **Inference Rules**

    A rule encodes `IF-THEN` style consequences and is composed of a `body` (IF) and a `head` (THEN), both of which are given as `graph patterns`.

7. **Materialisation**

    Refers to the idea of applying `rules` *recursively* to a graph, adding the `conclusions` generated back to the graph until a fixpoint is reached and nothing more can be added.

8. **Query Rewriting**

    Automatically `extends` the query in order to find solutions entailed by a set of `rules`.

9. **Description Logics**

    DLs are based on three types of elements: `individuals` (e.g. Santiago); `classes` (e.g. City); and `properties` (e.g. flight). DLs then allow for making claims, known as `axioms`, about these elements. Assertional axioms form the `Assertional Box` (A-Box); Class axioms form the `Terminology Box` (T-Box); Property axioms form the `Role Box` (R-Box). `⊤` symbol is used in DLs to denote the `class of all individuals`.
    
10. **Deductive vs. Inductive**

    Deductive knowledge is characterised by `precise logicial consequences`; Inductive knowledge involves `generalising pattern`s (then `making predictions` with a level of confidence) from observations.
    
11. **Supervised, Self-supervised and Unsupervised Methods**

    `Supervised` methods learn a function (model) to map a given set of example inputs to their labelled outputs; `Self-supervisision` rather finds ways to generate the input-output pairs automatically from the input, then fed into a supervised process to learn a model; `Unsupervised` processes do not require lablled input-output pairs, but rather apply a predefined function to map inputs to outputs.
    
12. **Graph Analytics**

    `Analytics` is the process of discovering, interpreting, and communicating *meaningful patterns* inherent to data collections (graph data for Graph Analytics). `Topology` of the graph is how the nodes of the graph are connected.
    
    12.1 <u>Main techniques</u>: `Centrality` aiming to identify the most important nodes or edges of the graph. `Community detection` aiming to identify *communities*, i.e. sub-graphs that are more densely connected internally than to the rest of the graph; `Connectivity` aiming to estimate how well-connected the graph is, revealing, e.g. the resilience and (un)reachability of elements of the graph; `Node similarity` aiming to find nodes that are similar to other nodes by virtue of how they are connected within their neighbourhood; `Path finding` aiming to find paths in a graph, typically between pairs of nodes given as input.
    
    12.2 <u>Graph parallel frameworks</u> apply a `systolic abstraction` where nodes are processors that can send message to other nodes along edges; an algorithm in this framework consists of the functions to compute message values in the `message phase` (MsG), and to accumulate the messages in the `aggregation phase` (AGG); additional features including `global step` (global computation) and `mutation step` (adding/removing during processing).

    12.3 <u>Analytics involving edge meta-data</u>: `Projection` drops all edge metat-data; `Weighting` converts edge meta-data into numerical values according to some function; `Transformation` involves transforming the graph to a lower arity model, where being `lossy` means irreversible transformation (lossing information) and being `lossless` means reversible; `Customisation` involves changing the analytical procedure to incorporate edge meta-data.
    
    **Note**: The combination of analytics and entailment, according to the survey, has not been well-explored.
    
13. **Knowledge Graph Embeddings**

    The main goal is to create a dense representation of teh graph in a continuous, low-dimensional vector space, where the dimensionality *d* is typically low, e.g. \\(50 \leq d \leq 1000 \\). 
    
    13.1 <u>Most common instantiation</u> is given an edge \\([s] \xrightarrow{p} [o] \\), and the embeddings \\(e_s, r_p, e_o\\) (*e* stands for entity, *r* stands for relation), the scoring function computes the *plausibility* of the edge. The goal is then to compute the embeddings that maximise the plausibility of `postive edges` (typically edges in the graph) and minimise the plausibility of `negative examples` (typically edges in the graph with a node or edge label changed) according to the scoring function. The resulting embeddings can be seen as encoding latent features of graph through `self-supervision`, mapping input edges to output plausibility scores.
    
    13.2 <u>Translational models</u> interpret edge labels as transformations from subject nodes (source, head) to object nodes (target, tail). The most elementary approach is `TransE`, aiming to make \\(e_s + r_p \rightarrow e_o\\) for positive edges \\([s] \xrightarrow{p} [o] \\), and keeps the sum away from \\(e_o\\) for negative examples. `TransE` tends to assign cyclical relations a zero vector as the directional components will tend to cancel each other out. Variants of TransE such as `TransH` (represents different relations using distinct hyperplanes, so project the \\([s]\\) onto the hyperplane of \\(\xrightarrow{p}\\) before translating to \\([o]\\)), `TransR` (projects \\([s], [o]\\) into a vector space specific to \\(\xrightarrow{p}\\), `TransD` (simplifies TransR by associating entities and relations with a second vector, where these secondary vectors are used to project the entity into a relation-specific vector space).
    
    13.3 <u>Tensor decomposition models</u>: the original tensor is decomposed into more *elementary* tensors which capture *latent factors* (underlying information). `Rank decomposition` such that \\(\sum^r_{i=1} \mathbf{x_i} \otimes \mathbf{y_i} = \mathbf{C} \\) is approximated by setting a limit \\( d < r\\), \\(\otimes\\) refers to the `outer product` of vectors (\\(\mathbf{x} \otimes \mathbf{y} = \mathbf{x}\mathbf{y^T}\\). Method is called `Canonical Polyadic` (CP) decomposition. For graphs, we can have it encoded as a one-hot, order-3 tensor \\(G\\) with \\(\vert V \vert \times \vert L \vert \times \vert V \vert \\) elements, where \\(G_{ijk}\\) is set to one if \\(i^{th}\\) node links to \\(k^{th}\\) node with an edge having \\(j^{th}\\) label, or zero otherwise. Apply CP we obtain \\( \sum^d_{i=1} \mathbf{x_i} \otimes \mathbf{y_i} \otimes \mathbf{z_i} \approx G\\) and the decomposed \\(\mathbf{x_i}, \mathbf{y_j}, \mathbf{z_k}\\) are the graph embeddings we want. 
    
    **Note**: According to the survey, the current state-of-the-art decomposition method is `TuckER` with \\( G = \mathcal{T} \otimes \mathbf{A} \otimes \mathbf{B} \otimes \mathbf{C}\\), where the tensor \\(\mathcal{T}\\) is the "core" tensor.
    
    13.4 <u>Neural models</u>: One of the earliest proposal is `Semantic Matching Energy` (SME) which learns parameters for two functions such that \\(f_s(e_s, r_p) \cdot g_{w'}(e_o, r_p)\\) gives the plausibility score; Anoter early work was `Neural Tensor Networks` (NTN), which proposes to maintain a tensor \\(\mathcal{W}\\) of internal weights such that the plausibility score is given by a complex function that combines \\(e_s \otimes \mathcal{W} \otimes e_o \rightarrow NN_{e_s}, NN_{e_o} \rightarrow r_p\\). `Multi-layer Perceptron` (MLP) is a simpler model, where \\(e_s, r_p, e_o\\) are concatenated and fed into a hidden layer to compute plausibility score. For more neural models, please refer to page 41 - 42 of the survey.
    
    13.5 <u>Language models</u>: 
 
 
---
### References
- Hogan, A., E. Blomqvist, Michael Cochez, Claudia D'amato, Gerard de Melo, C. Gutiérrez, J. L. Gayo, S. Kirrane, S. Neumaier, A. Polleres, R. Navigli, Axel-Cyrille Ngonga Ngomo, S. M. Rashid, A. Rula, Lukas Schmelzeisen, Juan Sequeda, Steffen Staab and A. Zimmermann. “Knowledge Graphs.” ArXiv abs/2003.02320 (2020): n. pag.

<!--
    Latex Maths expression for testing. The only thing to look out for is the escaping of the backslash when using markdown, so the delimiters become `\\[ ... \\]` and `\\( ... \\)` for inline and block maths respectively.

    $$
    \begin{align*}
      & \phi(x,y) = \phi \left(\sum_{i=1}^n x_ie_i, \sum_{j=1}^n y_je_j \right)
      = \sum_{i=1}^n \sum_{j=1}^n x_i y_j \phi(e_i, e_j) = \\
      & (x_1, \ldots, x_n) \left( \begin{array}{ccc}
          \phi(e_1, e_1) & \cdots & \phi(e_1, e_n) \\
          \vdots & \ddots & \vdots \\
          \phi(e_n, e_1) & \cdots & \phi(e_n, e_n)
        \end{array} \right)
      \left( \begin{array}{c}
          y_1 \\
          \vdots \\
          y_n
        \end{array} \right)
    \end{align*}
    $$
-->
