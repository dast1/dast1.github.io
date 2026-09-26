---
title: Permissions should expire with the work
description: Agent authority should be narrow, short-lived, and tied to a particular identity, action, resource, and time window.
date: "2026-09-25"
developed: "2025-12"
tags: [Governance, Agents]
---

Broad access is convenient for a demo and dangerous for a system that keeps running. I think permissions should be tied to a specific piece of work: this identity, this action, these resources, this time window.

The agent does not need a general right if the workload only needs a narrow one. Short-lived permission is not merely a security feature. It makes responsibility easier to reconstruct. You can ask what the system was allowed to do for that job instead of trying to remember what permanent access it happened to have.

There will be cases where repeated approval creates unnecessary friction. The answer is not permanent authority by default. It is a reusable policy whose scope is clear enough to inspect and revoke.
