---
title: Context to action
description: A reproducible synthetic experiment for testing whether retrieved evidence changes an agent's action, with stage-aware scoring and explicit controls.
date: '2026-09-28'
status: published
kind: independent
role: Synthetic evaluation and open-source repository
featured: true
order: 0
links:
  - label: GitHub repository
    href: https://github.com/dast1/context-to-action
---

This experiment starts from a narrow question: did memory change what the system did?

It follows evidence through retrieval, source resolution, context assembly, interpretation, authorization and a deterministic action simulator. The repository includes separate inputs and gold answers, CPU-only controls, a generic OpenAI-compatible reader, immutable hashes, tests and reference results.

The cases are synthetic and templated. Development and validation use different projects and action rotations, but share eight mechanism families. There is no independent held-out v2 set. The result is a reproducible method for examining a context-to-action pipeline, not a product release or a final memory benchmark.
