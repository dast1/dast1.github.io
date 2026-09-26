---
title: An agent should have its own identity
description: An agent that acts under a person's borrowed credentials cannot be scoped, revoked, or traced apart from that person. Delegation needs a principal of its own.
date: "2026-09-26"
developed: "2026-01"
tags: [Governance, Agents]
---

The easiest way to give an agent access is to let it use mine. It inherits my credentials, my sessions, my standing permissions, and it gets to work immediately. That is also the reason the arrangement fails the moment the agent matters.

If the agent acts as me, nothing downstream can tell us apart. The record shows my name. The permission check sees my rights, which are almost always broader than the task. Revoking the agent means revoking me, or waiting until I notice. Narrow, expiring authority cannot attach to a principal that does not exist.

I think a delegated system needs an identity of its own: issued for a purpose, holding only the permissions that purpose requires, traceable back to the person who granted them. The person remains responsible. The agent becomes visible.

This is not a new idea in security. Service accounts, tokens with a scope, and roles that can be assumed and dropped have existed for a long time. What is new is how many things now want to act on our behalf. Borrowed identity was tolerable when the borrower was a script. It is not a foundation for a system that decides.
