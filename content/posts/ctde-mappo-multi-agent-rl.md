+++
date = '2026-06-25'
draft = false
title = "Multi-Agent Reinforcement Learning From the Ground Up: PPO, GRPO, CTDE, and MAPPO"
description = "A beginner-friendly survey of multi-agent reinforcement learning: from RL foundations and the PPO/GRPO formulas to CTDE and MAPPO, with worked examples and a glossary."
tags = ['ai', 'machine-learning', 'reinforcement-learning', 'research']
+++

**Multi-agent reinforcement learning (MARL)** studies how several agents learn to
act in a shared environment. This post is a background survey of the cooperative
MARL literature, written so that a reader with no reinforcement-learning
background can follow it from start to finish.

It is organized in four parts. **Part 1** builds the single-agent foundations —
the vocabulary, then the formulas, with the purpose of every symbol. **Part 2**
covers the two policy-update algorithms everything else rests on, **PPO** and
**GRPO**, each with a worked example. **Part 3** moves to many agents: the **CTDE**
paradigm, the methods that established it (DDPG, MADDPG, COMA, VDN, QMIX), and
**MAPPO**. **Part 4** describes the benchmark environments. A summary and a
glossary close the post.

The wording is kept plain, with no analogies, and stays close to the source
papers. Each method is presented the same way: the question it answers, how it is
put together, and the role of each part.

## In plain words (the whole idea first)

Before any formal detail, here is the entire post in the simplest words. The rest
of the article makes each of these points precise.

- **The setup.** You have several agents in a world. They take actions and get
  points (reward) when things go well, and they learn by trying things and seeing
  what scores. This is reinforcement learning.
- **The hard part.** Each agent only sees what is near it, not the whole picture.
  They all learn at once, so the world keeps shifting. And when the team scores,
  it is hard to know *which* agent actually helped.
- **The main trick — CTDE.** During training, let the agents use *all* the
  information (the full state, what everyone is doing). At run time, each agent
  must act using only what it can see by itself. Train with full information, run
  with local information.
- **The critic.** During training, a "critic" judges each move as better or worse
  than average. The "actor" (the policy) uses that judgement to do more of the
  good moves and fewer of the bad ones.
- **The older methods.** MADDPG, COMA, VDN, and QMIX are different recipes for
  that training — mostly different ways to use the full picture during training and
  to work out who deserves credit when the agents share one reward.
- **PPO — the careful learner.** When a move turns out well, you want to do it
  more, but changing behavior too much in one update can wreck what was already
  learned. PPO improves the policy in *small, capped steps*. The "clip" is the
  limit that stops any single step from being too big.
- **GRPO — PPO without the critic.** Instead of a critic, try the same thing
  several times, keep the tries that scored above the group's average, and do more
  of those. It is used mainly to train large language models to reason.
- **MAPPO.** This is just PPO applied to a *team* of agents, with the critic
  allowed to see the whole state during training. Well-tuned PPO turns out to work
  very well, so no team-only algorithm is needed.

The one-line takeaway: **train with full information, run with local information,
and always take small, careful steps when learning.**

---

## Part 1 — Single-agent foundations

## The vocabulary of reinforcement learning

This section names the concepts the rest of the post depends on. The two that are
easiest to grasp as formulas — the value function and the advantage — are only
named here and built up properly in the next section.

**Reinforcement learning (RL)** is learning by trial and error: an *agent* takes
*actions* in an *environment*, receives a scalar *reward* after each step, and
adjusts its behavior to collect more reward over time. There is no labelled
correct answer at any step — only the reward. The standard formalism is the
**Markov Decision Process (MDP)**, defined by a state `s` (a description of the
current situation), an action `a`, a transition rule giving the next state, and a
reward `r`. "Markov" means the next state depends only on the current state and
action, not on the full history. When an agent cannot observe the full state but
only a partial view of it — as is almost always the case once there are several
agents — the problem becomes a **partially observable MDP (POMDP)**.

An agent's behavior is its **policy** `pi(a | s)`, the probability of taking
action `a` in state `s`; training means improving this policy. What the agent
maximizes is the **return**, the (discounted) sum of future rewards. Two
predictions of return guide learning: the **value function** `V(s)` and the
**Q-function** `Q(s, a)` (both defined in the next section). A network that learns
these predictions is called a **critic**. Methods that learn `Q` and act by
choosing the highest-`Q` action are **value-based** (DQN, and the multi-agent QMIX
below); methods that adjust the policy directly via a **policy gradient** are
**policy-based**. Combining the two gives the **actor-critic** architecture: an
*actor* (the policy) chooses actions, and a *critic* supplies the signal used to
update it. CTDE and MAPPO are both actor-critic methods, and the recurring phrase
"centralized critic" refers precisely to this critic.

