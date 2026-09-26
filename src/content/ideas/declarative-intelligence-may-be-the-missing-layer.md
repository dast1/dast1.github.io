---
title: Declarative intelligence may be the missing layer
description: Many agent decisions need a constrained label, score, or probability—not another open-ended paragraph.
date: "2026-09-25"
developed: "2026-03"
tags: [Agents, Systems]
---

We have language models that can reason in open-ended ways, and ordinary software that can execute a known procedure. A lot of agent work sits between them.

Which workflow applies? How complex is the request? Which context is relevant? Is confidence high enough to continue? Those are narrow decisions. The useful output is often a label, score, or probability—not a paragraph.

I think this decision layer deserves to be designed explicitly. It may use a classifier, a small model, constrained decoding, or something else. The implementation matters less than the contract: the system is allowed to be uncertain, but it is not allowed to invent the action set.

Open-ended intelligence is valuable. It becomes more governable when the surrounding decisions have declared shapes.
