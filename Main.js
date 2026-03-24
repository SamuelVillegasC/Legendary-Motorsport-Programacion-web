/* ============================================================
   main.js — Legendary Motorsport
   ============================================================ */
"use strict";

// ─────────────────────────────────────────────
// 1. localStorage
// ─────────────────────────────────────────────

const DB_KEY = "lm_vehiculos";

const VEHICULOS_DEFAULT = [
  {
    id: 1,
    nombre: "Pegassi Zentorno",
    marca: "Pegassi",
    precio: 725000,
    etiqueta: "bestseller",
    descripcion: "Superdeportivo de inspiración italiana con motor V8 central y diseño aerodinámico agresivo. Uno de los más rápidos de Los Santos.",
    imagen: "https://static.wikia.nocookie.net/gtawiki/images/0/0a/Zentorno-GTAV-front.png"
  },
  {
    id: 2,
    nombre: "Progen T20",
    marca: "Progen",
    precio: 2200000,
    etiqueta: "exclusivo",
    descripcion: "Hipercoche de producción limitada con sistema de propulsión híbrido. Inspirado en lo mejor de la ingeniería británica.",
    imagen: "https://static.wikia.nocookie.net/gtawiki/images/e/e8/T20-GTAV-front.png"
  },
  {
    id: 3,
    nombre: "Överflöd Krieger",
    marca: "Överflöd",
    precio: 2875000,
    etiqueta: "exclusivo",
    descripcion: "El superdeportivo más exclusivo del catálogo. Diseño vanguardista sueco con motor de altísimo rendimiento.",
    imagen: "https://static.wikia.nocookie.net/gtawiki/images/3/35/Krieger-GTAO-front.png"
  },
  {
    id: 4,
    nombre: "Grotti Turismo R",
    marca: "Grotti",
    precio: 500000,
    etiqueta: "recien-llegado",
    descripcion: "Elegante GT italiano con líneas de competición y un motor trasero que entrega una experiencia de conducción excepcional.",
    imagen: "https://static.wikia.nocookie.net/gtawiki/images/5/5b/TurismoR-GTAV-front.png"
  },
  {
    id: 5,
    nombre: "Dewbauchee Vagner",
    marca: "Dewbauchee",
    precio: 1535000,
    etiqueta: "bestseller",
    descripcion: "Hipercoche británico de tracción total con diseño de fibra de carbono y motor central de 800 CV.",
    imagen: "https://static.wikia.nocookie.net/gtawiki/images/0/01/Vagner-GTAO-front.png"
  },
  {
    id: 6,
    nombre: "Progen Itali GTB",
    marca: "Progen",
    precio: 1189000,
    etiqueta: "",
    descripcion: "Superdeportivo de tracción trasera con aerodinámica activa y motor biturbo de alta respuesta.",
    imagen: "https://static.wikia.nocookie.net/gtawiki/images/2/28/ItaliGTB-GTAO-front.png"
  },
  {
    id: 7,
    nombre: "Bravado Banshee 900R",
    marca: "Bravado",
    precio: 565000,
    etiqueta: "recien-llegado",
    descripcion: "Muscle car americano llevado al extremo. Potencia bruta y diseño clásico modernizado para las calles de Los Santos.",
    imagen: "https://static.wikia.nocookie.net/gtawiki/images/a/ae/Banshee900R-GTAO-front.png"
  }
];

function getVehiculos() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    localStorage.setItem(DB_KEY, JSON.stringify(VEHICULOS_DEFAULT));
    return [...VEHICULOS_DEFAULT];
  }
  return JSON.parse(raw);
}

function saveVehiculos(lista) {
  localStorage.setItem(DB_KEY, JSON.stringify(lista));
}

function nextId(lista) {
  return lista.length > 0 ? Math.max(...lista.map(v => v.id)) + 1 : 1;
}

// Resetea a los datos por defecto (útil para desarrollo)
window.resetCatalog = () => { localStorage.removeItem(DB_KEY); location.reload(); };


