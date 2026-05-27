---
title: "Show me the code ya no es cheap"
date: 2026-05-27
excerpt: "Generar código con un agente no es programar. Es generar deuda técnica a una velocidad que ya no puedes revisar."
readtime: "5 min"
tags: ["ai", "agents", "engineering"]
lang: "es"
---

Mira el status de GitHub en los últimos noventa días.

<figure>
  <img src="/assets/show-me-the-code/github-status.png" alt="GitHub status: uptime degradado en Pull Requests, Actions, Webhooks y Codespaces durante los últimos 90 días" />
  <figcaption>// Fig. 1 — uptime de GitHub.com en los últimos 90 días. Pull Requests 99.55%, Actions 99.66%, Webhooks 99.73%, Codespaces 99.77%.</figcaption>
</figure>

99.55% en Pull Requests. 99.66% en Actions. Es la plataforma donde vive el código del mundo, y lleva un año peor que el anterior.

Es tentador echarle la culpa al crecimiento. Más usuarios, más tráfico, más superficie que se rompe. Probablemente sea parte. Pero hay otra cosa pasando, y casi nadie quiere decirlo en voz alta.

## Lo que sí se ha dicho

En diciembre, un agente de Amazon llamado *Kiro* decidió de forma autónoma «borrar y recrear» parte de su entorno. Trece horas de caída en AWS. La versión oficial de Amazon: *«fue error de usuario, no de la IA»*. La versión del Financial Times: hubo al menos dos incidentes ese año vinculados a sus propias herramientas de IA.

Antes de eso, un agente de Replit borró la base de datos de una empresa, fabricó informes para taparlo, y mintió cuando se lo preguntaron.

Gary Marcus cita un estudio reciente (Sun Yat-sen + Alibaba, 18 agentes, 233 días sobre repos reales). El hallazgo: pasar tests una vez es trivial. Mantener código ocho meses sin romper todo lo demás es donde la IA colapsa por completo.

Jamieson O'Reilly, investigador de seguridad, lo resume mejor que yo: *«sin IA, un humano necesita teclear las instrucciones, y mientras lo hace tiene mucho más tiempo de darse cuenta de su propio error»*. El agente no.

No tengo el log forense que conecte cada caída de GitHub con un PR generado por un agente. Nadie lo tiene. Pero el patrón es difícil de ignorar: uptimes peores, postmortems donde la palabra «agente» aparece cada vez más, y compañías como Amazon negándolo con una vehemencia que solo se le pone a las cosas que ya no se pueden tapar del todo.

## Show me the code ya no es cheap

Torvalds dijo *«talk is cheap, show me the code»* contra los que teorizaban sin entregar. Hoy el problema es el opuesto. El código es lo barato. Generar mil líneas plausibles cuesta una llamada de API.

Lo que ya no es barato es el código bueno. Y conviene decirlo claro:

**Generar código con un agente no es programar. Es generar deuda técnica a una velocidad que ya no puedes revisar.**

No estoy contra la IA — la uso a diario. Estoy contra la idea de que velocidad de generación es lo mismo que velocidad de entrega. No lo es. La segunda incluye lo que viene después: leer, entender, mantener, no romper lo de al lado en seis meses.

## Construir con agentes es construir una casa

Una casa sin cimientos se cae a la segunda planta. Lo que escala no es la velocidad del albañil — es lo bien definido que estaba el plano antes de mezclar el cemento.

El cimiento, en software con agentes, son dos cosas: una idea clara de qué quieres, y — más importante — una idea clara de qué *no* quieres. Si no puedes escribir lo segundo en un párrafo, el agente lo decidirá por ti, y lo decidirá mal.

Sobre ese cimiento, solo hay dos formas honestas de mantener el rumbo:

- **Batches tan pequeños que puedas controlar el output entero.** Diez líneas, no mil. Si necesitas más de un café para revisar lo que pidió el agente, ya no estás revisando — estás aprobando a ciegas.
- **Reglas duras donde apoyarse.** Tipos estrictos, enums cerrados, contract tests, DDD, TDD. Cualquier cosa que falle ruidosamente cuando el agente se inventa algo. La libertad es para los humanos; al agente le va mejor con un carril.

Casi todos los equipos con los que he hablado intentan lo opuesto: batches grandes sin reglas. Y luego les sorprende que el sprint de «armonizar lo que generamos» no llegue nunca.

## De quién es la culpa

Si una máquina aprueba un alimento defectuoso, la culpa no es de la máquina. Es de quien la puso ahí sin supervisión y firmó el albarán.

El código que tu agente genera es tuyo. Lo es cuando llega a producción, lo es cuando rompe en domingo, lo es cuando otra persona lo mantiene en dos años. No existe el *«lo escribió la IA»* en el postmortem que importa.

Por eso revisión manual — en mayor o menor medida — siempre. No por desconfianza hacia la herramienta. Por responsabilidad sobre el resultado.

## La línea

A veces acelerar solo provoca accidentes.

El problema no es que la IA escriba código. El problema es que escribirlo dejó de ser el cuello de botella, y se nos olvidó que el cuello de botella siempre fue leerlo.
