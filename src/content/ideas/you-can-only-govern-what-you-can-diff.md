---
title: You can only govern what you can diff
description: A rule that lives in a prompt or a context window changes without anyone deciding it should. Governance needs behavior that can be versioned and compared.
date: "2026-09-26"
developed: "2026-04"
tags: [Governance, Systems]
---

When I ask what a system was allowed to do last Tuesday, I want an answer that does not depend on reconstructing a conversation. I want a version. This is the policy that was in force, this is the one that replaced it, and this is the difference between them.

A lot of agent behavior does not have that property. The effective rule is a mixture of a system prompt, whatever context happened to be loaded, and a model's interpretation of both. Change one sentence and the system behaves differently, with no record that a change was made and no way to say what changed. The behavior is real. It is not reviewable.

The test I have started using is simple. Can two people look at the system before and after and agree on what is different? If the answer is a diff, the behavior can be reviewed, approved, rolled back, and answered for. If the answer is a transcript, it cannot.

This is why I keep separating what a model decides from what the surrounding system permits. The model's judgment can be probabilistic and hard to inspect. The permission around it should be the kind of thing you can put in a repository and compare.

Conversations are evidence. Policy is code. You can only govern the second kind.
