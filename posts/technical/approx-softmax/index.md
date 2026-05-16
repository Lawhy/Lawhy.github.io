---
title: Approximating the Softmax Function
date: 2021-01-17
tags: [softmax, Machine Learning, Math Proofs]
slug: approx-softmax
summary: "A math-first tour of softmax approximations when normalizing over a large vocabulary becomes the bottleneck."
authors: '<a href="https://www.yuanhe.wiki/">Yuan He</a>'
---

## Introduction

The **softmax** function is widely used in the output layer of neural-network models for classification. In the *binary case*, it reduces to the familiar **sigmoid** mapping.

Given a score (logit) vector $x=(x_1,x_2)$, the softmax probabilities are

$$
P(X=x_1)=\frac{\exp(x_1)}{\exp(x_1)+\exp(x_2)},\quad
P(X=x_2)=\frac{\exp(x_2)}{\exp(x_1)+\exp(x_2)}
$$

In particular,

$$
P(X=x_1)=\frac{\exp(x_1)}{\exp(x_1)+\exp(x_2)}=\sigma(x_1-x_2)
$$

where $\sigma(z)=\frac{1}{1+\exp(-z)}$ is the sigmoid function.

More generally, softmax can be viewed as **normalizing positive weights** obtained from log-scale inputs. If we write $x_i=\log y_i$ with $y_i>0$, then

$$
\mathrm{softmax}(x_i)=\frac{\exp(x_i)}{\sum_j \exp(x_j)}
=\frac{y_i}{\sum_j y_j}
$$

i.e., exponentiation converts log-weights into unnormalized weights, and softmax normalizes them into a probability distribution.

Compared with some other normalizations, softmax can produce **sharper** (more peaked) distributions as the logit gaps grow, and in the limit it approaches an **argmax-like** behavior. Crucially, it is differentiable, which makes it convenient for gradient-based optimization (especially when paired with cross-entropy loss).

In NLP applications, however, softmax can be expensive because it requires **normalizing over the full vocabulary**. For example, in the Continuous Bag-of-Words (CBOW) model, the conditional probability of predicting a target (center) word $w$ given a context representation $c$ is

$$
P(w\mid c)=\frac{\exp(S(w,c))}{\sum_{v\in V}\exp(S(v,c))}
$$

where $S(w,c)$ is a scoring function measuring compatibility (or similarity) between $w$ and $c$. Computing the denominator requires summing over $|V|$ vocabulary items, which is $O(|V|)$ per update in a naïve implementation. To address this, **various approximations and alternatives** to softmax have been proposed; this post introduces several of them and the math behind them.

---

## Non-Sampling Softmax Variants

These methods avoid sampling-based objectives and keep an exactly normalized probability model, either by factorizing the distribution (H-softmax), reallocating capacity (D-softmax), or changing the output units (character/subword softmax).

### Hierarchical Softmax (H-Softmax)

Hierarchical Softmax (H-Softmax) reduces the cost of computing a normalized distribution by **factorizing** the probability over a hierarchy of **clusters** (typically organized as a tree). The key idea starts from a simple partitioning argument.

Suppose the outcomes of a variable $Y$ are partitioned into disjoint clusters $\{C_k\}$. Then, by the law of total probability,

$$
P(Y \mid X) \;=\; \sum_k P(Y, C_k \mid X)
\;=\; \sum_k P(Y \mid C_k, X)\,P(C_k \mid X)
$$

where $C_k$ denotes the $k$-th cluster. If the clusters are **non-overlapping**, each outcome $Y$ belongs to exactly one cluster, denoted $C(Y)$. In that case, all terms except the one corresponding to $C(Y)$ vanish, and we obtain the factorization

$$
P(Y \mid X) \;=\; P(Y \mid C(Y), X)\,P(C(Y)\mid X)
$$

H-Softmax applies this factorization **recursively** by organizing the vocabulary as a (usually binary) tree: internal nodes represent clusters, and leaves correspond to words. For a **balanced binary tree** over a vocabulary $V$, the path length from root to any leaf is $O(\log |V|)$, so we can compute $P(w\mid c)$ by multiplying probabilities along the path rather than summing over all $|V|$ words as in full softmax.

Let $p(w)$ denote the parent of the leaf corresponding to word $w$, and more generally let $p^i(w)$ be the $i$-th ancestor on the path to the root, with $p^0(w)=w$. Then we can write

$$
P(w \mid c) \;=\; P(w \mid p(w), c)\,P(p(w)\mid c)
$$

Applying the same idea upward through the tree yields a product over decisions along the path:

$$
P(w \mid c)
\;=\;
\prod_{i=0}^{L-1} P\!\big(p^i(w)\mid p^{i+1}(w), c\big) \cdot P(\text{root})
$$