// ─────────────────────────────────────────────
// 2. NAVEGACIÓN
// ─────────────────────────────────────────────

const NAV_LINKS = [
  { href: "index.html",    label: "Inicio"   },
  { href: "Catalogo.html", label: "Catálogo" },
  { href: "Mision.html",   label: "Misión"   },
  { href: "Vision.html",   label: "Visión"   },
  { href: "Contacto.html", label: "Contacto" },
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

function getCurrentPage() {
  const file = window.location.pathname.split("/").pop();
  return file === "" ? "index.html" : file;
}

function buildHeader() {
  const header = document.getElementById("header");
  if (!header) return;
  const current = getCurrentPage();
  const linksHTML = NAV_LINKS.map(({ href, label }) => {
    const active = current === href ? " active-page" : "";
    return `<a href="${href}" class="nav-link${active}">${label}</a>`;
  }).join("");

  header.innerHTML = `
    <div class="header-inner">
      <a href="index.html" style="line-height:0">
        <img id="header-img" src="LM_Icon.png" alt="LMS Logo" onerror="this.style.display='none'"/>
      </a>
      <div class="logo-text">LEGENDARY MOTORSPORT</div>
      <button class="hamburger" id="hamburger" aria-label="Abrir menú" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <nav id="nav-bar">${linksHTML}</nav>
    </div>`;

  initHamburger();
  initScrollEffect(header);
}

function buildFooter() {
  const f = document.querySelector("footer.footer");
  if (f) f.innerHTML = FOOTER_HTML;
}

function initScrollEffect(header) {
  window.addEventListener("scroll", () =>
    header.classList.toggle("scrolled", window.scrollY > 60), { passive: true });
}

function initHamburger() {
  const btn = document.getElementById("hamburger");
  const nav = document.getElementById("nav-bar");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("nav-open");
    btn.classList.toggle("is-active", open);
    btn.setAttribute("aria-expanded", open);
  });
  nav.querySelectorAll(".nav-link").forEach(l =>
    l.addEventListener("click", () => {
      nav.classList.remove("nav-open");
      btn.classList.remove("is-active");
    }));
  document.addEventListener("click", e => {
    const h = document.getElementById("header");
    if (h && !h.contains(e.target)) {
      nav.classList.remove("nav-open");
      btn.classList.remove("is-active");
    }
  });
}


// ─────────────────────────────────────────────
// 3. CATÁLOGO — RENDER + FILTROS
// ─────────────────────────────────────────────

function formatPrecio(n) {
  return "$" + Number(n).toLocaleString("en-US");
}

// Solo 3 etiquetas permitidas
const BADGE_CONFIG = {
  "bestseller":   { label: "Bestseller",     cls: "badge--dark"  },
  "exclusivo":    { label: "Exclusivo",       cls: "badge--gold"  },
  "recien-llegado":{ label: "Recién Llegado", cls: "badge--dark"  },
};

function getBadgeHTML(etiqueta) {
  const cfg = BADGE_CONFIG[etiqueta];
  if (!cfg) return "";
  return `<span class="v-badge ${cfg.cls}">${cfg.label}</span>`;
}

function renderCatalog(lista) {
  const container = document.getElementById("catalogo-grid");
  if (!container) return;

  if (lista.length === 0) {
    container.innerHTML = `<p class="no-results">No se encontraron vehículos con esos filtros.</p>`;
    return;
  }

  container.innerHTML = lista.map(v => {
    const isExclusivo = v.etiqueta === "exclusivo";
    return `
    <div class="v-card${isExclusivo ? " v-card--featured" : ""}">
      <div class="v-card__img">
        <img src="${v.imagen}" alt="${v.nombre}"
             onerror="this.src='https://placehold.co/480x300/e8e4de/b8935a?text=${encodeURIComponent(v.nombre)}'"/>
        ${getBadgeHTML(v.etiqueta)}
      </div>
      <div class="v-card__body">
        <span class="v-card__marca">${v.marca.toUpperCase()}</span>
        <h3 class="v-card__nombre">${v.nombre}</h3>
        <p class="v-card__desc">${v.descripcion}</p>
        <div class="v-card__footer">
          <span class="v-card__precio">${formatPrecio(v.precio)}</span>
          <button class="v-card__btn">Adquirir</button>
        </div>
      </div>
    </div>`;
  }).join("");
}

