---
title: The system should remember decisions, not every conversation
description: Durable state is the record of what was chosen, why, and what evidence would cause the choice to change.
date: "2026-09-25"
developed: "2026-04"
tags: [Systems, Product]
---

Long context can make a system feel like it remembers. That is not the same as maintaining useful state.

What matters over time are the decisions: what was chosen, why it was chosen, which assumptions were accepted, and what evidence would cause the decision to change. A transcript contains all of that somewhere. A working system should not require another model to reread the entire history to find it.

Conversations are evidence. Decisions are state.

Keeping the distinction also makes forgetting possible. The system can retain the commitments that still govern the work without preserving every incidental exchange forever.
