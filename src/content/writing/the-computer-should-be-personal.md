---
title: The computer should be personal again
description: Local inference matters less as a benchmark and more as a question of where a person's thinking is allowed to live.
date: "2026-09-14"
tags:
  - Local AI
  - Systems
series: Distributed compute
seriesOrder: 1
featuredEssay: true
---

For a while, "personal computer" was a hardware category. The machine was personal because you owned the box. Then a great deal of serious work moved onto computers other people run, which was often the right trade. Shared platforms made large-scale computing available without a private data center. I am glad they exist. A real part of my working life has been spent on them, at Amazon Web Services and at Databricks: getting data somewhere a system could use, and keeping that system trustworthy on an ordinary day.

Something is shifting back, unevenly. Some models are now small enough to run near the person using them. Not every model, and not every job. A useful share of inference does not need a shared supercomputer. It needs a fast enough model, the right context, and a machine the person actually controls.

I care about that shift for ordinary reasons.

Privacy becomes an architecture instead of a promise. If a document never leaves the room, you do not have to lean on a paragraph in a policy. You still have to trust the software on the machine. That is an older problem, and a clearer one. Private context is the asset. Where it is allowed to travel is the design.

The tool stays close while you are thinking. Something you reach for mid-sentence should feel nearer to a pencil than to a queue. Round trips change how often you ask, and they change what you are willing to ask. Latency is not a benchmark score in this setting. It is whether the machine is still in the conversation.

The system can be particular. A model sitting inside one person's work — their files, their vocabulary, an argument they have not finished — can be narrower than a model that has to be acceptable to everyone. Personal does not mean a chatbot with your name in the prompt. It means the system is allowed to be specific, because the context never had to be generalized for a crowd.

Local inference is operational work. Weights, memory, updates, and the quiet breakage when a model changes underneath you are real costs. Shared infrastructure does not vanish. It moves to the jobs that are actually heavy. The interesting problems are the ones that are neither a secret that must stay nor a job that must leave.

Two placements are not enough for that. Work can stay on the machine the person owns. It can move to something nearby: a computer in the same room, a box they operate, hardware they have a reason to trust more than a default region. Or it can go to a shared cloud because the computation is heavy or the tool does not exist anywhere else. Nearby is a trust and latency category. It is not a product I am building, and it is not a network I am proposing. It is the missing middle in a binary that forces every request to be either intimate or remote.

Routing is the decision in that middle, and it is first-class. Not a fallback for when a local model fails to load. For each request the policy has to say where the work may run, what context may travel with it, how long you are willing to wait, and who is allowed to change the answer. Sensitive context wants to stay. Heavy computation often should leave. A surprising amount of ordinary thinking is neither, and the bias I want is toward the machine the person controls. The route itself should be visible. If you cannot tell where a request ran, and what was allowed to go with it, you cannot tell who is responsible for the answer.

```ts
type Place = "local" | "nearby" | "remote";

// A sketch of the policy, not a system I ship.
// "Nearby" is a trust and latency category, not a product.
function route(request: {
  sensitive: boolean;
  heavy: boolean;
  staysClose: boolean;
}): Place {
  if (request.sensitive) return "local";
  if (request.heavy && request.staysClose) return "nearby";
  if (request.heavy) return "remote";
  return "local";
}
```

The arrangement I find plausible is hybrid on purpose. A small set of models and tools, some local, some nearby, some not, chosen by a policy the person can inspect. The cloud remains the right place for heavy work. It is a poor default place for a person's context to live. Ownership, in this sense, is not a sticker on the hardware. It is the right to decide what stays, what leaves, and under what rule.
