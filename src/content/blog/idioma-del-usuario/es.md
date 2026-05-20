---
title: "Si tu producto no habla el idioma de tu usuario, está condenado a fracasar"
date: 2026-05-20
excerpt: "Cuando tu equipo mantiene un mapping entre cinco dominios distintos, ya has perdido. Lo que el usuario ve en pantalla es solo la factura."
readtime: "4 min"
tags: ["product", "architecture", "ddd", "bff"]
lang: "es"
---

Tu usuario no tiene "Player". No tiene "Actor". No tiene "PC Sheet". Tiene a Lyra y la partida del martes.

Cada vez que tu producto le pide elegir entre esos tres nombres para el mismo concepto, le está obligando a traducir. A hacer, en su cabeza, el trabajo que tu backend no hizo.

Es la consecuencia visible de algo que pasa antes, dentro: tu equipo lleva meses manteniendo un mapping entre cinco dominios distintos. Y eso no escala.

## El ejemplo

Imagina Characters Vault — un gestor de fichas para juegos de rol de mesa — con cinco servicios independientes. **Players** publica los personajes del jugador. **NPCs**, los del director. **Campaigns** sabe quién juega qué. **Templates** guarda los arquetipos clonables. Y el **Frontend**, que tiene que fingir que nada de esto existe.

Cada servicio habla su propio dialecto del mismo concepto. **Players** los llama `playerCharacter`, con `level` calculado desde `xp`. **NPCs**, `nonPlayerCharacter`, con `cr` libre y `displayName` en vez de `name`. **Campaigns** ni siquiera los almacena: guarda `participants` con un `characterRef` opaco. **Templates** los llama `characterBlueprints`, sin portada — solo `iconKey`.

Cinco diccionarios internamente coherentes. Lo que no comparten es la palabra.

## Cuando los mappings no escalan

Tres dialectos son cuatro ramas en cada lista. Cinco, una matriz de tests que se multiplica. Seis es ya un proyecto a tiempo parcial.

Cada equipo upstream va a su ritmo. Players renombra un campo el martes y tu frontend revienta el miércoles. Casi nadie tiene contract tests entre servicios. Templates deprecia `iconKey` y nadie sabe quién lo usa. La persona nueva no aprende un dominio: aprende cinco.

Lo que parecía un atajo se vuelve deuda compuesta. *"Ya lo armonizamos luego"*. El sprint de *"luego"* nunca llega. La velocidad del equipo decrece — lo he visto en demasiados equipos.

Y la misma divergencia se filtra a la pantalla. El NPC muestra "CR 7", el PJ encima "Nivel 7": significan cosas distintas. El filtro "nivel ≥ 5" oculta al NPC favorito del usuario y nadie sabe por qué.

Tres filas seguidas: *Player*, *Actor*, *PC Sheet*. El usuario entrecierra los ojos y construye una teoría privada de qué significan. No significan nada — son tres equipos. La unión la está haciendo él, en su cabeza, cuando la debería haber hecho tu backend.

## La línea

La salida es aburrida: **parar**. Sentarte con producto y diseño, escribir el glosario que tu usuario ya tiene en la cabeza, y trazar la línea exactamente donde tiene que estar. Un **BFF** que normalice los cinco dialectos en uno solo: el del usuario.

(Una salvedad: si los dialectos reflejan distinciones reales del dominio, no las aplastes — dales contexto. Si tu equipo todavía no se ahoga, no construyas el bote.)

No has eliminado los mappings — los has centralizado. Lo que era N×M se vuelve N+M: todos los costes concentrados en un único sitio en lugar de cinco. Cuando mañana añadas la app móvil, lee del mismo sitio.

La factura de **no** hacerlo se paga en otra moneda: tickets que son problemas de vocabulario, onboardings que se atascan en *"¿qué diferencia hay entre un Player y un PC Sheet?"*, y abandono silencioso de gente que solo dice *"el producto se siente desordenado"*.

Tienen razón. Solo que no saben ponerle nombre.

---

*Notas para el lector técnico:*

*— Alternativas razonables: GraphQL federado, un servicio de composición, contratos OpenAPI canónicos. La elección depende de quién manda en los schemas, cuántos clientes tienes y qué latencia te puedes permitir.*

*— Si móvil y web divergen, acabas con varios BFFs — uno por cliente, el patrón original de SoundCloud.*

*— El camino de escritura es más feo que el de lectura: consistencia, sagas, idempotencia, fallos parciales. No hay atajo.*

*— Las dos preguntas que hunden estas iniciativas en empresas reales: quién mantiene el glosario, y quién es dueño del BFF.*
