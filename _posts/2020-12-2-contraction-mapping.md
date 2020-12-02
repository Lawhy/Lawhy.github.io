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

If $$T: X \mapsto X$$ is a *contraction mapping* on a **complete** metric space $$(X, d)$$, then $$\exists x \in X$$ be *fixed point*.

**Note 1**: A metric space $$(X, d)$$is said to be **complete** if every *Cauchy sequence* in $$X$$ converges to a point in $$X$$.

**Proof.** The proof uses a **constructive** method by creating a sequence converging to the *fixed point*. Let $$x_0$$ be any point in $$X$$. We define a sequence $$(x_n)$$ in $$X$$ by $$x_{n+1} = Tx_n$$ for $$n \in \mathbb{N}$$. A direct consequence is that $$x_n = T^nx_0$$. 

First, we show that $$(x_n)$$ is a *Cauchy sequence*. If $$n \geq m \geq 1$$, then from the definition of contractions and the *triangle inequality*, we have 
\\[ 
\begin{aligned}
d\left(x_{n}, x_{m}\right) &=d\left(T^{n} x_{0}, T^{m} x_{0}\right) \\
& \leq c^{m} d\left(T^{n-m} x_{0}, x_{0}\right) \\
& \leq c^{m}\left[d\left(T^{n-m} x_{0}, T^{n-m-1} x_{0}\right)+d\left(T^{n-m-1} x_{0}, T^{n-m-2} x_{0}\right)\right.\\
& \leq c^{m}\left[\sum_{k=0}^{n-m-1} c^{k}\right] d\left(x_{1}, x_{0}\right) \\
& \leq c^{m}\left[\sum_{k=0}^{\infty} c^{k}\right] d\left(x_{1}, x_{0}\right) \\
& \leq\left(\frac{c^{m}}{1-c}\right) d\left(x_{1}, x_{0}\right)
\end{aligned}
\\]
