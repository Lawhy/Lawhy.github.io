---
layout: post
title: ""Attentional Guidance" to the Novel Transformer"
date: 2021-1-17
feature: /assets/img/posts/sigmoid.jpg
excerpt: "Softmax function is widely used in the output layer of neural network based model. However, it suffers from the time complexitiy problem resulted from normalizing over the whole vocabulary in the NLP application (e.g. Word2Vec). To deal with it, various approaches for approximating/replacing softmax have been proposed, and this post introduces some of them as well as the maths behind them."
tags: [transformer, attention, positional_encoding, paper_reading, maths]
comments: true
highlight: true
maths: true
review: false
paper: true
---

As stated in the title of the paper which proposed the powerful transduction model, Transformer,  we do not need any recurrence or convolution to achieve the sequential predictions---all we need is **attention**. 

> Transformer is the first transduction model relying entirely on self-attention to compute representations of its input and output without using sequence- aligned RNNs or convolution [[1]](#ref1).





-------------------------

### References

- [1] Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, U., & Polosukhin, I. (2017). Attention is All You Need. Proceedings of the 31st International Conference on Neural Information Processing Systems, 6000–6010.  <a name="ref1"></a>
