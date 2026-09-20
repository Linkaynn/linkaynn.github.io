---
title: "The Cost of Thinking Slow"
date: 2026-09-20
excerpt: "Most LLM calls in production don't ask for an essay. They ask yes or no. You've been paying an award-winning novelist to sort your mail into two trays."
readtime: "3 min"
tags: ["ai", "engineering", "startups"]
lang: "en"
draft: true
---

Imagine hiring an award-winning novelist to sort your mail. He writes about the human condition, but all you need is for him to split "bill" from "spam." You pay him by the word, and each letter takes three minutes because he thinks out loud before answering.

That's what most production code does every time it calls a general-purpose LLM (GPT, Claude, Gemini). We ask it to classify, score, or decide yes/no: System 1 tasks in Kahneman's split, solved with a model trained for System 2, generating text token by token, deliberating at every step.

## A model that doesn't write

On September 15, TypeSafe AI came out of stealth with a $40 million seed round (DCVC, $200 million valuation), founded by Diogo Almeida, a co-inventor of RLHF at OpenAI. Its model, Jev, doesn't generate text: it evaluates typed questions, pick an option, score something, answer true or false, against your context, and returns a value, a probability, and a confidence score. As its own blog puts it: "unstructured state in, typed probabilistic decisions out."

## The numbers

These come from TypeSafe itself, not independently verified: 70-500 milliseconds to respond, against 3-329 seconds for a frontier LLM on a comparable task. Input costs $0.042 per million tokens, output is free. Per thousand equivalent workflows: 39 cents on Jev, $3.31 on OpenAI's GPT-5.6 Luna, $19.49 on Anthropic's Claude Haiku 4.5.

What TechCrunch did independently verify: Vercel swapped a command-safety classifier built on ChatGPT Luna 5.6 for Jev and got results 5 to 18 times faster, with better accuracy. Bryo AI tested Jev against Gemini for classifying business emails: Gemini edged it out slightly on accuracy, but cost 10 to 20 times more. Its CTO, Nikhil Mudholkar, put it this way: "it is the only one that hands back a real probability which makes it ideal for automating workflows."

## The real difference

Ask a general-purpose LLM how confident it is, and it will make up a number that sounds reasonable, because sounding reasonable is what it does best. Jev returns a calibrated probability because that's literally what it was trained to produce. That lets you route on confidence: below a threshold, the decision goes to a human; above another, the system acts on its own.

The economic argument holds even if Jev isn't perfect. Most of the decisions your system makes in production don't need a model trained to write prose. Save the general-purpose LLM for when someone actually needs something drafted.
