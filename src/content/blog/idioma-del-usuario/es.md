---
title: "Si tu producto no habla el idioma de tu usuario, está condenado a fracasar"
date: 2026-05-20
excerpt: "Cuando un producto depende de varios servicios independientes, cada uno con su vocabulario, el usuario termina aprendiendo el organigrama del equipo en lugar de usar el producto."
readtime: "6 min"
tags: ["product", "architecture", "ddd", "bff"]
lang: "es"
draft: true
---

El producto crece. Cada integración nueva trae su servicio, su equipo y, sobre todo, su **vocabulario**. Asientes en la reunión, copias el JSON tal cual al frontend, y unos meses después tu lista de "personajes" enseña una columna llamada `Player`, otra `Actor`, otra `Pc Sheet`, y dos filas sin portada porque ese servicio nunca tuvo el campo.

El usuario no ve cinco backends. Ve un producto desordenado.

## El ejemplo

Imagina Characters Vault con cinco servicios independientes. **Players** publica los PJs. **NPCs**, los personajes del director. **Campaigns** sabe quién juega qué y cuándo. **Templates** guarda los arquetipos clonables — *Bandido Genérico*, *Caballero Veterano*. Y el **Frontend**, que tiene que fingir que nada de esto existe.

Cada servicio habla su propio dialecto del mismo concepto:

- **Players** los llama `playerCharacter`. Campos: `name`, `level` calculado desde `xp`, `class` obligatorio, `portraitUrl`.
- **NPCs** los llama `nonPlayerCharacter`. Campos: `displayName` (algunos NPCs usan alias), `cr` libre que nadie recomputa, `archetype` opcional, `avatar` en lugar de `portraitUrl`.
- **Campaigns** no almacena personajes — almacena `participants`: un `characterRef` opaco, un `role` (`pc | npc | ally`), un `joinedAt`, y un `status` de `active | retired | dead`.
- **Templates** los llama `characterBlueprints`: `title`, un `recommendedLevel` que es un rango (no un número), `tags[]`, sin portada — solo un `iconKey`.
- **Frontend**, claro, solo quiere pintar "un personaje".

Cinco equipos, cinco diccionarios, internamente coherentes. Lo que no comparten es la palabra.

## Lo que ve el usuario

Si el frontend habla directo con cada servicio, la podredumbre aflora rápido. La lista de personajes crece cuatro ramas en código, una por origen. Cada celda hace su propio `displayName ?? name ?? title`. La página de detalle de un NPC muestra "CR 7"; la del PJ justo encima muestra "Nivel 7" — significan cosas distintas. La búsqueda global devuelve cuatro shapes diferentes y la pantalla deja caer los Templates en silencio porque la card revienta sin portada. Un filtro de "nivel ≥ 5" oculta el NPC favorito del usuario, y nadie sabe explicar por qué.

> <span class="speaker">El usuario:</span> No tiene tus conceptos. No tiene "PC Sheet", no tiene "Actor", no tiene IDs. Tiene a Lyra y la partida del martes.

El coste empieza siendo un impuesto cognitivo silencioso. Tres filas seguidas: la primera dice *Player*, la siguiente *Actor*, la siguiente *Pc Sheet*. Algunas con portada, algunas con nivel, algunas con ninguna de las dos. El usuario entrecierra los ojos y construye una teoría privada de qué significan las diferencias. No significan nada — son tres equipos. La unión la está haciendo él, en su cabeza, cuando la debería haber hecho tu BFF.

Luego el chip de filtro dice `Tipo: NPC` y esconde al goblin que acaba de crear en sesión, porque ese se escribió a través de la integración de encuentros y vive como `Actor.kind = "non_player"`. La búsqueda de "Lyra" devuelve una sola de las tres Lyras suyas, porque las otras dos viven en una tabla cuyo indexer no tokeniza `display_name`. Salta un error: *"Sheet 4471 cannot be linked to Campaign c_882"*. El usuario no tiene números de hoja. Tiene a Lyra y la partida del martes.

## El reflejo equivocado

