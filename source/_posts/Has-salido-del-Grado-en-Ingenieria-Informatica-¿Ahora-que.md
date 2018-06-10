title: 'Has salido del Grado en Ingeniería Informática: ¿Ahora qué?'
author: Jesé Romero
tags:
  - develop
  - ulpgc
  - informática
  - desarrollo
categories:
  - personal
sitemap: false
date: 2018-06-11 09:00:00
---
Recuerdo cuando salí del Grado en 2016, sentía que no sabía nada, o mejor dicho, sabía un poco de todo y mucho de nada.

Conocía: Java y MySQL por la carrera y HTML, CSS, Javascript y PHP por proyectos personales que empecé con un gran amigo y compañero Adrián Mujica ( [{% fa_inline linkedin-in fab %}](https://www.linkedin.com/in/adri%C3%A1n-mujica-gonz%C3%A1lez-a136815b/) | [{% fa_inline github fab %}](https://github.com/adrianmujica) ).

Sinceramente, me hallaba perdido, no sabía como una empresa se iba a interesar por mi perfil, no me sentía preparado. Pero spoiler: **El salto no fue para tanto**.

{% fa_css %}

<!-- more -->

No voy a contar mi vida laboral de estos dos años pero tan solo escribo este post para animarles y decirles que saben más de lo que creen. Toda esa algoritmia, destreza e intuición les va a solucionar muchísimo.

Y como este post no quiero que acabe aquí les voy a contar un poco sobre cosas que me han cambiado mi forma de desarrollar.

#### La programación funcional no es el demonio

Cuando sales de la carrera, si no lo has trabajado por tu cuenta, esto de la *programación funcional* no te termina de cuadrar.

Pues sinceramente, en algún punto de tu carrera profesional deberás trabajar con algún lenguaje que te permita trabajar funcionalmente por lo que te recomiendo que intentes hacer alguna [*kata*](http://www.shorturl.at/fCOQR) enfocada a ello o si en caso de que conozcas lo que es la programación funciona, que intentes hacer una que conozcas pero funcionalmente ;)

Eso sí: tal vez te explote un poco **la cabeza...**

![Blow mind](https://media.giphy.com/media/xT0BKCxTX64gcYNuwg/giphy.gif)

#### Hacer testing sobre lo que desarrollas tampoco es el demonio

Hay muchas deficiencias en lo que te enseñan en la carrera, y una de ellas es el poco enfoque de testing que se tiene. Recuerdo allá en 2013, en la asignatura de Programación I que te enseñan lo que es debugear (hablo después de esto) y algo de JUnit. No está mal que lo hayan tocado, en otras universidades ni te hablan de esto, pero tal vez se debería profundizar un poco.

A la hora de hacer katas, es obligatorio tener una batería de pruebas para testear todos los posibles casos de esta, si no sabes de lo que hablo te recomiendo que empiezes por conocer esta maravillosa plataforma: [CodeWars](https://www.codewars.com/)

Y te animo a que conozcas también un poco de lo que es integración contínua, aunque tan sólo sea el término: [Continuous Integration](https://en.wikipedia.org/wiki/Continuous_integration)

#### Si no sabes cómo debugear, experimenta y domínalo

En muchas ocasiones nos enfrentamos a problemas que no se ven a simple vista, una traza que no entendemos y lo primero que hacemos cuando no sabemos cómo debugear es escribir cosas del estilo:

```
let a = someData();
console.log(a) // I need to see what's going on
someFunction();
console.log(a) // I need to see what change
```

Y cuando escribo *console.log(...)* me refiero tambien a *System.out.println(...)* o cualquier otra función que imprima de cualquier lenguaje.

Te propongo lo siguiente, escribe y pega el siguiente código en un fichero que se llame **_index.html_**

```
<!DOCTYPE html>
<html>
    <head>
        <script>
            var sum2To = function (b) {
                return 2 + b;
            }
    
            for (var index = 0; index < 10; index++) {
                sum2To(index);
            }
        </script>
    </head>
    <body>
    Aprieta F12<br>o<br>Haz click derecho aquí e Inspeccionar elemento
    </body>
</html>
```

**IMPORTANTE**: Recomiendo usar Google Chrome por si varian los pasos:

Ahora ábrelo con Google Chrome y aprieta F12, haz click en la pestaña de *Sources* y selecciona la línea 10 para añadir un breakpoint, te debería quedar así:

![Primer paso](/images/pasted-1.png)

Recarga la página y el breakpoint se activará.

Ya el trabajo duro está hecho, comienza a practicar visualizando como se van sumando los elementos, añadiendo watches, viendo el call stack y lo que te pueda proporcionar el navegador.

Recuerda que todo lo que estás haciendo con el navegador, lo puedes hacer en todos los lenguaje y en el 99,99% de los entornos.

#### Y más

Podría continuar con muchos otras cosas que me han ayudado en estos dos años, pero no quiero dejar la entrada muy larga.

Tengo en mente hacer otra hablando sobre las tecnologías con las que trabajo actualmente, estense atentos {% fa_inline smile fas %}.

¡Saludos! 

Me puedes contactar en: [{% fa_inline envelope fas %}](mailto:jeseromeroarbelo@gmail.com) | [{% fa_inline twitter fab %}](https://twitter.com/JeseRomero) | [{% fa_inline linkedin-in fab %}](https://www.linkedin.com/in/jese-romero/) | [{% fa_inline github fab %}](https://github.com/Linkaynn)


{% fa_css %}