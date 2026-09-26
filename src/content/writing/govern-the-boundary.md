---
title: Govern the boundary
description: Model-based rules assume capability is scarce. As capable models become small and cheap, the durable place to attach policy is the layer that decides what an AI system may do.
date: '2026-09-27'
tags:
  - Governance
  - Agents
  - Systems
draft: false
---

Most AI policy written so far attaches to the model. Training compute above a threshold triggers reporting. A general-purpose model above a certain size is presumed to carry systemic risk. Evaluations are run on the model before release. This made sense when capability was scarce and concentrated: a few labs, a few models, one obvious place to look.[^1]

I think that assumption is weakening faster than the policy built on it. And I think the layer that will still be there when it goes is the one almost no policy names: the boundary that decides what an AI system is allowed to do.

This essay is my attempt to say what governing that boundary would mean, in terms a standards body, a procurement office, or a legislator could use. The technical claims come from systems I have built and from the shorter notes on this site. The policy claims are proposals. The notes at the end say which is which.

## Capability is leaving the threshold

Earlier this year I ran 35 head-to-head tests of an 8-billion-parameter model equipped with a knowledge graph against a 70-billion-parameter model on its own. On grounded enterprise retrieval, the small model with better structure won: a higher evaluation score, a fraction of the token cost, a third of the latency, and a verifiable chain of tool calls the large model could not produce. It is one evaluation on one class of task, and I would not generalize it further than that. But it is the kind of result that keeps appearing. Architecture, retrieval, tools, and orchestration are doing work that parameter count used to do.[^2]

Two things follow. First, a system built from models well below any compute threshold can already take consequential actions: send the message, change the record, move the money. Second, the model is often not the component that decides whether it may. The permission comes from the surrounding system, from whoever assembled it, and from what that assembly enforces.

A rule that triggers on training compute does not see any of this. It sees the model. It does not see the deployment, the tools attached to it, the identity it acts under, or the effects it can produce. Those are the things that determine whether a person is harmed.

## The boundary already exists

Every deployed AI system that acts has an authority boundary, whether or not anyone designed it. It is the set of answers to a small number of questions. What actions can this system take at all? Under whose identity? Against which resources? For how long? Who can stop it? What record is left?

In a well-built system, those answers are explicit. The set of legal actions is enumerated. The permission check is deterministic code that reads a model's output as an input, not as a verdict. Enforcement lives at the component that performs the side effect, so a tool can refuse an action that arrives without valid authority. Permissions are scoped to a piece of work and expire with it. Revocation takes effect immediately, not after the queue drains. Failure narrows the system's capability rather than removing its controls. And the record beside each action says which model, which policy version, where it ran, and on whose behalf.[^3]

In a poorly built system, the same questions have answers too. They are just implicit. The model is asked in prose whether it may proceed. The tools trust whatever calls them. Permissions are whatever credentials happened to be in the environment. The log is written after the fact and called a control.

The difference between those two systems is not the model. Both can run the same weights. The difference is the boundary. That is why I think the boundary is the right object for policy.

## Six properties a boundary should have

The technical notes on this site argue for each of these separately. Here they are as a list, in the form a standard could use.

**Enumerated actions.** The system can produce a finite list of the side effects it is able to cause. If the list cannot be written down, the system is not ready to be trusted with a repeated action.

**Deterministic permission.** Whether an action is allowed is decided by a rule a person wrote, versioned, and can test. A model's confidence can be an input to that rule. It cannot be the rule.[^4]

**Enforcement at the effector.** The component that sends, spends, deletes, or changes a record validates the authority it received. A policy that lives only in a diagram is documentation.

**Scoped, expiring authority.** Permission attaches to a task: this identity, these actions, these resources, this window. Standing access is the exception and requires a named reason.

**Live revocation and graceful degradation.** Authority can be withdrawn while the system is running, and losing a component reduces what the system may do before it removes the system's ability to say no.

**Action provenance.** Each consequential action leaves a record of the model, the policy version, the executing location, and the principal on whose behalf it acted. Provenance includes where it ran.[^5]

None of these requires a particular architecture. A single vendor's cloud service can satisfy them. So can a system spread across a person's own devices and a regional operator. They describe rights and obligations, not a topology.

## What this would look like as policy

I am not proposing a new regulator or a new statute. The following are places where existing instruments could attach to the boundary instead of, or in addition to, the model.

**1. Procurement.** Government is a large buyer of agentic systems, and procurement rules bind without legislation. A federal or state acquisition standard could require that any AI system authorized to take actions on agency data or systems document its enumerated action set, its permission logic, its enforcement points, and its revocation path, and demonstrate each in acceptance testing. This is not exotic. It is the same discipline agencies already apply to identity and access management. The agent is a new kind of principal, not a new kind of problem.[^6]

**2. Risk tiers keyed to action, not size.** Where a framework sorts AI systems into tiers, the sorting variable should include the class of action the system can take: informational only; reversible and contained; affects records other people depend on; moves money or exposes private data; produces physical or irreversible effects. A small model wired to a payment API sits in a higher tier than a large model that can only draft. Compute thresholds can remain a useful proxy for frontier training risk. They should not be mistaken for a measure of deployment risk.[^7]

**3. Separate the standard for records from the standard for controls.** Logging and transparency requirements are the most common AI obligations today, and they are useful. They should not be allowed to satisfy a control requirement. A standard should say, in plain terms, that a record written after an action is evidence, and that a control is something capable of stopping the action beforehand. Conflating them produces the appearance of safety exactly where a boundary was needed.[^8]

