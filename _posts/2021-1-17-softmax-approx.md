---
layout: post
title: "[Maths] Variants of Softmax Function"
date: 2021-1-17
excerpt: "Softmax function is widely used in the output layer of neural network based model. However, it suffers from the time complexitiy problem resulted from normalizing over the whole vocabulary in the NLP application (e.g. Word2Vec). To deal with it, various approaches for approximating Softmax have been proposed, and this post introduces some of them as well as the maths behind them."
tags: [softmax, variants, hierachical_decomposition, sampling, neural_network, maths]
comments: false
---

### Introduction

The **softmax** function is widely used in the output layer of the neural network based model when we have a classification problem. It is the generalization of the **sigmoid** function in the multi-dimensional space. To see that, suppose we have a random variable $$X$$ with only two possible outcomes $$\{ x_1, x_2 \}$$, then by applying the softmax function on $$X$$, we have:

$$
P(X=x_1) = \frac{\exp(x_1)}{\sum_{i=1, 2} \exp(x_i)} = \frac{\exp(x_1)}{\exp(x_1) + \exp(x_2)} = \frac{1}{1 + \exp(x_1 - x_2)} = \sigma (x_1 - x_2)  
$$

where $$\sigma (\cdot)$$ is the sigmoid function.

Compared to other types of normalization, the softmax function assigns more *extreme probabilities* to the outputs, and thus behaving more like the **argmax** function. Also, because of its **differentiability** and the nice **mathematical properties associated with its gradient**, softmax is a good fit for gradient-based optimization such as the *stochastic gradient descent*.

Nevertheless, the softmax function suffers from the time complexitiy problem resulted from **normalizing over the whole vocabulary** in the NLP application (e.g. Word2Vec). To deal with it, various approaches for approximating softmax have been proposed, and this post introduces some of them as well as the maths behind them. Taking the Continuous Bag of Words model as an example, the output conditional probability of predicting the center word $$w$$ given the context word $$c$$ is given by the softmax function as:

$$
P(w | c) = \frac{\exp(S(w, c))}{\sum_{v \in V} \exp((S(v, c)))}
$$

where $$S(w, c)$$ is the scoring function that computes the **similarity** between the center word $$w$$ and the given context word $$c$$. To enforce a probability distribution, the softmax function normalizes the exponetial of the similarity score over the whole vocabulary of size $$\lvert V \rvert$$, thus requiring a large time consumption ($$O(\lvert V \rvert)$$) when we have a large vocabulary list.

-------

### Hierarchical Softmax (H-Softmax)

The idea of H-Softmax starts from manipulating the equation of the conditional probability by **partioning** the outcomes of the random variable of interest into **clusters**. To illustrate, suppose we want to compute the conditional probability of $$Y$$ given $$X$$, by applying the summation rule we have:

$$
P(Y=y|X=x) = \sum_c P(Y=y, C=c | X=x) \sum_c P(Y=y | C=c, X=x) P(C=c | X=x)
$$


-------

### References

- Sebastian Ruder. 2021. Approximating The Softmax For Learning Word Embeddings. [online] Available at: <https://ruder.io/word-embeddings-softmax/index.html#negativesampling> [Accessed 17 January 2021].

- Morin, F. and Yoshua Bengio. “Hierarchical Probabilistic Neural Network Language Model.” AISTATS (2005).

