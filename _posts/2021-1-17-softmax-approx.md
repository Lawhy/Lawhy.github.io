---
layout: post
title: "[Maths] Approaches for Softmax Approximation"
date: 2021-1-17
excerpt: "Softmax function is widely used in the output layer of neural network based model. However, it suffers from the time complexitiy problem resulted from normalizing over the whole vocabulary in the NLP application (e.g. Word2Vec). To deal with it, various approaches for approximating Softmax have been proposed, and this post introduces some of them as well as the maths behind them."
tags: [softmax, approximation, sampling, time_complexity, neural_network, maths]
comments: false
---

**Softmax** function is widely used in the output layer of neural network based model. However, it suffers from the time complexitiy problem resulted from normalizing over the whole vocabulary in the NLP application (e.g. Word2Vec). To deal with it, various approaches for approximating Softmax have been proposed, and this post introduces some of them as well as the maths behind them. Taking the Skip-gram model as an example, the output conditional probability of predicting the context word $$c$$ given the center word $$w$$ is given by the Softmax function as:

$$
P(c | w) = \fract{\exp(x_i)}{\sum_{j=1}^{\lvert V \rvert} \exp(x_j)}
$$

where $$x_i$$ is the similarity score between the $$i$$th word in the vocabulary (i.e. the context word) and the given center word. 


-------

### References

- Sebastian Ruder. 2021. Approximating The Softmax For Learning Word Embeddings. [online] Available at: <https://ruder.io/word-embeddings-softmax/index.html#negativesampling> [Accessed 17 January 2021].

