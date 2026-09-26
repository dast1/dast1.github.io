---
title: Tool selection is part of the decision, not an afterthought
description: Choosing a tool also chooses a permission boundary, an execution path, and a particular risk surface.
date: "2026-09-25"
developed: "2026-03"
---

An agent does not only need to decide what to say. If it is going to act, it must decide which tool, which permission, and which execution path are appropriate for the request.

Those decisions are often buried inside one large model response. I think they should be inspectable. The same user intent may call for a read-only tool in one situation and an approval-gated write in another. Choosing the tool is therefore also choosing the risk surface.

The model may help recommend that choice. The available tools and the authority attached to them should still come from the surrounding system.

Tool use is not the final mechanical step after reasoning. It is part of the decision itself.
