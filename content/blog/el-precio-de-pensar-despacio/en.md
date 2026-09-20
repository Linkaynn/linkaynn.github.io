---
title: "The Cost of Thinking Slow"
date: 2026-09-20
excerpt: "Most LLM calls in production don't ask for an essay. They ask yes or no. You've been paying an award-winning novelist to sort your mail into two trays."
readtime: "5 min"
tags: ["ai", "engineering", "startups"]
lang: "en"
draft: true
---

Imagine hiring an award-winning novelist to sort your mail. He writes with precision about the human condition, but all you need is for him to split "bill" from "spam" into two trays. You pay him by the word. Each letter takes three minutes because he thinks out loud before answering. And sometimes, instead of a yes or a no, he hands you back a paragraph on the ambiguous nature of the concept of "bill."

That's close to literally what most production code does every time it calls an LLM.

Kahneman split human thinking into two systems: System 1, fast and automatic, the one that recognizes a face or decides a noise is dangerous without ever touching language; and System 2, slow and deliberate, the one you use to draft a contract or work through an equation step by step. General-purpose LLMs, GPT, Claude, Gemini, are trained for System 2. They generate language token by token, deliberating at every step. But most of the calls a production system makes to them are System 1 questions. Is this spam or not? On a scale of 1 to 10, how urgent is this ticket? Do I escalate this to a human or handle it myself? We're asking a novelist to think slowly to solve something that should take a blink, and we pay for that slowness on every call.

## A model that doesn't write

On September 15, TypeSafe AI came out of stealth with a $40 million seed round led by DCVC and a $200 million valuation. It was founded in 2024 by Diogo Almeida, a co-inventor of RLHF at OpenAI who worked on ChatGPT and GPT-4, alongside Erik Gafni and Sasha Sheng. Its product, Jev, is pitched as the first "System One Model": instead of generating text for your code to parse afterward, it evaluates typed questions against a state (your context, your data) and returns a typed value, a probability, and a confidence score directly.

Three primitives cover most of what a system needs to decide. Choice picks one option out of up to 255. Score rates something on a scale. Noul answers true or false with an associated probability between 0 and 1. Every question in a single call gets evaluated in parallel, so adding five more questions to a decision barely moves the latency or the cost: there's no context-rot from stacking questions. TypeSafe's own blog puts it this way: "Think of Jev as a frontier-intelligence function call: unstructured state in, typed probabilistic decisions out."

Almeida explained the problem to TechCrunch better than I could paraphrase it: "We have lightning in a bottle, and yet it is not useful... The problem is we are optimizing for human language... it's not useful for automation because computers speak a different language."

## The numbers

The benchmarks come from TypeSafe itself. SiliconANGLE notes that nobody has independently verified them, so treat them as a starting point for the conversation, not the end of it. With that caveat: Jev answers in 70 to 500 milliseconds, against 3 to 329 seconds for a frontier LLM on a comparable task. Input costs $0.042 per million tokens, and output is free because it's a typed value, not generated text. For every thousand equivalent workflows, TypeSafe puts the cost of running Jev at 39 cents, against $3.31 for OpenAI's GPT-5.6 Luna and $19.49 for Anthropic's Claude Haiku 4.5. The company claims up to 194x faster and roughly 445x cheaper across its published workflows.

Those numbers come from the company selling the product. Two adoption stories were independently verified by TechCrunch, straight from the people who lived them, and those are the ones that actually carry weight.

Pranit Sharma, an engineer at Vercel, had a command-safety classifier, the one deciding whether a command an agent is about to execute is dangerous, built on top of ChatGPT Luna 5.6. Switching it to Jev got him results 5 to 18 times faster, and more accurate. Nikhil Mudholkar, CTO at Bryo AI, tested Jev against Gemini for classifying business emails. Gemini edged it out slightly on accuracy, but cost 10 to 20 times more. What struck Mudholkar as decisive wasn't speed, it was the probability: "it is the only one that hands back a real probability which makes it ideal for automating workflows!!"

That's the part a general-purpose LLM doesn't give you out of the box. You can ask one how confident it is, and it will make up a number that sounds reasonable, because sounding reasonable is what it does best. Jev returns a calibrated probability because that's literally what it was trained to produce.

## Routing on confidence

TypeSafe's documentation describes a pattern that explains why this matters beyond the monthly bill: confidence-threshold routing. In a banking assistant, if Jev's confidence classifying user intent falls below 0.5, the system routes to a human. Above 0.5 for a low-risk action, like checking a balance, it acts on its own. For a destructive action, like approving a transfer, it requires confidence above 0.9; short of that, it asks the user to confirm before moving money.

A system that knows when it doesn't know can make that call on its own. One that only generates confident-sounding text, right or wrong, can't.

## The math

The economic argument holds even if Jev isn't perfect. It just needs most of the decisions your system makes in production, classify this, score that, yes or no, pick one of a handful of options, to stop paying the price of a model trained to write prose. Save the general-purpose LLM for when someone actually needs something drafted. For everything else, you don't need the award-winning novelist. You need someone who sorts the mail fast, cheap, and flags it when they're not sure which tray a letter belongs in.
