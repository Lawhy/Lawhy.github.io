---
layout: post
title: "[Maths] Approaches for Softmax Approximation"
date: 2021-1-17
excerpt: "Softmax function is widely used in the output layer of neural network based model. However, it suffers from the time complexitiy problem resulted from normalizing over the whole vocabulary in the NLP application (e.g. Word2Vec). To deal with it, various approaches for approximating Softmax have been proposed, and this post introduces some of them as well as the maths behind them."
tags: [softmax, approximation, sampling, time_complexity, neural_network, maths]
comments: false
---

**Softmax** function is widely used in the output layer of neural network based model. However, it suffers from the time complexitiy problem resulted from normalizing over the whole vocabulary in the NLP application (e.g. Word2Vec). To deal with it, various approaches for approximating Softmax have been proposed, and this post introduces some of them as well as the maths behind them. Taking the Continuous Bag of Words model as an example, the output conditional probability of predicting the center word $$w$$ given the context word $$c$$ is given by the Softmax function as:

$$
P(w | c) = \frac{\exp(S(w, c))}{\sum_{v \in V} \exp((S(v, c)))}
$$

where $$S(w, c)$$ is the scoring function that computes the **similarity** between the center word $$w$$ and the given context word $$c$$. To enforce a probability distribution, the Softmax function normalizes the exponetial of the similarity score over the whole **vocabulary** of size $$\lvert V \rvert$$ and this results in a large time consumption ($$O(\lvert V \rvert)$$).


-------

### References

- Sebastian Ruder. 2021. Approximating The Softmax For Learning Word Embeddings. [online] Available at: <https://ruder.io/word-embeddings-softmax/index.html#negativesampling> [Accessed 17 January 2021].

