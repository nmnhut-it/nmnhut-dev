+++
date = '2026-04-07'
draft = false
title = 'Patterns for Agent Diversity in Multi-Agent LLM Systems'
description = 'Practical patterns that prevent multi-agent systems from collapsing into echo chambers, inspired by learning pressures in deep learning.'
tags = ['ai', 'llm', 'multi-agent', 'architecture', 'patterns']
+++

When you run multiple LLM agents together, the most likely outcome is collapse: every agent converges on the same answer, echoes the others, and you end up paying for expensive consensus that a single call could have produced.

This happens because the default pressure in most multi-agent setups is agreement. Agents read each other's outputs and optimize for coherence. Without an opposing force, there's no reason for any agent to disagree.

The fix is intentional tension — mechanisms that force agents to stay diverse and contribute unique value. Below are patterns that do this, grouped by the kind of pressure they create. Each one is inspired by a technique from deep learning where the same problem (representation collapse) has been studied extensively.

---

## Diversity Pressures

These patterns force agents to produce different outputs.

### Adversarial Critic

Designate one agent as a critic whose only job is to find flaws in other agents' outputs. It never generates solutions — it only evaluates. This prevents it from drifting toward agreement with the group.

The key: the critic must not also be a generator. The moment it proposes alternatives, it starts optimizing for its own ideas instead of stress-testing others'.

*Inspired by the discriminator in GANs — a dedicated adversary that provides signal without participating in generation.*

Use when: you need high-confidence outputs and can afford the extra call.

### Role Codebook

Assign each agent a fixed persona before inference: optimist, skeptic, domain expert, user advocate, systems thinker. The agent is "committed" to reasoning from that perspective and cannot drift to a neutral middle ground.

This works because it makes collapse structurally impossible — a skeptic and an optimist cannot produce the same output without one of them violating their role.

*Inspired by VQ-VAE's discrete codebook — each representation must commit to a specific code, preventing everything from averaging to the mean.*

Use when: you want guaranteed perspective diversity without complex orchestration.

### Contrastive Reward

When evaluating agent outputs, reward meaningful difference from other agents. An output that raises a point no other agent mentioned scores higher than one that rephrases existing points, even if the rephrase is more polished.

*Inspired by contrastive learning (SimCLR, MoCo) — embeddings of different samples are pushed apart in representation space.*

Use when: you have an evaluation step and want to incentivize originality.

---

## Structural Pressures

These patterns control information flow to prevent cascade effects.

### Graph Topology

Don't let every agent read every other agent's output. Restrict the communication graph: agent A reads B and C, but not D and E. This prevents a single dominant agent from pulling the entire group toward its position.

Think of it as dropout for multi-agent systems — cutting connections forces each agent to form independent judgments on some dimensions.

*Inspired by graph neural network architectures and dropout regularization — restricting connectivity prevents co-adaptation.*

Use when: you have 4+ agents and notice one agent's framing dominates the group.

### Information Bottleneck

Before agents share reasoning with each other, force each to compress their output to a fixed budget (e.g., 200 tokens). Different agents compress differently — when you aggregate compressed outputs, you get more diverse information than sharing full context where one verbose agent dominates.

*Inspired by the information bottleneck principle (β-VAE) — compress maximally while retaining task-relevant information.*

Use when: agents are reading each other's full outputs and converging too quickly.

### Sequential Constraint

When agents respond in sequence, enforce a rule: each agent must introduce new information or explicitly contradict a previous agent with reasoning. Paraphrasing or agreeing without adding substance is not allowed.

This is simple to implement — add it to the system prompt — and surprisingly effective at maintaining diversity across rounds.

*Inspired by autoregressive models (GPT) — each position must add to the sequence, not repeat it.*

Use when: you have a multi-round debate or chain-of-agents setup.

---

## Selection Pressures

These patterns force agents to be selective about what they contribute.

### Sparsity Limit

Limit each agent to raising at most K points (e.g., 3). When an agent can only make 3 claims, it naturally picks the ones it's most confident about — and since each agent has different strengths, they self-select into different points without any explicit coordination.

*Inspired by sparse autoencoders — L1 penalty forces representations to activate only the most important features.*

Use when: agents are producing overlapping, comprehensive lists instead of focused contributions.

### Unique Contribution Reward

Score agents not just on correctness but on unique value: did this agent surface something that no other agent found? An agent that's correct but redundant scores lower than one that's correct and novel.

*Inspired by RLHF reward shaping — the reward function defines what "good" means, and you can shape it to value novelty alongside accuracy.*

Use when: you're aggregating outputs and want to identify which agents are actually earning their cost.

---

## Consensus Pressures

These patterns manage how the group converges without losing diversity.

### Momentum Consensus

Maintain a slowly-updated "group position" — an EMA (exponential moving average) of previous decisions. Each agent must produce output that differs meaningfully from this consensus to count as a contribution. If an agent's output is too similar to the current group position, ask it to go deeper or change direction.

This prevents premature convergence while still allowing the group to build on shared understanding over time.

*Inspired by DINO's momentum teacher — a slowly-moving target that the student must usefully deviate from.*

Use when: you have iterative rounds and want convergence to happen gradually, not in round one.

### Redundancy Reduction

After each round, measure semantic similarity between agent outputs. If two agents are saying essentially the same thing, either drop one or explicitly ask one to pivot to a different angle. The goal: every agent in the system covers an orthogonal dimension of the problem.

*Inspired by Barlow Twins — penalizing correlation between feature dimensions forces each dimension to encode something unique.*

Use when: you're paying for N agents but getting the information value of 2.

---

## Putting It Together

Collapse is the default. Without intentional tension, multi-agent systems converge to expensive single-agent behavior.

The practical advice: pick at least one pattern from each category.

- One **diversity pressure** to ensure agents think differently
- One **structural pressure** to prevent information cascades
- One **selection pressure** to make each agent earn its cost
- One **consensus pressure** to manage convergence speed

You don't need all ten. A role codebook + sequential constraint + sparsity limit + redundancy reduction is a reasonable starting point that's simple to implement and covers all four categories.

The underlying principle is borrowed from deep learning: every system that learns needs a source of tension. In GANs it's the discriminator. In DINO it's the momentum teacher. In your multi-agent system, it's whatever mechanism you choose to prevent agreement from becoming the path of least resistance.

---

*The patterns in this post are inspired by learning pressure mechanisms in deep learning: adversarial training (GAN), self-distillation (DINO, BYOL), contrastive learning (SimCLR, MoCo), redundancy reduction (Barlow Twins, VICReg), vector quantization (VQ-VAE), sparse representations, information bottleneck theory, and autoregressive modeling. The mapping from neural network training dynamics to multi-agent orchestration is analogical, not formal — but the intuitions transfer well.*
