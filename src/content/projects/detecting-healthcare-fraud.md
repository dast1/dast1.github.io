---
title: Detecting healthcare fraud
description: A 2018 machine-learning study of public Medicare data, asking whether an exclusion list was visible in prescription records.
date: "2018-08-22"
status: published
kind: research
role: Independent research and public talk
featured: false
order: 5
links:
  - label: Source
    href: https://github.com/dast1/healthcare-fraud
  - label: Talk
    href: https://youtu.be/rYsj_TqLmPs
---

I published this in 2018 as a study, not a product. Medicare drug prescription records were the predictors. The federal list of excluded individuals and entities was the target. The question was narrow: whether those public sources held a signal a model could use.

The notebooks are ordinary Python data-science tooling. The extracts were large enough that I ran them on AWS. A short talk from August 2018 sits next to the code.

I have left the repository up because the shape still seems right to me. A specific decision, public data, and a result you can inspect. I would build the pipeline differently now. The question has not gotten less interesting.
