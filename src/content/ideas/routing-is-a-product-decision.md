---
title: Routing is a product decision
description: Choosing a model is not only a cost and latency problem. The policy says what good enough means, and whether the user can see the switch.
date: "2026-09-16"
---

Which model handles a request is often framed as an optimization: cost, latency, a score on a benchmark. Those numbers matter. They are the smaller half of the decision.

A routing policy is a statement of taste. It says what "good enough" means, which failures are acceptable, and whether the person using the system can tell that a switch happened. Routing that hides those choices produces a smoother miss.

If I cannot tell which path a request took, I cannot tell who is responsible for the answer. That belongs in the product, in the open, next to the answer itself.
