---
layout: post
title: "Important Definitions for Knowledge Graphs"
date: 2020-11-18
excerpt: "A collection of definitions in Knowledge Graphs (KGs)."
tags: [knowledge_graph, literature_review, definition]
comments: false
---

This post collects the important definitions in Knowledge Graphs and it will be updated every now and then.

1. **Knowledge Graph**:

    A graph of data intended to accumulate and convey knowledge of the real world, whose nodes represent `entities` of interest and whose `edges` represent relations between these entities.


2. **Interpretation**:

    Mapping the nodes and edges in the `data graph` to those (respectively) of the `domain graph`.


3. **Model**:

    The interpretations that satisfy a graph are called `models` of the graph.


4. **Entailment**:

    One graph `entails` another *iff* any model of the former graph is also a model of the latter graph.
    
5. **Graph Pattern**:

    Data graphs allowing `variables` as terms.
    
6. **Inference Rules**:

    A rule encodes `IF-THEN` style consequences and is composed of a `body` (IF) and a `head` (THEN), both of which are given as `graph patterns`.

7. **Materialisation**:

    Refers to the idea of applying `rules` *recursively* to a graph, adding the `conclusions` generated back to the graph until a fixpoint is reached and nothing more can be added.

8. **Query Rewriting**:

    Automatically `extends` the query in order to find solutions entailed by a set of `rules`.

9. **Description Logics**:

    DLs are based on three types of elements: `individuals` (e.g. Santiago); `classes` (e.g. City); and `properties` (e.g. flight). DLs then allow for making claims, known as `axioms`, about these elements. Assertional axioms form the `Assertional Box` (A-Box); Class axioms form the `Terminology Box` (T-Box); Property axioms form the `Role Box` (R-Box). ⊤ symbol is used in DLs to denote the `class of all individuals`.
    
---
### References:
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