El atajo seductor es propagar los shapes tal cual. Funciona con dos sistemas. Para el quinto cada pantalla paga un **impuesto de traducción**: condicionales, fallbacks, tres predicados distintos para "¿esto es PJ?", y una matriz de tests que crece multiplicativamente. Y lo peor: cuando un equipo upstream renombra un campo un martes, el sheet del usuario aparece roto el miércoles.

Esta podredumbre se acelera con el crecimiento. Cada integración nueva añade otro dialecto a la misma pantalla. Siempre hay alguien que dice *"ya lo armonizamos luego"*. Luego nunca tiene sprint. Mientras tanto las etiquetas drifftean sección a sección: **Personajes** aquí, **Actores** en el editor de encuentros, **Sheets** en el diálogo de exportar — el mismo concepto, tres nombres.

## Parar, pensar a nivel de producto

Esta tensión no es nueva. La QA lleva años formalizándola con **BDD**: *Given / When / Then* escritos en el idioma del usuario, compartidos entre producto, soporte y QA. La idea es la misma — qué palabras tiene el usuario, qué shapes, qué agrupaciones — aplicada a los tests. Lo que cambia aquí es **dónde** dibujas la costura: no solo en los tests, también en el cable entre tus sistemas.

La salida, entonces, no es glamurosa. Es **parar**. Sentarte con producto y diseño, escribir el glosario que tu usuario ya tiene en la cabeza, y trazar la línea exactamente donde tiene que estar — un **BFF** que actúe como *anti-corruption layer*.

Hacia adentro habla los cinco dialectos foráneos. Hacia afuera expone uno solo: el del usuario. La traducción ocurre **una sola vez**, en la costura, en un lugar diseñado para ello. Una `GET /characters` se abre en cuatro llamadas paralelas, cada respuesta se normaliza al mismo shape `Character` — un `name`, un `level` numérico (con regla documentada para los rangos), un `portrait`, un `kind` discriminador — y el frontend recibe una sola lista. Una `PATCH /characters/:id` se enruta y se redialecta hacia el servicio que toca: ajustes de `xp` en Players, edits de `cr` en NPCs, transiciones de `status` en Campaigns.

## Los beneficios, en concreto

Lo que ganas es estructural, no cosmético:

- **Un único nombre canónico** para "personaje" en todo el frontend. Nombrar deja de ser una negociación en cada PR.
- Cuando un servicio upstream cambia el schema, **el radio de impacto se detiene en el adaptador**. La pantalla ni se entera.
- **Los ritmos de release se desacoplan**. Cada equipo upstream va a su velocidad. La costura absorbe la impedancia.
- **Los tests se vuelven honestos**: verificas cada adaptador contra un contrato upstream, y verificas el producto contra un modelo interno estable. No persigues cinco objetivos móviles a la vez.
- Una persona nueva en el equipo **aprende un vocabulario el primer día**, no cinco dialectos que tiene que diff'ear mentalmente cada vez que abre un fichero.

Y, lo más importante: la lista del usuario vuelve a ser "personajes". Sin más. Cinco backends, un producto.

## El cierre

La factura de no hacerlo se paga en tickets de soporte que en realidad son problemas de vocabulario, en onboardings que se atascan en *"espera, ¿qué diferencia hay entre un Player y un PC Sheet?"*, y en abandono silencioso de gente que solo dice *"el producto se siente desordenado"*. Tienen razón. Solo que no saben ponerle nombre.

Hablar el idioma del usuario no es traducir. Es **decidir** qué palabras, qué shapes y qué agrupaciones lleva ya en la cabeza, y negarse a filtrar nada más. Y eso, mucho antes de ser un patrón arquitectónico, es una decisión de producto.

---

*Por cierto: lo que acabamos de describir tiene un nombre más antiguo y un cuerpo de literatura detrás. En **Domain-Driven Design** se llama **lenguaje ubicuo**; los cinco servicios son **bounded contexts**; la línea que tira el BFF es, en su jerga, una ***anti-corruption layer***. No necesitas el framework para empezar — solo el glosario. Pero si quieres seguir tirando del hilo, la literatura te está esperando.*
