---
layout: post
title: "\"Attentional Guidance\" to the Novel Transformer"
date: 2021-2-18
feature: /assets/img/posts/attention.jpg
excerpt: "As stated in the title of the paper which proposed the powerful transduction model, Transformer, we do not need any recurrence or convolution to achieve the sequential predictions——all we need is attention."
tags: [transformer, attention, positional_encoding, paper_reading, maths]
comments: true
highlight: true
maths: true
review: false
paper: true
---

Though RNN and its variants are capable of capturing the sequential information, they suffer from the limited context. The attention mechanism, in theory, has the complete context window given enough computational power [[2]](#ref2). While the attention mechanism can strengthen RNNs, there is a natural question: Why don't we rely fully on the attention mechanism?

As stated in the title of the paper which proposed the powerful transduction model, Transformer, we do not need any recurrence or convolution to achieve the sequential predictions---all we need is **attention**. 

> Transformer is the first [transduction](https://machinelearningmastery.com/transduction-in-machine-learning/) model relying entirely on self-attention to compute representations of its input and output without using sequence- aligned RNNs or convolution [[1]](#ref1).

This post is intended to guide your attention, step by step, to understand the architecture of Transformer.

### Transformer Architecture

|                                                              |
| :----------------------------------------------------------: |
| <img src="https://miro.medium.com/max/2880/1*BHzGVskWGS_3jEcYYi6miQ.png" alt="transformer" style="zoom: 33%;" /> |
| Fig 1. The model architecture of the transformer taken from the original paper [[1]](#ref1). |

In Figure 1, we can see that the overall architecture follows the *encoder-decoder* structure with the left half being the *stacked encoder* and the right half being the *stacked decoder*. We will go through all the components in this figure as to understand it thoroughly.



**1. Stacked Layers**: 

The symbol ``Nx`` means the stack of $$N$$ identical layers. To overcome the problem brought by the deep architecture, the output of each sub-layer is augmented with a *residual connection* followed by *layer normalization* (``Add & Norm``). In short, the residual connection channels the information of the input to the deep layers and the layer normalization normalizes along the feature dimension for more stable gradients.

**2. **





-------------------------

### References

- [1] Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, U., & Polosukhin, I. (2017). Attention is All You Need. Proceedings of the 31st International Conference on Neural Information Processing Systems, 6000–6010.  <a name="ref1"></a>
- [2] Phi, Michael. "Illustrated Guide To Transformers- Step By Step Explanation". *Medium*, 2020, https://towardsdatascience.com/illustrated-guide-to-transformers-step-by-step-explanation-f74876522bc0.  <a name="ref2"></a>
