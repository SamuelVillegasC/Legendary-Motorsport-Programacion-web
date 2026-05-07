const { createApp } = Vue;

createApp({
  template: `
    <div class="auth-container">
      <div class="auth-card">
        
        <div class="auth-header">
          <h2>Legendary</h2>
          <p>Autenticación de Acceso</p>
        </div>

        <div class="auth-tabs">
          <button class="auth-tab" :class="{ active: mode === 'login' }" @click="mode = 'login'">Iniciar Sesión</button>
          <button class="auth-tab" :class="{ active: mode === 'register' }" @click="mode = 'register'">Registrarse</button>
        </div>

        <div v-if="globalError" class="auth-alert">{{ globalError }}</div>
        <div v-if="globalSuccess" class="auth-alert success">{{ globalSuccess }}</div>

        <!-- FORMULARIO DE LOGIN -->
        <form v-if="mode === 'login'" @submit.prevent="submitLogin">
          <div class="auth-field">
            <label for="l-username">Usuario</label>
            <input type="text" id="l-username" v-model.trim="loginForm.username" required />
          </div>
          <div class="auth-field">
            <label for="l-password">Contraseña</label>
            <input type="password" id="l-password" v-model="loginForm.password" required />
          </div>
          <button type="submit" class="auth-submit" :disabled="loading">
            Ingresar <span v-if="loading" class="spinner"></span>
          </button>
        </form>

        <!-- FORMULARIO DE REGISTRO -->
        <form v-if="mode === 'register'" @submit.prevent="submitRegister">
          <div class="auth-field">
            <label for="r-username">Usuario <span>*</span></label>
            <input type="text" id="r-username" v-model.trim="regForm.username" @input="checkUsername" required />
            <span class="auth-error-msg" v-if="usernameError">{{ usernameError }}</span>
            <span style="color:#d4af37; font-size:0.8rem; margin-top:0.4rem; display:block;" v-if="usernameOk">Usuario disponible ✓</span>
          </div>

          <div style="display:flex; gap:1rem;">
            <div class="auth-field" style="flex:1;">
              <label for="r-firstname">Nombre</label>
              <input type="text" id="r-firstname" v-model.trim="regForm.first_name" required />
            </div>
            <div class="auth-field" style="flex:1;">
              <label for="r-lastname">Apellido</label>
              <input type="text" id="r-lastname" v-model.trim="regForm.last_name" required />
            </div>
          </div>

          <div class="auth-field">
            <label for="r-email">Correo Electrónico <span>*</span></label>
            <input type="email" id="r-email" v-model.trim="regForm.email" required />
          </div>

          <div class="auth-field">
            <label for="r-dir">Dirección</label>
            <input type="text" id="r-dir" v-model.trim="regForm.direccion" />
          </div>

          <div class="auth-field">
            <label for="r-password">Contraseña <span>*</span></label>
            <input type="password" id="r-password" v-model="regForm.password" required />
          </div>

          <button type="submit" class="auth-submit" :disabled="loading || usernameError !== ''">
            Crear Cuenta <span v-if="loading" class="spinner"></span>
          </button>
        </form>

      </div>
    </div>
  `,

  data() {
    return {
      mode: 'login', // 'login' o 'register'
      loading: false,
      globalError: '',
      globalSuccess: '',

      loginForm: {
        username: '',
        password: ''
      },

      regForm: {
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        direccion: '',
        password: ''
      },

      usernameError: '',
      usernameOk: false,
      checkTimeout: null
    };
  },

  watch: {
    mode() {
      this.globalError = '';
      this.globalSuccess = '';
    }
  },

  methods: {
    checkUsername() {
      this.usernameError = '';
      this.usernameOk = false;
      if (!this.regForm.username) return;

      clearTimeout(this.checkTimeout);
      this.checkTimeout = setTimeout(() => {
        fetch('/api/check_username/?username=' + encodeURIComponent(this.regForm.username))
          .then(r => r.json())
          .then(data => {
            if (data.is_taken) {
              this.usernameError = 'Este usuario ya está en uso.';
              this.usernameOk = false;
            } else {
              this.usernameError = '';
              this.usernameOk = true;
            }
          });
      }, 500); // 500ms debounce
    },

    submitLogin() {
      this.globalError = '';
      this.loading = true;

      fetch('/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.loginForm)
      })
        .then(r => r.json())
        .then(data => {
          if (data.status === 'ok') {
            window.location.href = '/catalogo/';
          } else {
            this.globalError = data.message || 'Error al iniciar sesión';
            this.loading = false;
          }
        })
        .catch(() => {
          this.globalError = 'Error de conexión';
          this.loading = false;
        });
    },

    submitRegister() {
      if (this.usernameError) return;
      this.globalError = '';
      this.loading = true;

      fetch('/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.regForm)
      })
        .then(r => {
          if (!r.ok) return r.json().then(e => Promise.reject(e));
          return r.json();
        })
        .then(data => {
          if (data.status === 'ok') {
            this.globalSuccess = 'Cuenta creada con éxito. Redirigiendo...';
            setTimeout(() => {
              window.location.href = '/catalogo/';
            }, 1500);
          }
        })
        .catch(err => {
          this.globalError = err.message || 'Error al crear la cuenta';
          this.loading = false;
        });
    }
  }

}).mount('#app-login');

