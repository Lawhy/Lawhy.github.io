---
layout: post
title: "[Maths] Softmax and its Variants"
date: 2021-1-17
excerpt: "Softmax function is widely used in the output layer of neural network based model. However, it suffers from the time complexitiy problem resulted from normalizing over the whole vocabulary in the NLP application (e.g. Word2Vec). To deal with it, various approaches for approximating/replacing softmax have been proposed, and this post introduces some of them as well as the maths behind them."
tags: [softmax, variants, hierachical_decomposition, sampling, neural_network, maths]
comments: false
---

## Introduction

The **softmax** function is widely used in the output layer of the neural network based model when we have a classification problem. It is the generalization of the **sigmoid** function in the multi-dimensional space. To see that, suppose we have a random variable $$X$$ with only two possible outcomes $$\{ x_1, x_2 \}$$, then by applying the softmax function on $$X$$, we have:

$$
P(X=x_1) = \frac{\exp(x_1)}{\sum_{i=1, 2} \exp(x_i)} = \frac{\exp(x_1)}{\exp(x_1) + \exp(x_2)} = \frac{1}{1 + \exp(x_1 - x_2)} = \sigma (x_1 - x_2)  
$$

where $$\sigma (\cdot)$$ is the sigmoid function.

Compared to other types of normalization, the softmax function assigns more *extreme probabilities* to the outputs, and thus behaving more like the **argmax** function. Also, because of its **differentiability** and the nice **mathematical properties associated with its gradient**, softmax is a good fit for gradient-based optimization such as the *stochastic gradient descent*.

Nevertheless, the softmax function suffers from the time complexitiy problem resulted from **normalizing over the whole vocabulary** in the NLP application (e.g. Word2Vec). To deal with it, various approaches for approximating/replacing softmax have been proposed, and this post introduces some of them as well as the maths behind them. Taking the Continuous Bag of Words model as an example, the output conditional probability of predicting the center word $$w$$ given the context word $$c$$ is given by the softmax function as:

$$
P(w | c) = \frac{\exp(S(w, c))}{\sum_{v \in V} \exp(S(v, c)))}
$$

where $$S(w, c)$$ is the scoring function that computes the **similarity** between the center word $$w$$ and the given context word $$c$$. To enforce a probability distribution, the softmax function normalizes the exponetial of the similarity score over the whole vocabulary of size $$\lvert V \rvert$$, thus requiring a large time consumption ($$O(\lvert V \rvert)$$) when we have a large vocabulary list.

-------

## Softmax-based Approaches 

The approaches discussed in this section more or less maintain the overall structure of the softmax.

### Hierarchical Softmax (H-Softmax)

The idea of H-Softmax starts from manipulating the equation of the conditional probability by **partioning** the outcomes of the random variable of interest into **clusters**. To illustrate, suppose we want to compute the conditional probability of $$Y$$ given $$X$$, by applying the summation rule we have:

$$
P(Y|X) = \sum_k P(Y, C_k | X) = \sum_k P(Y | C_k, X) \cdot P(C_k | X)
$$

where $$C_k$$ stands for the $$k$$th cluster of $$Y$$. Suppose there are no overlaps among clusters, we have each $$Y$$ corresponding to exactly one cluster $$C(Y)$$, thus the probabilities conditioned on other clusters are zeros. Therefore, we can re-write the above equation by discarding the summation symbol as:

$$
P(Y|X) = P(Y | C(Y), X) \cdot P(C(Y) | X)
$$

We can then extend the idea by applying the paritioning **recursively** as in a **binary tree structure** such that at each node of the tree, we are partioning words into two clusters. Suppose we have a **balanced binary tree** with leaves representing the words in the vocabulary, then the maximum search depth will be $$\log \lvert V \rvert$$ instead of $$\lvert V \rvert$$ as in the original softmax. Following the previous equation, we can replace the random variables to fit our context as follows:

$$
P(w | c) = P(w | p(w), c) \cdot P(p(w) | c) 
$$

where $$p(w)$$ stands for the parent node of the leaf for the word $$w$$. We can regard $$p(w)$$ as the cluster of $$w$$ and another word $$w'$$ (two children). The **recursive step is to merge the cluster $$p(w)$$ into a larger cluster** by applying the backtracking function $$p(\cdot)$$ again and again (climbing up the hierarchy) until reaching the root node (similar to hierarchical k-means). Hence, the final expression is:

$$
P(w | c) = \prod_{i=0}^{\log \lvert V \rvert - 2} P(p^i(w) | p^{i+1}(w), c) \cdot P(root)
$$

where $$p^0(w) = w$$, $$P(root) = 1$$, and the path is of length $$\log \lvert V \rvert - 1$$. The figure below demonstrates an example of computing the conditional probability $$P(blue \vert context)$$ in the hierarchical manner.

