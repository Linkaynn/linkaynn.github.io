---
title: "If your product doesn't speak your user's language, it's doomed to fail"
date: 2026-05-20
excerpt: "When a product depends on multiple independent services, each with its own vocabulary, the user ends up learning the team's org chart instead of just using the product."
readtime: "4 min"
tags: ["product", "architecture", "ddd", "bff"]
lang: "en"
draft: true
---

Every new integration brings its service, its team, and above all its **vocabulary**. And when that vocabulary makes it to the user unfiltered — when your list of "characters" shows one column reading `Player`, another `Actor`, another `Pc Sheet`, and two rows with no portrait because that service never had the field — you've stopped building a product. You're making your user learn your org chart.

It's the quietest way I know to lose users. Nobody complains. They just leave.

The user doesn't see five backends. They see a messy product.

## The example

Picture Characters Vault — a cloud-based character sheet manager for tabletop RPGs — as five independent services. **Players** publishes the PCs. **NPCs** publishes the GM's cast. **Campaigns** owns who plays what, and when. **Templates** holds the cloneable archetypes. And finally the **Frontend**, which has to pretend none of this exists.

(If your domain is orders, products or medical appointments, swap the names; the mechanics are the same.)

Each service speaks its own dialect for the same underlying thing. **Players** calls them `playerCharacter`, with numeric `level` derived from `xp` and a required `class`. **NPCs** calls them `nonPlayerCharacter`, with free-form `cr` that nobody recomputes, and `displayName` instead of `name`. **Campaigns** doesn't even store characters — it stores `participants` with an opaque `characterRef`. And **Templates** calls them `characterBlueprints`, no portrait — just an `iconKey`.

Five dictionaries, each internally coherent. What they don't share is the word.

## What the user sees

If the frontend talks to each service directly, the mess shows up fast. The detail page for an NPC reads "CR 7"; the PC right above it reads "Level 7" — they mean entirely different things. Global search returns four shapes and the list quietly drops Templates because the card crashes without a portrait. A filter for "level ≥ 5" hides the user's favorite NPC, and nobody can explain why.

> <span class="speaker">The user:</span> doesn't have your team's concepts. No "PC Sheet", no "Actor", no IDs. They have Lyra and the Tuesday game.

Three rows in a row: the first says *Player*, the next *Actor*, the next *Pc Sheet*. The user squints and starts building a private theory of what the difference means. There is no difference. There are three teams. The user is doing the join, in their head, that your backend should have done.

It accelerates with growth. Every new integration adds another dialect. Someone always says *"we'll harmonize later"*. The "later" sprint never comes. Meanwhile labels drift section by section: **Characters** here, **Actors** in the encounter builder, **Sheets** in the export dialog.

## Two heads-up before going further

Before adding a new layer, two things are worth admitting.

One: **there are reasonable alternatives**. GraphQL federation, a composition service, OpenAPI contracts with canonical types. Which one you pick depends on who owns the schemas, how many clients you have, and what latency budget you can afford.

Two: **sometimes the internal dialects reflect real domain distinctions, not team noise**. CR and Level can be genuinely different things — and forcibly flattening them can be worse UX, not better. The question isn't "how do I flatten this?" but "what does my user understand when they see this list?". Sometimes the answer is to separate them better, not unify them.

## The line

Assuming unification is what you want, the fix is unglamorous. **Stop**. Sit down with product and design, write the glossary your user already speaks, and draw the line exactly where it belongs — a **BFF** that normalizes the five dialects into one: the user's.

Inward it speaks the five foreign dialects. Outward it exposes exactly one. A `GET /characters` fans out into four parallel calls, each response gets normalized into the same `Character` shape, and the frontend receives a single list.

## What it costs

Drawing that line isn't free either. The normalization is business logic that now lives there — someone owns it when the Players team renames a field on a Tuesday. Four parallel calls add latency. The BFF can become its own bottleneck if you don't watch it. And the **write path** is uglier than the read path: when a `PATCH /characters/:id` has to fan out across three services, someone has to think about consistency. The glossary itself needs an owner and a process for the days when two teams disagree on what "level" means.

Even with all that, the bill for **not** doing it gets paid in another currency: support tickets that are really vocabulary mismatches, onboardings that stall on *"wait, what's the difference between a Player and a PC Sheet?"*, and churn from users who can only say *"the product feels messy"*.

They're right. They just can't name it.
