---
title: "El precio de pensar despacio"
date: 2026-09-20
excerpt: "La mayoría de las llamadas a un LLM en producción no piden un ensayo, piden un sí o un no. Llevas meses pagando el precio de un novelista premiado para que te separe el correo en dos bandejas."
readtime: "3 min"
tags: ["ai", "engineering", "startups"]
lang: "es"
draft: true
---

Imagina contratar a un novelista premiado para que te ordene el correo. Sabe escribir sobre la condición humana, pero tú solo necesitas que separe "factura" de "spam". Le pagas por palabra y tarda tres minutos por carta porque piensa en voz alta antes de contestar.

Eso es lo que hace la mayoría del código en producción cuando llama a un LLM genérico (GPT, Claude, Gemini). Le pedimos clasificar, puntuar o decidir sí/no: tareas del Sistema 1 en la división de Kahneman, resueltas con un modelo entrenado para el Sistema 2, generación de texto token a token, deliberando en cada paso.

## Un modelo que no escribe

El 15 de septiembre, TypeSafe AI salió de stealth con 40 millones de dólares de ronda semilla (DCVC, valoración de 200 millones), fundada por Diogo Almeida, coinventor de RLHF en OpenAI. Su modelo, Jev, no genera texto: evalúa preguntas tipadas, elige una opción, puntúa, responde verdadero o falso, contra tu contexto, y devuelve un valor, una probabilidad y una confianza. Como dice su propio blog: "entra estado sin estructurar, salen decisiones probabilísticas tipadas".

## Los números

Son de la propia TypeSafe, sin verificar por terceros: 70-500 milisegundos de respuesta frente a 3-329 segundos en un LLM de frontera para una tarea comparable. 0,042 dólares por millón de tokens de entrada, salida gratis. Por cada mil workflows equivalentes: 39 centavos en Jev, 3,31 dólares en GPT-5.6 Luna de OpenAI, 19,49 en Claude Haiku 4.5 de Anthropic.

Lo que sí verificó TechCrunch de forma independiente: Vercel sustituyó un clasificador de seguridad de comandos hecho con ChatGPT Luna 5.6 por Jev y ganó de 5 a 18 veces en velocidad, con mejor precisión. Bryo AI probó Jev contra Gemini para clasificar emails de negocio: Gemini ganó por poco en precisión, pero costaba de 10 a 20 veces más. Su CTO, Nikhil Mudholkar, lo resumió así: "es el único que te devuelve una probabilidad real, lo que lo hace ideal para automatizar workflows".

## La diferencia real

Pídele a un LLM genérico que te diga qué tan seguro está y va a inventar un número que suena razonable, porque sonar razonable es lo que hace mejor. Jev devuelve una probabilidad calibrada porque es literalmente para lo que fue entrenado. Eso te deja enrutar por confianza: bajo un umbral, la decisión pasa a un humano; sobre otro, el sistema actúa solo.

El argumento económico se sostiene aunque Jev no sea perfecto. La mayoría de las decisiones que tu sistema toma en producción no necesitan un modelo entrenado para escribir prosa. Guarda el LLM generalista para cuando alguien de verdad necesite que redacten algo.
