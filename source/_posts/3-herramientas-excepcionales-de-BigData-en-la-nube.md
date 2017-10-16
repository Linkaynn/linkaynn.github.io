---
title: 3 herramientas excepcionales de BigData en la nube
tags:
  - bigquery
  - pub/sub
  - dataflow
  - bigdata
  - gcp
  - google
date: 2017-10-15 14:49:46
---

Muy buenos días a todos y todas, como siempre, espero que esten teniendo una muy buena semana.
Hace dos semanas tuve un examen de certificación de Data Engineer de Google Cloud ~~que he aprobado~~ y he pensado que qué mejor que hacer un post sobre el tratamiento de datos y tres herramientas, para mi, fundamentales.

Tengo que decir que personalmente soy nuevo en tecnologías de la nube, pero que, en poco tiempo, me he formado y actualmente toco alguna herramienta, como las que les voy a presentar. Y... ahora... sin más dilación.. les presento a **BigQuery**, **Pub/Sub** y **Dataflow**.

Estas tres herramientas en solitario pueden hacer mucho, pero juntas... pueden hacer mágia...

![Magic](https://media.giphy.com/media/12NUbkX6p4xOO4/giphy.gif)

*¡Allá vamos!*
<!-- more -->

Las tres herramientas son serverless, es decir, no se necesita la gestión de un servidor para utilizarlas, eso ahorra mucho los costes y los tiempos. 

## BigQuery
Situación: Tienes una base de datos con un **gran gran** volumen de información, sea SQL o noSQL, y quieres atacarla para saber algún dato en concreto, como por ejemplo:
- Preferencias de los usuarios
- Usos frecuentes de tus herramientas
- Ventas de tu aplicación
- Usos de tu aplicación

Si es SQL siempre podrás atacarla con sentencias normales, pero en esta situación estamos hablando que hacer una consulta sobre 100.000 filas podría tardar entre 20 y 60 segundos. Con BigQuery tardarías 1 segundo, es decir, entre un 2000-6000% más rapido.

Por otro lado, si es noSQL es posible que hacer una consulta muy precisa pueda ser proporcionalmente tediosa o compleja. Como BigQuery trabaja con sentencias SQL no tendrás ningún problema en realizar dichas consultas.

En resumen, BigQuery ofrece:
- Una gran potencia en consultas
- Consultas en SQL (Legacy y Standard)
- Gran warehouse de datos
- Y todo a un bajo coste
   - 0.02$ por GB por mes de almacenamiento (Los 10 primeros GB son gratis al mes)
   - 5$ por TB en consultas (El primer TB del mes siempre es gratis)

## Pub/Sub
Situación: Tienes una aplicación con muchos usuarios, en este caso, cualquier juego multijugador y online sirve de ejemplo: WoW, GW2, HS... y necesitas recopilar información segmentada y reenviarla a sistemas que recopilan esta información y la clasifican para su analisis. (Qué podría ser en BigQuery ;) )

Pub/Sub se explica casi solo ya que tiene la siguiente arquitectura simple:

![Arquitectura de Pub/Sub](https://cloud.google.com/solutions/mobile/images/telemetry-03-pub-sub.png)

Como ves, ofrece una arquitectura sólida, dando la oportunidad a los **publishers** enviar todo el contenido que quieran, mientra que los **subscribers** la reciben con el compromiso de que como mínimo, les llega una vez.

## Dataflow
Situación: Tenemos un flujo constante de información o tenemos datos en un warehouse y queremos tratarlas de la misma manera que un filter, map o reduce se tratara.

Dataflow es la herramienta perfecta. Trabaja con pipelines, es decir, la información entra en un punto y se va tratando a medida que pasa por estos pipelines, step by step, un concepto sencillo con un gran proposito. Pero mejor una imagen que mil palabras, ¿no?.

![Representación de Dataflow](https://media.licdn.com/mpr/mpr/shrinknp_800_800/AAEAAQAAAAAAAAbRAAAAJDFhZGMyZjhmLWZlM2QtNDkzYS04ZGVlLWY0ZGRlOWZkOTVkNA.png)

## Las mezclas son geniales

![Fuuuusión](https://media.giphy.com/media/P4TqKx6NHyLnO/giphy.gif)

Imaginemos que queremos hacer una aplicación para analizar tweets, por lo que tenemos:
- Gran volumen de datos
- Los datos están en constante envío
- Queremos analizar los datos pero para ello antes hay que tratarlos

Con estas tres herramientas tenemos una gran solución:
- BigQuery como data warehouse, en ella podríamos almacenarlos y así poder analizarlos posteriormente.
- Pub/Sub como bastión ante todo el flujo de datos tanto los que queramos analizar ~~como los que no~~.
- Dataflow para tratar los tweets, gestionarlos y almacenar la información tratada en BigQuery.

Quedando:

![Arquitectura final](https://cloud.google.com/blog/big-data/2017/02/images/148649399337217/DataAnalysisPipeline-05.png)

Sé que el post podría ser corto, pero tampoco los quiero aburrir con tanta explicación.

Si tienen alguna duda o necesitan consultar algo sobre estas herramientas u otras de Google Cloud Platform no duden en enviarme un correo: jeseromeroarbelo@gmail.com

¡Un saludo y hasta la próxima!