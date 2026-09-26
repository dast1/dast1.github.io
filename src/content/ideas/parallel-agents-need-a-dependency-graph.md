---
title: Parallel agents need a dependency graph, not a group chat
description: More agents do not automatically make work faster; parallelism becomes useful only when dependencies are explicit.
date: "2026-09-25"
developed: "2026-02"
---

Putting more agents on a problem does not automatically make the work faster. Sometimes it just creates more updates to reconcile.

I think the better model is a graph. Begin with the end state, then identify the decisions, unknowns, and pieces of work that connect to it. Some nodes depend on one another. Others do not. The independent work can move in parallel. A dependent node should start only when the inputs it actually needs are ready.

Ordinary project planning already works this way. What changes with agents is that they can discover new nodes while doing the work. The graph is not only a plan. It is a living representation of what we know, what remains disconnected, and where another worker would genuinely help.

Parallelism is useful when it shortens the critical path. If it only creates more coordination, it is theater.
