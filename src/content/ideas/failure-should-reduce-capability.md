---
title: Failure should reduce capability, not destroy the system
description: A resilient AI system should fall back to a smaller, safer set of capabilities when one component becomes unavailable.
date: "2026-09-25"
developed: "2025-09"
tags: [Systems, Local AI]
related:
  - /work/local-ai-intelligent-scaffolding/
  - /writing/capacity-is-not-consent/
---

Distributed systems fail in pieces. A local machine sleeps. A nearby device becomes unavailable. A remote provider has an outage. The system should not treat every failure as an all-or-nothing event.

A more resilient design degrades into a narrower set of capabilities. Perhaps a smaller local model can still classify and retrieve when heavy generation is unavailable. Perhaps read-only work continues while actions pause. Perhaps cached results remain useful while fresh computation waits.

The practical goal is not that every component is always online. It is that the system knows what remains safe and useful when one is not.

Failure should make the system smaller before it makes the system disappear.
