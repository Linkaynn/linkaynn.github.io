---
title: Cómo crear tu propia presentación en Github Pages
date: 2017-08-29 11:00:00
tags: ["github", "presentacion", "github_pages", "blog", "beginners", "wordpress"]
---

*¡Buenas tardes a todos y todas!*<br><br> Espero que estén pasando una buena semana. ¡Ánimo! que ya queda menos para el deseado **fin de semana**.

Hoy en día es muy común ~~necesitar~~ querer tener una página de presentación propia, para ello a veces recurrimos a [Wordpress](https://es.wordpress.com) u otros gestores de contenidos similares pero en este post les enseñaré a aquellos que no requieran una presentación compleja cómo hacerlo.

*Jesé, por favor, define complejo...*

En este [link](http://kimoxstudio.github.io) tienes un ejemplo de presentación como el que describo.

Trabajaremos con [Github](http://www.github.com). Lo explicaré de una manera breve y sencilla para aquellos que no estén familiarizados con repositorios. *Github* se podría definir como un lugar en el que los archivos se versionan, es decir, cada vez que se **añada, modifique o se elimine** algo, Github te dirá **qué archivo, qué cambios hubieron y en qué momento**.

¡Vamos al ajo!
<!-- more -->

## Requisitos

Es necesario:

1. Una cuenta en [Github](http://www.github.com/join/). El proceso de registro es realmente sencillo.
2. Un editor de texto sencillo (**NO** Word ni Libreoffice).
   P.e: [SublimeText](https://www.sublimetext.com/) e incluso el propio editor de texto de Windows o Linux sirve.

## Comencemos

Una vez creada la cuenta hacemos log in. Si es que el registro no nos lo hace de forma automática (*Que creo que sí lo hace*).
Lo primero que necesitamos es crear un [repositorio](https://es.wikipedia.org/wiki/Repositorio) en Github, voy a explicar esta parte.

#### Creando un repositorio en Github

Haciendo click en el "**+**" que tenemos en la esquina superior derecha nos desplegará un menú, tras esto, clicamos en la opción "*New repository*"

{% asset_img creating_repository.png Creando un repositorio en Github %}

Podemos darle el nombre que queramos, **pero** recomiendo darle el nombre con el siguiente formato: *nombre*.github.io

***¿Qué pongo de nombre?***

Pues algo significativo si es un producto, o si es personal, darle el **nombre de usuario** con el que nos hayamos creado la cuenta, en mi caso, mi nombre de usuario en Github es [Linkaynn](https://github.com/Linkaynn), quedando así: *linkaynn.github.io*. **Recomiendo** que si es una página personal, se use el nombre de usuario.

Seleccionamos la opción de inicializar con un Readme y por último creamos el repositorio.

***Nota: En mi caso da fallo porque ya existe, no te preocupes***

{% asset_img creating_repository_2.png Creando un repositorio en Github %}

#### Añadiendo contenido a nuestra presentación

Ahora se nos abrirá una página para añadir contenido al Readme, si no es así, hacemos clic en el archivo *Readme.md* y tras esto hacemos clic en el lápiz que nos aparecerá a continuación.

{% asset_img creating_repository_3.png Modificando el Readme %}

Ahora, *¿Cómo introducimos el contenido que nosotros queremos?*. Pues bien, usaremos notación markdown, es muy muy sencilla. Recomiendo mirar [este link](https://github.com/ricval/Documentacion/tree/master/Markdown) **muy** por encima para aprender un poco. No lo mires en profundidad ni lo estudies, es solo para ver el concepto ya que poco a poco nos iremos acostumbrando.

Es hora de escribir nuestra presentación, para ello utilizaremos un compilador de markdown online como podría ser el de [jbt](https://github.com/jbt): [markdown-editor](https://jbt.github.io/markdown-editor/)

![Un tiempo más tarde...](https://media.giphy.com/media/3LV06sPEp0I8g/giphy.gif)

¿Abemus presentación?

Ahora copiamos y pegamos en la página donde modificamos el *Readme* y al final de la página hacemos clic en "*Commit changes*" ;)

Una vez *comiteado* la presentación vamos al apartado de "*Settings*" y hacemos scroll hasta la zona de *Github Pages*. Es probable que nos aparezca como en la siguiente imagen, sino, ve al apartado de [Eligiendo tema](#Eligiendo-tema).

{% asset_img github_pages_not_published.png Página no publicada %}

En este caso desplegamos la lista de sources y elegimos *master* una vez hecho nos tiene que quedar así:

{% asset_img github_pages_published.png Página publicada %}

#### Eligiendo tema

En el apartado de *Github Pages* del que hablamos en el apartado anterior, hacemos clic en "*Choose a theme*" y escogemos el tema que más nos guste.

Una vez elegido nos vamos al apartado "*Code*" y una vez allí veremos un fichero nuevo llamado: ***_config.yml***.

Hacemos clic y seguidamente hacemos otro clic en el lápiz para editarlo.

Veremos lo siguiente:

{% codeblock %}
theme: *nombredeltemaescogido*
{% endcodeblock %}

Añadimos el título de nuestra página:

{% codeblock %}
theme: *nombredeltemaescogido*
title: Así soy yo
{% endcodeblock %}

Una vez hecho esto debemos asegurarnos que está publicada nuestra web por lo que vamos vamos a "*Code*" nuevamente y hacemos clic en el enlace que dice "*X commits*". 
X es la cantidad de commits que tiene nuestro repositorio por lo que debería tener un 2, no debemos preocuparnos si dice más, si dice menos es que nos hemos saltado algún paso.

En el último commit nos tiene que salir un tick a la derecha, si es así fue todo bien, sino, es que ha ocurrido algún error. Recomiendo revisar lo que hayamos escrito por si hemos cometido algún error de sintaxis y si no es así, rehacer el paso de [Eligiendo tema](#Eligiendo-tema) y comitear nuevamente.

{% asset_img commits.png Los commits hechos sobre el repositorio %}

Una vez terminado este paso tan solo debemos ir nuevamente al apartado de *Github pages* y allí aparecerá nuestra URL.

***¡Listo!***

Si tienes alguna duda siempre puedes escribirme a jeseromeroarbelo@gmail.com, será un placer ayudarte :)

¡Hasta pronto!

![¡Hasta luego!](https://media.giphy.com/media/h4kRsEO8N63PW/giphy.gif)