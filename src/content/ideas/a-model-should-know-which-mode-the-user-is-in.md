---
title: A model should know which mode the user is in
description: The same request needs different behavior when a person is exploring, deciding, building, or authorizing action.
date: "2026-09-25"
developed: "2026-04"
---

The same sentence can mean very different things depending on what the person is trying to do. They may be curious. They may be brainstorming, comparing options, ready to build, or asking the system to execute something consequential.

Most AI interfaces treat those as the same interaction: a prompt goes in and an answer comes back. I think the mode should change the system around the model. It should affect how much clarification is needed, which tools are available, how much computation is justified, and whether the result should be a suggestion, a plan, or an action.

Intent is not only what the user asked for. It is the kind of help they believe they are asking for.

The danger is over-classifying every conversation. Sometimes the mode is obvious and nothing special needs to happen. The useful system notices only when getting the mode wrong would materially change the outcome.
