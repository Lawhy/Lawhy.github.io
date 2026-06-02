---
title: "From Agent Loops to Agent Environments"
date: 2026-06-01
slug: strands-env
summary: "Slides on the infrastructure behind agentic RL — making a rollout correct (token-faithful, on-policy) and fast (scalable), before any algorithm. The story behind strands-env and strands-sglang."
authors: '<a href="https://www.yuanhe.wiki/">Yuan He</a>'
comments: true
---

<aside class="post-aside">
<h3>Resources</h3>
<ul>
  <li><img class="favicon" src="https://www.google.com/s2/favicons?domain=github.com&sz=32" alt=""><a href="https://github.com/strands-rl/strands-env">strands-rl/strands-env</a></li>
  <li><img class="favicon" src="https://www.google.com/s2/favicons?domain=github.com&sz=32" alt=""><a href="https://github.com/strands-rl/strands-sglang">strands-rl/strands-sglang</a></li>
</ul>
</aside>

This slide deck discusses the principles behind how we built agent environments for agentic RL with [strands-env](https://github.com/strands-rl/strands-env) and [strands-sglang](https://github.com/strands-rl/strands-sglang). An agent environment is essentially a **rollout system** — and getting it right requires infra-level understanding before approaching the algorithms...

<div class="post-deck">
  <iframe class="post-deck__frame" src="slides/deck.html" title="From Agent Loops to Agent Environments — slides" allowfullscreen></iframe>
</div>

<div class="post-deck__bar">
  <span class="post-deck__hint">Arrow keys or click to navigate &middot; <kbd>Space</kbd> reveals details.</span>
  <button class="post-deck__fs" type="button" onclick="document.querySelector('.post-deck__frame').requestFullscreen()">&#9974; Fullscreen</button>
</div>
