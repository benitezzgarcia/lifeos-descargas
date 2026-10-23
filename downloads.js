(() => {
  'use strict';
  const status = document.querySelector('#transfer-status');
  const downloads = [
    ['download-android', 'LifeOS-android-debug.apk'],
    ['download-windows', 'LifeOS-Windows-Prueba.zip']
  ];
  for (const [id] of downloads) document.getElementById(id).addEventListener('click', event => {
    if (event.currentTarget.getAttribute('aria-disabled') === 'true') event.preventDefault();
  });
  async function check() {
    try {
      const response = await fetch('https://api.github.com/repos/benitezzgarcia/lifeos-descargas/releases/tags/v1.5.0', {credentials: 'omit', signal: AbortSignal.timeout(15000)});
      if (!response.ok) throw new Error('No disponible');
      const release = await response.json();
      let ready = 0;
      for (const [id, name] of downloads) {
        const asset = release.assets?.find(file => file.name === name && file.state === 'uploaded' && file.size > 0);
        if (!asset) continue;
        const button = document.getElementById(id);
        button.removeAttribute('aria-disabled');
        ready++;
      }
      status.textContent = ready === 2 ? 'Las dos descargas están disponibles.' : 'Preparando los archivos. Los botones se activarán cuando cada descarga esté lista.';
      if (ready < 2) setTimeout(check, 60000);
    } catch {
      status.textContent = 'No se han podido comprobar las descargas. Reintentaremos en un minuto. También puedes consultar los archivos de la versión en GitHub.';
      setTimeout(check, 60000);
    }
  }
  check();
})();

