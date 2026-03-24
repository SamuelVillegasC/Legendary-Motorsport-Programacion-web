/* ============================================================
   catalogo.js — Legendary Motorsport
   Vue app para el catálogo: búsqueda y filtrado de vehículos
   Requiere: Vue 3, catalogo-data.js
   ============================================================ */

const { createApp } = Vue;

createApp({
  data() {
    return {
      cars:          [],   // todos los autos del localStorage
      searchQuery:   '',   // texto del buscador
      selectedBrand: ''    // marca seleccionada en los filtros
    };
  },

  mounted() {
    this.cars = getCars();
  },

  computed: {
    // Lista de marcas únicas para los botones de filtro
    brands() {
      return [...new Set(this.cars.map(c => c.marca))].sort();
    },

    // Autos que coinciden con la búsqueda y el filtro de marca
    filteredCars() {
      const query = this.searchQuery.toLowerCase().trim();

      return this.cars.filter(car => {
        const coincideMarca = this.selectedBrand === '' || car.marca === this.selectedBrand;
        const coincideBusqueda =
          query === '' ||
          car.nombre.toLowerCase().includes(query)      ||
          car.marca.toLowerCase().includes(query)       ||
          car.descripcion.toLowerCase().includes(query);

        return coincideMarca && coincideBusqueda;
      });
    }
  },

  methods: {
    formatPrice(precio) {
      return formatPrice(precio);
    },

    // Aviso al presionar "Adquirir"
    contactar(nombre) {
      alert(`¡Gracias por su interés en el ${nombre}!\nContáctenos en la sección Contacto para más información.`);
    }
  }
}).mount('#app-catalogo');
