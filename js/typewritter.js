window.onload = function () {
  const subtitle = document.getElementById('welcome-subtitle');

  if (subtitle) {
    const typewriter = new Typewriter(subtitle, {
      loop: true
    });

    typewriter
      .typeString('Developing web')
      .pauseFor(2500)
      .deleteChars(3)
      .typeString('mobile')
      .pauseFor(2500)
      .deleteChars(6)
      .typeString('<strong>ideas!</strong>')
      .pauseFor(10000)
      .start();
  }
};
