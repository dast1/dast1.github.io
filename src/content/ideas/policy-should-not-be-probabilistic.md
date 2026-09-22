---
title: Policy should not be probabilistic
description: A classifier may return a probability. The rule that permits an action should still be code you can read, version, and test.
date: "2026-09-21"
---

A model can be unsure. A policy should not be. If the system may refund, send, delete, or spend, that permission is a rule: this action, this actor, this threshold, this record. The probability is an input to the rule. It is not a substitute for the rule.

Letting a generative model talk its way into an exception means the exception is different every time, and nobody can diff it. Low confidence is a branch you wrote — a stronger model, a person, or a stop — not a softer yes hidden in the prose.

Where this fails is a judgment a person has genuinely delegated: is this tone acceptable, is this lead real. Even then I want the delegation written down, and a branch for low confidence that a person still owns. The fuzzy call can be probabilistic. The act that follows it should not be.
