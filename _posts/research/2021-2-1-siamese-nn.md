---
layout: post
title: "Siamese Neural Network"
date: 2021-2-1
excerpt: "Quick notes on Siamese Neural Network"
tags: [siamese_neural_network, quick_notes]
category: blog
---

### Siamese Neural Network

**Learning Goal**: Force the distance between Anchor and Positive to be small and that between Anchor and Negative to be large: $$d(A, P) + \alpha \leq d(A, N)$$.

**Triplet Loss Function**: 

$$
L_i(A, P, N) = \max\left(\|f(A) - f(P)\|^2 - \| f(A) - f(N) \|^2 + \alpha, 0\right)
$$

where $$A, P, N$$ refer to Anchor, Positive, Negative; $$\alpha$$ is the margin that defines the threshold distance. Overall loss is $$L = \sum_{i=1}^m L_i$$.

**Problem**: If triplets are randomly chosen, the inequality is easily satisfied.

**Solution**: Change the objective to 

$$
L = \sum_{i=1}^m \frac{y_i \cdot d_i + (1-y_i)\cdot\max\{\alpha - d_i, 0\}}{2}
$$

where $$d_i$$ is the normalized distance for $$i$$th sample, $$y_i=1$$ indicates $$P$$, $$y_i=0$$ indicates $$N$$.  The margin $$\alpha$$ here will force $$d_i$$ to be more negative in order to minimize the overall loss. 