const { createApp } = Vue;

createApp({
  template: `
    <div class="auth-container">
      <div class="auth-card">
        
        <div class="auth-header">
          <h2>Legendary</h2>
          <p>Autenticación de Acceso</p>
        </div>

        <div class="auth-tabs">
          <button class="auth-tab" :class="{ active: mode === 'login' }" @click="mode = 'login'">Iniciar Sesión</button>
          <button class="auth-tab" :class="{ active: mode === 'register' }" @click="mode = 'register'">Registrarse</button>
        </div>

        <div v-if="globalError" class="auth-alert">{{ globalError }}</div>
        <div v-if="globalSuccess" class="auth-alert success">{{ globalSuccess }}</div>

        <!-- FORMULARIO DE LOGIN -->
        <form v-if="mode === 'login'" @submit.prevent="submitLogin">
          <div class="auth-field">
            <label for="l-username">Usuario</label>
            <input type="text" id="l-username" v-model.trim="loginForm.username" required />
          </div>
          <div class="auth-field">
            <label for="l-password">Contraseña</label>
            <input type="password" id="l-password" v-model="loginForm.password" required />
          </div>
          <button type="submit" class="auth-submit" :disabled="loading">
            Ingresar <span v-if="loading" class="spinner"></span>
          </button>
        </form>

        <!-- FORMULARIO DE REGISTRO -->
        <form v-if="mode === 'register'" @submit.prevent="submitRegister">
          <div class="auth-field">
            <label for="r-username">Usuario <span>*</span></label>
            <input type="text" id="r-username" v-model.trim="regForm.username" @input="checkUsername" required />
            <span class="auth-error-msg" v-if="usernameError">{{ usernameError }}</span>
            <span style="color:#d4af37; font-size:0.8rem; margin-top:0.4rem; display:block;" v-if="usernameOk">Usuario disponible</span>
          </div>

          <div style="display:flex; gap:1rem;">
            <div class="auth-field" style="flex:1;">
              <label for="r-firstname">Nombre</label>
              <input type="text" id="r-firstname" v-model.trim="regForm.first_name" required />
            </div>
            <div class="auth-field" style="flex:1;">
              <label for="r-lastname">Apellido</label>
              <input type="text" id="r-lastname" v-model.trim="regForm.last_name" required />
            </div>
          </div>

          <div class="auth-field">
            <label for="r-email">Correo Electrónico <span>*</span></label>
            <input type="email" id="r-email" v-model.trim="regForm.email" required />
          </div>

          <div class="auth-field">
            <label for="r-dir">Dirección</label>
            <input type="text" id="r-dir" v-model.trim="regForm.direccion" />
          </div>

          <div class="auth-field">
            <label for="r-password">Contraseña <span>*</span></label>
            <input type="password" id="r-password" v-model="regForm.password" required />
          </div>

          <button type="submit" class="auth-submit" :disabled="loading || usernameError !== ''">
            Crear Cuenta <span v-if="loading" class="spinner"></span>
          </button>
        </form>

      </div>
    </div>
  `,

  data() {
    return {
      mode: 'login', // 'login' o 'register'
      loading: false,
      globalError: '',
      globalSuccess: '',

      loginForm: {
        username: '',
        password: ''
      },

      regForm: {
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        direccion: '',
        password: ''
      },

      usernameError: '',
      usernameOk: false,
      checkTimeout: null
    };
  },

  watch: {
    mode() {
      this.globalError = '';
      this.globalSuccess = '';
    }
  },

  methods: {
    checkUsername() {
      this.usernameError = '';
      this.usernameOk = false;
      if (!this.regForm.username) return;

      clearTimeout(this.checkTimeout);
      this.checkTimeout = setTimeout(() => {
        fetch('/api/check_username/?username=' + encodeURIComponent(this.regForm.username))
          .then(r => r.json())
          .then(data => {
            if (data.is_taken) {
              this.usernameError = 'Este usuario ya está en uso.';
              this.usernameOk = false;
            } else {
              this.usernameError = '';
              this.usernameOk = true;
            }
          });
      }, 500); // 500ms debounce
    },

    submitLogin() {
      this.globalError = '';
      this.loading = true;

      fetch('/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.loginForm)
      })
        .then(r => r.json())
        .then(data => {
          if (data.status === 'ok') {
            window.location.href = '/catalogo/';
          } else {
            this.globalError = data.message || 'Error al iniciar sesión';
            this.loading = false;
          }
        })
        .catch(() => {
          this.globalError = 'Error de conexión';
          this.loading = false;
        });
    },

    submitRegister() {
      if (this.usernameError) return;
      this.globalError = '';
      this.loading = true;

      fetch('/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.regForm)
      })
        .then(r => {
          if (!r.ok) return r.json().then(e => Promise.reject(e));
          return r.json();
        })
        .then(data => {
          if (data.status === 'ok') {
            this.globalSuccess = 'Cuenta creada con éxito. Redirigiendo...';
            setTimeout(() => {
              window.location.href = '/catalogo/';
            }, 1500);
          }
        })
        .catch(err => {
          this.globalError = err.message || 'Error al crear la cuenta';
          this.loading = false;
        });
    }
  }

}).mount('#app-login');
