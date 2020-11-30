---
layout: post
title: "Graph Embeddings"
date: 2020-11-18
excerpt: "Notes on different techniques of graph embeddings."
tags: [graph_embeddings, in_depth_notes]
comments: false
---

**Embedding** is given by some mathematical function \\(f: X \rightarrow Y\\) which is `injective`, `structure-preserving` and often 
maps from the abstract high dimensional space to the concrete low diemnsional space to resolve the *sparsity* and *fractured information* caused by one-hot encoding.
Here \\(X\\) is said to be embedded in \\(Y\\). 

### Classical Graph Embeddings

1. **Locally Linear Embedding**: Under the assumption that the node can be represented by the `linear combination` of its neighbors such that the objective function is
\\[
\phi(\mathbf{X}) = \frac{1}{2} \sum_i (\mathbf{X_i} - \sum_{\mathbf{X_j \in ne(\mathbf{X_i})} \mathbf{W_j} \mathbf{X_j})^2
\\]

