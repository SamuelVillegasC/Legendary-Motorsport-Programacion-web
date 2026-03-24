/* ============================================================
   contacto.js — Legendary Motorsport
   Vue app para el formulario de suscripción con validación
   Requiere: Vue 3
   ============================================================ */

const { createApp } = Vue;

/* ── Helper: valida formato de correo electrónico ── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

createApp({
  data() {
    return {
      emailInput: '',    // valor del campo de email
      emailError: '',    // mensaje de error (vacío = sin error)
      subscribed: false  // true cuando el formulario fue enviado exitosamente
    };
  },

  computed: {
    // Campo marcado en verde cuando tiene contenido válido
    emailOk() {
      return this.emailInput.length > 0 &&
             !this.emailError           &&
             isValidEmail(this.emailInput);
    }
  },

  methods: {
    // Valida al salir del campo (on blur)
    validateEmail() {
      if (!this.emailInput) {
        this.emailError = 'El correo electrónico es obligatorio.';
      } else if (!isValidEmail(this.emailInput)) {
        this.emailError = 'Ingresa un correo electrónico válido.';
      } else {
        this.emailError = '';
      }
    },

    // Limpia el error en tiempo real mientras el usuario escribe
    clearError() {
      if (this.emailError && isValidEmail(this.emailInput)) {
        this.emailError = '';
      }
    },

    // Envío del formulario
    submitSuscripcion() {
      this.validateEmail();
      if (this.emailError) return;

      // Simula el envío (sin backend)
      this.subscribed = true;
      this.emailInput = '';
    }
  }

}).mount('#app-contacto');
