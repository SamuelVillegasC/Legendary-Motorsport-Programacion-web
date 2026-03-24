/* ============================================================
   index.js — Legendary Motorsport
   Vue apps para: contadores de estadísticas y sección Novedades
   Requiere: Vue 3, catalogo-data.js
   ============================================================ */

const { createApp } = Vue;

/* ─────────────────────────────────────────────────────────────
   App 1: Contadores de estadísticas animados
   Se activan cuando la sección entra al viewport (IntersectionObserver)
───────────────────────────────────────────────────────────── */
createApp({
  data() {
    return {
      displayVehiculos: 0,
      displayMarcas:    0,
      displayAnios:     0,
      displayClientes:  0,
      targetVehiculos:  0,
      targetMarcas:     0,
      targetAnios:      12,
      targetClientes:   500
    };
  },

  mounted() {
    const cars = getCars();
    this.targetVehiculos = cars.length;
    this.targetMarcas    = new Set(cars.map(c => c.marca)).size;

    // Observa cuándo la sección es visible para iniciar la animación
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.animarContador('displayVehiculos', this.targetVehiculos, 900);
        this.animarContador('displayMarcas',    this.targetMarcas,    900);
        this.animarContador('displayAnios',     this.targetAnios,    1200);
        this.animarContador('displayClientes',  this.targetClientes, 1500);
        observer.disconnect();
      }
    }, { threshold: 0.4 });

    observer.observe(this.$el);
  },

  methods: {
    // Anima un contador desde 0 hasta `target` en `duracion` ms
    animarContador(propiedad, target, duracion) {
      const inicio = performance.now();
      const paso = (ahora) => {
        const progreso = Math.min((ahora - inicio) / duracion, 1);
        const ease = 1 - Math.pow(1 - progreso, 3); // easeOutCubic
        this[propiedad] = Math.floor(ease * target);
        if (progreso < 1) requestAnimationFrame(paso);
        else this[propiedad] = target;
      };
      requestAnimationFrame(paso);
    }
  }
}).mount('#app-stats');


/* ─────────────────────────────────────────────────────────────
   App 2: Novedades — muestra los últimos 2 autos del catálogo
───────────────────────────────────────────────────────────── */
createApp({
  data() {
    return {
      featuredCars: []
    };
  },

  mounted() {
    const cars = getCars();
    // Toma los últimos 2 autos añadidos
    this.featuredCars = [...cars].slice(-2).reverse();
  },

  methods: {
    formatPrice(precio) {
      return formatPrice(precio);
    }
  }
}).mount('#app-novedades');
