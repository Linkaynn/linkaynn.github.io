---
title: "La Pragmacidad en el Desarrollo de Software"
date: 2025-07-07
excerpt: "La pragmacidad se vuelve crítica una vez el producto está vivo y cada decisión repercute en la experiencia real."
readtime: "8 min"
tags: ["philosophy", "engineering"]
lang: "es"
---

La **pragmacidad** se vuelve crítica cuando el producto ya está vivo y cada decisión repercute en la experiencia real.

> <span class="speaker">A:</span> «Creo que con usar un JWT firmado para hacer la migración entre las dos aplicaciones bastaría, es suficientemente robusto; al final solo tenemos 500 usuarios».
>
> <span class="speaker">B:</span> «Sería más seguro crear una tabla con _salt_, TTL y un JWT ligado a ella para evitar ataques por fuerza bruta».

Este diálogo ejemplifica la tensión entre el ideal de seguridad absoluta y el coste operativo. La **pragmacidad** invita a ponderar impacto, riesgos y tiempo de entrega antes de añadir complejidad futura.

«La solución para un problema en un contexto con 500 usuarios pensando que tienes 50.000 podría hacer perderlos a todos». Para un volumen tan pequeño, duplicar tablas, TTL y gestión de _salts_ puede retrasar la migración, multiplicar puntos de fallo y desviar al equipo del feedback esencial que los usuarios ya generan. La **pragmacidad** pos‑lanzamiento propone medir incidentes reales y reforzar controles solo cuando la superficie de ataque y el tráfico lo justifiquen, liberando recursos para mejoras visibles y rápidas.

Un enfoque **pragmático** en Node.js consiste en emitir un JWT de corta vida firmado con una clave rotativa y monitorizar su uso. El siguiente snippet crea un token válido durante 15 minutos; cubre la migración sin tablas extra:

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

console.log(issueToken("user123"));
```

<figure>
  <img src="/assets/pragmacidad-desarrollo-software/matriz.png" alt="Matriz de complejidad vs valor pragmacidad" />
  <figcaption>// Fig. 1 — matriz de impacto vs esfuerzo: prioriza alto impacto y bajo esfuerzo.</figcaption>
</figure>
