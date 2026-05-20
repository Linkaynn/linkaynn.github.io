---
title: "If your product doesn't speak your user's language, it's doomed to fail"
date: 2026-05-20
excerpt: "When a product depends on multiple independent services, each with its own vocabulary, the user ends up learning the team's org chart instead of just using the product."
readtime: "6 min"
tags: ["product", "architecture", "ddd", "bff"]
lang: "en"
draft: true
---

The product grows. Every new integration brings its service, its team, and above all its **vocabulary**. You nod in the meeting, you forward the JSON straight to the frontend, and a few months later your list of "characters" shows one column reading `Player`, another `Actor`, another `Pc Sheet`, and two rows with no portrait because that service never had the field.

The user doesn't see five backends. They see a messy product.

## The example

Picture Characters Vault as five independent services. **Players** publishes the PCs. **NPCs** publishes the GM's cast — villains, shopkeepers, that recurring barmaid. **Campaigns** owns the table itself: who is playing what, when sessions happen, which characters are *active* in which arc. **Templates** holds the cloneable archetypes — *Generic Bandit*, *Veteran Knight*. And finally the **Frontend**, which has to pretend none of this exists.

Each service speaks its own dialect for the same underlying thing:

- **Players** calls them `playerCharacter`. Fields: `name`, numeric `level` derived from `xp`, required `class`, `portraitUrl`.
- **NPCs** calls them `nonPlayerCharacter`. Fields: `displayName` (some NPCs use aliases), free-form integer `cr` (challenge rating) that nobody recomputes, optional `archetype`, `avatar` instead of `portraitUrl`.
- **Campaigns** doesn't store characters at all — it stores `participants`: an opaque `characterRef`, a `role` of `pc | npc | ally`, a `joinedAt`, and a `status` of `active | retired | dead`.
- **Templates** calls them `characterBlueprints`: `title`, a `recommendedLevel` range (not a single integer), `tags[]`, no portrait — just an `iconKey`.
- **Frontend**, of course, just wants to render "a character".

Five teams, five dictionaries, each internally coherent. What they don't share is the word.

## What the user sees

If the frontend talks to each service directly, the rot sets in fast. The character list grows four code branches, one per origin. Each row hedges `displayName ?? name ?? title`. The detail page for an NPC shows "CR 7"; the PC right above it shows "Level 7" — and they mean entirely different things. Global search returns four payload shapes and the list quietly drops Templates because the card crashes without a portrait. A filter for "level ≥ 5" hides the user's favorite NPC, and nobody can explain why.

> <span class="speaker">The user:</span> doesn't have your team's concepts. No "PC Sheet", no "Actor", no IDs. They have Lyra and the Tuesday game.

The cost starts as a quiet cognitive tax. Three rows in a row: the first says *Player*, the next *Actor*, the next *Pc Sheet*. Some have a portrait, some have a level, some have neither. The user squints, scrolls back up, and starts building a private theory of what the difference means. There is no difference. There are three teams. The user is now doing the join the BFF should have done.

Then the filter chip reads `Type: NPC` and hides the goblin they just created last session, because that one was written through the encounters integration and lives as `Actor.kind = "non_player"`. Search for "Lyra" returns one of the three Lyras she has, because the other two live in a table whose indexer doesn't tokenize `display_name`. An error pops: *"Sheet 4471 cannot be linked to Campaign c_882"*. The user doesn't have sheet numbers. They have Lyra and the Tuesday game.

## The wrong reflex

The seductive shortcut is to forward the shapes through. It works with two systems. By the fifth, every screen is paying a **translation tax**: conditionals, fallbacks, three different "is this a PC?" predicates, and a test matrix that grows multiplicatively. Worse: when an upstream team renames a field on a Tuesday, the user's sheet is broken by Wednesday.

This rot accelerates with growth. Every new integration, every acquired feature, every *"let's just expose what the service returns for now"* adds another dialect to the same screen. Someone always says we'll harmonize the vocabulary later. Later never has a sprint. Meanwhile the labels drift section by section: **Characters** here, **Actors** in the encounter builder, **Sheets** in the export dialog — all pointing at the same thing.

## Stop, think at the product level

This tension isn't new. QA has been formalizing it for years with **BDD**: *Given / When / Then* written in the user's language, shared between product, support and QA. Same idea — which words the user uses, which shapes, which groupings — just applied to the tests. What changes here is **where** you draw the seam: not only in the tests, but also in the wire between your systems.

The fix, then, is unglamorous. **Stop**. Sit down with product and design, write the glossary your user already speaks, and draw the line exactly where it belongs — a **BFF** acting as an *anti-corruption layer*.

Inward it speaks the five foreign dialects. Outward it exposes exactly one: the user's. Translation happens **once**, at the seam, in a place built for it. A `GET /characters` fans out into four parallel calls, each response gets normalized into the same `Character` shape — one `name`, one `level` (numeric, with a documented rule for ranges), one `portrait`, one `kind` discriminator — and the frontend gets a single list. A `PATCH /characters/:id` is routed and re-dialected into the right service's verbs: `xp` adjustments for Players, `cr` edits for NPCs, `status` transitions for Campaigns.

## The benefits, concretely

What you get is structural, not cosmetic:

- **One canonical name** for "character" everywhere downstream. Naming stops being a negotiation in every PR.
- When an upstream schema changes, **the blast radius stops at the adapter**. The screen never notices.
- **Release cadences decouple**. Upstream teams ship on their clock; you ship on yours; the seam absorbs the impedance.
- **Tests get honest**: each adapter is verified against one upstream contract, and the product is verified against one stable internal model — you stop chasing five moving targets at once.
- A new engineer **learns one vocabulary on day one**, not five dialects to mentally diff every time they open a file.

And — most importantly — the user's list goes back to being "characters". That's it. Five backends, one product.

## The closing

The bill for not doing this gets paid in support tickets that are really vocabulary mismatches, in onboardings that stall on *"wait, what's the difference between a Player and a PC Sheet?"*, and in churn from users who can only say *"the product feels messy"*. They're right. They just can't name it.

Speaking the user's language isn't translation. It's **deciding** which words, which shapes, and which groupings they already carry in their head — and refusing to leak anything else. And that, long before it's an architectural pattern, is a product decision.

---

*One more thing: what we've just described has an older name and a body of literature behind it. In **Domain-Driven Design** it's called **ubiquitous language**; the five services are **bounded contexts**; and the line the BFF draws is, in its jargon, an ***anti-corruption layer***. You don't need the framework to start — just the glossary. But if you want to keep pulling the thread, the literature is waiting.*
