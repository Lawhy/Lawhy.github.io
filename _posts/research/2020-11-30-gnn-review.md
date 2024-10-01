---
layout: post
title: "Graph Neural Network"
date: 2020-11-18
excerpt: "Notes on the original Graph Neural Network (GNN)."
tags: [graph_neural_network, gnn, literature_review]
category: blog
---

The **Graph Neural Network** (GNN) implements a function $$\tau(G, n) \in \mathbb{R}^m$$ that maps a graph $$G$$ and one of its node $$n$$ into an $$m$$-dimensional Euclidean space. The originally proposed GNN is an extension of both *recursive neural networks* and *random walk models*. GNNs are based on an *information diffusion mechanism* (propagating the information to neighbors) which is constrained to ensure that a *unique* *stable* *equilibrium* always exists.

### The Original Model

GNN in the *positional* form involves with a parametric *local transition function* $$f$$ and a *local output function* $$g$$ such that for node $$v$$, we have:

$$
\begin{aligned}
\mathbf{h}_v &= f(\mathbf{x}_v, \mathbf{x}_{co[v]}, \mathbf{h}_{ne[v]}, \mathbf{x}_{ne[v]}) \\
\mathbf{o}_v &= g(\mathbf{h}_v, \mathbf{x}_v)
\end{aligned}
$$

where $$\mathbf{x}_v, \mathbf{x}_{co[v]}, \mathbf{h}_{ne[v]}, \mathbf{x}_{ne[v]}$$ are the features of $$v$$, the features of its edges (connecting to the same node), the states of the neighbors, and the features of the neighbors.

> **Note 1**: The features of neighbors $$\mathbf{x}_{ne[v]}$$ could be removed because the state of the neighbours $$h_{ne[v]}$$ implicitly contains the information.

> **Note 2**: For directed graph, the function $$f$$ can take extra input variable indicating the directions of the edges linked to node $$v$$.

> **Note 3**: For simplicity, the original GNN implements the same $$f$$ and $$g$$ for all nodes, but they can depend on different nodes.

Let $$\mathbf{H}, \mathbf{O}, \mathbf{X}$$, and $$\mathbf{N}$$ be the vectors constructed by stacking all the states, all the outputs, all the features, and all the node features, respectively. Then we have a compact form as:

$$
\begin{aligned}
\mathbf{H} &= F(\mathbf{H}, \mathbf{X})\\
\mathbf{O} &= G(\mathbf{H}, \mathbf{X}_N)
\end{aligned}
$$

where $$F$$ and $$G$$ are *global* functions according to **Note 3**.

By **Banach's fixed point theorem**, $$\mathbf{H}$$ can reach the *fixed point* as shown in the above compact expression, provided that $$F$$ is a *contraction map* (see the post [here](https://lawhy.github.io/contraction-mapping/) for details). Under this assumption, $$\mathbf{H}$$ can be iteratively updated to reach the *fixed point* as $$\mathbf{H}^{t+1} = F(\mathbf{H}^t, \mathbf{X})$$. This dynamical system *converges exponentially fast* to the solution of fixed point for *any* initial value $$\mathbf{H}(0)$$.

Next, we need to learn the parameters of $$F$$ and $$G$$. With $$p$$ supervised nodes, and the target information $$\mathbf{t}_i$$ for $$i$$th node, we have the loss function: $$ loss = \sum_{i=1}^p (\mathbf{t}_i - \mathbf{o}_i)$$. Then use the *gradient-descent* based algorithem to train the model as the followings:

- Iteratively update $$\mathbf{H}^t$$ until reaching the fixed point (set time $$T$$ as the upper time limit).
- Compute the gradient of weights w.r.t to the loss function.
- Update the parameters according to the optimization algorithm.

> **Limitations**: (1) Using fixed point makes it inefficient to update the hidden states of nodes and less informative for distinguishing each node (so not suitable for node-focused tasks); (2) Most popular neural networks use different parameters in different layers while the orginal GNN sets up global functions; (3) Informative features on the edges cannot be effectively modeled in the original model and how to learn the hidden states of edges is also a problem.

-------------
### References

- Zhou, J., Cui, G., Zhang, Z., Yang, C., Liu, Z., & Sun, M. (2018). Graph Neural Networks: A Review of Methods and Applications. *ArXiv, abs/1812.08434.*
- Scarselli, F., Gori, M., Tsoi, A., Hagenbuchner, M., & Monfardini, G. (2009). The Graph Neural Network Model. *IEEE Transactions on Neural Networks, 20, 61-80.*
- Li, B., Hao, D., Zhao, D., & Zhou, T. (2017). Mechanism Design in Social Networks. *AAAI*.
