---
layout: post
title: "Pythagorean Means"
date: 2019-4-2
excerpt: "We discuss the common three types of Pythagorean means (i.e. *Arithmetic Mean, Geometric Mean* and *Harmonic Mean*) in this post, with emphasis on the interpretation of the Harmonic Mean."
tags: [pythagorean, Arithmetic Mean, Geometric Mean, Harmonic Mean, maths]
category: blog
---

We discuss the common three types of Pythagorean means (i.e. *Arithmetic Mean, Geometric Mean* and *Harmonic Mean*) in this post, with emphasis on the interpretation of the Harmonic Mean.



### Definitions

The definitions of the three Pythagorean means are the following:


$$
\begin{aligned}
AM &= \frac{1}{N} {\sum_{n=1}^N x_n} \\
GM &= \sqrt[N]{\lvert \prod_{n=1}^N x_n \rvert}  \\
HM &= \frac{N}{\sum_{n=1}^N \frac{1}{x_n}}
\end{aligned}
$$


where $$AM, GM$$ and $$HM$$ are abbreviations of Arithmetic Mean, Geometric Mean and Harmonic Mean, respectively.

### Interpretations

- $$AM$$ is the most intuitive mean.

- $$GM$$ is actually the **median** of the geometric series $$(x_n)$$. 

  **Proof:**  Let $$x_n = c r^n$$, then the product of the first $$N$$ terms is:
  
  $$
  P = \prod_{n=1}^N x_n = \prod_{n=1}^N cr^n = c^N r^{\sum_{n=1}^N n} = c^N r^{\frac{N(1+N)}{2}}
  $$
  
  Thus, the $$n$$th root of the product is $$c r^{\frac{1+N}{2}}$$, i.e. the **median** $$\blacksquare.$$

- The formula of $$HM$$ does not reveal intuitive understanding.  We present a sequence of examples to understand $$HM$$ as follows:

  - Modify the formula as follows: $$(\frac{\sum \frac{1}{x_n}}{N})^{-1}$$, we can interpret $$\frac{1}{x_n}$$ as the amount of work we need to finish the $$n$$th task given the **rate** $$x_n$$. Then $$\frac{\sum \frac{1}{x_n}}{N}$$ can be deemed as the **average amount of work** to finish a task, the inverse is the **average rate** to finish a task.

    > **Note**: The arithmetic mean of rate $$\bar{x}_n$$ has no meaning here because the rates are not of equal weights.  

  - Moreover, if we take $$x_n$$ as the **speed** of $$n$$th vehicle used  for travelling, then $$\frac{1}{x_n}$$ will be the **time** used for travelling a unit route with $$n$$th vehicle and the sum of all the reciprocals is the **mean time**. Thus $$HM$$ will be the **average speed** of the total trip divided into $$N$$ continuous parts with different vehicles.

  - If $$P$$ gives the Precision ($$\frac{tp}{tp + fp}$$) and $$R$$ gives the Recall ($$\frac{tp}{tp + fn}$$), then we can interpret $$P$$ to be the **correct rate** of the machine and $$R$$ to be the **retrieval rate**. The two "vehicles" here are *Model* and *Data* in the sense that the rate of getting a correct (model) prediction is $$x_1$$ and the rate of retrieve a reference (from data) is $$x_2$$. 

    > **Note**: Both the correct prediction and the retrieved reference refer to a True Positive ($$tp$$), but from different aspects. The former considers the model and the latter considers the data.

  - $$HM(P, R) = \frac{2PR}{P + R}$$ is the standard F1-score. Why not arithmetic mean? The reason is simply that Positive and Truth may not coincide with each other. We are measuring the machine performance from two aspects: [1] To what extent can we **trust the Positive**? [2] To what the extent of is the **Truth being treated properly**? By default, there is no preference to these two aspects. But if we do prefer one to another, then we need a weighted version of means.

  - The general $$F_{\beta}$$ score has the following formula: 
    
    $$
    F_{\beta} = \frac{1}{\frac{\beta^2 / (1 + \beta^2)}{R} + \frac{1 / (1 + \beta^2)}{P}} = \frac{(1 + \beta^2)PR}{\beta^2 P + R}
    $$

    So the total "distance" is now $$1+\beta^2$$ instead of $$2$$ ($$\beta^2$$ for *Data* and $$1$$ for *Model*). If $$\beta^2 > 1$$, we need larger Recall to increase the score (it favours Recall) and for $$\beta^2 < 1$$ the metric favours Precision. To obtain the AM, we need $$R = \beta^2 P$$ such that 
    
    $$
    F_{\beta} = \frac{(1 + \beta^2)\beta^2P^2}{2 \beta^2 P} = \frac{(1 + \beta^2)P}{2} = \frac{P + R}{2}
    $$

    > **Note**: $$R = \beta^2 P$$ can be interpreted as follows: Data takes $$\beta^2$$ distance so it needs $$\beta^2$$ times of the speed to keep the same time as Model. $$2$$ in the denominator indicates the same time intervals spent by both vehicles.

### Geometric Interpretations

|  ![mean_geometry.PNG](/assets/img/posts/mean_geometry.PNG)   |
| :----------------------------------------------------------: |
| *Fig. 1: Geometric relationship between each of the Pythagorean mean and the half circle. |

**Claim**: $$A, G$$ and $$H$$ correspond to the three Pythagorean means defined above, respectively.



**Proof**: $$A$$ is clearly $$\frac{a + b}{2}$$, i.e. the radius $$r$$ of the circle. Thus, $$z = r - b = \frac{a-b}{2}$$. 

Since $$z = \frac{a - b}{2}$$, $$H + x = \frac{a + b}{2}$$, we have, by the Pythagorean Theorem, $$G = \sqrt{ab}$$. 

Since $$\frac{x}{z} = \frac{y}{G}$$ (similar triangles), we have $$\frac{x}{(a-b)/2} = \frac{y}{\sqrt{ab}}$$, thus $$ x = \frac{ (a-b)y }{ 2\sqrt{ab} } $$. Again, by the Pythagorean Theorem, 

$$
\begin{aligned}
    & \frac{(a-b)^2y^2}{4ab} + y^2 = \frac{(a-b)^2}{4} \\[10pt]
    \implies & (a+b)^2y^2 = ab(a-b)^2 \\[10pt]
    \implies & y = \frac{\sqrt{ab}|a-b|}{(a+b)} \\
    \implies & H = \sqrt{G^2 - y^2} = \sqrt{ab - ab\frac{(a-b)^2}{(a+b)^2}} \\
    =& \sqrt{ab(\frac{(a+b)^2 - (a-b)^2}{(a+b)^2})} \\
    =& \sqrt{\frac{4a^2b^2}{(a+b)^2}} = \frac{2ab}{a + b} = \text{Harmonic Mean}.
\end{aligned}
$$

$$\blacksquare$$.
