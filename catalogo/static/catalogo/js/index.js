const { createApp } = Vue;

/* App 1 — Contadores animados se activan con IntersectionObserver al entrar al viewport*/
createApp({

  template: `
    <section class="stats-section">
      <div class="stats-inner">
        <div class="stat-item">
          <span class="stat-number">{{ displayVehiculos }}</span>
          <span class="stat-label">Vehículos disponibles</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ displayMarcas }}</span>
          <span class="stat-label">Marcas exclusivas</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ displayAnios }}+</span>
          <span class="stat-label">Años de experiencia</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ displayClientes }}</span>
          <span class="stat-label">Clientes satisfechos</span>
        </div>
      </div>
    </section>
  `,

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

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.animarContador('displayVehiculos', this.targetVehiculos, 900);
        this.animarContador('displayMarcas',    this.targetMarcas,    900);
        this.animarContador('displayAnios',     this.targetAnios,     1200);
        this.animarContador('displayClientes',  this.targetClientes,  1500);
        observer.disconnect();
      }
    }, { threshold: 0.4 });

    observer.observe(this.$el);
  },

  methods: {
    animarContador(propiedad, target, duracion) {
      const inicio = performance.now();
      const paso = (ahora) => {
        const progreso = Math.min((ahora - inicio) / duracion, 1);
        const ease = 1 - Math.pow(1 - progreso, 3);
        this[propiedad] = Math.floor(ease * target);
        if (progreso < 1) requestAnimationFrame(paso);
        else this[propiedad] = target;
      };
      requestAnimationFrame(paso);
    }
  }

}).mount('#app-stats');


/* App 2 — Novedades Muestra los últimos 2 autos añadidos al catálogo */
createApp({

  template: `
    <section class="coleccion-dark">
      <div class="section-header novedades-header">
        <span class="section-label">— Últimas incorporaciones —</span>
        <h2 class="novedades-titulo">Novedades</h2>
      </div>

      <div class="productos" v-if="featuredCars.length > 0">
        <div
          class="producto-card"
          v-for="car in featuredCars"
          :key="car.id"
          :class="{ featured: car.badge === 'Exclusivo' || car.badge === 'Premium' }"
        >
          <div class="producto-img-wrap">
            <img :src="car.imagen" :alt="car.nombre" loading="lazy" />
            <span
              v-if="car.badge"
              class="producto-badge"
              :class="{ gold: car.badge === 'Recién llegado' || car.badge === 'Exclusivo' }"
            >{{ car.badge }}</span>
          </div>
          <div class="producto-info">
            <span class="producto-marca">{{ car.marca }}</span>
            <h3>{{ car.nombre }}</h3>
            <p>{{ car.descripcion }}</p>
            <div class="producto-footer">
              <span class="precio">{{ formatPrice(car.precio) }}</span>
              <a href="Catalogo.html" class="btn-buy">Ver más</a>
            </div>
          </div>
        </div>
      </div>

      <div class="novedades-vacio" v-else>
        <p>Catálogo en preparación</p>
      </div>

      <div class="novedades-cta">
        <a href="Catalogo.html" class="btn-primary">Ver catálogo completo</a>
      </div>
    </section>
  `,

  data() {
    return { featuredCars: [] };
  },

  mounted() {
    const cars = getCars();
    this.featuredCars = [...cars].slice(-2).reverse();
  },

  methods: {
    formatPrice(precio) { return formatPrice(precio); }
  }

}).mount('#app-novedades');
