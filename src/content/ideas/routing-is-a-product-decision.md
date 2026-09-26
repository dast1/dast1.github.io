---
title: Routing is a product decision
description: Choosing a path is not only a cost and latency problem. The policy says what good enough means, and whether the user can see the switch.
date: "2026-09-16"
developed: "2026-09"
tags: [Agents, Product, Governance]
---

Which model handles a request is often framed as an optimization: cost, latency, a score on a benchmark. Those numbers matter. They are the smaller half of the decision.

A routing policy is also a choice of kind. Open-ended generation, a narrow decision over a fixed set, or software that already knows the workflow. It says what "good enough" means, which failures are acceptable, where the work may run, and whether the person using the system can tell that a switch happened. Routing that hides those choices produces a smoother miss.

If I cannot tell which path a request took, I cannot tell who is responsible for the answer. That belongs in the product, in the open, next to the answer itself. Placement is part of the path. A switch from a machine the person controls to a machine they do not is a bigger change than a switch between two model names, and it deserves the same visibility.

The risk is a policy so visible it becomes interruption, a confirmation on every trivial request. Visibility is not the same as a click. The record can sit next to the answer.
