---
title: "If your product doesn't speak your user's language, it's doomed to fail"
date: 2026-05-20
excerpt: "When your team is maintaining a mapping across five different domains, you've already lost. What the user sees on screen is just the bill."
readtime: "4 min"
tags: ["product", "architecture", "ddd", "bff"]
lang: "en"
---

Your user doesn't have "Player". They don't have "Actor". They don't have "PC Sheet". They have Lyra and the Tuesday game.

Every time your product makes them choose between those three names for the same concept, it's making them translate. Doing, in their head, the join your backend didn't.

It's the visible consequence of something that's been happening earlier, inside: your team has spent months maintaining a mapping across five different domains. And that doesn't scale.

## The example

Picture Characters Vault — a cloud-based character sheet manager for tabletop RPGs — as five independent services. **Players** publishes the player's characters. **NPCs**, the GM's. **Campaigns** owns who plays what. **Templates** holds the cloneable archetypes. And the **Frontend**, which has to pretend none of this exists.

Each service speaks its own dialect for the same underlying thing. **Players** calls them `playerCharacter`, with numeric `level` derived from `xp`. **NPCs**, `nonPlayerCharacter`, with free-form `cr` and `displayName` instead of `name`. **Campaigns** doesn't even store characters: it stores `participants` with an opaque `characterRef`. **Templates** calls them `characterBlueprints`, no portrait — just an `iconKey`.

Five internally coherent dictionaries. What they don't share is the word.

## When mappings stop scaling

Three dialects in code mean four branches in every list. Five mean a test matrix that multiplies. Six is a part-time project of its own.

Every upstream team moves on its own clock. Players renames a field on Tuesday and your frontend breaks on Wednesday. Almost nobody has contract tests between services. Templates deprecates `iconKey` and nobody knows who's using it. The new engineer doesn't learn one domain: they learn five.

What looked like a shortcut turns into compounding debt. *"We'll harmonize later"*. The "later" sprint never comes. Team velocity decays — I've seen it in too many teams.

And the same divergence leaks onto the screen. The NPC reads "CR 7", the PC right above it reads "Level 7": they mean entirely different things. The "level ≥ 5" filter hides the user's favorite NPC and nobody can explain why.

Three rows in a row: *Player*, *Actor*, *PC Sheet*. The user squints and starts building a private theory of what the differences mean. They don't mean anything — there are three teams. The user is doing the join, in their head, that your backend should have done.

## The line

The fix is boring: **stop**. Sit down with product and design, write the glossary your user already speaks, and draw the line exactly where it belongs. A **BFF** that normalizes the five dialects into one: the user's.

(One caveat: if the dialects reflect real domain distinctions, don't flatten them — give them context. If your team isn't drowning yet, don't build the boat.)

You haven't eliminated the mappings — you've centralized them. What was N×M becomes N+M: every cost concentrated in one place instead of five. When you add a mobile app next month, it reads from the same place.

The bill for **not** doing it gets paid in another currency: support tickets that are really vocabulary mismatches, onboardings that stall on *"wait, what's the difference between a Player and a PC Sheet?"*, and churn from users who can only say *"the product feels messy"*.

They're right. They just can't name it.

---

*Notes for the technical reader:*

*— Reasonable alternatives: GraphQL federation, a composition service, canonical OpenAPI contracts. Which one you pick depends on who owns the schemas, how many clients you have, and what latency budget you can afford.*

*— If mobile and web diverge, you end up with multiple BFFs — one per client, the original SoundCloud pattern.*

*— The write path is uglier than the read path: consistency, sagas, idempotency, partial failures. There's no shortcut.*

*— The two questions that sink these initiatives in real companies: who owns the glossary, and who owns the BFF.*
