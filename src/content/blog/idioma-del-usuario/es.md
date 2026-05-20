---
title: "Si tu producto no habla el idioma de tu usuario, está condenado a fracasar"
date: 2026-05-20
excerpt: "Mantener un mapping entre cinco dominios distintos no escala. Y cuando el equipo no aguanta el mantenimiento, el desorden se filtra a la pantalla del usuario."
readtime: "5 min"
tags: ["product", "architecture", "ddd", "bff"]
lang: "es"
draft: true
---

Cada integración nueva trae su servicio, su equipo y, sobre todo, su **vocabulario**. Con dos sistemas te apañas: cuatro condicionales en el frontend, dos shapes, fin. Con cinco, cada pantalla está pagando un impuesto de traducción que no para de crecer.

No es un problema de UX. Todavía. Es un problema de mantenimiento.

Y los problemas de mantenimiento, en plural, no se suman. Se multiplican.

## El ejemplo

Imagina Characters Vault — un gestor de fichas de rol — con cinco servicios independientes. **Players** publica los PJs. **NPCs**, los personajes del director. **Campaigns** sabe quién juega qué y cuándo. **Templates** guarda los arquetipos clonables. Y el **Frontend**, que tiene que fingir que nada de esto existe.

(Si tu dominio son pedidos, productos o citas médicas, sustituye los nombres; la mecánica es la misma.)

Cada servicio habla su propio dialecto del mismo concepto. **Players** los llama `playerCharacter`, con `level` calculado desde `xp` y `class` obligatorio. **NPCs** los llama `nonPlayerCharacter`, con `cr` libre que nadie recomputa y `displayName` en vez de `name`. **Campaigns** ni siquiera los almacena — solo guarda `participants` con un `characterRef` opaco. Y **Templates** los llama `characterBlueprints`, sin portada — solo un `iconKey`.

Cinco diccionarios internamente coherentes. Lo que no comparten es la palabra.

## Por qué cinco mappings no escalan

Tres dialectos en código son cuatro ramas en cada lista. Cinco son una matriz de tests que crece multiplicativamente. Seis es ya un proyecto a tiempo parcial.

Cada equipo upstream va a su ritmo. Players renombra un campo un martes y tu frontend revienta el miércoles porque nadie te avisó. Templates deprecia `iconKey` y nadie sabe quién lo usa. Una persona nueva en el equipo no aprende un dominio: aprende cinco, y se pasa el primer mes haciendo arqueología de qué significa "nivel" en cada uno.

Lo que parecía un atajo — propagar shapes tal cual al frontend — se convierte en deuda compuesta. Cada feature toca cuatro pantallas; cada pantalla toca cuatro shapes; cada shape evoluciona en su servicio sin avisarte. La velocidad del equipo no crece linealmente con el número de servicios. Decrece.

Esto se acelera con el crecimiento. Cada integración nueva añade otro dialecto. Siempre hay alguien que dice *"ya lo armonizamos luego"*. El sprint de *"luego"* nunca llega. Mientras tanto las etiquetas se desvían sección a sección: **Personajes** aquí, **Actores** en el editor de encuentros, **Sheets** en el diálogo de exportar.

## Y luego está el usuario

Mientras tu equipo se ahoga manteniendo esos cinco dialectos, la misma divergencia se filtra a la pantalla. La página de detalle de un NPC muestra "CR 7"; la del PJ justo encima "Nivel 7" — significan cosas distintas. La búsqueda global devuelve cuatro formas diferentes y la pantalla deja caer los Templates en silencio porque la card revienta sin portada. Un filtro de "nivel ≥ 5" oculta el NPC favorito del usuario, y nadie sabe explicar por qué.

> <span class="speaker">El usuario:</span> No tiene tus conceptos. No tiene "PC Sheet", no tiene "Actor", no tiene IDs. Tiene a Lyra y la partida del martes.

Tres filas seguidas: la primera dice *Player*, la siguiente *Actor*, la siguiente *Pc Sheet*. El usuario entrecierra los ojos y construye una teoría privada de qué significan las diferencias. No significan nada — son tres equipos. La unión la está haciendo él, en su cabeza, cuando la debería haber hecho tu backend.

## Dos avisos antes de seguir

Antes de meter una capa nueva, conviene reconocer dos cosas.

Una: **hay alternativas razonables**. GraphQL federado, un servicio de composición, contratos OpenAPI con tipos canónicos. La elección depende de quién manda en los schemas, cuántos clientes tienes y qué latencia te puedes permitir.

Dos: **a veces los dialectos internos reflejan distinciones reales del dominio, no ruido de equipos**. CR y Nivel pueden ser cosas distintas — y aplanarlas a la fuerza puede ser peor UX, no mejor. La pregunta no es "¿cómo aplano esto?" sino "¿qué entiende mi usuario al ver esta lista?". A veces la respuesta es separarlos mejor, no unificarlos.

## La línea

Asumiendo que la unificación es lo correcto, la salida no es glamurosa. Es **parar**. Sentarte con producto y diseño, escribir el glosario que tu usuario ya tiene en la cabeza, y trazar la línea exactamente donde tiene que estar — un **BFF** que normalice los cinco dialectos en uno solo: el del usuario.

Hacia adentro habla los cinco dialectos foráneos. Hacia afuera expone uno solo. Una `GET /characters` se abre en cuatro llamadas paralelas, cada respuesta se normaliza al mismo shape `Character`, y el frontend recibe una sola lista. La complejidad **N×N** se convierte en **N+1**: cada servicio mapea a un único canónico, y a partir de ahí, todo es uno.

## Lo que cuesta

Tirar esa línea tampoco es gratis. La normalización es lógica de negocio que ahora vive aquí — alguien la mantiene cuando el equipo de Players renombra un campo un martes. Las cuatro llamadas en paralelo añaden latencia. El BFF puede convertirse en su propio cuello de botella si no se vigila. Y el **camino de escritura** es más feo que el de lectura: cuando una `PATCH /characters/:id` tiene que repartirse entre tres servicios, alguien tiene que pensar en consistencia. El glosario, además, necesita dueño y proceso para los días en que dos equipos no se ponen de acuerdo sobre qué significa "nivel".

Pero ahora, al menos, el dolor está localizado en una pieza. La velocidad del equipo deja de decrecer con cada integración nueva.

Aun con todo eso, la factura de **no** hacerlo se paga en otra moneda: tickets que en realidad son problemas de vocabulario, onboardings que se atascan en *"¿qué diferencia hay entre un Player y un PC Sheet?"*, y abandono silencioso de gente que solo dice *"el producto se siente desordenado"*.

Tienen razón. Solo que no saben ponerle nombre.
