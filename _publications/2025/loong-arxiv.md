---
title:          "Loong: Synthesize Long Chain-of-Thoughts at Scale through Verifiers"
date:           2025-09-04 00:01:00 +0800
selected:       false
pub:            "arXiv"
pub_date:       "2025"

tldr: Synthetic long CoT data generation environment through verfiable rationale and high-quality seed datapoints across domains.

abstract: >-
    Recent advances in Large Language Models (LLMs) have shown that their reasoning
    capabilities can be significantly improved through Reinforcement Learning with
    Verifiable Reward (RLVR), particularly in domains like mathematics and programming,
    where ground-truth correctness can be automatically evaluated. However, extending
    this success to other reasoning-intensive domains remains challenging due to the
    scarcity of high-quality, verifiable datasets and the high cost of human supervision.
    In this work, we introduce the Loong Project: an open-source framework for scalable
    synthetic data generation and verification across a diverse range of reasoning-intensive
    domains.

    The framework consists of two key components. LOONGBENCH, a curated seed dataset
    containing 8,729 human-vetted examples across 12 domains (e.g., Advanced Mathematics,
    Chemistry, Logic), each paired with executable code and rich metadata. LOONGENV, a
    modular synthetic data generation environment that supports multiple prompting strategies
    to produce new question–answer–code triples. These components form an agent-environment
    loop enabling reinforcement learning, where an LLM-based agent is rewarded for generating
    Chain-of-Thought solutions that align with code-executed answers.

    We benchmark LOONGBENCH across open-source and proprietary LLMs to evaluate domain coverage
    and identify performance bottlenecks, and analyze synthetic data from LOONGENV in terms of
    correctness, difficulty, and diversity. Code and documentation are publicly available.

cover: 
authors:
  - Xingyue Huang*
  - Rishabh*
  - Gregor Franke*
  - Ziyi Yang*
  - Jiamu Bai‡
  - Weijie Bai
  - Jinhe Bi
  - Zifeng Ding
  - Yiqun Duan
  - Chengyu Fan
  - Wendong Fan
  - Xin Gao
  - Ruohao Guo
  - <b>Yuan He</b>
  - Zhuangzhuang He
  - Xianglong Hu
  - Neil Johnson
  - Bowen Li
  - Fangru Lin
  - Siyu Lin
  - Tong Liu
  - Yunpu Ma
  - Hao Shen
  - Hao Sun
  - Beibei Wang
  - Fangyijie Wang
  - Hao Wang
  - Haoran Wang
  - Yang Wang
  - Yifeng Wang
  - Zhaowei Wang
  - Ziyang Wang
  - Yifan Wu
  - Zikai Xiao
  - Chengxing Xie
  - Fan Yang
  - Junxiao Yang
  - Qianshuo Ye
  - Ziyu Ye
  - Guangtao Zeng
  - Yuwen Ebony Zhang
  - Zeyu Zhang
  - Zihao Zhu
  - Bernard Ghanem
  - Philip Torr
  - Guohao Li†

links:
  Preprint: https://arxiv.org/abs/2509.03059
---