function initCatalogFilters() {
  if (!document.getElementById("catalogo-grid")) return;

  const searchInput  = document.getElementById("catalogo-search");
  const marcaSelect  = document.getElementById("filtro-marca");
  const precioSelect = document.getElementById("filtro-precio");

  if (marcaSelect) {
    const marcas = [...new Set(getVehiculos().map(v => v.marca))].sort();
    marcas.forEach(m => {
      const o = document.createElement("option");
      o.value = m; o.textContent = m;
      marcaSelect.appendChild(o);
    });
  }

  function applyFilters() {
    let lista = getVehiculos();
    const q     = searchInput  ? searchInput.value.toLowerCase().trim() : "";
    const marca = marcaSelect  ? marcaSelect.value : "";
    const orden = precioSelect ? precioSelect.value : "";

    if (q)     lista = lista.filter(v =>
      v.nombre.toLowerCase().includes(q) || v.marca.toLowerCase().includes(q));
    if (marca) lista = lista.filter(v => v.marca === marca);
    if (orden === "asc")  lista.sort((a, b) => a.precio - b.precio);
    if (orden === "desc") lista.sort((a, b) => b.precio - a.precio);

    renderCatalog(lista);
  }

  [searchInput, marcaSelect, precioSelect].forEach(el => {
    if (el) el.addEventListener("input", applyFilters);
  });

  renderCatalog(getVehiculos());
}


// ─────────────────────────────────────────────
// 4. VALIDACIONES
// ─────────────────────────────────────────────

function setError(field, msg) {
  if (!field) return;
  field.classList.toggle("input-error", !!msg);
  const wrap = field.closest(".field") || field.parentElement;
  let errEl = wrap.querySelector(".err-msg");
  if (!errEl) {
    errEl = document.createElement("span");
    errEl.className = "err-msg";
    wrap.appendChild(errEl);
  }
  errEl.textContent = msg;
}

const clearError = f => setError(f, "");

function validateNotEmpty(field, label) {
  if (!field || !field.value.trim()) { setError(field, `${label} es obligatorio.`); return false; }
  clearError(field); return true;
}

function validatePositiveNumber(field, label) {
  const val = parseFloat(field ? field.value : "");
  if (isNaN(val) || val <= 0) { setError(field, `${label} debe ser un número mayor a 0.`); return false; }
  clearError(field); return true;
}

function validateUrl(field) {
  if (!field || !field.value.trim()) { clearError(field); return true; }
  try { new URL(field.value.trim()); clearError(field); return true; }
  catch { setError(field, "URL inválida. Debe comenzar con https://"); return false; }
}

function validateEmail(field) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!field || !re.test(field.value.trim())) { setError(field, "Ingresa un correo electrónico válido."); return false; }
  clearError(field); return true;
}

function attachLive(pairs) {
  pairs.forEach(({ el, fn }) => { if (el) el.addEventListener("input", () => fn(el)); });
}


// ─────────────────────────────────────────────
// 5. TOAST
// ─────────────────────────────────────────────

function showToast(msg, type = "success") {
  let t = document.getElementById("lm-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "lm-toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = `lm-toast lm-toast--${type} lm-toast--visible`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("lm-toast--visible"), 3200);
}


// ─────────────────────────────────────────────
// 6. CRUD — ADMIN
// ─────────────────────────────────────────────

/* --- Render listas (Modificación y Eliminación) --- */
function renderAdminLists() {
  renderEditList();
  renderDeleteList();
}

