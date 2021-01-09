---
layout: post
title: "Cross Entropy Loss"
date: 2021-1-9
excerpt: "Cross-entropy is a measure of the difference between two probability distributions for a given random variable or set of events."
tags: [information_theory, cross_entropy, loss_function]
comments: false
---

Suppose we have $$N$$ balls that are entirely the **same**, and we put $$n_i$$ balls into the $$i$$th box, such that $$\sum_i n_i = N$$. Then, the number of ways of putting balls 
into the boxes is the following:

$$
M = \frac{N !}{\prod_i n_i !}
$$

In the binary system, we have $$2^h = M \iff h = \log_2 M$$ where $$h$$ is the number of bits required in the binary system to represent the number $$M$$. Therefore, the average bit for a ball is $$H = \frac{h}{N} = \frac{1}{N} \log_2 M$$. When $$N$$ goes to infinity, the average bit for storing the result incurred by one ball is the following:

$$
H = \lim_{N \to \infty} \frac{1}{N} \log_2 \frac{N !}{\prod_i n_i !} = \lim_{N \to \infty} \frac{1}{N} (\log_2 N! - \log_2 \prod_i n_i!)
$$


### References

- Brownlee, J., 2021. A Gentle Introduction To Cross-Entropy For Machine Learning. [online] Machine Learning Mastery. 
  Available at: [https://machinelearningmastery.com/cross-entropy-for-machine-learning](https://machinelearningmastery.com/cross-entropy-for-machine-learning) 
  [Accessed 9 January 2021].
