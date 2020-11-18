---
layout: post
title: "Important Definitions for Knowledge Graphs"
date: 2020-11-18
excerpt: "A collection of definitions in Knowledge Graphs (KGs)."
tags: [knowledge_graph, definition, research]
comments: false
---

This post collects the important definitions in Knowledge Graphs and it will be updated every now and then.

1. **Knowledge Graph**:
A graph of data intended to accumulate and convey knowledge of the real world, whose nodes represent *entities* of interest and whose *edges* represent relations between these entities.


2. **Interpretation**:
Mapping the nodes and edges in the data graph to those (respectively) of the *domain graph*.


3. **Model**:
The interpretations that satisfy a graph are called *models* of the graph.


4. **Entailment**:
One graph *entails* another **iff** any model of the former graph is also a model of the latter graph.

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
