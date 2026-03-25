const { createApp } = Vue;

/* Helper: valida formato de correo electrónico */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

createApp({

  template: `
    <section class="contacto contacto-padded">
      <div class="contacto-inner">

        <!-- Información de contacto -->
        <div class="contacto-texto">
          <span class="section-label">— Contáctenos —</span>
          <h2>Acceso <em>exclusivo</em></h2>
          <p class="contacto-desc">
            Estamos listos para ayudarle a encontrar el vehículo de sus sueños.
            Comuníquese con nosotros o suscríbase para recibir novedades de
            nuevas colecciones y eventos privados.
          </p>
          <h3>
            Correo:&nbsp;
            <a href="mailto:LegendaryMtsp@gmail.com">LegendaryMtsp@gmail.com</a>
          </h3>
          <h3 class="contacto-tel">
            Teléfono:&nbsp;
            <a href="tel:+52826190226">+52 826 190 226</a>
          </h3>
        </div>

        <!-- Formulario de suscripción -->
        <div class="contacto-form-col">

          <div v-if="!subscribed">
            <label for="email" class="contacto-label">Correo electrónico</label>

            <input
              type="email"
              id="email"
              v-model.trim="emailInput"
              :class="{ 'input-error': emailError, 'input-ok': emailOk }"
              @blur="validateEmail"
              @input="clearError"
              placeholder="su@correo.com"
            />
            <span class="contacto-error" v-if="emailError">{{ emailError }}</span>

            <button type="button" class="btn-suscribir" @click="submitSuscripcion">
              Suscribirse
            </button>
          </div>

          <!-- Mensaje de éxito tras suscribirse -->
          <div v-else class="form-success">
            ¡Suscripción exitosa! Le informaremos sobre nuestras novedades.
          </div>

        </div>

      </div>
    </section>
  `,

  data() {
    return {
      emailInput: '',  
      emailError: '',   
      subscribed: false 
    };
  },

  computed: {
    emailOk() {
      return (
        this.emailInput.length > 0 &&
        !this.emailError           &&
        isValidEmail(this.emailInput)
      );
    }
  },

  methods: {
    validateEmail() {
      if (!this.emailInput) {
        this.emailError = 'El correo electrónico es obligatorio.';
      } else if (!isValidEmail(this.emailInput)) {
        this.emailError = 'Ingresa un correo electrónico válido.';
      } else {
        this.emailError = '';
      }
    },

    clearError() {
      if (this.emailError && isValidEmail(this.emailInput)) {
        this.emailError = '';
      }
    },

    // Envío del formulario
    submitSuscripcion() {
      this.validateEmail();
      if (this.emailError) return;
      this.subscribed = true;
      this.emailInput = '';
    }
  }

}).mount('#app-contacto');