| ![hsoftmax.jpg](https://raw.githubusercontent.com/Lawhy/Lawhy.github.io/master/_posts/Materials/hsoftmax.png) | 
|:--:| 
| *Fig. 1: The example of applying the recursive cluster partioning as in the balanced binary tree.* |

Since we are searching in the binary tree, the probability function for each node can be the sigmoid function as proposed in the original work of H-Softmax [[2]](#ref3).

> **Note:** Although H-Softmax achieves $$O(\log \lvert v \rvert)$$ in **training**, it still needs to compute the probabilities for **all words** in **testing** because we do not know in advance that which word to be predicted (thus we **do not know the exact path**).

> **Note:** Building a language model for a corpus of vocabulary size $$\lvert V \rvert = 10000$$ with a balanced binary tree will result in an overall entropy of $$H = - \sum_{w \in V} p(w) \log p(w) = $$$$- \sum_{w \in V} \frac{1}{\lvert V \rvert} \log \frac{1}{\lvert V \rvert} =$$$$- \log {\lvert V \rvert} \approx 13.3$$. However, if we consider the frequencies of words in the corpus, we may have a lower entropy.

> **Note:** The intermediate nodes can be deemed as the **latent variables** and the performance of H-softmax relies largely on the construction of the tree or the definition of the clusters. One idea is to enforce that similar paths are assigned to similar words.


### Differentiated Softmax (D-Softmax) 

The idea of D-Softmax was inspired by *differentiating* words according to their frequencies. Compared to the vanilla softmax with a condense weight matrix in the output layer, D-Softmax utilizes a sparse weight matrix with blocks (of different dimensionalities) distributed to different word embeddings [[3]](#ref3). 

### Character-level Softmax

Instead of having a softmax over the words, we can apply it on the characters sequentially. 

-------

## Monte-Carlo Sampling Based Approahes

The approaches discussed in this section utilize the Monte-Carlo sampling techniques to approximate the softmax expectation during backpropagation to avoid the expensive computation on the normalizing term. Before delving into the methodology, we need to know some nice mathematical properties of the cross-entropy loss with the softmax activation.

### Cross-Entropy Loss with Softmax

In the language model scenario, the **cross-entropy loss for a single instance** $$\mathbf{y}$$ (one-hot encoding vector with value $$1$$ at the $$i$$th position) has the following form (see my previous post [here](https://lawhy.github.io/cross-entropy/) about cross-entropy): 

$$
L_i = H(\mathbf{y}, \hat{\mathbf{y}}) = - \sum_{j=1}^{\lvert V \rvert} y_j \log \hat{y}_j = - \log \hat{y}_i = - \log \frac{\exp(z_{i})}{\sum_{j=1}^{\lvert V \rvert} \exp(z_j))} = - z_i + \log (\sum_{j=1}^{\lvert V \rvert} \exp(z_j))
$$

where $$y_j = 1 \iff j=i$$ because of the nature of the one-hot encoding, $$z$$ refers to the unnormalized result generated from the previous layer, and the output is computed by the softmax activation. 

> **Note**: The subscripts for $$z$$ and $$y$$ correspond to the indices of the words in the vocabulary. 

For backpropagation we need to compute the gradient of the loss as:

$$
\begin{aligned}

\nabla L_i &= - \nabla z_i + \frac{1}{\sum_{j=1}^{\lvert V \rvert} \exp(z_j)} \cdot \nabla (\sum_{k=1}^{\lvert V \rvert} \exp(z_j))\\
           &= - \nabla z_i + \frac{1}{\sum_{j=1}^{\lvert V \rvert} \exp(z_j)} \cdot \sum_{k=1}^{\lvert V \rvert} \nabla \exp(z_k) \\
           &= - \nabla z_i + \frac{1}{\sum_{j=1}^{\lvert V \rvert} \exp(z_j)} \cdot \sum_{k=1}^{\lvert V \rvert} \exp(z_k) \nabla z_k\\
           &= - \nabla z_i + \sum_{k=1}^{\lvert V \rvert} \frac{\exp(z_k)}{\sum_{j=1}^{\lvert V \rvert} \exp(z_j)} \nabla z_k\\
           &= - \nabla z_i + \sum_{k=1}^{\lvert V \rvert} P(z_k) \nabla z_k\\
           &= - \nabla z_i + \mathbb{E}[\nabla z]
\end{aligned}
$$

where $$P$$ is the softmax probability distribution derived from the network. The final form of the gradient can be deemed as the (negative) deviation from the mean gradient. 

> **Note**: The reason for modelling the expectation is that backpropagation **does not** require the exact loss value and all we need to know is the gradient. However, we need specific softmax value when we want to monitor the convergence of the loss or during the evaluation time.

### Monte-Carlo Estimate

The Monte-Carlo estimate of the expectation $$\mathbb{E}[\nabla z]$$ has the following form:

$$
\mathbb{E}[\nabla z] \approx \frac{1}{m} \sum_{k=1}^m \nabla z_k
$$

where $$\nabla z_k$$ is sampled from the network's distribution $$P$$ as mentioned above. To justify the Monte-Carlo method, we need to apply the **Law of Large Numbers (LLN)** stating that the sample average converges to the expected value when the sample size is large enough. 

> **Note**: There are two forms of LLN, the **strong** one states that $$ Pr(\lim_{n \to \infty} \bar{X}_n = \mu) = 1 $$, which means the sample average converges [almost surely](https://www.statlect.com/asymptotic-theory/almost-sure-convergence)) to the mean. Briefly speaking, the event of having the limit not equal to the expectation is technically possible but of zero probability. Another example of the zero-probability event is $$Pr(X=x)=0$$ when $$X$$ is a continuous random variable.

> **Note**: The **weak** LLN states that $$\forall \epsilon.\lim_{n \to \infty} Pr(\lvert \bar{X}_n - \mu \rvert < \epsilon) = 0$$. Notice that the limit sign is pulled out and meaning changes. Here it states that with large enough sample size, there is a very low (but not zero) probability of having the deviation larger than some margin $$\epsilon$$. The weak LLN can be easily proved by using the **Chebyshev's Inequaility** but there is a lot more effort required for proving the strong LLN. 

> **Note**: Many Bayesian integrals can be viewed as expectations. 

It is clear that if $$m < \lvert V \rvert$$, then we will have a reduced computation steps. Nevertheless, such sampling method requires to **know the distribution $$P$$ of words** from the network which is even harder. Moreover, to reduce the training time further we need to **approximate the normalizing term using the sampling techniques** as well. In the following section, we will discuss how to address these two problems using Importance Sampling.

### Importance Sampling

The idea of the importance sampling is to leverage a easy-to-compute distribution $$Q$$ (e.g. the unigram distribution) called the **proposal distribution** to avoid sampling from the network's distribution $$P$$. To this end, we rewrite the forluma of the expected value as:

$$
\mathbb{E}_{P}[f(X)] = \int f(x)p(x) dx = \int f(x)\frac{P(x)}{Q(x)} Q(x) dx = \mathbb{E}_{Q}[f(X)\frac{P(X)}{Q(X)}] \approx \frac{1}{m} \sum_{k=1}^m f(x_k) \frac{P(x_k)}{Q(x_k)} 
$$

Compared to the direct sampling, we have an extra term $$\frac{P(x)}{Q(x)}$$ (sampling ratio) needed to compute, but the samples are derived from the distribution $$Q$$. To fit our context, we have:

$$
\mathbb{E}_{P}[\nabla z] = \mathbb{E}_{Q}[\nabla z \frac{P(z)}{Q(z)}] \approx \frac{1}{m} \sum_{k=1}^m \nabla z_k \frac{P(z_k)}{Q(z_k)} 
$$

At this point, we have solved the first problem by leveraging the proposal distribution, but we still need to tackle the normalizing term. We can first rewrite the normalizing term in the form of expectation as:

$$
\sum_j \exp(z_j) = n \sum_j \frac{1}{n} \exp(z_j) = n \cdot \mathbb{E}_{Uniform(0, n)}[\exp(z)] \approx \frac{n}{m} \sum_{k=1}^m \exp(z_k)
$$

In order to reuse the same proposal distribution $$Q$$, we can apply importance sampling on the expected value and obtain:

$$
\mathbb{E}_{Uniform(0, n)} = \mathbb{E}_{Q}[\exp(z) \frac{P'(z)}{Q(z)}] \approx \frac{1}{m} \sum_{k=1}^m \exp(z_k}\frac{m^{-1}}{Q(z_k)}
$$


> **Note**: There are many other Bayesian sampling techniques such as Rejection Sampling and MCMC.

-------

### References

- [1] Sebastian Ruder. On word embeddings - Part 2: Approximating the Softmax. http://ruder.io/word-embeddings-softmax, 2016. <a name="ref1"></a>

- [2] Morin, F. and Yoshua Bengio. “Hierarchical Probabilistic Neural Network Language Model.” AISTATS (2005). <a name="ref2"></a>

- [3] Chen, Wenlin, David Grangier and M. Auli. “Strategies for Training Large Vocabulary Neural Language Models.” ACL (2016). <a name="ref3"></a>

- [4] Bengio, Yoshua and Jean-Sébastien Senecal. “Quick Training of Probabilistic Neural Nets by Importance Sampling.” AISTATS (2003). <a name="ref4"></a>
