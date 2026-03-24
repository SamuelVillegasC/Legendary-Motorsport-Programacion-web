/* ============================================================
   admin.js — Legendary Motorsport
   Vue app para el panel de administración
   Operaciones: Alta, Modificación y Eliminación de vehículos
   Los datos se persisten en localStorage (sin base de datos)
   Requiere: Vue 3, catalogo-data.js
   ============================================================ */

const { createApp } = Vue;

/* ── Helper: valida que una cadena sea una URL http/https válida ── */
function isValidUrl(str) {
  try {
    return ['http:', 'https:'].includes(new URL(str).protocol);
  } catch {
    return false;
  }
}

createApp({
  data() {
    return {
      panel: 'alta',   // panel activo: 'alta' | 'modificacion' | 'eliminacion'
      cars:  [],        // lista de vehículos cargada desde localStorage

      /* ── Alta ── */
      alta: {
        nombre: '', marca: '', precio: '',
        imagen: '', descripcion: '', badge: ''
      },
      altaErrors:  {},
      altaTouched: {},
      altaSuccess: false,

      /* ── Modificación ── */
      editTarget:  null,  // auto seleccionado para editar
      editForm:    {},
      editErrors:  {},
      editTouched: {},
      editSuccess: false,

      /* ── Eliminación ── */
      deleteTarget:    null,  // auto seleccionado para eliminar
      deleteMotivo:    '',
      deleteConfirmed: false,
      deleteErrors:    {}
    };
  },

  computed: {
    // Título del topbar según el panel activo
    panelTitle() {
      const titulos = {
        alta:         'Alta',
        modificacion: 'Modificación',
        eliminacion:  'Eliminación'
      };
      return titulos[this.panel] || '';
    }
  },

  mounted() {
    this.cars = getCars();
  },

  methods: {

    /* ── Navegación entre paneles ── */
    setPanel(p) {
      this.panel       = p;
      this.altaSuccess  = false;
      this.editSuccess  = false;
      this.editTarget   = null;
      this.deleteTarget = null;
    },

    fmtP(precio) {
      return formatPrice(precio);
    },

    /* ─────────────────────────────────────────────────────
       VALIDACIONES
    ───────────────────────────────────────────────────── */

    validarAlta() {
      const e = {};
      if (!this.alta.nombre)                          e.nombre      = 'El nombre es obligatorio.';
      if (!this.alta.marca)                           e.marca       = 'La marca es obligatoria.';
      if (!this.alta.precio || this.alta.precio <= 0) e.precio      = 'Ingresa un precio mayor a 0.';
      if (!this.alta.descripcion)                     e.descripcion = 'La descripción es obligatoria.';
      if (this.alta.imagen && !isValidUrl(this.alta.imagen)) e.imagen = 'Ingresa una URL válida.';
      this.altaErrors = e;
      return Object.keys(e).length === 0;
    },

    // Valida en tiempo real al salir de un campo (on blur)
    touchAlta(campo) {
      this.altaTouched[campo] = true;
      const e = { ...this.altaErrors };
      if (campo === 'nombre'      && this.alta.nombre)           delete e.nombre;
      if (campo === 'marca'       && this.alta.marca)            delete e.marca;
      if (campo === 'precio'      && this.alta.precio > 0)       delete e.precio;
      if (campo === 'descripcion' && this.alta.descripcion)      delete e.descripcion;
      if (campo === 'imagen' && (!this.alta.imagen || isValidUrl(this.alta.imagen))) delete e.imagen;
      this.altaErrors = e;
    },

    validarEdit() {
      const e = {};
      if (!this.editForm.nombre)                              e.nombre      = 'El nombre es obligatorio.';
      if (!this.editForm.marca)                               e.marca       = 'La marca es obligatoria.';
      if (!this.editForm.precio || this.editForm.precio <= 0) e.precio      = 'Ingresa un precio mayor a 0.';
      if (!this.editForm.descripcion)                         e.descripcion = 'La descripción es obligatoria.';
      if (this.editForm.imagen && !isValidUrl(this.editForm.imagen)) e.imagen = 'URL inválida.';
      this.editErrors = e;
      return Object.keys(e).length === 0;
    },

    touchEdit(campo) {
      this.editTouched[campo] = true;
      const e = { ...this.editErrors };
      if (campo === 'nombre'      && this.editForm.nombre)           delete e.nombre;
      if (campo === 'marca'       && this.editForm.marca)            delete e.marca;
      if (campo === 'precio'      && this.editForm.precio > 0)       delete e.precio;
      if (campo === 'descripcion' && this.editForm.descripcion)      delete e.descripcion;
      if (campo === 'imagen' && (!this.editForm.imagen || isValidUrl(this.editForm.imagen))) delete e.imagen;
      this.editErrors = e;
    },

    /* ─────────────────────────────────────────────────────
       ALTA — Agrega un nuevo vehículo al catálogo
    ───────────────────────────────────────────────────── */

    submitAlta() {
      // Marcar todos los campos como tocados para mostrar todos los errores
      ['nombre', 'marca', 'precio', 'imagen', 'descripcion'].forEach(f => {
        this.altaTouched[f] = true;
      });
      if (!this.validarAlta()) return;

      const nuevoCarro = {
        id:          Date.now(),
        nombre:      this.alta.nombre,
        marca:       this.alta.marca,
        precio:      this.alta.precio,
        imagen:      this.alta.imagen || '',
        descripcion: this.alta.descripcion,
        badge:       this.alta.badge
      };

      this.cars.push(nuevoCarro);
      saveCars(this.cars);
      this.resetAlta();
      this.altaSuccess = true;
      setTimeout(() => { this.altaSuccess = false; }, 4000);
    },

    resetAlta() {
      this.alta        = { nombre: '', marca: '', precio: '', imagen: '', descripcion: '', badge: '' };
      this.altaErrors  = {};
      this.altaTouched = {};
    },

    /* ─────────────────────────────────────────────────────
       MODIFICACIÓN — Edita un vehículo existente
    ───────────────────────────────────────────────────── */

    selectEdit(car) {
      this.editTarget  = car;
      this.editForm    = { ...car };  // copia para no mutar el original hasta guardar
      this.editErrors  = {};
      this.editTouched = {};
      this.editSuccess = false;
    },

    cancelEdit() {
      this.editTarget  = null;
      this.editSuccess = false;
    },

    submitEdit() {
      ['nombre', 'marca', 'precio', 'imagen', 'descripcion'].forEach(f => {
        this.editTouched[f] = true;
      });
      if (!this.validarEdit()) return;

      const idx = this.cars.findIndex(c => c.id === this.editTarget.id);
      if (idx !== -1) {
        this.cars[idx] = { ...this.editForm };
        saveCars(this.cars);
      }

      this.editSuccess = true;
      setTimeout(() => {
        this.editSuccess = false;
        this.cancelEdit();
      }, 2500);
    },

    /* ─────────────────────────────────────────────────────
       ELIMINACIÓN — Elimina un vehículo del catálogo
    ───────────────────────────────────────────────────── */

    selectDelete(car) {
      this.deleteTarget    = car;
      this.deleteMotivo    = '';
      this.deleteConfirmed = false;
      this.deleteErrors    = {};
    },

    cancelDelete() {
      this.deleteTarget = null;
    },

    confirmDelete() {
      const e = {};
      if (!this.deleteMotivo)    e.motivo  = 'Selecciona un motivo.';
      if (!this.deleteConfirmed) e.confirm = 'Debes confirmar la eliminación.';
      this.deleteErrors = e;
      if (Object.keys(e).length > 0) return;

      this.cars = this.cars.filter(c => c.id !== this.deleteTarget.id);
      saveCars(this.cars);
      this.deleteTarget = null;
    }
  }

}).mount('#app-admin');