where $p^L(w)=\text{root}$ and $P(\text{root})=1$. For a balanced binary tree, $L \approx \log |V| - 1$.

Because each internal node in a binary tree corresponds to a **binary decision** (e.g., go left vs. go right), the conditional probability at each node can be modeled with a **sigmoid function**, as in the original H-Softmax formulation.

H-Softmax reduces the *per-example* cost of computing $P(w\mid c)$ during training from $O(|V|)$ to $O(\log |V|)$, because only the nodes on the target word's path are visited.

At inference time, however, if one needs the full distribution over all words, computing $P(w\mid c)$ for every $w\in V$ still requires evaluating all paths (or all leaves), which is $O(|V|)$ overall. In practice, H-Softmax is often most beneficial when training requires repeated probability computations for observed targets.

More broadly, internal nodes can be viewed as latent variables, and H-Softmax performance depends heavily on the **tree construction** (i.e., how words are clustered). A common intuition is that placing semantically or distributionally similar words under nearby subtrees can improve efficiency and accuracy.

### Differentiated Softmax (D-Softmax)

Differentiated Softmax (D-Softmax) is motivated by a simple observation: **word frequencies are highly skewed**, and allocating the same embedding/output dimensionality to every word can be wasteful. Instead of using a single dense output weight matrix of uniform dimensionality (as in vanilla softmax), D-Softmax **assigns different representation sizes to different frequency bands**. Concretely, frequent words are given higher-dimensional vectors (more capacity), while rare words use lower-dimensional vectors, yielding a **block-structured (effectively sparse) output layer** and reducing both memory and compute [<a href="#ref-3">3</a>].

Intuitively, this preserves expressiveness where it matters most (common words dominate the loss) while keeping the tail of the vocabulary cheap.

### Character-level Softmax

Another way to avoid a large word-level normalization is to predict **characters (or subword units)** instead of whole words. Rather than computing a softmax over a vocabulary of size $|V|$, the model generates a word as a sequence of characters and applies a softmax at each step over a much smaller character set (or subword vocabulary). This can significantly reduce the per-step normalization cost, at the expense of **longer sequences** and potentially more complex decoding.

---

## Monte Carlo Softmax Approximations

The approaches discussed in this section use **Monte Carlo sampling** to approximate the *softmax expectation* that appears in the gradient, thereby avoiding the expensive full-vocabulary computation of the normalizing term. Before introducing these methods, it is helpful to review a key property of combining **softmax** with **cross-entropy**.

### Cross-Entropy Loss with Softmax

In the Word2Vec setting, consider a single training instance whose target is word index $i$. Let $\mathbf{y}\in\mathbb{R}^{|V|}$ be the one-hot target vector with $y_i=1$ and $y_j=0$ for $j\neq i$. Let $\mathbf{z}\in\mathbb{R}^{|V|}$ be the vector of logits (unnormalized scores), and let $\hat{\mathbf{y}}=\mathrm{softmax}(\mathbf{z})$ be the predicted distribution:

$$
\hat{y}_j = \frac{\exp(z_j)}{\sum_{t=1}^{|V|} \exp(z_t)}
$$

The cross-entropy loss for this single instance is

$$
\begin{aligned}
L_i
&= H(\mathbf{y}, \hat{\mathbf{y}})
= -\sum_{j=1}^{|V|} y_j \log \hat{y}_j \\
&= -\log \hat{y}_i
= -\log\left(\frac{\exp(z_i)}{\sum_{j=1}^{|V|} \exp(z_j)}\right) \\
&= -z_i + \log\left(\sum_{j=1}^{|V|} \exp(z_j)\right)
\end{aligned}
$$

In Word2Vec (and other context-dependent models), one typically has $z_i = S(w_i, c)$ for some scoring function $S(\cdot,\cdot)$ given context $c$. For clarity, we omit the context dependence in this section.

> With one-hot targets, minimizing cross-entropy is equivalent to maximizing the conditional log-likelihood (i.e., **Maximum Likelihood Estimation**) under the model.

### Gradient and the "expectation" form

For backpropagation, we need $\nabla L_i$ with respect to model parameters (implicitly through their effect on $\mathbf{z}$). Differentiating the expression above gives

$$
\begin{aligned}
\nabla L_i
&= -\,\nabla z_i \;+\; \nabla \log\left(\sum_{j=1}^{|V|}\exp(z_j)\right) \\
&= -\,\nabla z_i \;+\; \frac{1}{\sum_{j=1}^{|V|}\exp(z_j)} \sum_{k=1}^{|V|} \exp(z_k)\,\nabla z_k \\
&= -\,\nabla z_i \;+\; \sum_{k=1}^{|V|} \frac{\exp(z_k)}{\sum_{j=1}^{|V|}\exp(z_j)}\,\nabla z_k \\
&= -\,\nabla z_i \;+\; \sum_{k=1}^{|V|} \hat{y}_k \,\nabla z_k \\
&= -\,\nabla z_i \;+\; \mathbb{E}_{k\sim \hat{\mathbf{y}}}\!\left[\nabla z_k\right]
\end{aligned}
$$

