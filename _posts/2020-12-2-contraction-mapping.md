---
layout: post
title: "Contraction Mapping Theorem"
date: 2020-12-2
excerpt: "The proof and notes of the Contraction Mapping Theorem."
tags: [contraction_mapping_theorem, proof, in_depth_notes]
comments: false
---

The source of the proof is available [here](https://www.math.ucdavis.edu/~hunter/book/ch3.pdf).

### Definition of Contractions

Let $$(X, d)$$ be a metric space, A mapping $$T : X \mapsto X$$ is a *contraction mapping*, or *contraction*, if $$\exists c, 0 \leq c < 1$$ s.t. $$\forall x,y \in X$$, we have \\[d(T(x), T(y)) \leq c d(x, y).\\] 
**Note**: The *contraction* literally means `shortening the distance` between points. 
