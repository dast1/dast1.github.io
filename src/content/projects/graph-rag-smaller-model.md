---
title: A smaller model with better structure
description: An 8B model with knowledge-graph tools outperformed a 70B model without them on grounded enterprise retrieval, and showed its chain of evidence.
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

The useful result was not that smaller models always win. They do not. It was that architecture can matter more than model size. The 8B model with graph tools outperformed the 70B model without them while producing an inspectable chain of evidence.

I published the methodology, category-level results, limitations, and system design because the tradeoff is more useful when somebody else can examine it.
