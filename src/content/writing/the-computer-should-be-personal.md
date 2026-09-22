---
title: The computer should be personal again
description: Local inference matters less as a benchmark and more as a question of where a person's thinking is allowed to live.
date: "2026-09-14"
tags:
  - Computing
  - Systems
---

For a while, "personal computer" was a hardware category. The machine was personal because you owned the box. Then a great deal of serious work moved onto computers other people run, which was often the right trade. Shared platforms made large-scale computing available without a private data center. I am glad they exist. A real part of my working life has been spent on them, at Amazon Web Services and at Databricks: getting data somewhere a system could use, and keeping that system trustworthy on an ordinary day.

Something is shifting back, unevenly. Some models are now small enough to run near the person using them. Not every model, and not every job. A useful share of inference does not need a shared supercomputer. It needs a fast enough model, the right context, and a machine the person actually controls.

I care about that shift for ordinary reasons.

Privacy becomes an architecture instead of a promise. If a document never leaves the room, you do not have to lean on a paragraph in a policy. You still have to trust the software on the machine. That is an older problem, and a clearer one.

The tool stays close while you are thinking. Something you reach for mid-sentence should feel nearer to a pencil than to a queue. Round trips change how often you ask.

The system can be particular. A model sitting inside one person's work — their files, their vocabulary, an argument they have not finished — can be narrower than a model that has to be acceptable to everyone. Personal does not mean a chatbot with your name in the prompt. It means the system is allowed to be specific.

Local inference is operational work. Weights, memory, updates, and the quiet breakage when a model changes underneath you are real costs. Shared infrastructure does not vanish. It moves to the jobs that are actually heavy. The design problem in the middle is routing: which request stays, which request leaves, and who is allowed to decide.

```ts
type Route = "local" | "remote";

// A sketch of the policy, not a system I ship.
function route(request: { sensitive: boolean; heavy: boolean }): Route {
  if (request.sensitive) return "local";
  if (request.heavy) return "remote";
  return "local";
}
```

The arrangement I find plausible is a small set of models and tools, some local and some not, with a bias toward the machine the person owns. The cloud remains the right place for heavy work. It is a poor default place for thinking to live.
