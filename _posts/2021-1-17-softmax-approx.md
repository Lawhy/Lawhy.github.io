---
layout: post
title: "[Maths] Approaches for Softmax Approximation"
date: 2021-1-17
excerpt: "Softmax function is widely used in the output layer of neural network based model. However, it suffers from the time complexitiy problem resulted from normalizing over the whole vocabulary in the NLP application (e.g. Word2Vec). To deal with it, various approaches for approximating Softmax have been proposed, and this post introduces some of them as well as the maths behind them."
tags: [softmax, approximation, sampling, time_complexity, neural_network, maths]
comments: false
---

The **softmax** function is widely used in the output layer of the neural network based model when we have a classification problem. It is the generalization of the **sigmoid** function in the multi-dimensional space. Compared to other types of normalization, the softmax function assigns more *extreme probabilities* to the outputs, and thus behaving more like the **argmax** function. Also, because of its [differentiability] and the nice [mathematical properties associated with its gradient], softmax is a good fit for gradient-based optimization such as the *stochastic gradient descent*.

Nevertheless, the softmax function suffers from the time complexitiy problem resulted from [normalizing over the whole vocabulary] in the NLP application (e.g. Word2Vec). To deal with it, various approaches for approximating softmax have been proposed, and this post introduces some of them as well as the maths behind them. Taking the Continuous Bag of Words model as an example, the output conditional probability of predicting the center word $$w$$ given the context word $$c$$ is given by the softmax function as:

$$
P(w | c) = \frac{\exp(S(w, c))}{\sum_{v \in V} \exp((S(v, c)))}
$$

where $$S(w, c)$$ is the scoring function that computes the **similarity** between the center word $$w$$ and the given context word $$c$$. To enforce a probability distribution, the softmax function normalizes the exponetial of the similarity score over the whole vocabulary of size $$\lvert V \rvert$$, thus requiring a large time consumption ($$O(\lvert V \rvert)$$) when we have a large vocabulary list.


-------

### References

- Sebastian Ruder. 2021. Approximating The Softmax For Learning Word Embeddings. [online] Available at: <https://ruder.io/word-embeddings-softmax/index.html#negativesampling> [Accessed 17 January 2021].

