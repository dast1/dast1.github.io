---
title: A smaller model with better structure
description: 'In 35 head-to-head enterprise retrieval tests, Llama 3.1 8B with a knowledge graph beat Llama 3.3 70B on its own: a 55% higher core score, 13x lower input-token cost, 3x lower latency, and a verifiable tool-call chain.'
date: '2026-03-05'
status: published
kind: independent
role: Evaluation and technical article
featured: true
order: 1
links:
  - label: Read the article
    href: https://www.linkedin.com/pulse/your-70b-model-lost-8b-graph-dastan-aitzhanov-f5rkc
---

I compared four combinations: smaller and larger language models, each with and without a knowledge graph. The evaluation covered multi-hop questions, entity disambiguation, set operations, document scope, grounding, cost, and latency.

The useful result was not that smaller models always win. They do not. It was that architecture can matter more than model size. Across 35 head-to-head tests, Llama 3.1 8B with graph tools outperformed Llama 3.3 70B without them: a 55% higher core evaluation score, input tokens at $0.075 instead of $1.00 per million, and mean latency of 2.9 seconds instead of 8.8. It also produced a verifiable tool-call chain for every answer, which the 70B model alone could not.

I published the methodology, category-level results, limitations, and system design because the tradeoff is more useful when somebody else can examine it.
