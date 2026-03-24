const { createApp } = Vue;

/* Rangos disponibles para el filtro de precio */
const PRECIO_RANGOS = {
  low:  { min: 0,       max: 1000000  }, 
  mid:  { min: 1000000, max: 2000000  },
  high: { min: 2000000, max: Infinity }  
};

createApp({

  /* Template catalogo completo*/
  template: `
    <section class="coleccion-oscura">

      <div class="section-header">
        <span class="section-label">— Legendary Motorsport —</span>
        <h2>Todos los Vehículos</h2>
      </div>

      <!-- Búsqueda de texto -->
      <div class="search-filter-bar">
        <div class="search-input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="search"
            class="search-input"
            v-model="searchQuery"
            placeholder="Buscar por nombre, marca o descripción..."
            aria-label="Buscar vehículos"
          />
        </div>

        <!-- Filtro por marca -->
        <div class="filter-tags" role="group" aria-label="Filtrar por marca">
          <button type="button" class="filter-tag"
            :class="{ active: selectedBrand === '' }"
            @click="selectedBrand = ''">Todas</button>
          <button
            type="button"
            class="filter-tag"
            v-for="brand in brands"
            :key="brand"
            :class="{ active: selectedBrand === brand }"
            @click="selectedBrand = brand"
          >{{ brand }}</button>
        </div>
      </div>

      <!-- Filtro por rango de precio -->
      <div class="price-filter-row" role="group" aria-label="Filtrar por precio">
        <span class="price-filter-label">Precio:</span>
        <button type="button" class="filter-tag"
          :class="{ active: selectedPrice === '' }"
          @click="selectedPrice = ''">Todos</button>
        <button type="button" class="filter-tag"
          :class="{ active: selectedPrice === 'low' }"
          @click="selectedPrice = 'low'">Hasta $1,000,000</button>
        <button type="button" class="filter-tag"
          :class="{ active: selectedPrice === 'mid' }"
          @click="selectedPrice = 'mid'">$1M — $2M</button>
        <button type="button" class="filter-tag"
          :class="{ active: selectedPrice === 'high' }"
          @click="selectedPrice = 'high'">Más de $2,000,000</button>
      </div>

      <!-- Contador de resultados -->
      <p class="results-count">
        {{ filteredCars.length }}
        vehículo{{ filteredCars.length !== 1 ? 's' : '' }}
        encontrado{{ filteredCars.length !== 1 ? 's' : '' }}
      </p>

      <!-- Grid de tarjetas -->
      <div class="productos">
        <div
          class="producto-card"
          v-for="car in filteredCars"
          :key="car.id"
          :class="{ featured: car.badge === 'Premium' || car.badge === 'Exclusivo' }"
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
              <button type="button" class="btn-buy" @click="contactar(car.nombre)">
                Adquirir
              </button>
            </div>
          </div>
        </div>

        <div class="no-results" v-if="filteredCars.length === 0">
          <p>Sin resultados para "{{ searchQuery }}"</p>
        </div>
      </div>

      <div class="catalogo-cta">
        <a href="Admin.html" class="btn-primary">Administrar catálogo →</a>
      </div>

    </section>
  `,

  data() {
    return {
      cars:          [],
      searchQuery:   '',
      selectedBrand: '',
      selectedPrice: ''
    };
  },

  mounted() {
    this.cars = getCars();
  },

  computed: {
    brands() {
      return [...new Set(this.cars.map(c => c.marca))].sort();
    },

    /* Aplica los tres filtros simultáneamente */
    filteredCars() {
      const query = this.searchQuery.toLowerCase().trim();
      const rango = PRECIO_RANGOS[this.selectedPrice] || null;

      return this.cars.filter(car => {
        const coincideMarca  = this.selectedBrand === '' || car.marca === this.selectedBrand;
        const coincideTexto  = query === '' ||
          car.nombre.toLowerCase().includes(query)      ||
          car.marca.toLowerCase().includes(query)       ||
          car.descripcion.toLowerCase().includes(query);
        const coincidePrecio = rango === null ||
          (car.precio >= rango.min && car.precio < rango.max);

        return coincideMarca && coincideTexto && coincidePrecio;
      });
    }
  },

  methods: {
    formatPrice(precio) { return formatPrice(precio); },
    contactar(nombre) {
      alert('Gracias por su interés en el ' + nombre + '.\nContáctenos en la sección Contacto para más información.');
    }
  }

}).mount('#app-catalogo');