Methods also differ in how they reuse experience. **On-policy** methods (PPO,
COMA, MAPPO) learn only from data generated by the current policy and discard it
after each update, whereas **off-policy** methods (DQN, DDPG, MADDPG, QMIX) reuse
older data, typically held in a *replay buffer*. Off-policy methods are usually
more **sample-efficient** — they reach a given performance level with fewer
environment steps — while on-policy methods are often more stable and easier to
tune. Sample efficiency matters because each environment step can be slow or
costly to simulate.

For fuller treatments of all of the above, Sutton and Barto's *Reinforcement
Learning: An Introduction* is the standard textbook
([free online](http://incompleteideas.net/book/the-book.html)).

## Reading the formulas (where each one comes from)

The formulas in this post look intimidating, but each is built from a simple idea,
and every symbol stands for something plain. This section reads them slowly: first
the symbols, then how each formula is *put together*, and what every parameter is
for. No formula here is more than "an average of something simple."

### The symbols, in one place

```
s   = state        the situation right now
a   = action       what the agent does
r   = reward       the score after an action
t   = time step    step 0, 1, 2, ... within an episode
pi  = policy       the behavior; pi(a | s) = chance of doing a in state s
theta = the policy's internal numbers (network weights). pi_theta = the policy
        with those numbers. "Training" just means changing theta.
E[.] = "the average of ." taken over many sampled runs
```

The three Greek-letter *knobs* you tune — `gamma`, `lambda`, `eps` — are explained
below as they come up. Everything else is one of the symbols above.

### Return: why the discount `gamma`

We want the agent to collect reward not just now but into the future. The obvious
choice is to add up all future rewards: `r_0 + r_1 + r_2 + ...`. Two problems: an
episode can run very long (the sum blows up), and reward far in the future is
uncertain, so it should count for less. Both are fixed by *discounting* — shrinking
each step further out by a factor `gamma` between 0 and 1:

```
R = r_0 + gamma*r_1 + gamma^2*r_2 + gamma^3*r_3 + ...
```

**Role of `gamma`.** It sets how far ahead the agent looks. `gamma = 0` means "only
the reward right now matters" (short-sighted). `gamma` near 1 (say 0.99) means
"care about the long run." Each extra step multiplies by `gamma` again, so distant
rewards fade smoothly instead of being cut off.

### Value and Q: why an average

The agent cannot know its exact future — the environment and its own choices are
partly random. So we work with *averages* of the return. That is all `E[.]` means.

```
V(s)    = E[ return | start in state s, then follow the policy ]
Q(s, a) = E[ return | do action a in state s, then follow the policy ]
```

`V(s)` answers "how good is this situation, on average?" `Q(s, a)` answers "how
good is this situation if I take *this* action first?" They are predictions, and
the critic is the network that learns them.

### Advantage: why we subtract `V`

We do not really care how much total reward an action gives — only whether it is
**better or worse than the agent's usual behavior** in that state. So we subtract
the state's average value:

```
A(s, a) = Q(s, a) - V(s)
```

**Why subtract `V` (the baseline).** Every action from state `s` shares the same
"how good is `s`" part. That shared part is just noise for deciding *between*
actions, and it makes learning jumpy. Subtracting `V` cancels it, leaving only the
part that depends on the action. The result is steadier learning.

**Role of the sign and size.** `A > 0` = better than usual → do it more; `A < 0` =
worse → do it less; the size says by how much.

### The ratio `r_t`: why it appears at all

To improve the policy we want to raise the probability of high-advantage actions.
But there is a catch: we collected our data with the *old* policy, and we are now
scoring a *new* one. To reuse old data fairly, we reweight each sample by how much
more (or less) likely the new policy is to take that same action — that weight is
the ratio:

```
r_t(theta) = pi_theta(a_t | s_t) / pi_theta_old(a_t | s_t)
```

So `r_t` is not an extra assumption; it falls out of "we want to judge the new
policy using data from the old one." Multiplying advantage by `r_t` gives the score
`r_t * A_t` that PPO then *clips* so the step stays small. The full build-up of
that clipped objective — and the role of `eps` — is in
[the PPO section](#the-clipped-update-step-by-step).

### GAE: the knob `lambda`

One more knob. To get the advantage we must estimate the return, and there are two
extremes: use the single next reward (fast to react, but noisy), or use the whole
rest of the episode (accurate, but slow and high-variance). **GAE (Generalized
Advantage Estimation)** (Schulman et al., 2016) blends the two with a parameter
`lambda` between 0 and 1: near 0 leans on the short, low-noise estimate; near 1
leans on the long, more accurate one. It is the dial between "react quickly" and
"be sure."

With these pieces, every formula later in the post is just one of the above, used
in a specific place.

---

## Part 2 — The policy-update algorithms

## PPO and GRPO

PPO and GRPO are two algorithms for the same job: take the data you just collected
and improve the policy by a *safe* step. They share the exact same update rule —
the clipped objective below — and differ in only one place: how they compute the
advantage `A_t`. **PPO learns a critic to get it; GRPO reads it off a group of
samples.** PPO comes first because it is the basis of MAPPO. GRPO is a more recent
variant from large-language-model training, included here for comparison.

### PPO (Proximal Policy Optimization)

PPO is motivated by one question: using only the data we have already collected,
how large an improvement step can we take on the policy without moving so far that
performance collapses? Too small a step and learning crawls; too large a step and
a single bad update can ruin a policy that took a long time to train.

This is the same question **TRPO (Trust Region Policy Optimization)**, Schulman et
al., 2015, set out to answer. TRPO solves it with a heavy second-order method: each
update is constrained to a "trust region", measured by how much the policy's
action distribution is allowed to change. That is accurate but complicated and
expensive to compute. PPO (Schulman et al., 2017) goes after the same goal with
simpler first-order tricks — chiefly the clip described below — that keep the new
policy close to the old one. PPO is much easier to implement and, empirically,
performs at least as well as TRPO, which is why it has become a default.

Mechanically, PPO is a single-agent, on-policy actor-critic method. One iteration
is four steps:

1. **Collect.** Run the current policy and record a batch of `(state, action,
   reward)` steps.
2. **Score.** Use the learned **critic** `V(s)` to estimate each action's
   advantage `A_t` (in practice via GAE).
3. **Update.** Improve the policy by maximizing the clipped objective (below), and
   nudge the critic toward the returns actually observed.
4. **Repeat** with the improved policy.

**Example of the critic-based advantage.** Suppose for some state the critic
predicts `V(s) = 10` — the return it expects on average from here. The agent takes
an action, and the rollout that follows suggests this action's return is `13`.
Then:

```
A_t = 13 - 10 = +3     (better than the critic expected -> make it more likely)
```

If the return had been `8`, then `A_t = 8 - 10 = -2` (worse than expected -> make
it less likely). The critic supplies the baseline (`10`); the clipped update then
moves the policy, but only by a small step. Here is that update, built up one
piece at a time.

#### The clipped update, step by step

PPO's update rule is the *clipped surrogate objective*. Here is the whole thing,
which we will then build up one piece at a time:

```
L(theta) = E_t [ min( r_t(theta) * A_t ,
                      clip(r_t(theta), 1 - eps, 1 + eps) * A_t ) ]

where  r_t(theta) = pi_theta(a_t | s_t) / pi_theta_old(a_t | s_t)
```

(`E_t [ ... ]` just means "average this over all the timesteps `t` you
collected." The interesting part is what is inside the brackets.)

The goal of one update is simple: **make good actions more likely and bad actions
less likely — but only by a small amount, so a single noisy update cannot wreck
the policy.** Every piece of the formula serves that one goal.

**Step 1 — `A_t` sets the direction.** The advantage (defined earlier) is positive
when the action was better than average for that state, negative when it was
worse. So its sign tells us which way to move: `A_t > 0` means push this action's
probability *up*; `A_t < 0` means push it *down*. In plain PPO, `A_t` comes from
the learned critic; in MAPPO it comes from a centralized critic.

**Step 2 — `r_t` measures how far the policy moved.** PPO collects data with the
*old* policy, then updates a *new* policy. The ratio compares the two on the same
action:

```
r_t = (new policy's probability of the action) / (old policy's probability)

r_t = 1   -> new policy unchanged for this action
r_t > 1   -> new policy makes the action MORE likely
r_t < 1   -> new policy makes the action LESS likely
```

So `r_t` is a single number saying how much the policy has shifted on this action.

**Step 3 — the naive score `r_t * A_t`, and why it is dangerous.** The simplest
objective is to multiply them. Maximizing `r_t * A_t` points the right way: for a
good action (`A_t > 0`) it rewards raising `r_t`; for a bad action (`A_t < 0`) it
rewards lowering `r_t`. The problem is there is **no limit**. For a good action
the optimizer pushes `r_t` as high as it can — a huge, one-shot policy change
based on one noisy advantage estimate. That is how PPO training collapses. We
want a *small* step, not the largest possible one.

**Step 4 — `clip` refuses to pay for moving too far.**
`clip(r_t, 1 - eps, 1 + eps)` forces the ratio to stay inside the band
`[1 - eps, 1 + eps]`. With `eps = 0.2` that band is `[0.8, 1.2]`. Inside the band
the ratio is untouched; outside, it is pinned to the nearest edge:

```
clip(1.1, 0.8, 1.2) = 1.1   (inside, unchanged)
clip(1.5, 0.8, 1.2) = 1.2   (too high, pinned to 1.2)
clip(0.5, 0.8, 1.2) = 0.8   (too low,  pinned to 0.8)
```

So beyond a 20% change, the clipped score stops growing. **Role of `eps`:** it is
the width of the safe band — the maximum policy change one update is rewarded for.
Smaller `eps` = more cautious, slower; larger `eps` = bolder, riskier.

**Step 5 — `min` keeps the more pessimistic of the two scores.** The objective
takes the *smaller* of the naive score and the clipped score:

```
L = min( r_t * A_t ,  clip(r_t, 1 - eps, 1 + eps) * A_t )
```

Taking the minimum makes the objective a cautious *lower bound*. Its effect:
remove any reward for moving the policy too far in the *helpful* direction, while
still fully penalizing moving it in the *harmful* direction. Two worked cases show
this. Remember we are *maximizing* `L`.

**Case A — good action, `A_t = +5`, `eps = 0.2`.** We want `r_t` to rise.

```
r_t = 1.1:  naive = 1.1 * 5 = 5.5    clipped = 1.1 * 5 = 5.5    min = 5.5
r_t = 1.5:  naive = 1.5 * 5 = 7.5    clipped = 1.2 * 5 = 6.0    min = 6.0  (capped)
```

At `r_t = 1.5` the naive score `7.5` would pull the policy hard toward this one
action. The clipped score is `6.0`, and `min` keeps `6.0`. Past a 20% increase
the objective is flat, so the update has no reason to push `r_t` higher.

**Case B — bad action, `A_t = -5`, `eps = 0.2`.** We want `r_t` to fall. (Now the
scores are negative, and a value closer to `0` is better.)

```
r_t = 0.9:  naive = 0.9 * -5 = -4.5    clipped = 0.9 * -5 = -4.5    min = -4.5
r_t = 0.5:  naive = 0.5 * -5 = -2.5    clipped = 0.8 * -5 = -4.0    min = -4.0  (capped)
```

Dropping `r_t` to `0.5` would give the naive score `-2.5`, the best (highest)
value — so the optimizer would love to slash this action in one step. The clipped
score is `-4.0`, and `min` keeps `-4.0`. Past a 20% decrease the objective is
flat again: no extra credit for an over-large change.

**Putting it together.** Each piece has exactly one job:

- `A_t` — sets the direction (raise or lower the action's probability).
- `r_t` — measures how far the policy has moved on this action.
- `clip` — stops counting any movement beyond `±eps` (here ±20%).
- `min` — makes the objective pessimistic, so the cap actually bites in the
  helpful direction instead of being bypassed.

Together they hold every update inside a small, safe region around the old policy.
That single constraint is what keeps PPO — and the methods built on it — stable.

### GRPO (Group Relative Policy Optimization)

GRPO (Shao et al., 2024, from the DeepSeekMath work, and used to train DeepSeek-R1)
keeps PPO's clipped update but **removes the critic entirely**. Training a separate
value network costs memory and is hard to get right, so GRPO replaces it with a
simpler baseline: for each input, sample a *group* of complete outputs, score each
one with the reward, and use the group's own average as the baseline. Each
sample's advantage is its reward standardized within the group:

```
A_i = ( r_i - mean(r_1 .. r_G) ) / std(r_1 .. r_G)
```

Here `r_i` is the *reward* of sample `i` (not the PPO ratio `r_t`), and `G` is the
group size.

**Example.** Take one prompt and sample `G = 4` answers. The reward is `1` for a
correct answer and `0` for a wrong one. Say the four answers score `[1, 1, 0, 0]`:

```
mean = 0.5 ,  std = 0.5

A_1 = (1 - 0.5) / 0.5 = +1     (correct  -> make this answer more likely)
A_2 = (1 - 0.5) / 0.5 = +1     (correct  -> more likely)
A_3 = (0 - 0.5) / 0.5 = -1     (wrong    -> less likely)
A_4 = (0 - 0.5) / 0.5 = -1     (wrong    -> less likely)
```

The two correct answers get advantage `+1`, the two wrong ones `-1` — and no critic
was needed anywhere; the baseline (`0.5`) came straight from the group. These
advantages then go through the *same* clipped update as PPO (GRPO also adds a
penalty that keeps the new policy from drifting too far from a fixed reference
policy).

### PPO vs GRPO in one line

PPO's baseline is a **learned prediction** `V(s)`, which suits per-step rewards and
continuing control — including MAPPO, where the prediction is made by a centralized
critic. GRPO's baseline is the **measured average of a fresh group of samples**,
which suits settings where you can sample many complete outputs and score each one,
most notably training large language models to reason. Same safe-step clip, two
different ways to get `A_t`.

---

## Part 3 — From one agent to many

## The setting: more than one agent

Everything so far has been a single agent. Multi-agent reinforcement learning
(MARL) keeps all of it and adds several agents acting at the same time — for
example, several robots that must cooperate, or several units in a game that share
a goal. That one change creates three specific difficulties. Every method in the
rest of this post exists to handle one or more of them, so it is worth naming them:

- **Partial observability.** Each agent usually sees only its own local view, not
  the full state (a POMDP, defined earlier).
- **Multi-agent credit assignment.** When agents share one reward, it is unclear
  *which agent's action* caused a good or bad outcome. If the team wins, did agent
  3 help, or was it carried by the others? Learning needs to attribute credit
  correctly. COMA and the value-decomposition methods (VDN, QMIX) are built
  specifically for this.
- **Non-stationarity.** Every agent is learning at the same time, so from any one
  agent's point of view the environment keeps changing as the others change their
  behavior. A centralized critic that can see all agents helps, because it is not
  surprised by the others' actions.

The shared theme: during learning you often have access to *everything* — every
agent's observation, the full state, and what the other agents are doing. The
question is how to use that extra information without breaking the rule that, at
run time, each agent can only act on what it can see. That is exactly what CTDE
addresses.

## CTDE: centralized training, decentralized execution

**Main idea.** Use all the information you have *while training*, but make sure each
agent can run on *only its own local information* once training is done. CTDE is a
paradigm — a way of organizing the learning — not a single algorithm. It splits the
agent's life into two phases:

- **Training (centralized).** You may use any information you have, including the
  global state and the other agents' policies. This is fine because training is
  done offline, in a controlled setting.
- **Execution (decentralized).** Once trained, each agent runs on its own, using
  only the information available to it locally. No global state, and no
  communication required between agents.

### A small example

Take the MPE scenario `simple_spread`: 3 agents and 3 landmarks, and the shared
goal is to cover all landmarks while not colliding. The reward is the same for
every agent — roughly the negative of the total distance from landmarks, with a
penalty for collisions. Now look at what each part sees:

```
Decentralized actor (agent 1, at execution time):
    input  = [agent 1's position, velocity, nearby landmark/agent offsets]
    output = agent 1's action (which way to move)

Centralized critic (training only):
    input  = [all 3 agents' positions and velocities, all landmark positions]
    output = one value estimate: "how good is this joint situation?"
```

The actor only ever sees agent 1's local view, so it still works when each agent
runs on its own. The critic is allowed the full picture, but it is used *only to
train the actors* — it is thrown away at execution time. That split is the whole
point of CTDE.

### The three families, and what to read

A 2024 tutorial by Amato is a good single reference for the definition:
*"An Introduction to Centralized Training for Decentralized Execution in
Cooperative Multi-Agent Reinforcement Learning"*
([arXiv:2409.03052](https://arxiv.org/abs/2409.03052)). It divides MARL approaches
into three types:

- **CTE** — Centralized Training and Execution.
- **CTDE** — Centralized Training, Decentralized Execution.
- **DTE** — Decentralized Training and Execution.

CTDE is the most common of the three: it can use centralized information during
training, it scales better than fully centralized methods, it needs no
communication at execution time, and it fits cooperative problems well. For a
prior-work section, the usual citation pattern is **Amato 2024** for the
definition, and **MADDPG / COMA / QMIX** (next section) for the origin of the
paradigm.

### A brief instruction

CTDE is a concept, so you "use" it through a specific algorithm. The easiest
on-ramp is **MADDPG on the MPE environment**:

1. Read the Amato 2024 tutorial for the definition, then the MADDPG paper.
2. Pick a maintained library rather than the original (bit-rotted) code —
   **EPyMARL** or **PyMARL** ([github.com/oxwhirl/pymarl](https://github.com/oxwhirl/pymarl)).
3. Run MADDPG on an MPE scenario (for example `simple_spread`). This is light
   enough to run on a CPU.

## The origin methods of CTDE

These are the algorithms a background survey cites as the foundation of CTDE. Each
is explained below, including the single-agent method it builds on.

### DDPG (the base for MADDPG)

**DDPG (Deep Deterministic Policy Gradient)**, Lillicrap et al., 2016, is a
single-agent, off-policy actor-critic method for *continuous* actions (for example,
a steering angle rather than a choice from a small menu). The actor outputs one
specific action ("deterministic"), and the critic learns `Q(s, a)` to score it.
You need DDPG only because MADDPG is its multi-agent extension.

### MADDPG

**MADDPG (Multi-Agent DDPG)**, Lowe et al., 2017
([arXiv:1706.02275](https://arxiv.org/abs/1706.02275)). It gives each agent its own
DDPG actor and critic, with one change that defines CTDE: each agent's **critic is
centralized** — it takes *all* agents' observations and actions as input — while
each **actor stays decentralized**, using only that agent's own observation.

```
Agent i:
    actor_i(own observation)                 -> action_i     (used at execution)
    critic_i(all observations, all actions)  -> Q value      (training only)
```

Why the centralized critic helps: it directly addresses **non-stationarity**. If
the critic can see what the other agents did, the world no longer looks random to
it when they change behavior. MADDPG works for cooperative, competitive, and mixed
settings, and is evaluated mainly on the light MPE environment.

### COMA

**COMA (Counterfactual Multi-Agent Policy Gradients)**, Foerster et al., 2017
([arXiv:1705.08926](https://arxiv.org/abs/1705.08926)). COMA is an on-policy
actor-critic method built to solve **credit assignment** when all agents share one
reward.

Its key idea is a **counterfactual baseline**. To judge agent `i`'s action, COMA
asks: "how much better was the action it actually took, compared to the average
over all the *other* actions it could have taken, while everyone else's actions
stay fixed?" Concretely, the advantage for agent `i` is

```
A_i = Q(state, joint action)
      - sum over a' of [ pi_i(a' | obs_i) * Q(state, other agents' actions, a') ]
```

The second term is the counterfactual baseline: the expected value if agent `i`
had acted according to its current policy instead of the specific action it took.
Subtracting it isolates agent `i`'s own contribution, so each agent gets a clean
learning signal. (Note the shape: it is the same `Q - baseline` advantage from
Part 1, with a baseline chosen to single out one agent.) COMA uses one centralized
critic shared across agents and is evaluated mainly on SMAC.

### VDN (the base for QMIX)

**VDN (Value Decomposition Networks)**, Sunehag et al., 2018. VDN is a value-based
CTDE method for the cooperative, shared-reward case. It assumes the team's joint
`Q` is simply the **sum** of each agent's individual `Q`:

```
Q_total(state, joint action) = Q_1(obs_1, a_1) + Q_2(obs_2, a_2) + ...
```

Because the total is a sum, each agent can pick its own best action independently
and still maximize the team total. That makes execution decentralized. The
limitation: a plain sum is too simple to represent many real team interactions.
QMIX fixes that.

### QMIX

**QMIX**, Rashid et al., 2018
([arXiv:1803.11485](https://arxiv.org/abs/1803.11485)). QMIX generalizes VDN. It
also combines per-agent `Q` values into a team total, but instead of a fixed sum it
uses a learned **mixing network**. The one rule it enforces is that the mixing is
**monotonic** — increasing any agent's own `Q` never decreases the team total:

```
Q_total = MixingNetwork( Q_1, Q_2, ... )   with   d(Q_total) / d(Q_i) >= 0
```

This monotonicity is what keeps execution decentralized: because raising an agent's
own `Q` always helps the team, each agent can still choose its best action by
itself, with no need to coordinate at run time. This property is often called
**IGM (Individual-Global-Max)**: the joint best action equals each agent's
individual best action. QMIX is more expressive than VDN and is a standard strong
baseline on SMAC. The mixing network's weights are produced from the full state
during training only, so QMIX is squarely a CTDE method.

## MAPPO: PPO applied to many agents

**Main idea.** MAPPO stands for **Multi-Agent PPO**. Take PPO (Part 2), add a small
set of changes, and it performs strongly across several multi-agent benchmarks. The
surprise the paper reports is that you do not need a special multi-agent algorithm;
well-tuned PPO is enough.

The canonical paper is *"The Surprising Effectiveness of PPO in Cooperative
Multi-Agent Games"* (Yu, Velu, Vinitsky, Gao, Wang, Bayen, Wu, 2021):

- arXiv: [https://arxiv.org/abs/2103.01955](https://arxiv.org/abs/2103.01955)
- Project page: [https://sites.google.com/view/mappo](https://sites.google.com/view/mappo)
- Official code: [https://github.com/marlbenchmark/on-policy](https://github.com/marlbenchmark/on-policy)

### What the paper claims

PPO, an on-policy single-agent method, with several simple modifications reaches
strong performance on three popular MARL benchmarks — MPE, SMAC, and Hanabi — with
sample efficiency similar to popular off-policy methods in most cases. (The
official code also supports a fourth environment, Google Research Football, so you
will see "four environments" referred to elsewhere in this post.) The structure
fits CTDE directly: MAPPO uses a **centralized value function (critic)** during
training while keeping **decentralized actors** for execution.

### The advantage and the clipped update

MAPPO computes each action's advantage `A_t` with its **centralized critic**, then
improves the policy with **PPO's clipped update** — the exact step-by-step
mechanism worked out in [the PPO and GRPO section](#ppo-and-grpo) above. Nothing
about that update changes for the multi-agent case; what is special to MAPPO is
only the *source* of `A_t`: a centralized critic that sees the global state during
training, instead of the plain critic that single-agent PPO uses.

### The five factors

The paper points out five implementation and hyperparameter choices that matter a
lot for MAPPO's performance. Each is explained below:

1. **Value normalization.** Rewards (and therefore value targets) can have very
   different scales across tasks, which destabilizes the critic. The fix is to
   normalize the critic's training targets using a running mean and standard
   deviation, so the critic always learns against well-scaled numbers.
2. **Value function (critic) inputs.** Because the critic is centralized, you
   choose what global information to feed it. Too little and it is uninformed; too
   much (raw concatenation of everything) and the input becomes high-dimensional
   and noisy. The paper recommends a compact, agent-specific global state rather
   than a naive dump of all features.
3. **Training data usage.** PPO reuses each batch of collected data for several
   passes ("epochs"), split into mini-batches. The paper finds MAPPO does better
   with *fewer* epochs on harder tasks and with *few* mini-batches (often just
   one), so each update sees the whole batch and does not overfit to a slice.
4. **Policy and value clipping.** The clip term `eps` (from Part 2) limits how far
   each update can move the policy, and a similar clip is applied to the value
   function. A smaller clip trades faster learning for more stability; MAPPO is
   sensitive to this choice.
5. **Death masking.** In environments like SMAC, agents can die mid-episode. A dead
   agent has no real observation, so feeding garbage into the network hurts
   learning. The fix is to replace a dead agent's input with a clean, fixed
   "I am dead" state (a zero vector plus an identity tag), so the network handles
   it consistently.

This list matters in practice: if your numbers do not match the paper, one of these
five is a likely cause.

### Parameter sharing

One more implementation choice worth knowing: **parameter sharing**. When all
agents are interchangeable (same abilities, same action set), they can share a
single set of network weights instead of each learning its own. The agent still
acts on its own observation, but all agents learn from their pooled experience,
which speeds up learning and cuts the number of parameters. MAPPO and most SMAC
methods use parameter sharing by default. It is dropped when agents have genuinely
different roles.

### A brief instruction

1. Clone the official code:
   [github.com/marlbenchmark/on-policy](https://github.com/marlbenchmark/on-policy).
2. Install the **MPE** environment first — it is the lightest of the four and runs
   on a CPU.
3. Run the provided MPE training script with the default config, then read the five
   factors above and check each one against your run.
4. Move to SMAC, Hanabi, or GRF only after MPE works.

---

## Part 4 — The benchmark environments

These four environments come up constantly in this literature, and how heavy they
are decides how much compute a method needs.

- **MPE (Multi-Agent Particle Environment).** A simple 2D world of point particles
  with small tasks: cover landmarks (`simple_spread`), one agent guides another
  (`speaker_listener`), or predators chase prey. Low-dimensional and fast — the
  standard light testbed, and the home of the classic MADDPG-vs-MAPPO comparison.
- **SMAC (StarCraft Multi-Agent Challenge).** Unit micro-management built on
  StarCraft II: each of your units is one agent, and the team must win a fight
  through decentralized control. It needs the StarCraft II game binary, which makes
  it heavy. It is the main testbed for QMIX and COMA.
- **Hanabi.** A cooperative card game of imperfect information for 2–5 players. Each
  player can see everyone's cards except their own, so success depends on reasoning
  about what teammates know. It is very sample-hungry — full results need billions
  of steps.
- **GRF (Google Research Football).** A 3D football simulator where agents control
  players. Rewards are sparse (goals are rare), which makes learning slow and the
  environment computationally heavy.

---

## Summary

**Foundations (Part 1):** RL frames decisions as an MDP; the agent learns a policy
to maximize discounted return. The critic predicts value `V` and `Q`; the
**advantage** `A = Q - V` says whether an action beat the average. Everything is an
average of something simple.

**PPO and GRPO (Part 2):** both take a safe, clipped improvement step and differ
only in how they get `A_t`. PPO learns a critic (and descends from TRPO's
trust-region idea, done more simply). GRPO drops the critic and standardizes
rewards within a sampled group. Use PPO for control tasks and MAPPO; GRPO for
training language models to reason.

**CTDE (Part 3):** use all information during training, but let each agent act on
local information only at execution time. Cite Amato 2024 for the definition; the
origin methods are MADDPG (centralized critic), COMA (counterfactual baseline for
credit assignment), VDN and QMIX (value decomposition). Start with MADDPG on MPE
via EPyMARL or PyMARL — CPU-friendly.

**MAPPO (Part 3):** plain PPO with a centralized critic and five tuning factors,
strong across benchmarks. Start with the official code on the MPE environment, the
lightest of the four benchmarks.

---

## Glossary (every term in one place)

**Concepts**

- **RL (Reinforcement Learning)** — learning by trial and error from a reward
  signal.
- **MARL (Multi-Agent RL)** — RL with several agents acting at once.
- **MDP** — Markov Decision Process; the state/action/transition/reward frame.
- **POMDP** — Partially Observable MDP; the agent sees only part of the state.
- **Policy (`pi`)** — the agent's behavior, mapping a state to an action.
- **Return** — total (discounted) future reward; `gamma` is the discount factor.
- **Value function (`V`)** — expected return from a state.
- **Q-function (`Q`)** — expected return from a state-action pair.
- **Advantage (`A`)** — how much better an action was than average: `Q - V`.
- **GAE** — Generalized Advantage Estimation; `lambda` dials between fast/noisy and
  slow/accurate advantage estimates.
- **Policy gradient** — adjusting the policy directly toward higher return.
- **Actor-critic** — an actor (policy) trained with help from a critic (value
  function).
- **On-policy** — learns only from current-policy data (PPO, COMA, MAPPO).
- **Off-policy** — reuses old data via a replay buffer (DDPG, MADDPG, QMIX).
- **Sample efficiency** — how few environment steps a method needs to learn.
- **Credit assignment** — figuring out which agent's action caused a shared
  outcome.
- **Non-stationarity** — the environment shifting because other agents are also
  learning.
- **Parameter sharing** — interchangeable agents using one shared set of weights.
- **Centralized critic / decentralized actor** — the critic sees global info in
  training; each actor uses only local info at execution.

**Paradigms**

- **CTE** — Centralized Training and Execution.
- **CTDE** — Centralized Training, Decentralized Execution.
- **DTE** — Decentralized Training and Execution.
- **IGM (Individual-Global-Max)** — the joint best action equals each agent's own
  best action; what makes value-decomposition methods executable in a decentralized
  way.

**Algorithms**

- **TRPO** — Trust Region Policy Optimization; takes the largest safe policy step
  using a second-order trust-region constraint. The complex predecessor PPO
  simplifies.
- **PPO** — Proximal Policy Optimization; single-agent on-policy method with a
  clipped update; gets the advantage from a learned critic.
- **GRPO** — Group Relative Policy Optimization; PPO's clipped update with no critic
  — the advantage comes from standardizing rewards within a sampled group. From LLM
  training.
- **DDPG** — Deep Deterministic Policy Gradient; single-agent off-policy method for
  continuous actions.
- **MADDPG** — Multi-Agent DDPG; centralized critics, decentralized actors.
- **COMA** — Counterfactual Multi-Agent Policy Gradients; solves credit assignment
  with a counterfactual baseline.
- **VDN** — Value Decomposition Networks; team `Q` = sum of per-agent `Q`.
- **QMIX** — VDN generalized to a monotonic mixing network.
- **MAPPO** — Multi-Agent PPO; PPO with a centralized critic plus five tuning
  factors.

**Environments**

- **MPE** — Multi-Agent Particle Environment; light 2D tasks.
- **SMAC** — StarCraft Multi-Agent Challenge; unit micro-management, heavy.
- **Hanabi** — cooperative imperfect-information card game; very sample-hungry.
- **GRF** — Google Research Football; 3D, sparse rewards, heavy.