This final expression highlights the computational bottleneck: the gradient contains an **expectation under the model distribution** $\hat{\mathbf{y}}$, which in the naïve form requires summing over all $|V|$ vocabulary items. Sampling-based methods replace this full sum with a **Monte Carlo estimate**.

> During training we primarily need the *gradient*. Sampling-based methods approximate the expectation term to obtain a cheaper (possibly biased/noisy) gradient estimate. In contrast, computing the exact loss value or the full distribution can still be useful for monitoring and evaluation.

### Monte-Carlo Estimate

Recall that the gradient of the softmax cross-entropy loss can be written in the form

$$
\nabla L_i = -\,\nabla z_i + \mathbb{E}_{k\sim P}\!\left[\nabla z_k\right]
$$

where $P$ is the **model distribution** induced by the softmax. A natural idea is to approximate the expectation term with a **Monte Carlo (MC) average**:

$$
\mathbb{E}_{k\sim P}\!\left[\nabla z_k\right]
\;\approx\;
\frac{1}{m}\sum_{r=1}^{m} \nabla z_{k_r}
$$

Here, each $k_r$ is an index sampled from $P$, and $\nabla z_{k_r}$ is the corresponding gradient contribution.

This approximation is justified by the **Law of Large Numbers (LLN)**: as $m\to\infty$, the sample average converges to the true expectation under mild conditions.

- **Strong LLN (almost sure convergence):** $\Pr\!\left(\lim_{m\to\infty}\bar{X}_m = \mu\right) = 1$. Intuitively, the sample average converges to the mean with probability 1 (events where it does not converge are possible in principle but have probability 0).
- **Weak LLN (convergence in probability):** $\forall\,\epsilon>0,\quad \lim_{m\to\infty}\Pr\!\left(|\bar{X}_m - \mu| > \epsilon\right)=0$. Equivalently, for large $m$, the probability that the sample average deviates from $\mu$ by more than $\epsilon$ becomes arbitrarily small. A standard proof uses Chebyshev's inequality.

In practice, if $m \ll |V|$, then replacing the full-vocabulary sum with $m$ samples can substantially reduce computation. However, there are two major obstacles:

1. **Sampling from $P$ is expensive.** The distribution $P$ is the softmax distribution over the vocabulary, and sampling exactly from it typically requires knowing (or computing) the normalizing constant, which already involves an $O(|V|)$ pass.
2. **The normalizer still appears implicitly.** Even if we only need gradients, the softmax probabilities depend on $\sum_{j=1}^{|V|}\exp(z_j)$, so we still need a way to avoid computing this term exactly.

The next section addresses both issues using **importance sampling**, which replaces sampling from $P$ with sampling from a cheaper proposal distribution and applies appropriate reweighting.

### Importance Sampling

The key idea of **importance sampling** is to avoid sampling directly from the model distribution $P$ (the softmax over the vocabulary), which is expensive because it depends on the normalizing constant. Instead, we sample from an easier **proposal distribution** $Q$ (e.g., a unigram distribution) and reweight samples to obtain an estimate under $P$.

For any function $f$ and any proposal $Q$ such that $Q(x) > 0$ whenever $P(x) > 0$, we can rewrite the expectation:

$$
\mathbb{E}_{X\sim P}[f(X)]
= \int f(x)\,P(x)\,dx
= \int f(x)\,\frac{P(x)}{Q(x)}\,Q(x)\,dx
= \mathbb{E}_{X\sim Q}\!\left[f(X)\frac{P(X)}{Q(X)}\right]
$$

A Monte Carlo approximation using $m$ samples $x_1,\dots,x_m \sim Q$ is then

$$
\mathbb{E}_{X\sim P}[f(X)]
\approx
\frac{1}{m}\sum_{r=1}^{m} f(x_r)\frac{P(x_r)}{Q(x_r)}
$$

Applying this to our context (with $f$ playing the role of a gradient contribution), we obtain

$$
\mathbb{E}_{k\sim P}[\nabla z_k] = \mathbb{E}_{k\sim Q}\!\left[\nabla z_k \frac{P(k)}{Q(k)}\right]
\approx
\frac{1}{m}\sum_{r=1}^{m}\nabla z_{k_r}\frac{P(k_r)}{Q(k_r)}
$$

At this point we have addressed the first obstacle, i.e., **how to draw samples without sampling from $P$**, but we still face the second: we do not want to compute the softmax normalizer.

