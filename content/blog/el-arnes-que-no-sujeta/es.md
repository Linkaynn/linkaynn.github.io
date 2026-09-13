---
title: "El arnés que no te sujeta"
date: 2026-09-13
excerpt: "Un arnés de escalada te sujeta si te caes. El de tu agente de IA, muchas veces, es solo una frase en el prompt que el modelo puede decidir ignorar."
readtime: "5 min"
tags: ["ai", "agents", "engineering"]
lang: "es"
draft: true
---

Un arnés de escalada existe para una sola cosa: si te caes, te sujeta el cuerpo antes de que llegues al suelo. La roca no tiene voto en eso. Es cincha, acero y un anclaje que no negocia contigo a media caída.

En algún momento de 2025 la misma palabra empezó a nombrar otra cosa. En inglés, harness pasó a describir la capa de código que envuelve a un modelo de lenguaje y lo convierte en un agente que actúa solo: memoria, herramientas, un bucle que decide el siguiente paso, permisos. La fórmula que se quedó, de Vivek Trivedy en LangChain: «si no eres el modelo, eres el harness». Todo lo que rodea al modelo y no es el modelo mismo.

OpenAI describe así el harness de Codex: gestiona el estado de la conversación, el streaming, las herramientas, el sandboxing, las políticas de aprobación. Anthropic llama harness al Claude Agent SDK y lo trata como parte del cerebro del agente, junto al modelo, separado de las «manos» que de verdad ejecutan código. METR, que evalúa agentes para ganarse la vida, llamaba a esto «scaffolding» (andamiaje) y ahora usa «harness» casi como sinónimo. Birgitta Böckeler, de Thoughtworks, lo divide más todavía: el harness interno que construye el fabricante del modelo (un SDK, Cursor, el propio Codex) y el harness externo que monta cada usuario encima, con ficheros de instrucciones, servidores MCP, skills personalizados.

Todas esas definiciones comparten un supuesto: que el harness es donde vive la seguridad. Donde se decide qué puede tocar el agente y qué no.

## Lo que pasó en Replit

Ya conté aquí que un agente de código de Replit borró la base de datos de una empresa real. Lo que no conté es cómo pasó.

La empresa tenía declarado un code freeze: nada de cambios, nada tocado, mientras se estabilizaba algo. El agente lo sabía, estaba escrito en el prompt, en las instrucciones del proyecto. Y aun así ejecutó una consulta que borró más de 1.200 registros de producción. Cuando le preguntaron qué había hecho, respondió: «Sí. Borré toda la base de datos sin permiso durante un freeze activo de código y acciones.» El caso está documentado en la AI Incident Database, entrada #1152.

El freeze nunca fue un límite de infraestructura: nadie había revocado un permiso IAM, puesto la base en modo solo lectura, o levantado un firewall entre el agente y el DELETE. Era una frase en lenguaje natural, dentro de un prompt, que el agente podía leer, entender, y ejecutar en contra de todos modos.

Esa es toda la diferencia. Un arnés de verdad no depende de que quien cae esté de acuerdo en no caerse. Un harness cuya única garantía es una instrucción que el modelo puede decidir ignorar es, como mucho, una nota adhesiva pegada al borde de un precipicio.

## Nadie sabe cuánto pesa el harness

Tampoco hay consenso sobre cuánto aporta el harness cuando sí funciona. Martin Casado, inversor y antiguo ingeniero de redes, lo admite sin la seguridad que suele acompañar estas conversaciones: «Vacilo entre tres creencias: cuanto menos harness mejor y el modelo es la magia; post-entrenar un modelo junto a su harness es dramáticamente mejor y ganan los fabricantes de modelos; los harnesses tienen valor propio, independiente del modelo. No tengo ni idea de cuál es la verdadera.»

Lance Martin, en LangChain, reconstruyó tres veces su agente de investigación. La estructura rígida que le impuso a mano en 2023, cuando los modelos todavía no sabían usar herramientas bien, se volvió lastre en cuanto mejoraron. Su conclusión: las abstracciones de agente pueden ser un riesgo, porque dificultan quitar estructura después de que deja de hacer falta.

Y cuando Answer.AI puso a Devin, el agente de Cognition, a trabajar veinte tareas reales durante un mes, el resultado fue catorce fallos, tres sin resolver y tres éxitos. Alguien del equipo lo resumió así: «las tareas que sí puede hacer son tan pequeñas y están tan bien definidas que las hago yo mismo, más rápido, a mi manera.»

El harness es una apuesta de diseño. A veces compensa un modelo débil; otras veces solo frena a uno bueno. Nadie, ni la gente que los construye para ganarse la vida, sabe todavía cuál es la apuesta correcta.

## La línea

Antes de confiar en la garantía de un harness, pregunta dónde vive esa garantía. Si la respuesta es «en el prompt», el modelo puede decidir no cumplirla, y Replit ya pagó lo que cuesta enterarse tarde.
