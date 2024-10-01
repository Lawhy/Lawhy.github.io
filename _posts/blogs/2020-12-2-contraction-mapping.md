---
layout: post
title: "Contraction Mapping Theorem"
date: 2020-12-2
excerpt: "The proof and notes of the Contraction Mapping Theorem."
tags: [contraction_mapping_theorem, topology, maths]
comments: false
highlight: false
maths: true
review: false
paper: false
---

## Contraction Mapping Definition

Let $$(X, d)$$ be a metric space, A mapping $$T : X \mapsto X$$ is a *contraction mapping*, or *contraction*, if $$\exists c, 0 \leq c < 1$$ s.t. $$\forall x,y \in X$$, we have \\[d(T(x), T(y)) \leq c d(x, y).\\] 

**Note 1**: The *contraction* literally means **shortening the distance** between points. 

**Note 2**: The point $$x \in X$$ s.t. $$T(x) = x$$ is called a *fixed point* of $$T$$.

**Note 3**: The contraction mapping is **uniformly continuous** (not showing the proof in this post).

-----------------------

## Contraction Mapping Theorem

If $$T: X \mapsto X$$ is a *contraction mapping* on a **complete** metric space $$(X, d)$$, then $$\exists x \in X$$ be *fixed point*.

**Note 1**: A metric space $$(X, d)$$is said to be **complete** if every *Cauchy sequence* in $$X$$ converges to a point in $$X$$.

**Proof.** The proof uses a **constructive** method by creating a sequence converging to the *fixed point*. Let $$x_0$$ be any point in $$X$$. We define a sequence $$(x_n)$$ in $$X$$ by $$x_{n+1} = Tx_n$$ for $$n \in \mathbb{N}$$. A direct consequence is that $$x_n = T^nx_0$$. 

First, we show that $$(x_n)$$ is a *Cauchy sequence*. If $$n \geq m \geq 1$$, then from the definition of contractions and the *triangle inequality*, we have 

$$ 
\begin{aligned}
d\left(x_{n}, x_{m}\right) &=d\left(T^{n} x_{0}, T^{m} x_{0}\right) \\
& \leq c^{m} d\left(T^{n-m} x_{0}, x_{0}\right) \\
& \leq c^{m}\left[d\left(T^{n-m} x_{0}, T^{n-m-1} x_{0}\right)+d\left(T^{n-m-1} x_{0}, T^{n-m-2} x_{0}\right)\right.\\
& \leq c^{m}\left[\sum_{k=0}^{n-m-1} c^{k}\right] d\left(x_{1}, x_{0}\right) \\
& \leq c^{m}\left[\sum_{k=0}^{\infty} c^{k}\right] d\left(x_{1}, x_{0}\right) \\
& \leq\left(\frac{c^{m}}{1-c}\right) d\left(x_{1}, x_{0}\right)
\end{aligned}
$$

> **Inserted Note**: The second line results from **iterating** the definition of contractions for $$m$$ times, the first iteration would be \\[d(T^n x_0, T^m x_0 \leq cd(T^{n-1}x_0, T^{m-1}x_0).\\] The third line results from **iterating** the triangle inequality for $$n-m-1$$ times, the first iteration would be \\[c^{m} d\left(T^{n-m} x_{0}, x_{0}\right) \leq c^m [d(T^{n-m}x_0, T^{n-m-1}x_0) + d(T^{n-m-1}x_0, x_0)].\\] The fourth line, again, results from applying the defintion of contractions on each term separately. The last line gives an upper bound and since $$0 \leq c < 1$$, the bound converges to $$0$$. 


Hence, $$(x_n)$$ is *Cauchy*, and it converges to $$x \in X$$ since $$X$$ is **complete**. This further implies that
\\[Tx = T \lim_{n \rightarrow \infty} x_n = \lim_{n \rightarrow \infty} x_{n+1} = x.\\] 

> **Inserted Note**: The limit sign can be pulled out because of the **uniform continuity** of $$T$$.

Finally, suppose $$x$$ and $$y$$ are two fixed points, then we have 
\\[ 0 \leq d(x, y) = d(Tx, Ty) \leq cd(x, y),\\]
which implies that $$d(x,y) = 0$$ otherwise it contradicts to the definition of contractions.

-----------------
## References

The source of the proof is available [here](https://www.math.ucdavis.edu/~hunter/book/ch3.pdf).

