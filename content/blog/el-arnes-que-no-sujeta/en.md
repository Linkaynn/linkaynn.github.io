---
title: "The Harness That Doesn't Hold You"
date: 2026-09-13
excerpt: "A climbing harness catches you when you fall. The one wrapped around your AI agent is often just a sentence in a prompt, and the model can choose to ignore it."
readtime: "5 min"
tags: ["ai", "agents", "engineering"]
lang: "en"
---

A climbing harness exists for one thing. If you fall, it catches your body before it reaches the ground. Gravity doesn't get a vote. It's webbing, steel, and an anchor that doesn't negotiate mid-fall.

Sometime in 2025, the same word started naming something else. Harness became the term for the layer of code that wraps a language model and turns it into an agent that acts on its own: memory, tools, a loop that decides the next step, permissions. The phrase that stuck, from Vivek Trivedy at LangChain: "If you're not the model, you're the harness." Everything around the model that isn't the model itself.

OpenAI describes Codex's harness as the system managing conversation state, streaming, tools, sandboxing, approval policies. Anthropic calls the Claude Agent SDK a harness and treats that layer as part of the agent's brain, alongside the model, separate from the "hands" that actually execute code. METR, which evaluates agents for a living, used to call this "scaffolding" and now uses "harness" almost interchangeably. Birgitta Böckeler at Thoughtworks splits it further: the inner harness a model maker builds (an SDK, Cursor, Codex itself) versus the outer harness each user stacks on top, made of instruction files, MCP servers, custom skills.

Pi, a deliberately minimal harness, takes the idea to the opposite extreme: no built-in permission gates, sub-agents, or sandboxing. If you want them, you build them yourself with extensions: no guarantee you didn't write with your own hands.

Every one of those definitions shares an assumption: that the harness is where safety lives. Where the boundaries of what an agent can touch get decided.

## What happened at Replit

I already wrote here about a Replit coding agent that wiped a real company's database. What I didn't get into is how.

The company had declared a code freeze: no changes, nothing touched, while something else stabilized. The agent knew about it. It was written right there in the prompt, in the project instructions. It ran a query that deleted more than 1,200 production records anyway. Asked what happened, it answered: "Yes. I deleted the entire database without permission during an active code and action freeze." The case is documented in the AI Incident Database, entry #1152.

The freeze was never an infrastructure boundary: no IAM permission got revoked, no database got flipped to read-only, no firewall sat between the agent and the DELETE statement. It was a sentence in natural language, sitting in a prompt, that the agent could read, understand, and run straight through anyway.

That's the whole difference. A real harness doesn't depend on the thing falling agreeing not to fall. A harness whose only guarantee is an instruction the model can choose to ignore is, at best, a sticky note taped to the edge of a cliff.

## Nobody knows how much the harness weighs

There's no consensus on how much the harness adds when it does work, either. Martin Casado, the investor and former networking engineer, admits it without the confidence these conversations usually come with: "I vacillate between three beliefs: the less harness, the better, models are the magic; post-training a model and harness is dramatically better and the model providers win; harnesses have real independent value from the model. I have no idea which is right."

Lance Martin, at LangChain, rebuilt his research agent three times. The rigid structure he hand-built in 2023, back when models weren't good at tool-calling yet, turned into dead weight once models got better. His conclusion: agent abstractions can be a risk, because they make it harder to strip out structure once it stops earning its keep.

And when Answer.AI put Devin, Cognition's agent, through twenty real tasks over a month, the result was fourteen failures, three unresolved, three successes. One team member summed it up: "Tasks it can do are those that are so small and well-defined that I may as well do them myself, faster, my way."

The harness is a design bet. Sometimes it compensates for a weak model; other times it's dead weight slowing down a good one. Nobody, not even the people building these for a living, knows yet which bet is right.

## The line

Before you trust any harness's guarantee, ask where that guarantee actually lives. If the answer is "in the prompt," the model can choose not to follow it, and Replit already paid what it costs to find that out late.
