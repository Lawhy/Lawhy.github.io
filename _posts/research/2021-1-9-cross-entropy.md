---
layout: post
title: "Cross Entropy Loss"
date: 2021-1-9
excerpt: "Cross-entropy is a measure of the difference between two probability distributions for a given random variable or set of events."
tags: [information_theory, cross_entropy, loss_function, maths]
category: blog
---

### What is Entropy?

Suppose we have $$N$$ balls that are entirely the **same**, and we put $$n_i$$ balls into the $$i$$th box, such that $$\sum_i n_i = N$$. Then, the number of ways of putting balls 
into the boxes is the following:

$$
M = \frac{N !}{\prod_i n_i !}
$$

In the binary system, we have $$2^h = M \iff h = \log_2 M$$ where $$h$$ is the number of bits required in the binary system to represent the number $$M$$. Therefore, the average bit for a ball is $$H = \frac{h}{N} = \frac{1}{N} \log_2 M$$. When $$N$$ goes to infinity, the average bit for storing the result incurred by one ball is the following:

$$
H = \lim_{N \to \infty} \frac{1}{N} \log_2 \frac{N !}{\prod_i n_i !} = \lim_{N \to \infty} \frac{1}{N} (\log_2 N! - \sum_i \log_2 n_i!)
$$

By [Stirling's Approximation](https://en.wikipedia.org/wiki/Stirling%27s_approximation), we have $$\log_2 n! = n \log_2 n - n \log_2 e + O(\log_2 n)$$. Hence, the above formula becomes:

$$
\begin{aligned}

H &= \lim_{N \to \infty} \frac{1}{N} (N \log_2 N - N \log_2 e + O(\log_2 N) - \sum_i (n_i \log_2 n_i - n_i \log_2 e + O(\log_2 n_i))) \\
  &= \lim_{N \to \infty} \frac{1}{N} (N \log_2 N - \sum_i (n_i \log_2 n_i)) \\
  &= \lim_{N \to \infty} \frac{1}{N} (\sum_i n_i \log_2 N - \sum_i (n_i \log_2 n_i)) \\
  &= \lim_{N \to \infty} \sum_i \frac{n_i}{N} \log_2 \frac{N}{n_i} = - \sum_i p_i \log_2 p_i
\end{aligned}
$$

where $$N \log_2 e = \sum_i n_i \log_2 e$$ and $$O(\log_2 N) = \sum_i O(\log_2 n_i)$$ are the reasons for eliminating terms in the second step, and the minus sign in the last step comes from inverting the fraction. If we take the probability of a ball going into the $$i$$th box as $$\lim_{N \to \infty} \frac{n_i}{N}$$, then we can interpret $$H$$ as the average bits (yes-or-no questions) required for knowing a ball going to which box. WLOG, for a discrete probability distribution $$P$$, the **entropy** $$H_P$$ is the average bits required for observing an event happened under the distribution $$P$$.

### What is Cross-Entropy?

The **Cross-Entropy** is the average number of **total bits** needed to encode data (in the binary system) or event coming from (true) distribution $$P$$ when we simulate from $$Q$$.

> **Note:** In contrast, Relative Entropy (KL Divergence) is the average number of **extra bits** to represent an event from Q instead of P. And both measures are **not symmetrical**.

The formula for Cross-Entropy and its relationship with KL Divergence is presented as follows:

$$
H(P, Q) = - \sum_i p_i \log_2 q_i = H(P) + KL(P \lvert \rvert Q)
$$

For a machine learning task, we can have $$H(y, \hat{y}) = - \sum_i y_i \log_2 \hat{y}_i$$, where $$y_i$$ is the known probability for the $$i$$th label occurred in the dataset, and $$\hat{y}_i$$ the is the probability of predicting the $$i$$th label. In an NlP task such as Word2Vec, the entropy becomes $$H(y, \hat{y}) = - \sum_i y_i \log_2 \hat{y}_i = - \log_2 \hat{y}_k$$ because the probability of having a word at this position (k) is exactly $$1$$ in the text data. If we use gradient descent, then we consider the sum or partial sum (batch) of the cross-entropies across the corpus as the loss function. In Word2Vec, this is equivalent to minimizing the negative log likelihood of context words given a center word (Skip-gram) or vice versa (CBOW). 

> **Note**: Specifically, a cross-entropy loss function is **equivalent** to a maximum likelihood function under a **Bernoulli or Multinoulli probability distribution**.

> **Note**: For the NLP case, $$H(y)=0$$ because we know exactly which position of the vector will have the value $$1$$ (one-hot encoding). Thus, minimizing the cross entropy is equivalent to minimizing the KL divergence.

### Some Extra Thoughts

- KL Divergence seems to be more appropriate to be used as the loss because it can actually tell the difference between the true distribution and the prediction model when the entropy of the true distribution is extremely large.

- Overfitting will be easily incurred in the NLP task because the cross-entropy model assumes the true conditional probability for a word appeared in this position is $$1$$.

-------------------------

### References

- Brownlee, J., 2021. A Gentle Introduction To Cross-Entropy For Machine Learning. [online] Machine Learning Mastery. 
  Available at: [https://machinelearningmastery.com/cross-entropy-for-machine-learning](https://machinelearningmastery.com/cross-entropy-for-machine-learning) 
  [Accessed 9 January 2021].
  
- The mathematical proof of the entropy formula is inspired by the blog [here](https://zhuanlan.zhihu.com/p/30854084).