Recall that $P(k)=\frac{\exp(z_k)}{Z}$, with $Z=\sum_{j\in V}\exp(z_j)$. A convenient way to estimate $Z$ is to view it as an expectation under the uniform distribution over the vocabulary. Let $n=|V|$. If $U$ is uniform over indices $\{1,\dots,n\}$, then

$$
\mathbb{E}_{U}[\exp(z_U)] = \frac{1}{n}\sum_{j=1}^{n}\exp(z_j)
\;\;\Rightarrow\;\;
Z = n\,\mathbb{E}_{U}[\exp(z_U)]
$$

Using importance sampling to replace $U$ with the same proposal $Q$ gives

$$
\mathbb{E}_{U}[\exp(z_U)]=
\mathbb{E}_{k\sim Q}\!\left[\exp(z_k)\frac{U(k)}{Q(k)}\right]=
\mathbb{E}_{k\sim Q}\!\left[\exp(z_k)\frac{1/n}{Q(k)}\right]
$$

Therefore, with samples $k_1,\dots,k_m\sim Q$,

$$
Z = n\,\mathbb{E}_{U}[\exp(z_U)]
\approx
n\cdot\frac{1}{m}\sum_{r=1}^{m}\exp(z_{k_r})\frac{1/n}{Q(k_r)}=
\frac{1}{m}\sum_{r=1}^{m}\frac{\exp(z_{k_r})}{Q(k_r)}
$$

Plugging $P(k)=\exp(z_k)/Z$ into the importance-sampling estimate yields a ratio form. Using the same sampled set for numerator and denominator leads to the **self-normalized importance sampling** estimator:

$$
\mathbb{E}_{k\sim P}[\nabla z_k]
=\mathbb{E}_{k\sim Q}\!\left[\nabla z_k\frac{\exp(z_k)/Z}{Q(k)}\right]
\approx
\frac{\sum_{r=1}^{m}\nabla z_{k_r}\,\frac{\exp(z_{k_r})}{Q(k_r)}}
{\sum_{r=1}^{m}\frac{\exp(z_{k_r})}{Q(k_r)}}
$$

This estimator is **biased** in general, because it is a ratio of random quantities (and in general $\mathbb{E}[A/B]\neq \mathbb{E}[A]/\mathbb{E}[B]$) [<a href="#ref-4">4</a>]. In practice, the bias often decreases as $m$ grows, and the variance can be substantially lower than naive sampling.

Finally, in the Word2Vec case the logits are typically given by a similarity score, i.e. $z_k = S(w_k, c)$.

> Many other sampling techniques exist (e.g., rejection sampling, MCMC). Some work also proposes adaptive importance sampling, where the proposal $Q$ is adjusted over time to better match the target distribution $P$.

---

## Noise-Contrastive Estimation

Compared with importance sampling, **Noise-Contrastive Estimation (NCE)** [<a href="#ref-5">5</a>] often behaves more stably in practice because it avoids large or highly variable importance weights when the proposal distribution is a poor match to the model distribution. Instead of estimating the softmax probabilities directly, NCE reformulates learning as a **binary classification** problem: distinguish data samples from noise samples using the same underlying scoring function.

Let $D$ be a binary label where:

- $D=1$: the pair $(w,c)$ comes from the **data** (positive) distribution $P^+$,
- $D=0$: the word $w$ comes from a **noise** (negative) distribution $P^-$.

For each positive pair $(w,c)$, we draw $k$ negative words $w'_1,\dots,w'_k \sim P^-$. Under the common mixture interpretation (one data sample vs. $k$ noise samples), the joint distribution of $(D,w)$ conditioned on context $c$ is

$$
P(D,w\mid c) \propto P(D) \cdot P(w \mid c,D) =
\begin{cases}
\frac{1}{1+k}\,P^+(w\mid c) & D=1 \\[6pt]
\frac{k}{1+k}\,P^-(w) & D=0
\end{cases}
$$

where we assume $P^-(w)$ is **context-independent** for simplicity. Using Bayes' rule,

$$
P(D=1\mid w,c)=\frac{P^+(w\mid c)}{P^+(w\mid c)+k\,P^-(w)}
$$

$$
P(D=0\mid w,c)=\frac{k\,P^-(w)}{P^+(w\mid c)+k\,P^-(w)}
$$

In our setting, the model assigns an (unnormalized) score $S(w,c)$, and the corresponding **softmax** model is

$$
P^+(w\mid c)=\frac{\exp(S(w,c))}{\sum_{v\in V}\exp(S(v,c))}=\frac{\exp(S(w,c))}{Z(c)}
$$

> NCE is not restricted to softmax or discrete outcomes. In its original form, it can be used to train unnormalized probabilistic models by introducing noise and learning through classification.

