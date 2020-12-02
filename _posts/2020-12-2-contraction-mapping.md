---
layout: post
title: "Contraction Mapping Theorem"
date: 2020-12-2
excerpt: "The proof and notes of the Contraction Mapping Theorem."
tags: [contraction_mapping_theorem, proof, in_depth_notes]
comments: false
---

The source of the proof is available [here](https://www.math.ucdavis.edu/~hunter/book/ch3.pdf).

### Contraction Mapping Definition

Let $$(X, d)$$ be a metric space, A mapping $$T : X \mapsto X$$ is a *contraction mapping*, or *contraction*, if $$\exists c, 0 \leq c < 1$$ s.t. $$\forall x,y \in X$$, we have \\[d(T(x), T(y)) \leq c d(x, y).\\] 

**Note 1**: The *contraction* literally means **shortening the distance** between points. 

**Note 2**: The point $$x \in X$$ s.t. $$T(x) = x$$ is called a *fixed point* of $$T$$.

### Contraction Mapping Theorem

If $$T: X \maps X$$ is a *contraction mapping* on a **complete** metric space $$(X, d)$$, then $$\exists x \in X$$ be *fixed point*.

**Note 1**: A metric space $$(X, d)$$is said to be **complete** if every Cauchy sequence in $$X$$ converges to a point in $$X$$.

**Proof.** The proof uses a **constructive** method by creating a sequence converging to the *fixed point*. Let $$x_0$$ be any point in $$X$$. We define a sequence $$(x_n)$$ in $$X$$ by  
