---
title: Autonomy should scale with reversibility
description: The useful question is not whether an AI agent is autonomous, but how much autonomy makes sense for a particular action.
date: "2026-09-25"
developed: "2026-09"
tags: [Agents, Governance]
---

I do not think the useful question is whether an AI agent should be autonomous. That is too broad. The question is how much autonomy makes sense for a particular action.

If the action is low-risk, reversible, and contained, I want the system to move quickly. Reading a file, organizing information, trying a local change, or preparing a draft should not require the same process as sending a message, spending money, exposing private information, or changing something another person depends on.

The trick is to make complexity follow risk. Most systems do one of two things. They put the same approval step in front of everything, which makes the agent frustrating to use. Or they give the agent broad access and rely on the model to be careful, which works until the action matters.

I think autonomy should be dynamic. A reversible action with a small blast radius can proceed and leave a record. An action that is harder to undo may need a preview, a narrower permission, or a second check. A consequential action may still require a person. The model can help judge the situation, but it should not be able to expand its own authority because it feels confident.

This is not a choice between useful agents and safe ones. A system that asks for approval on every trivial step is not especially well designed. Neither is a system that treats every successful tool call as evidence that it should receive more access.

The practical goal is simple: give the system enough freedom to be useful, and add structure as the consequences grow. Autonomy is not a property the agent either has or does not have. It is a decision the surrounding system makes for each kind of work.
