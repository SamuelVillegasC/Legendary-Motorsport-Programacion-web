// components.js

function renderHeader(paginaActiva) {
  const links = [
    { href: 'index.html',    label: 'Inicio' },
    { href: 'Catalogo.html', label: 'Catálogo' },
    { href: 'Mision.html',   label: 'Misión' },
    { href: 'Vision.html',   label: 'Visión' },
    { href: 'Contacto.html', label: 'Contacto' }
  ];

  const navLinks = links.map(link => {
    const activo = link.href === paginaActiva ? 'active-link' : '';
    return `<a href="${link.href}" class="nav-link ${activo}">${link.label}</a>`;
  }).join('');

  document.getElementById('header').innerHTML = `
    <div class="header-inner">
      <div class="logo-text">LEGENDARY MOTORSPORT</div>
      <nav id="nav-bar">${navLinks}</nav>
    </div>
  `;
}

function renderFooter() {
  document.getElementById('footer').innerHTML = `
    <div class="footer-logo">LEGENDARY</div>
    <p>&copy; 2026 LEGENDARY MOTORSPORT &mdash; Todos los derechos reservados.</p>

      <p>
    <div class="productos">
    <a href="https://jigsaw.w3.org/css-validator/check/referer">
        <img style="border:0;width:88px;height:31px"
            src="https://jigsaw.w3.org/css-validator/images/vcss"
            alt="¡CSS Válido!" />
    </a>
    <p>
    <a href="https://www.w3.org/Icons/valid-html401">
        <img style="border:0;width:88px;height:31px"
            src="https://www.w3.org/Icons/valid-html401"
            alt="¡HTML Válido!" />
    </a>
    </p>
  </div>

  `;
}