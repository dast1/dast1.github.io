---
title: Coding agents can optimize the wrong stage
description: An agent can produce excellent implementation work while the product is still asking a more important, earlier question.
date: "2026-09-25"
developed: "2026-03"
tags: [Agents, Product]
---

One of the strange failure modes of coding agents is that they can be very productive while moving the work in the wrong direction. They add abstractions, polish edge cases, and improve test coverage before anyone has decided whether the feature is the right one.

This is not a complaint about code quality. It is a question of timing. The right implementation at the wrong stage is still waste.

The system needs to know whether we are exploring, validating usefulness, hardening reliability, or refining something already proven. Each mode deserves a different definition of progress.

Fast execution is valuable only after the work has found the right target.
