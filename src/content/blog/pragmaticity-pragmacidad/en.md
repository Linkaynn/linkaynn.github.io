---
title: "Pragmaticity in Software Development"
date: 2025-07-07
excerpt: "Pragmaticity becomes critical once the product is live and every decision reverberates through the user experience."
readtime: "8 min"
tags: ["philosophy", "engineering"]
lang: "en"
---

**Pragmaticity** becomes critical once the product is live and every decision reverberates through the user experience.

> <span class="speaker">A:</span> "I think a signed JWT is enough to migrate between both apps; it's robust enough, we only have 500 users."
>
> <span class="speaker">B:</span> "It would be safer to create a table with a salt, TTL and a JWT linked to it to prevent brute‑force attacks."

This dialogue illustrates the tension between the ideal of absolute security and operational cost. **Pragmaticity** invites us to weigh impact, risks and delivery time before adding future complexity.

"The solution for a problem in a 500‑user context, assuming you have 50,000, could make you lose them all." For such a small volume, duplicating tables, TTLs and salt management can delay migration, multiply failure points and distract the team from the feedback those users already generate. **Pragmaticity** after launch suggests measuring real incidents and hardening controls only when traffic and attack surface justify it, freeing resources for visible, rapid improvements.

A **pragmatic** approach in Node.js issues a short‑lived JWT signed with a rotating key and tracks its use. The snippet below generates a token valid for 15 minutes — enough for the migration without extra tables:

```js
const jwt = require("jsonwebtoken");

const signingKey = Buffer.from("super-secret-key", "utf8");

function issueToken(userId) {
  return jwt.sign(
    { sub: userId },
    signingKey,
    { algorithm: "HS256", expiresIn: "15m" }
  );
}

// Example
console.log(issueToken("user123"));
```

<figure>
  <img src="/assets/pragmacidad-desarrollo-software/matriz.png" alt="Impact vs effort matrix with four prioritization quadrants" />
  <figcaption>// Fig. 1 — impact-effort matrix: prioritise high-impact, low-effort work.</figcaption>
</figure>