function renderEditList() {
  const ul = document.getElementById("edit-list");
  if (!ul) return;
  const lista = getVehiculos();
  ul.innerHTML = lista.length === 0
    ? `<li class="admin-row admin-row--empty">Sin vehículos registrados.</li>`
    : lista.map(v => `
      <li class="admin-row" data-id="${v.id}">
        <span class="admin-row__nombre">${v.nombre}</span>
        <span class="admin-row__marca">${v.marca}</span>
        <span class="admin-row__precio">${formatPrecio(v.precio)}</span>
        <button class="admin-row__btn" onclick="openEdit(${v.id})">→</button>
      </li>`).join("");
}

function renderDeleteList() {
  const ul = document.getElementById("delete-list");
  if (!ul) return;
  const lista = getVehiculos();
  ul.innerHTML = lista.length === 0
    ? `<li class="admin-row admin-row--empty">Sin vehículos registrados.</li>`
    : lista.map(v => `
      <li class="admin-row" data-id="${v.id}">
        <span class="admin-row__nombre">${v.nombre}</span>
        <span class="admin-row__marca">${v.marca}</span>
        <span class="admin-row__precio">${formatPrecio(v.precio)}</span>
        <button class="admin-row__btn admin-row__btn--del" onclick="confirmDelete(${v.id})">✕</button>
      </li>`).join("");
}

/* --- Alta --- */
function initAltaForm() {
  const form = document.getElementById("form-alta");
  if (!form) return;
  const fN = form.querySelector("#a-nombre"),
        fM = form.querySelector("#a-marca"),
        fP = form.querySelector("#a-precio"),
        fI = form.querySelector("#a-imagen"),
        fE = form.querySelector("#a-etiqueta"),
        fD = form.querySelector("#a-descripcion");

  attachLive([
    { el: fN, fn: el => validateNotEmpty(el, "Nombre") },
    { el: fM, fn: el => validateNotEmpty(el, "Marca")  },
    { el: fP, fn: el => validatePositiveNumber(el, "Precio") },
    { el: fI, fn: validateUrl },
    { el: fD, fn: el => validateNotEmpty(el, "Descripción") },
  ]);

  form.addEventListener("submit", e => {
    e.preventDefault();
    const ok = [
      validateNotEmpty(fN, "Nombre"),
      validateNotEmpty(fM, "Marca"),
      validatePositiveNumber(fP, "Precio"),
      validateUrl(fI),
      validateNotEmpty(fD, "Descripción"),
    ].every(Boolean);
    if (!ok) return;

    const lista  = getVehiculos();
    const nombre = fN.value.trim();
    lista.push({
      id:          nextId(lista),
      nombre,
      marca:       fM.value.trim(),
      precio:      parseFloat(fP.value),
      etiqueta:    fE ? fE.value : "",
      imagen:      fI.value.trim(),
      descripcion: fD.value.trim(),
    });
    saveVehiculos(lista);
    form.reset();
    [fN,fM,fP,fI,fD].forEach(clearError);
    renderAdminLists();
    showToast(`✔ "${nombre}" agregado al catálogo.`);
  });
}

/* --- Edición --- */
window.openEdit = function(id) {
  const v = getVehiculos().find(x => x.id === id);
  if (!v) return;
  document.getElementById("e-id").value          = v.id;
  document.getElementById("e-nombre").value      = v.nombre;
  document.getElementById("e-marca").value       = v.marca;
  document.getElementById("e-precio").value      = v.precio;
  document.getElementById("e-imagen").value      = v.imagen;
  document.getElementById("e-etiqueta").value    = v.etiqueta || "";
  document.getElementById("e-descripcion").value = v.descripcion;
  switchPanel("edicion");
  showToast(`Editando: ${v.nombre}`, "info");
};

