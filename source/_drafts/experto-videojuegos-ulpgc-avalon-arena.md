title: 'Postgrado en Diseño y Programación de Videojuegos de ULPGC: Avalon Arena'
author: Jesé Romero
tags: []
categories: []
date: 2018-05-27 23:56:00
---
Como algunos saben llevo desde Octubre cursando el [Postgrado en Diseño Y Programación de Videojuegos de la ULPGC](http://serdis.dis.ulpgc.es/~atrujillo/Experto_Videojuegos/web2017/) y ya que por falta de tiempo no he podido hacer un seguimiento de lo que he hecho, voy a explicar qué me ha parecido y qué he hecho.

#### Mi experiencia

Empecé un mes más tarde, a finales de Octubre, me había perdido algunas clases teóricas, y la verdad, el resto de ellas, fueron muy interesantes, aprendí conceptos como: Propósito dual, Recompensas y castigos tanto positivos como negativos. Me han hecho interesarme más en la psicología del jugador y entrar en reddit a leer sobre ello.

Decir que este post estará dirigido a mis clases prácticas y no a las teóricas, intentaré dejar el nombre de todos los profesores y sus enlaces al final del post.

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

![Poster del juego](/images/pasted-0.png)

Este es el título que recibió el juego del proyecto final del posgrado (Aunque no fue el primero: Brawler Next), nuestra idea deste un comienzo fue: *Como el Smash Bros pero en 3D*. Una frase sencilla pero con un objetivo claro.

El juego avanzó lento, por mi parte sin ninguna duda, tuve un viaje y no pude trabajarlo tanto como quise, pero el resultado final no me desagrada. Tengo que agradecer a todos los profesores el apoyo que dieron al proyecto hasta el final, y en especial a nuestro tutor de proyecto Antonio Sanchez ( [{% fa_inline linkedin-in fab %}](https://es.linkedin.com/in/antoniojose/es) ) por todas las sugerencias y la guía hasta el final.

Hablaré de los problemas que tuve por la parte de scripting:

- Fisicas de Unity 3D {% fa_inline frown far %}
- Diferencias entre controladores (Xbox, Keyboard) y entre jugadores (P1 y P2)
- Tranferencia de estados entre scripts
- Gestión de estados dependientes de animación

#### Física de Unity 3D

Lo resumo en una frase: Vaya ~~m**~~ de gestión de física que tiene Unity.

A ver, tal vez he exagerado un poco, pero la verdad es que me dió más problemas que soluciones. La forma en la que Unity gestiona la física es poco realista, y un problema que nos enfrentamos todos al principio es que la caída  tras un salto no parece propia de un objeto con 70 unidades de masa. Con una búsqueda sencilla se pueden dar cuenta ([Realistic Jump Unity](https://www.google.es/search?q=realistic+jump+unity&oq=jump+realistic+&aqs=chrome.3.69i57j0l5.4281j0j4&sourceid=chrome&ie=UTF-8)).

#### Diferencias entre controladores

Uno de mis primeros problemas a la hora de plantear la arquitectura de control fue la diferencia de controladores y de jugadores y mi pregunta fue la siguiente: *¿Cómo mantener una estructura que sostenga varios jugadores y que a la vez sea flexible entre personajes?*

En Unity una de las maneras de las que se puede obtener el estado de un botón o de un axis es a través del nombre que recibe en input en el *Input Asset*, p.e: Si quisiera obtener el botón de salto del jugador 2 en un mando de la XBox, yo escogería el nombre de P2XboxJump. 

Mi idea, que ni por asomo es la mejor fue la siguiente: 

**Player** + **Controller** + **Action** + **"Button"** = **Nombre del input**

Por lo cual trabajé con enumerados: Player, Controller, Action respectivamente.

*Ce fini*

#### Transferencias de estados entre scripts

¿Saben cuando ven un *main.js* con 6000 líneas? Bueno pues mi script que controla todos los estados posibles de mi personaje estaba así ~~y tampoco ha cambiado mucho~~. Pero tras varios intentos de partición pude dividir lo que era el estado de las acciones del personaje a la interacción con su entorno.

Dos scripts que comparten estado: *PlayerManager.cs* y *CollisionManager.cs*

###### ¿Qué estados?

- Última acción realizada
- El objeto del contrincante
- El personaje que es (Yakab)
- Si el otro contrincante era invulnerable o no

Todos estos datos se actualizan constantemente en cada frame, para mantener coherencia entre scripts.

#### Gestión de estados dependientes de animación

Aún no lo he explicado, pero cada acción (Golpe ligero, golpe fuerte, salto, defensa, dash...) tiene su limitación en cuanto qué puede hacer después y cuantos frames de "penalización" tiene para poder realizar una accion no encadenante.

Por ejemplo: El golpe ligero puede encadenarse hasta tres veces, si en algún punto intermedio tan solo se realizan dos golpes, el personaje tendrá 10 frames en los que estará bloqueado sin poder realizar ninguna acción. También hay una penalización de frames en el golpe fuerte y en la finalización de los tres golpes ligeros (esta vez menor)

Y no solo eso, si estoy realizando alguna acción bloqueante como es golpear, dashear o realizar el golpe aéreo, no puedo hacer absolutamente nada más hasta que termine la animación.

Todo esto lo controlo con dos diccionarios del tipo *< Action, boolean >* uno para saber qué acciones son posibles (*Flags*) y otro para saber qué acciones está realizando el personaje (*CurrentlyDoing*).

Pero claro, todo depende de las animaciones, cuando empieza y cuando acaba. Estos estados son *toggleados* por los [AnimationEvents](https://docs.unity3d.com/Manual/animeditor-AnimationEvents.html) una maravilla que me ha salvado de estar controlando cuando la animación empieza y acaba.

Hay que intentar no abusar de ellos ya que externalizan la lógica de tu juego sin ningún beneficio a excepción del de no tener en cuenta la animación en sí para saber su estado.

### Conclusión

A lo largo del desarrollo he **Avalon Arena** he tenido muchos percances pero estos han sido los más dolorosos. Tengo que agradecer a mis compañeros artistas y músico todo el esfuerzo que le han dado al proyecto porque han hecho un trabajo estupendísimo:

- Antonio Sánchez León ( [{% fa_inline instagram fab %}](https://www.instagram.com/anto.sanchezleon/?hl=es) | [{% fa_inline linkedin-in fab %}](https://www.linkedin.com/in/antonio-s%C3%A1nchez-le%C3%B3n-33403311a/) )
- Alberto Suárez Llobet ( [{% fa_inline instagram fab %}](https://www.instagram.com/albertosuarezstinson/?hl=es) | [{% fa_inline linkedin-in fab %}](https://www.linkedin.com/in/alberto-su%C3%A1rez-llobet-4b261a129/) )
- Alejandro Almeida Morera
- Raimund Seitz

Ah, y si vas a realizar el experto, te recomiendo que hagas un juego 2D, no hace falta que sea 3D para que sea un gran juego.

Dejo los links a nuestro proyecto y a los otros en [itch.io](https://itch.io/):

- [Kioni](https://elcaminodekioni.itch.io/kioniproject)
- [Split Mind](https://splitmindteam.itch.io/split-mind)
- [Avalon Arena](https://linkaynn.itch.io/avalon-arena)

#### Más información
##### Profesores y profesoras

###### Director
- Agustín Trujillo ( [{% fa_inline linkedin-in fab %}](https://www.linkedin.com/in/agustintrujillo/) )

###### Arte
- Brendan McCaffrey ( [{% fa_inline linkedin-in fab %}](https://www.linkedin.com/in/brendan-mccaffrey-28723/) )
- Herbie Cans ( [{% fa_inline linkedin-in fab %}](https://www.linkedin.com/in/herbiecans/) )

###### Programación
- Luis Antón ( [{% fa_inline linkedin-in fab %}](https://www.linkedin.com/in/luisantoncanalis/) )
- Aitor Lozano ( [{% fa_inline linkedin-in fab %}](https://www.linkedin.com/in/aitorlozano/) )
- Lucas Roig ( [{% fa_inline linkedin-in fab %}](https://www.linkedin.com/in/lucas-roig-p%C3%A9rez-0b9763b9/) )
- Antonio Sánchez López ( [{% fa_inline linkedin-in fab %}](https://www.linkedin.com/in/antoniojose/) )
- Nelson Monzón ( [{% fa_inline linkedin-in fab %}](https://www.linkedin.com/in/nelsonmonzonlopez/) )

###### Música
- Andrés Ravelo ( [{% fa_inline twitter fab %}](https://twitter.com/ravelicomposer) )

Si falta alguna persona por nombrar o tienes alguna duda, házmelo saber a [@jeseromero](https://twitter.com/JeseRomero).

¡Un saludo!

{% fa_css %}