/* ============================================================
   main.js — Legendary Motorsport
   Maneja: header/footer dinámico, nav activo, scroll effect,
           filtro de catálogo, hamburger menu
   ============================================================ */

// ─── 1. CONSTANTES GLOBALES ───────────────────────────────────

const NAV_LINKS = [
  { href: "Catalogo.html",  label: "Catálogo"  },
  { href: "Mision.html",    label: "Misión"    },
  { href: "Vision.html",    label: "Visión"    },
  { href: "Contacto.html",  label: "Contacto"  },
  { href: "index.html#coleccion", label: "Novedades" },
];

const FOOTER_HTML = `
  <div class="footer-logo">LEGENDARY</div>
  <p>© 2026 LEGENDARY MOTORSPORT — Todos los derechos reservados.</p>
  <div class="footer-badges">
    <a href="https://jigsaw.w3.org/css-validator/check/referer" target="_blank">
      <img src="https://jigsaw.w3.org/css-validator/images/vcss" alt="CSS Válido" style="border:0;width:88px;height:31px"/>
    </a>
    <a href="https://www.w3.org/Icons/valid-html401" target="_blank">
      <img src="https://www.w3.org/Icons/valid-html401" alt="HTML Válido" style="border:0;width:88px;height:31px"/>
    </a>
  </div>
`;


// ─── 2. DETECTAR PÁGINA ACTUAL ────────────────────────────────

/**
 * Devuelve el nombre del archivo actual (ej. "Catalogo.html")
 * para poder marcar el nav-link correcto como activo.
 */
function getCurrentPage() {
  const path = window.location.pathname;
  const file = path.split("/").pop();
  return file === "" ? "index.html" : file;
}


// ─── 3. CONSTRUIR EL HEADER ───────────────────────────────────

function buildHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  const currentPage = getCurrentPage();

  // Construir links del nav, marcando el activo
  const linksHTML = NAV_LINKS.map(({ href, label }) => {
    const isActive = currentPage === href.split("#")[0] ? 'class="nav-link active-page"' : 'class="nav-link"';
    return `<a href="${href}" ${isActive}>${label}</a>`;
  }).join("");

  header.innerHTML = `
    <div class="header-inner">
      <a href="index.html">
        <img id="header-img" src="LM_Icon.png" alt="LMS Logo" onerror="this.style.display='none'"/>
      </a>
      <div class="logo-text">LEGENDARY MOTORSPORT</div>
      <button class="hamburger" id="hamburger" aria-label="Abrir menú">
        <span></span><span></span><span></span>
      </button>
      <nav id="nav-bar">${linksHTML}</nav>
    </div>
  `;

  initHamburger();
  initScrollEffect(header);
}


// ─── 4. CONSTRUIR EL FOOTER ───────────────────────────────────

function buildFooter() {
  const footer = document.querySelector("footer.footer");
  if (!footer) return;
  footer.innerHTML = FOOTER_HTML;
}


// ─── 5. EFECTO SCROLL EN EL HEADER ───────────────────────────

/**
 * Añade clase "scrolled" al header cuando el usuario baja más
 * de 60px. El CSS puede usar esta clase para cambiar estilos.
 */
function initScrollEffect(header) {
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 60);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
}


// ─── 6. MENÚ HAMBURGUESA (MÓVIL) ─────────────────────────────

function initHamburger() {
  const btn  = document.getElementById("hamburger");
  const nav  = document.getElementById("nav-bar");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav-open");
    btn.classList.toggle("is-active", isOpen);
    btn.setAttribute("aria-expanded", isOpen);
  });

  // Cerrar el menú al hacer click en un link
  nav.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav-open");
      btn.classList.remove("is-active");
    });
  });

  // Cerrar al hacer click fuera del menú
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) {
      nav.classList.remove("nav-open");
      btn.classList.remove("is-active");
    }
  });
}


// ─── 7. FILTRO DE CATÁLOGO ────────────────────────────────────

/**
 * Si existe un input#catalogo-search en la página,
 * filtra las .producto-card en tiempo real según el texto.
 */
function initCatalogFilter() {
  const searchInput = document.getElementById("catalogo-search");
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    const cards = document.querySelectorAll(".producto-card");

    let visible = 0;
    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      const match = text.includes(query);
      card.style.display = match ? "" : "none";
      if (match) visible++;
    });

    // Mostrar mensaje si no hay resultados
    let noResults = document.getElementById("no-results");
    if (!noResults) {
      noResults = document.createElement("p");
      noResults.id = "no-results";
      noResults.style.cssText = "color:var(--gold);text-align:center;width:100%;padding:2rem;letter-spacing:0.1em;";
      noResults.textContent = "No se encontraron vehículos.";
      document.querySelector(".productos")?.appendChild(noResults);
    }
    noResults.style.display = visible === 0 ? "block" : "none";
  });
}


// ─── 8. CONTADOR ANIMADO DE ESTADÍSTICAS ─────────────────────

/**
 * Anima números desde 0 hasta su valor final.
 * Aplica a cualquier elemento con el atributo data-count="número".
 * Ejemplo: <span data-count="150">0</span>
 */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      const duration = 1500;
      const startTime = performance.now();

      const tick = (now) => {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.unobserve(el); // Solo animar una vez
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}


// ─── 9. HIGHLIGHT DEL AÑO EN EL FOOTER ───────────────────────

/**
 * Actualiza el año en el footer automáticamente.
 * Busca el elemento con id="footer-year" si existe.
 */
function updateYear() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}


// ─── 10. INICIALIZACIÓN ───────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  buildHeader();
  buildFooter();
  initCatalogFilter();
  initCounters();
  updateYear();
});