function initEditForm() {
  const form = document.getElementById("form-edicion");
  if (!form) return;
  const fN = form.querySelector("#e-nombre"),
        fM = form.querySelector("#e-marca"),
        fP = form.querySelector("#e-precio"),
        fI = form.querySelector("#e-imagen"),
        fD = form.querySelector("#e-descripcion");

  attachLive([
    { el: fN, fn: el => validateNotEmpty(el, "Nombre") },
    { el: fM, fn: el => validateNotEmpty(el, "Marca")  },
    { el: fP, fn: el => validatePositiveNumber(el, "Precio") },
    { el: fI, fn: validateUrl },
    { el: fD, fn: el => validateNotEmpty(el, "Descripción") },
  ]);

  form.addEventListener("submit", e => {
    e.preventDefault();
    const ok = [
      validateNotEmpty(fN, "Nombre"),
      validateNotEmpty(fM, "Marca"),
      validatePositiveNumber(fP, "Precio"),
      validateUrl(fI),
      validateNotEmpty(fD, "Descripción"),
    ].every(Boolean);
    if (!ok) return;

    const id    = parseInt(document.getElementById("e-id").value);
    const lista = getVehiculos();
    const idx   = lista.findIndex(x => x.id === id);
    if (idx === -1) return;
    const nombre = fN.value.trim();
    lista[idx] = {
      id,
      nombre,
      marca:       fM.value.trim(),
      precio:      parseFloat(fP.value),
      etiqueta:    document.getElementById("e-etiqueta").value,
      imagen:      fI.value.trim(),
      descripcion: fD.value.trim(),
    };
    saveVehiculos(lista);
    renderAdminLists();
    showToast(`✔ "${nombre}" actualizado.`);
    switchPanel("modificacion");
  });
}

/* --- Eliminación con confirm inline --- */
window.confirmDelete = function(id) {
  const v = getVehiculos().find(x => x.id === id);
  if (!v) return;

  // Resaltar la fila y pedir confirmación
  const row = document.querySelector(`#delete-list [data-id="${id}"]`);
  if (!row) return;

  // Si ya hay un confirm activo para este, ejecutar
  if (row.classList.contains("confirm-pending")) {
    saveVehiculos(getVehiculos().filter(x => x.id !== id));
    renderAdminLists();
    showToast(`🗑 "${v.nombre}" eliminado.`, "warn");
    return;
  }

  // Primera vez: resaltar y cambiar texto del botón
  document.querySelectorAll(".admin-row.confirm-pending").forEach(r => {
    r.classList.remove("confirm-pending");
    const b = r.querySelector(".admin-row__btn--del");
    if (b) b.textContent = "✕";
  });

  row.classList.add("confirm-pending");
  const btn = row.querySelector(".admin-row__btn--del");
  if (btn) btn.textContent = "¿Confirmar?";

  showToast("Haz clic en '¿Confirmar?' para eliminar.", "warn");
};

/* --- Switch paneles --- */
function switchPanel(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".sidebar-link[data-panel]").forEach(l => l.classList.remove("active"));
  const panel = document.getElementById(id);
  if (panel) panel.classList.add("active");
  const link = document.querySelector(`.sidebar-link[data-panel="${id}"]`);
  if (link) link.classList.add("active");
  const titles = {
    alta: "Alta",
    modificacion: "Modificación",
    edicion: "Edición",
    eliminacion: "Eliminación"
  };
  const tb = document.getElementById("topbar-title");
  if (tb) tb.textContent = titles[id] || id;
}

function initAdminNav() {
  document.querySelectorAll(".sidebar-link[data-panel]").forEach(link =>
    link.addEventListener("click", e => {
      e.preventDefault();
      switchPanel(link.dataset.panel);
    }));
}


// ─────────────────────────────────────────────
// 7. CONTACTO
// ─────────────────────────────────────────────

function initContactForm() {
  const form  = document.getElementById("form");
  const email = document.getElementById("email");
  if (!form || !email) return;
  email.addEventListener("input", () => validateEmail(email));
  form.addEventListener("submit", e => { if (!validateEmail(email)) e.preventDefault(); });
}


// ─────────────────────────────────────────────
// 8. INIT
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  buildHeader();
  buildFooter();
  initCatalogFilters();
  initAdminNav();
  renderAdminLists();
  initAltaForm();
  initEditForm();
  initContactForm();
});