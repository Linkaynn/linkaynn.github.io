---
title: "El precio de pensar despacio"
date: 2026-09-20
excerpt: "La mayoría de las llamadas a un LLM en producción no piden un ensayo, piden un sí o un no. Llevas meses pagando el precio de un novelista premiado para que te separe el correo en dos bandejas."
readtime: "5 min"
tags: ["ai", "engineering", "startups"]
lang: "es"
draft: true
---

Imagina que contratas a un novelista premiado para que te ordene el correo. Sabe escribir con precisión sobre la condición humana, pero tú solo necesitas que separe "factura" de "spam" en dos bandejas. Le pagas por palabra. Tarda tres minutos en decidir cada carta porque piensa en voz alta antes de contestar. Y a veces, en vez de un sí o un no, te devuelve un párrafo sobre la naturaleza ambigua del concepto "factura".

Eso es, casi literalmente, lo que hace la mayoría del código en producción cuando llama a un LLM.

Kahneman dividió el pensamiento humano en dos sistemas: el Sistema 1, rápido y automático, el que reconoce una cara o decide si un ruido es peligroso sin pasar por el lenguaje; y el Sistema 2, lento y deliberado, el que usas para redactar un contrato o resolver una ecuación paso a paso. Los LLM generalistas (GPT, Claude, Gemini) están entrenados para el Sistema 2: generan lenguaje token a token, deliberando en cada paso. Pero la mayoría de las llamadas que un sistema en producción les hace son preguntas de Sistema 1. ¿Es esto spam o no? Del 1 al 10, ¿qué prioridad tiene este ticket? ¿Escalo esto a un humano o lo resuelvo yo? Le pedimos a un novelista que piense despacio para resolver algo que debería tardar un parpadeo, y pagamos esa lentitud en cada llamada.

## Un modelo que no escribe

El 15 de septiembre, TypeSafe AI salió de stealth con 40 millones de dólares de ronda semilla liderada por DCVC y una valoración de 200 millones. La fundó en 2024 Diogo Almeida, coinventor de RLHF en OpenAI y parte del equipo que trabajó en ChatGPT y GPT-4, junto con Erik Gafni y Sasha Sheng. Su producto, Jev, se presenta como el primer "System One Model": en vez de generar texto para que tu código lo interprete después, evalúa preguntas tipadas contra un estado (tu contexto, tus datos) y devuelve un valor tipado, una probabilidad y una confianza.

Tres primitivas cubren casi todo lo que un sistema necesita decidir. Choice elige una opción entre hasta 255. Score puntúa en una escala. Noul responde verdadero o falso con una probabilidad asociada de 0 a 1. Todas las preguntas de una misma llamada se evalúan en paralelo, así que añadir cinco preguntas más a una decisión apenas mueve la latencia o el coste: no hay degradación de contexto por acumular preguntas. El blog de TypeSafe lo resume así: "Piensa en Jev como una llamada a función de inteligencia de frontera: entra estado sin estructurar, salen decisiones probabilísticas tipadas."

Almeida se lo explicó a TechCrunch con una frase que resume el problema mejor que cualquier cosa que pueda escribir yo: "Tenemos un rayo metido en una botella, y aun así no es útil (...) el problema es que estamos optimizando para el lenguaje humano (...) no sirve para automatización, porque los ordenadores hablan un idioma distinto."

## Los números

Los benchmarks son de la propia TypeSafe. SiliconANGLE señala que nadie los ha verificado de forma independiente, así que tómalos como punto de partida, no como cierre de la conversación. Con esa salvedad: Jev responde en 70 a 500 milisegundos frente a los 3 a 329 segundos que tarda un LLM de frontera en una tarea comparable. El coste de entrada es 0,042 dólares por millón de tokens, y la salida sale gratis porque es un valor tipado, no texto generado. Por cada mil workflows equivalentes, TypeSafe cifra el gasto en Jev en 39 centavos, frente a 3,31 dólares en GPT-5.6 Luna de OpenAI y 19,49 dólares en Claude Haiku 4.5 de Anthropic. La empresa habla de hasta 194 veces más rápido y unas 445 veces más barato en sus workflows publicados.

Esas cifras las pone quien vende el producto. Hay dos casos que sí verificó TechCrunch de forma independiente, hablando con la gente que los vivió, y son los que de verdad pesan.

Pranit Sharma, ingeniero de Vercel, tenía montado sobre ChatGPT Luna 5.6 un clasificador que decide si un comando que va a ejecutar un agente es peligroso. Al pasarlo a Jev, obtuvo resultados entre 5 y 18 veces más rápidos, y más precisos. Nikhil Mudholkar, CTO de Bryo AI, probó Jev contra Gemini para clasificar emails de negocio. Gemini ganó por poco en precisión, pero costaba entre 10 y 20 veces más. Lo que a Mudholkar le pareció decisivo no fue la velocidad, sino la probabilidad: "es el único que te devuelve una probabilidad real, lo que lo hace ideal para automatizar workflows."

Ahí está lo que un LLM generalista no te da de fábrica. Puedes pedirle que te diga qué tan seguro está, y te va a inventar un número que suena razonable porque eso es lo que hace mejor: sonar razonable. Jev devuelve una probabilidad calibrada porque es literalmente para lo que fue entrenado.

## Enrutar por confianza

La documentación de TypeSafe describe un patrón que explica por qué esto importa más allá de la factura mensual. En un asistente bancario, si la confianza de Jev al clasificar la intención del usuario cae por debajo de 0.5, el sistema deriva a un humano. Si supera 0.5 y la acción es de bajo riesgo, como consultar un saldo, actúa sola. Si la acción es destructiva, como aprobar una transferencia, exige una confianza superior a 0.9; si no la alcanza, pide confirmación explícita antes de mover el dinero.

Un sistema que sabe cuándo no sabe puede tomar esa decisión sola. Uno que solo genera texto con tono seguro, acierte o no, no puede.

## El cálculo

El argumento económico se sostiene aunque Jev no sea perfecto. Basta con que la mayoría de las decisiones que tu sistema toma en producción, clasificar, puntuar, decidir sí o no, elegir entre un puñado de opciones, dejen de pagar el precio de un modelo entrenado para escribir prosa. Guarda el LLM generalista para cuando alguien de verdad necesite que redacten algo. Para todo lo demás no hace falta el novelista premiado. Hace falta alguien que separe el correo rápido, barato, y que avise cuando no está seguro de en qué bandeja va la carta.
