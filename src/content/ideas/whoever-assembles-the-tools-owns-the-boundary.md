---
title: Whoever assembles the tools owns the boundary
description: A model developer can say what a model was trained to do. Only the party that connected the tools and set the permissions can say what the system is allowed to do.
date: "2026-09-26"
developed: "2026-06"
tags: [Governance, Agents, Systems]
---

A lot of responsibility talk in AI is aimed at the lab that trained the model. That is the right target for some questions. It is the wrong target for most of the ones that matter once a system acts.

The same model can be deployed as a drafting assistant with no tools, or as an agent with access to email, a payment API, and a production database. The weights did not change. The boundary did. The person who chose which tools to connect, which identity the system acts under, which actions are permitted, and where the checks run has done the work that determines what can go wrong.

I think accountability should follow that work. The developer can attest to what the model was trained and evaluated to do. The party that assembled the system is the only one who can attest to what it is allowed to do, because they are the only one who decided.

This is not an argument for letting developers off the hook. It is an argument for putting the obligation where the decision was made. Someone connected the tool that can spend money. That someone owns the boundary, whether or not they thought of it as one.