A practical issue is that $Z(c)$ is expensive to compute. Early NCE formulations treated (a function of) the normalizer as an additional parameter to learn (e.g., a learned $\log Z(c)$ per context), but this can be difficult to scale when the number of distinct contexts is large.

Empirically, many implementations **fix** $Z(c)=1$ (often called **self-normalization**), i.e.,

$$
P^+(w\mid c)\approx \exp(S(w,c))
$$

and rely on the model capacity to learn scores consistent with normalization constraints.

> If you want a theoretical discussion of when/why self-normalization is reasonable, see Goldberger and Melamud's work [<a href="#ref-8">8</a>], which focuses on the properties of self-normalization in language models.

Let the dataset of observed pairs be $\mathcal{D}=\{(w,c)\}$, and for each observed $(w,c)$ sample $k$ negatives $w'_1,\dots,w'_k\sim P^-$. The NCE objective is the negative conditional log-likelihood of the binary labels:

$$
L = - \sum_{(w,c)\in\mathcal{D}}
\left[
\log P(D=1\mid w,c)
+
\sum_{i=1}^{k}\log P(D=0\mid w'_i,c)
\right]
$$

Substituting the class-posteriors above, and using the self-normalized choice $Z(c)=1$ (so $P^+(w\mid c)=\exp(S(w,c))$), we obtain:

$$
- \sum_{(w,c)\in\mathcal{D}}
\left[
\log \frac{\exp(S(w,c))}{\exp(S(w,c)) + k\,P^-(w)}
+
\sum_{i=1,\,w'_i\sim P^-}^{k}
\log \frac{k\,P^-(w'_i)}{\exp(S(w'_i,c)) + k\,P^-(w'_i)}
\right]
$$

<details markdown="1">
<summary>Derivation of the overall loss from per-context averaging</summary>

$$
\begin{aligned}
L &= \mathbb{E}_{c \sim P^{\mathcal{D}}}\!\left[L_c\right]
= \sum_{c \in V} P^{\mathcal{D}}(c)\,L_c
= \sum_{c \in V} \frac{|\mathcal{D}_c|}{|\mathcal{D}|}\,L_c \\[6pt]
&= \sum_{c \in V} \frac{|\mathcal{D}_c|}{|\mathcal{D}|}\left(- \sum_{(w,c)\in \mathcal{D}_c}\frac{1}{|\mathcal{D}_c|}\log P(D=1\mid w,c)- \sum_{i=1,\; w'_i\sim P^-}^{k}\log P(D=0\mid w'_i,c)\right) \\[8pt]
&= -\left(\sum_{c \in V}\sum_{(w,c)\in \mathcal{D}_c}\frac{1}{|\mathcal{D}|}\log P(D=1\mid w,c)+\frac{1}{|\mathcal{D}|}\sum_{c \in V}|\mathcal{D}_c|\sum_{i=1,\; w'_i\sim P^-}^{k}\log P(D=0\mid w'_i,c)\right) \\[10pt]
&= -\left(\sum_{(w,c)\in \mathcal{D}}\frac{1}{|\mathcal{D}|}\log P(D=1\mid w,c)+\sum_{(w,c)\in \mathcal{D}}\frac{1}{|\mathcal{D}|}\sum_{i=1,\; w'_i\sim P^-}^{k}\log P(D=0\mid w'_i,c)\right) \\[10pt]
&\propto -\sum_{(w,c)\in \mathcal{D}}\left(\log P(D=1\mid w,c)+\sum_{i=1,\; w'_i\sim P^-}^{k}\log P(D=0\mid w'_i,c)\right) \\[10pt]
&= -\sum_{(w,c)\in \mathcal{D}}\left(\log \frac{\exp(S(w,c))}{\exp(S(w,c)) + k\,P^-(w)}+\sum_{i=1,\; w'_i\sim P^-}^{k}\log \frac{k\,P^-(w'_i)}{\exp(S(w'_i,c)) + k\,P^-(w'_i)}\right)
\end{aligned}
$$

</details>

Intuitively, each positive pair competes against $k$ noise words: the model is trained to assign higher scores to true data pairs than to sampled noise words.

### Asymptotic analysis: why does NCE work?

Recall the per-context NCE objective. For a fixed context $c$, we can write the loss as the negative sum of two expectations: one over positive (data) words and one over negative (noise) words. Using a compact notation where $P^+=P^+(w\mid c)$ and $P^-=P^-(w)$, we have

$$
L_c = -\sum_{w\in V} P^{\mathcal{D}_c}(w)\,\log\frac{P^+}{P^+ + kP^-}
\;-\;
k\sum_{w\in V} P^-(w)\,\log\frac{kP^-}{P^+ + kP^-}
$$

To see why NCE recovers maximum-likelihood learning, we compute the gradient $\nabla_{\theta} L_c$ and examine its behavior as $k\to\infty$. Note that $P^+$ depends on parameters $\theta$, while $P^-$ and $P^{\mathcal{D}_{c}}$ are fixed distributions and thus have zero gradient.

**Part I: Gradient of the data (positive) term**

Define

$$
\mathrm{LHS}
=\nabla_{\theta} \sum_{w\in V} P^{\mathcal{D}_{c}}(w)\,
\log\frac{P^+}{P^+ + kP^-}
$$

Since $\nabla_{\theta} P^{\mathcal{D}_{c}}(w)=0$, we have:

$$
\begin{aligned}
\mathrm{LHS}
&= \sum_{w\in V}
P^{\mathcal{D}_{c}}(w)\cdot
\nabla_{\theta} \log\frac{P^+}{P^+ + kP^-} \\[4pt]
&= \sum_{w\in V}
P^{\mathcal{D}_{c}}(w)\cdot
\frac{P^+ + kP^-}{P^+}\cdot
\nabla_{\theta} \left(\frac{P^+}{P^+ + kP^-}\right) \\[6pt]
&= \sum_{w\in V}
P^{\mathcal{D}_{c}}(w)\cdot
\frac{P^+ + kP^-}{P^+}\cdot
\left(
\frac{\nabla_{\theta} P^+}{P^+ + kP^-}
- \frac{P^+\cdot \nabla_{\theta}(P^+ + kP^-)}{(P^+ + kP^-)^2}
\right) \\[6pt]
&= \sum_{w\in V}
P^{\mathcal{D}_{c}}(w)\cdot
\frac{P^+ + kP^-}{P^+}\cdot
\left(
\frac{\nabla_{\theta} P^+}{P^+ + kP^-}
- \frac{P^+\cdot \nabla_{\theta} P^+}{(P^+ + kP^-)^2}
\right)\\[6pt]
&= \sum_{w\in V}
P^{\mathcal{D}_{c}}(w)\cdot
\frac{\nabla_{\theta} P^+}{P^+}
\left(1 - \frac{P^+}{P^+ + kP^-}\right) \\[6pt]
&= \sum_{w\in V}
P^{\mathcal{D}_{c}}(w)\cdot
\nabla_{\theta} \log(P^+)\cdot \frac{kP^-}{P^+ + kP^-} \\[6pt]
&= \mathbb{E}_{w\sim P^{\mathcal{D}_{c}}}
\left[\nabla_{\theta} \log(P^+)\cdot \frac{kP^-}{P^+ + kP^-}\right]
\end{aligned}
$$

**Part II: Gradient of the noise (negative) term**

Similarly define:

$$
\mathrm{LHS}'
=\nabla_{\theta} \; k\sum_{w\in V} P^-(w)\,
\log\frac{kP^-}{P^+ + kP^-}
$$

Then,

$$
\begin{aligned}
\mathrm{LHS}'
&= k\sum_{w\in V} P^-(w)\,
\nabla_{\theta} \left(\log(kP^-) - \log(P^+ + kP^-)\right) \\[4pt]
&= -k\sum_{w\in V} P^-(w)\,
\frac{1}{P^+ + kP^-}\,\nabla_{\theta}(P^+ + kP^-) \\[4pt]
&= -k\sum_{w\in V} P^-(w)\,
\frac{1}{P^+ + kP^-}\,\nabla_{\theta} P^+ \\[6pt]
&= -k\sum_{w\in V} P^-(w)\,
\nabla_{\theta} \log(P^+)\cdot \frac{P^+}{P^+ + kP^-} \\[6pt]
&= -k\,\mathbb{E}_{w\sim P^-}
\left[\nabla_{\theta} \log(P^+)\cdot \frac{P^+}{P^+ + kP^-}\right]
\end{aligned}
$$

**Part III: Putting both parts together**

Since $\nabla_{\theta} L_c = -\mathrm{LHS} - \mathrm{LHS}'$, we obtain

$$
\begin{aligned}
\nabla_{\theta} L_c
&=
-\sum_{w\in V} P^{\mathcal{D}_{c}}(w)\,
\nabla_{\theta} \log(P^+)\cdot \frac{kP^-}{P^+ + kP^-}
\;+\;
k\sum_{w\in V} P^-(w)\,
\nabla_{\theta} \log(P^+)\cdot \frac{P^+}{P^+ + kP^-} \\[6pt]
&=
-\sum_{w\in V}
\frac{kP^-}{P^+ + kP^-}
\left(P^{\mathcal{D}_{c}}(w) - P^+(w\mid c)\right)
\nabla_{\theta} \log P^+(w\mid c)
\end{aligned}
$$

As $k\to\infty$ (the noise-to-data ratio grows), $\frac{kP^-}{P^+ + kP^-} \to 1$, and therefore

$$
\nabla_{\theta} L_c
\to
-\sum_{w\in V}
\left(P^{\mathcal{D}_{c}}(w) - P^+(w\mid c)\right)
\nabla_{\theta} \log P^+(w\mid c)
$$

This shares the same stationary points as maximum-likelihood training: at an optimum the model distribution matches the empirical conditional distribution, and the gradient vanishes. In other words, as $k$ increases, the **negative** NCE gradient approaches the maximum-likelihood gradient, explaining why NCE can serve as an effective surrogate for full softmax training.

### Negative sampling

Negative sampling is often presented as a simplified, more practical variant of NCE. Rather than explicitly fitting a normalized conditional distribution $P(w\mid c)$, it trains the scoring function $S(w,c)$ using a **binary logistic loss** that encourages observed (positive) pairs to score higher than randomly drawn (negative) pairs.

> **Important note**: It is not accurate to say negative sampling is the special case of NCE with (1) $k=|V|$ and (2) $P^-$ uniform. In practice, negative sampling typically uses a small $k$ (e.g., 5–20) and a non-uniform noise distribution (often a smoothed unigram). The correct relationship is: negative sampling is a closely related NCE-style objective, but it is not equivalent to NCE under those substitutions.

That said, starting from the NCE-style per-instance objective with $k$ negatives,

$$
L =
- \sum_{(w,c)\in\mathcal{D}}
\left[
\log P(D=1\mid w,c)
+
\sum_{i=1}^{k}\log P(D=0\mid w'_i,c)
\right]
$$

and using the common self-normalized approximation $P^+(w\mid c)\approx \exp(S(w,c))$ (i.e., $Z(c)=1$), we have

$$
P(D=1\mid w,c)=\frac{\exp(S(w,c))}{\exp(S(w,c)) + kP^-(w)}
$$

$$
P(D=0\mid w,c)=\frac{kP^-(w)}{\exp(S(w,c)) + kP^-(w)}
$$

If we further assume a uniform noise distribution $P^-(w)=\frac{1}{|V|}$ and set $k=|V|$, then $kP^-(w)=1$ and the objective becomes

$$
\begin{aligned}
L
&=
-\sum_{(w,c)\in\mathcal{D}}
\left[
\log \frac{\exp(S(w,c))}{\exp(S(w,c)) + 1}
+
\sum_{i=1}^{|V|}
\log \frac{1}{\exp(S(w'_i,c)) + 1}
\right] \\[6pt]
&=
-\sum_{(w,c)\in\mathcal{D}}
\left[
\log \frac{1}{1+\exp(-S(w,c))}
+
\sum_{i=1}^{|V|}
\log \frac{1}{1+\exp(S(w'_i,c))}
\right] \\[6pt]
&=
-\sum_{(w,c)\in\mathcal{D}}
\left[
\log \sigma\!\big(S(w,c)\big)
+
\sum_{i=1}^{|V|}
\log \sigma\!\big(-S(w'_i,c)\big)
\right]
\end{aligned}
$$

where $\sigma$ is the sigmoid function.

This is exactly the familiar **logistic loss** form used by negative sampling: push up scores for positive pairs and push down scores for sampled negatives.

In practice, negative sampling uses $k\ll |V|$ and a carefully chosen $P^-$ (often frequency-based), which makes training much cheaper while working well empirically.

---

## Tackling the normalizing constant directly

Most approaches above avoid the full-vocabulary normalizer $Z(c)=\sum_{v\in V}\exp(S(v,c))$ either by restructuring the output layer (e.g., H-softmax), changing the parameterization (e.g., D-softmax), or approximating the training objective via sampling (e.g., NCE, negative sampling). A natural question is: **can we handle the normalizer more directly?**

### Self-normalization

The idea of **self-normalizing softmax** is to encourage the model to produce scores such that

$$
Z(c)\approx 1
\Longleftrightarrow
\log Z(c)\approx 0
$$

so that the model behaves like an *approximately normalized* distribution without explicitly computing $Z(c)$ at decoding time [<a href="#ref-7">7</a>].

A common way to enforce this is to add a penalty term on $\log Z(c)$ to the (negative) log-likelihood objective:

$$
\begin{aligned}
L
&= - \sum_{(w,c)\in \mathcal{D}}
\left[
\log P(w\mid c) - \alpha(\log Z(c))^2
\right] \\
&= - \sum_{(w,c)\in \mathcal{D}} \log P(w\mid c)
\;+\;
\alpha \sum_{(w,c)\in \mathcal{D}} (\log Z(c))^2
\end{aligned}
$$

where $\alpha>0$ controls the strength of the self-normalization constraint.

At decoding time, one may then approximate

$$
P(w\mid c)
=\frac{\exp(S(w,c))}{Z(c)}
\approx
\exp(S(w,c))
$$

because the model has been trained to keep $\log Z(c)$ close to $0$. The original work reports substantial decoding speedups in their implementation (e.g., on the order of $\sim 15\times$) [<a href="#ref-7">7</a>].

> Some papers write the objective as a maximization problem; here we use the equivalent minimization form for consistency.

Two practical caveats are worth noting:

1. **Self-normalization is approximate.** Unlike the hard constraint sometimes adopted in NCE implementations (e.g., fixing $Z(c)=1$), this method only *encourages* $Z(c)$ to stay near $1$ via a soft penalty.
2. **It does not automatically reduce training cost.** Unless the penalty itself is estimated cheaply, training still requires computing (or approximating) $Z(c)$ in order to evaluate $\log P(w\mid c)$ and the penalty term.

### Sampling-based self-normalization

To improve training-time efficiency, Andreas and Klein (2015) [<a href="#ref-9">9</a>] proposed a **sampling-based** variant. The key observation is that enforcing normalization on a sufficiently large subset of contexts can still encourage approximate normalization more broadly.

Instead of penalizing $\log Z(c)$ for every training example, they apply the penalty only on a sampled subset $\mathcal{D}'\subseteq \mathcal{D}$:

$$
L = -\sum_{(w,c)\in \mathcal{D}} \log P(w\mid c)
\;+\;
\frac{\alpha}{\gamma}\sum_{c\in \mathcal{D}'} (\log Z(c))^2
$$

where $\gamma\in(0,1)$ is the sampling rate such that $|\mathcal{D}'|=\gamma|\mathcal{D}|$. The factor $\alpha/\gamma$ keeps the expected contribution of the penalty term comparable as $\gamma$ changes.

This reduces the amount of work spent on explicitly controlling $Z(c)$ during training while still encouraging self-normalization in the learned model.

---

## Conclusions

This post focused primarily on the **theoretical** side of the softmax family, with relatively fewer practical details. A natural next step would be to complement it with a more implementation-oriented follow-up, e.g., coding patterns, engineering trade-offs, and a brief survey of which softmax variants are commonly used in modern language models and representation learning systems.

> The central challenge addressed by most softmax variants in this post is how to **avoid the expensive computation of the normalizing constant** $Z(c)$ (or, more broadly, full-vocabulary normalization) during training and/or inference.

### Acknowledgements

This post follows the same high-level ordering of variants as Ruder's post [<a href="#ref-1">1</a>], but takes a more **math-oriented** approach and correspondingly includes less discussion of practical considerations. The core results are based on the original papers [<a href="#ref-2">2</a>]–[<a href="#ref-7">7</a>], while the derivations and proofs presented here were written by me (in 2021), and later polished by ChatGPT-5.2 (in 2026). Special thanks to [Yixuan He](https://sherylhyx.github.io/) for proofreading and helpful feedback.

---

## References

<ul class="references">
<li id="ref-1">[1] Sebastian Ruder. <a href="https://www.ruder.io/word-embeddings-softmax/"><em>On word embeddings — Part 2: Approximating the Softmax.</em></a> 2016.</li>
<li id="ref-2">[2] Morin, F. and Yoshua Bengio. <em>Hierarchical Probabilistic Neural Network Language Model.</em> AISTATS, 2005.</li>
<li id="ref-3">[3] Chen, Wenlin, David Grangier, and M. Auli. <em>Strategies for Training Large Vocabulary Neural Language Models.</em> ACL, 2016.</li>
<li id="ref-4">[4] Bengio, Yoshua and Jean-Sébastien Senecal. <em>Quick Training of Probabilistic Neural Nets by Importance Sampling.</em> AISTATS, 2003.</li>
<li id="ref-5">[5] Gutmann, M. and Hyvärinen, A. <em>Noise-contrastive estimation: A new estimation principle for unnormalized statistical models.</em> AISTATS, 2010.</li>
<li id="ref-6">[6] Mnih, A. and Y. Teh. <em>A fast and simple algorithm for training neural probabilistic language models.</em> ICML, 2012.</li>
<li id="ref-7">[7] Devlin, J., Rabih Zbib, Zhongqiang Huang, Thomas Lamar, R. Schwartz and J. Makhoul. <em>Fast and Robust Neural Network Joint Models for Statistical Machine Translation.</em> ACL, 2014.</li>
<li id="ref-8">[8] Goldberger, J. and Oren Melamud. <em>Self-Normalization Properties of Language Modeling.</em> <a href="https://arxiv.org/abs/1806.00913">arXiv:1806.00913</a>, 2018.</li>
<li id="ref-9">[9] Andreas, Jacob and D. Klein. <em>When and why are log-linear models self-normalizing?</em> HLT-NAACL, 2015.</li>
</ul>