**4. Accountability at the boundary, not only at the lab.** Obligations should follow whoever controls the authority boundary. Often that is the deployer, not the model developer. A developer can and should attest to what a model was trained and evaluated to do. Only the party that assembled the tools, the permissions, and the enforcement can attest to what the system is allowed to do. Liability and disclosure duties should reflect that split.[^11]

**5. A named principal for delegated authority.** Every action an AI system takes should trace to a person or role who granted the authority and can be asked about it. This is the oldest rule in organizations that manage money: analysis can be cheap and plentiful, but the right to commit is scarce and assigned. An agent should not be the last name on the record.[^9] The same discipline applies one level up: an organization adopting AI should be able to say, for each initiative, who owns it and what would make them stop it.[^12]

**6. Owner consent as a governance primitive for distributed compute.** Compute governance today assumes a small number of large providers who can be identified and obligated. That assumption holds for frontier training. It is already weaker for inference, and it will weaken further as capable models run on machines that people and small organizations own. When that happens, the enforcement point is not the data center. It is the machine, under a policy its owner chose. Standards for portable policy, workload attestation, and revocation that the network must respect are the compute-governance work that distributed AI will need. It is better to write them before the network exists than after.[^10]

## What this does not solve

Governing the boundary does not tell you whether a frontier model should be trained or released. It is a deployment-side framework, and it complements, rather than replaces, work on training compute, model evaluations, and the misuse of the most capable systems.

It also does not remove judgment from the loop. Some decisions are genuinely delegated to a model: is this tone acceptable, is this lead real. The framework asks that the delegation be written down and that low confidence have a branch a person owns. It does not pretend the fuzzy call can be made deterministic.

And it is only as good as the enforcement. A boundary that exists on paper is the thing this essay argues against. The test is the same one I use for distributed compute. After the model is capable, after the tools are connected, after there is an economic reason to let the system act: can the boundary still say no, in a way the rest of the system is forced to respect? If the answer is no, the system has a model. It does not have governance.

## Notes

[^1]: Two examples. Article 51(2) of the EU AI Act presumes that a general-purpose model has systemic risk when the cumulative compute used to train it exceeds 10^25 floating-point operations; the presumption is rebuttable, and providers must notify the Commission within two weeks of reaching the threshold ([Article 51](https://artificialintelligenceact.eu/article/51/)). In the United States, Executive Order 14110 of October 30, 2023 required reporting for models trained above 10^26 operations ([Federal Register](https://www.federalregister.gov/documents/2023/11/01/2023-24283/safe-secure-and-trustworthy-development-and-use-of-artificial-intelligence)); it was revoked on January 20, 2025 ([Federal Register](https://www.federalregister.gov/documents/2025/01/28/2025-01901/initial-rescissions-of-harmful-executive-orders-and-actions)). The threshold idea survives in state law and in the EU. The observation is about where these instruments attach, not whether they are wise.

[^2]: The evaluation is described in [A smaller model with better structure](/work/graph-rag-smaller-model/). It is one study on grounded enterprise retrieval. I am citing it as an instance of a pattern, not as proof of the pattern.

[^3]: These properties are argued for individually in the shorter notes: [Policy should not be probabilistic](/ideas/policy-should-not-be-probabilistic/), [You can only govern what you can diff](/ideas/you-can-only-govern-what-you-can-diff/), [An agent should have its own identity](/ideas/an-agent-should-have-its-own-identity/), [The place that performs the action should say no](/ideas/the-place-that-performs-the-action-should-say-no/), [Permissions should expire with the work](/ideas/permissions-should-expire-with-the-work/), [Failure should reduce capability](/ideas/failure-should-reduce-capability/), [An audit log is not a control](/ideas/an-audit-log-is-not-a-control/), and [Provenance should include where it ran](/ideas/provenance-should-include-where-it-ran/).

[^4]: Principle. A model's probability can inform a policy; the policy stays code. The full argument is in [Probabilistic Intelligence, Deterministic Control](/writing/probabilistic-intelligence-deterministic-control/).

[^5]: Provenance here is deployment-side: which model, which policy version, where it executed, on whose behalf. It is a different record from training-data provenance, and both are needed.

[^6]: Proposal. The current federal instruments are OMB memoranda M-25-21, on agency use of AI, and M-25-22, on acquisition, both issued April 3, 2025 ([OMB M-25-22](https://digitalgovernmenthub.org/examples/omb-m-25-22-driving-efficient-acquisition-of-artificial-intelligence-in-government/)). M-25-22 already sets contract terms on data rights, interoperability, and vendor use of government data. It is the natural place for requirements on enumerated actions, permission logic, enforcement points, and revocation to attach.

[^7]: Proposal. The action-class list is illustrative. The claim is the sorting variable, not the exact tiers. This follows [Autonomy should scale with reversibility](/ideas/autonomy-should-scale-with-reversibility/).

[^8]: Principle, from [An audit log is not a control](/ideas/an-audit-log-is-not-a-control/).

[^9]: Principle, from [What owners notice](/writing/what-owners-notice/). The scarce object in an organization is the right to commit, not the analysis.

[^11]: Principle, from [Whoever assembles the tools owns the boundary](/ideas/whoever-assembles-the-tools-owns-the-boundary/). The developer attests to the model; the assembler attests to the system.

[^12]: From [Treat AI adoption as a portfolio, not a project](/ideas/treat-ai-adoption-as-a-portfolio/).

[^10]: Proposal. The minimum governance contract for owner-controlled compute is set out in [Capacity is not consent](/writing/capacity-is-not-consent/). The claim that inference will move to owner-controlled machines at scale is a prediction, not a measurement.
