// components.js

function renderHeader(paginaActiva, isAuth = false) {
  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/catalogo/', label: 'Catálogo' },
    { href: '/mision/', label: 'Misión' },
    { href: '/vision/', label: 'Visión' },
    { href: '/contacto/', label: 'Contacto' }
  ];

  let navLinks = links.map(link => {
    const activo = link.href === paginaActiva ? 'active-link' : '';
    return `<a href="${link.href}" class="nav-link ${activo}">${link.label}</a>`;
  }).join('');

  if (isAuth) {
    navLinks += `<a href="#" onclick="logoutUser(event)" class="nav-link" style="color:#d4af37;">Cerrar Sesión</a>`;
  } else {
    navLinks += `<a href="/login/" class="nav-link" style="color:#d4af37;">Iniciar Sesión</a>`;
  }

  document.getElementById('header').innerHTML = `
    <div class="header-inner">
      <div class="logo-text">LEGENDARY MOTORSPORT</div>
      <nav id="nav-bar">${navLinks}</nav>
    </div>
  `;
}

function logoutUser(e) {
  e.preventDefault();
  fetch('/api/logout/', { method: 'POST' })
    .then(() => window.location.href = '/');
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