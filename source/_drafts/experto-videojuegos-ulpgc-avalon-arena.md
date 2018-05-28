title: 'Postgrado en Diseño y Programación de Videojuegos de ULPGC: Avalon Arena'
author: Jesé Romero
date: 2018-05-27 23:56:53
tags:
---
Como algunos saben llevo desde Octubre cursando el [Postgrado en Diseño Y Programación de Videojuegos de la ULPGC](http://serdis.dis.ulpgc.es/~atrujillo/Experto_Videojuegos/web2017/) y ya que por falta de tiempo no he podido hacer un seguimiento de lo que he hecho, voy a explicar qué me ha parecido y qué he hecho.

#### Mi experiencia

Empecé un mes más tarde, a finales de Octubre, me había perdido algunas clases teóricas, y la verdad, el resto de ellas, fueron muy interesantes, aprendí conceptos como: Propósito dual, Recompensas y castigos tanto positivos como negativos. Me han hecho interesarme más en la psicología del jugador y entrar en reddit a leer sobre ello.

<!-- more -->

Sobre las clases prácticas, empezamos con scripting básico: Movimiento de objetos, tratamiento de componentes, animaciones en 2D. Me fue de muchísima utilidad para recordar todo lo que utilicé para hacer mi primero juego en 2015 con Unity 4.6. Esta parte de las cases las impartió Lucas Roig ( [{% fa_inline linkedin-in fab %}](https://es.linkedin.com/in/lucas-roig-p%C3%A9rez-0b9763b9) ), todo un profesional.

Donde más aprendí scripting fue con Aitor Lozano ( [{% fa_inline user far %}](https://aitorlozano.com/) | [{% fa_inline linkedin-in fab %}](https://es.linkedin.com/in/aitorlozano) ) ya que el nivel de programación aumentaba con cada clase: 

- Event Systems
- State Machine
- Herencia y el patrón Observer en C#
- Subrutinas
- Animation Events

Entre otras cosas. Sin duda fue donde más aprendí y avancé.

### Avalon Arena

Este es el título que recibió el juego del proyecto final del posgrado (Aunque no fue el primero: Brawler Next), nuestra idea deste un comienzo fue: *Como el Smash Bros pero en 3D*. Una frase sencilla pero con un objetivo claro.

![Foto del cartel](Link)

El juego avanzó lento, por mi parte sin ninguna duda, tuve un viaje y no pude trabajarlo tanto como quise, pero el resultado final no me desagrada. Tengo que agradecer a todos los profesores el apoyo que dieron al proyecto hasta el final, y en especial a nuestro tutor de proyecto Antonio Sanchez ( [{% fa_inline linkedin-in fab %}](https://es.linkedin.com/in/antoniojose/es) ) por todas las sugerencias y la guía hasta el final.

Hablaré de los problemas que tuve por la parte de scripting:

- Fisicas de Unity 3D {% fa_inline frown far %}
- Diferencias entre controladores (Xbox, Keyboard)
- Diferencias entre jugadores (P1 y P2)
- Tranferencia de estados entre scripts
- Gestión de estados dependientes de animación

#### Física de Unity 3D

Lo resumo en una frase: Vaya ~~m**~~ de gestión de física que tiene Unity.

A ver, tal vez he exagerado un poco, pero la verdad es que me dió más problemas que soluciones. La forma en la que Unity gestiona la física es poco realista, y un problema que nos enfrentamos todos al principio es que la caída  tras un salto no parece propia de un objeto con 70 unidades de masa. Con una búsqueda sencilla se pueden dar cuenta ([Realistic Jump Unity](https://www.google.es/search?q=realistic+jump+unity&oq=jump+realistic+&aqs=chrome.3.69i57j0l5.4281j0j4&sourceid=chrome&ie=UTF-8)).

{% fa_css %}