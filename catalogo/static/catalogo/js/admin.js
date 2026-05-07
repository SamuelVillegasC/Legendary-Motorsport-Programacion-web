const { createApp } = Vue;

/*Valida que una cadena sea URL válida*/
function isValidUrl(str) {
  try { return ['http:', 'https:'].includes(new URL(str).protocol); }
  catch { return false; }
}

createApp({

  /* Template completo — sidebar + main */
  template: `
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-l">L</span>
        <div>
          <span class="brand-name">LEGENDARY</span>
          <span class="brand-sub">Motorsport · Admin</span>
        </div>
      </div>
      <nav>
        <p style="color:#666; font-size:0.7rem; text-transform:uppercase; margin: 1rem 0 0.5rem 1.5rem; letter-spacing:1px;">Vehículos</p>
        <a href="#" class="nav-link" :class="{ active: panel === 'alta' }"
           @click.prevent="setPanel('alta')">Alta Vehículos</a>
        <a href="#" class="nav-link" :class="{ active: panel === 'modificacion' }"
           @click.prevent="setPanel('modificacion')">Modificar Vehículos</a>
        <a href="#" class="nav-link" :class="{ active: panel === 'eliminacion' }"
           @click.prevent="setPanel('eliminacion')">Eliminar Vehículos</a>
        
        <p style="color:#666; font-size:0.7rem; text-transform:uppercase; margin: 1.5rem 0 0.5rem 1.5rem; letter-spacing:1px;">Usuarios</p>
        <a href="#" class="nav-link" :class="{ active: panel === 'mod_user' }"
           @click.prevent="setPanel('mod_user')">Modificar Usuarios</a>
        <a href="#" class="nav-link" :class="{ active: panel === 'del_user' }"
           @click.prevent="setPanel('del_user')">Eliminar Usuarios</a>
        
        <p style="color:#666; font-size:0.7rem; text-transform:uppercase; margin: 1.5rem 0 0.5rem 1.5rem; letter-spacing:1px;">Navegación</p>
        <a href="/catalogo/" class="nav-link">Ver Catálogo</a>
        <a href="/"    class="nav-link">Volver al Sitio</a>
      </nav>
    </aside>

    <main>
      <header class="topbar">
        <span>Gestión Principal &nbsp;/&nbsp; <b>{{ panelTitle }}</b></span>
        <span class="dot"></span>
      </header>

      <!-- PANEL 01: ALTA VEHÍCULOS -->
      <section class="panel" v-show="panel === 'alta'">
        <div class="panel-head">
          <span class="num">01</span>
          <div><h1>Alta de Vehículo</h1><p>Registra un nuevo modelo en el catálogo.</p></div>
        </div>
        <div class="msg-success" v-if="altaSuccess">Vehículo registrado correctamente.</div>
        <form @submit.prevent="submitAlta">
          <div class="field">
            <label for="a-nombre">Nombre del Vehículo <span>*</span></label>
            <input type="text" id="a-nombre" v-model.trim="alta.nombre"
              :class="{ 'input-err': altaErrors.nombre, 'input-ok': altaTouched.nombre && !altaErrors.nombre }"
              @blur="touchAlta('nombre')" placeholder="Ej. Pegassi Zentorno 2025" />
            <span class="ferr" v-if="altaErrors.nombre">{{ altaErrors.nombre }}</span>
          </div>
          <div class="row">
            <div class="field">
              <label for="a-marca">Marca <span>*</span></label>
              <input type="text" id="a-marca" v-model.trim="alta.marca"
                :class="{ 'input-err': altaErrors.marca, 'input-ok': altaTouched.marca && !altaErrors.marca }"
                @blur="touchAlta('marca')" placeholder="Ej. Pegassi" />
              <span class="ferr" v-if="altaErrors.marca">{{ altaErrors.marca }}</span>
            </div>
            <div class="field">
              <label for="a-precio">Precio (USD) <span>*</span></label>
              <div class="prefix-wrap">
                <span>$</span>
                <input type="number" id="a-precio" v-model.number="alta.precio"
                  :class="{ 'input-err': altaErrors.precio, 'input-ok': altaTouched.precio && !altaErrors.precio }"
                  @blur="touchAlta('precio')" placeholder="0" min="0" />
              </div>
              <span class="ferr" v-if="altaErrors.precio">{{ altaErrors.precio }}</span>
            </div>
          </div>
          <div class="field">
            <label for="a-imagen">URL de Imagen</label>
            <input type="url" id="a-imagen" v-model.trim="alta.imagen"
              :class="{ 'input-err': altaErrors.imagen }"
              @blur="touchAlta('imagen')" placeholder="https://ejemplo.com/imagen.jpg" />
            <span class="ferr" v-if="altaErrors.imagen">{{ altaErrors.imagen }}</span>
          </div>
          <div class="field">
            <label for="a-badge">Etiqueta</label>
            <select id="a-badge" v-model="alta.badge">
              <option value="">Sin etiqueta</option>
              <option value="Bestseller">Bestseller</option>
              <option value="Recién llegado">Recién llegado</option>
              <option value="Exclusivo">Exclusivo</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <div class="field">
            <label for="a-desc">Descripción <span>*</span></label>
            <textarea id="a-desc" v-model.trim="alta.descripcion" rows="4"
              :class="{ 'input-err': altaErrors.descripcion, 'input-ok': altaTouched.descripcion && !altaErrors.descripcion }"
              @blur="touchAlta('descripcion')" placeholder="Motor, características..."></textarea>
            <span class="ferr" v-if="altaErrors.descripcion">{{ altaErrors.descripcion }}</span>
          </div>
          <div class="actions">
            <button type="button" class="btn ghost" @click="resetAlta">Limpiar</button>
            <button type="submit" class="btn primary">Registrar Vehículo →</button>
          </div>
        </form>
      </section>

      <!-- PANEL 02: MODIFICACIÓN VEHÍCULOS -->
      <section class="panel" v-show="panel === 'modificacion'">
        <div class="panel-head">
          <span class="num">02</span>
          <div><h1>Modificación de Vehículo</h1><p>Selecciona un vehículo para editar sus datos.</p></div>
        </div>
        <div class="car-list" v-if="!editTarget">
          <p v-if="cars.length === 0">No hay vehículos registrados.</p>
          <div class="car-list-item" v-for="car in cars" :key="car.id" @click="selectEdit(car)">
            <span class="cli-nombre">{{ car.nombre }}</span>
            <span class="cli-marca">{{ car.marca }}</span>
            <span class="cli-precio">{{ fmtP(car.precio) }}</span>
            <span class="cli-arrow">→</span>
          </div>
        </div>
        <div v-if="editTarget">
          <button type="button" class="btn ghost" @click="cancelEdit">← Volver a la lista</button>
          <div class="msg-success" v-if="editSuccess">✓ Cambios guardados correctamente.</div>
          <form @submit.prevent="submitEdit">
            <div class="field">
              <label for="e-nombre">Nombre del Vehículo <span>*</span></label>
              <input type="text" id="e-nombre" v-model.trim="editForm.nombre"
                :class="{ 'input-err': editErrors.nombre, 'input-ok': editTouched.nombre && !editErrors.nombre }"
                @blur="touchEdit('nombre')" />
              <span class="ferr" v-if="editErrors.nombre">{{ editErrors.nombre }}</span>
            </div>
            <div class="row">
              <div class="field">
                <label for="e-marca">Marca <span>*</span></label>
                <input type="text" id="e-marca" v-model.trim="editForm.marca"
                  :class="{ 'input-err': editErrors.marca, 'input-ok': editTouched.marca && !editErrors.marca }"
                  @blur="touchEdit('marca')" />
                <span class="ferr" v-if="editErrors.marca">{{ editErrors.marca }}</span>
              </div>
              <div class="field">
                <label for="e-precio">Precio (USD) <span>*</span></label>
                <div class="prefix-wrap">
                  <span>$</span>
                  <input type="number" id="e-precio" v-model.number="editForm.precio"
                    :class="{ 'input-err': editErrors.precio, 'input-ok': editTouched.precio && !editErrors.precio }"
                    @blur="touchEdit('precio')" min="0" />
                </div>
                <span class="ferr" v-if="editErrors.precio">{{ editErrors.precio }}</span>
              </div>
            </div>
            <div class="field">
              <label for="e-imagen">URL de Imagen</label>
              <input type="url" id="e-imagen" v-model.trim="editForm.imagen"
                :class="{ 'input-err': editErrors.imagen }"
                @blur="touchEdit('imagen')" />
              <span class="ferr" v-if="editErrors.imagen">{{ editErrors.imagen }}</span>
            </div>
            <div class="field">
              <label for="e-badge">Etiqueta</label>
              <select id="e-badge" v-model="editForm.badge">
                <option value="">Sin etiqueta</option>
                <option value="Bestseller">Bestseller</option>
                <option value="Recién llegado">Recién llegado</option>
                <option value="Exclusivo">Exclusivo</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div class="field">
              <label for="e-desc">Descripción <span>*</span></label>
              <textarea id="e-desc" v-model.trim="editForm.descripcion" rows="4"
                :class="{ 'input-err': editErrors.descripcion, 'input-ok': editTouched.descripcion && !editErrors.descripcion }"
                @blur="touchEdit('descripcion')"></textarea>
              <span class="ferr" v-if="editErrors.descripcion">{{ editErrors.descripcion }}</span>
            </div>
            <div class="actions">
              <button type="button" class="btn ghost" @click="cancelEdit">Cancelar</button>
              <button type="submit" class="btn warning">Guardar Cambios →</button>
            </div>
          </form>
        </div>
      </section>

      <!-- PANEL 03: ELIMINACIÓN VEHÍCULOS -->
      <section class="panel" v-show="panel === 'eliminacion'">
        <div class="panel-head">
          <span class="num">03</span>
          <div><h1>Eliminación de Vehículo</h1><p>Selecciona el vehículo a eliminar.</p></div>
        </div>
        <div class="alert">
          <span>⚠</span>
          <p>Esta acción es <strong>irreversible</strong>. Verifica los datos antes de confirmar.</p>
        </div>
        <p v-if="cars.length === 0">No hay vehículos registrados.</p>
        <div class="car-list" v-if="!deleteTarget">
          <div class="car-list-item" v-for="car in cars" :key="car.id" @click="selectDelete(car)">
            <span class="cli-nombre">{{ car.nombre }}</span>
            <span class="cli-marca">{{ car.marca }}</span>
            <span class="cli-precio">{{ fmtP(car.precio) }}</span>
            <span class="cli-delete">✕</span>
          </div>
        </div>
        <div v-if="deleteTarget">
          <div class="delete-preview">
            <p>Vas a eliminar:</p>
            <strong>{{ deleteTarget.nombre }}</strong>
            <span>{{ deleteTarget.marca }} · {{ fmtP(deleteTarget.precio) }}</span>
          </div>
          <form @submit.prevent="confirmDelete">
            <div class="field">
              <label for="d-motivo">Motivo <span>*</span></label>
              <select id="d-motivo" v-model="deleteMotivo"
                :class="{ 'input-err': deleteErrors.motivo }">
                <option value="" disabled>Seleccionar motivo</option>
                <option value="descontinuado">Modelo descontinuado</option>
                <option value="duplicado">Registro duplicado</option>
                <option value="error">Error en el alta</option>
                <option value="vendido">Unidad vendida / sin stock</option>
                <option value="otro">Otro</option>
              </select>
              <span class="ferr" v-if="deleteErrors.motivo">{{ deleteErrors.motivo }}</span>
            </div>
            <div class="confirm-box">
              <label class="check-label">
                <input type="checkbox" v-model="deleteConfirmed" />
                <span class="check"></span>
                Confirmo que deseo eliminar este vehículo de forma permanente
              </label>
              <span class="ferr" v-if="deleteErrors.confirm">{{ deleteErrors.confirm }}</span>
            </div>
            <div class="actions">
              <button type="button" class="btn ghost" @click="cancelDelete">Cancelar</button>
              <button type="submit" class="btn danger">Eliminar Vehículo ✕</button>
            </div>
          </form>
        </div>
      </section>

      <!-- PANEL 04: MODIFICACIÓN USUARIOS -->
      <section class="panel" v-show="panel === 'mod_user'">
        <div class="panel-head">
          <span class="num">04</span>
          <div><h1>Modificación de Usuarios</h1><p>Edita los datos y roles de los usuarios del sistema.</p></div>
        </div>
        <div class="car-list" v-if="!editUserTarget">
          <p v-if="users.length === 0">No hay usuarios registrados.</p>
          <div class="car-list-item" v-for="u in users" :key="u.id" @click="selectEditUser(u)">
            <span class="cli-nombre">{{ u.username }}</span>
            <span class="cli-marca" style="color: #888;">{{ u.first_name }} {{ u.last_name }}</span>
            <span class="cli-precio" style="color: #d4af37;">{{ u.rol === 'admin' ? 'Administrador' : 'Usuario' }}</span>
            <span class="cli-arrow">→</span>
          </div>
        </div>
        <div v-if="editUserTarget">
          <button type="button" class="btn ghost" @click="cancelEditUser">← Volver a la lista</button>
          <div class="msg-success" v-if="editUserSuccess">✓ Usuario actualizado correctamente.</div>
          <form @submit.prevent="submitEditUser">
            <div class="field">
              <label>Username (Solo lectura)</label>
              <input type="text" v-model="editUserForm.username" disabled style="opacity: 0.5;" />
            </div>
            <div class="row">
              <div class="field">
                <label for="eu-nombre">Nombre</label>
                <input type="text" id="eu-nombre" v-model.trim="editUserForm.first_name" />
              </div>
              <div class="field">
                <label for="eu-apellido">Apellido</label>
                <input type="text" id="eu-apellido" v-model.trim="editUserForm.last_name" />
              </div>
            </div>
            <div class="field">
              <label for="eu-email">Email</label>
              <input type="email" id="eu-email" v-model.trim="editUserForm.email" />
            </div>
            <div class="field">
              <label for="eu-dir">Dirección</label>
              <input type="text" id="eu-dir" v-model.trim="editUserForm.direccion" />
            </div>
            <div class="field">
              <label for="eu-rol">Rol en el Sistema <span>*</span></label>
              <select id="eu-rol" v-model="editUserForm.rol">
                <option value="user">Usuario (Cliente Normal)</option>
                <option value="admin">Administrador (Acceso Total)</option>
              </select>
            </div>
            <div class="actions">
              <button type="button" class="btn ghost" @click="cancelEditUser">Cancelar</button>
              <button type="submit" class="btn warning">Guardar Usuario →</button>
            </div>
          </form>
        </div>
      </section>

      <!-- PANEL 05: ELIMINACIÓN USUARIOS -->
      <section class="panel" v-show="panel === 'del_user'">
        <div class="panel-head">
          <span class="num">05</span>
          <div><h1>Eliminación de Usuarios</h1><p>Selecciona el usuario a revocar.</p></div>
        </div>
        <div class="alert">
          <span>⚠</span>
          <p>Esta acción es <strong>irreversible</strong> y borrará todo rastro del usuario.</p>
        </div>
        <p v-if="users.length === 0">No hay usuarios registrados.</p>
        <div class="car-list" v-if="!deleteUserTarget">
          <div class="car-list-item" v-for="u in users" :key="u.id" @click="selectDeleteUser(u)">
            <span class="cli-nombre">{{ u.username }}</span>
            <span class="cli-marca" style="color: #888;">{{ u.first_name }} {{ u.last_name }}</span>
            <span class="cli-precio" style="color: #d4af37;">{{ u.rol === 'admin' ? 'Administrador' : 'Usuario' }}</span>
            <span class="cli-delete">✕</span>
          </div>
        </div>
        <div v-if="deleteUserTarget">
          <div class="delete-preview">
            <p>Vas a eliminar al usuario:</p>
            <strong>@{{ deleteUserTarget.username }}</strong>
            <span>{{ deleteUserTarget.first_name }} {{ deleteUserTarget.last_name }}</span>
          </div>
          <div class="ferr" v-if="deleteUserError" style="margin-bottom: 1rem; text-align: center; font-size: 1rem;">{{ deleteUserError }}</div>
          <form @submit.prevent="confirmDeleteUser">
            <div class="confirm-box">
              <label class="check-label">
                <input type="checkbox" v-model="deleteUserConfirmed" />
                <span class="check"></span>
                Confirmo que deseo eliminar a este usuario de forma permanente
              </label>
            </div>
            <div class="actions">
              <button type="button" class="btn ghost" @click="cancelDeleteUser">Cancelar</button>
              <button type="submit" class="btn danger" :disabled="!deleteUserConfirmed">Eliminar Usuario ✕</button>
            </div>
          </form>
        </div>
      </section>

    </main>
  `,

  data() {
    return {
      panel: 'alta',
      cars:  [],
      users: [],
      
      alta:         { nombre: '', marca: '', precio: '', imagen: '', descripcion: '', badge: '' },
      altaErrors:   {},
      altaTouched:  {},
      altaSuccess:  false,
    
      editTarget:   null,
      editForm:     {},
      editErrors:   {},
      editTouched:  {},
      editSuccess:  false,
 
      deleteTarget:    null,
      deleteMotivo:    '',
      deleteConfirmed: false,
      deleteErrors:    {},

      editUserTarget:  null,
      editUserForm:    {},
      editUserSuccess: false,

      deleteUserTarget: null,
      deleteUserConfirmed: false,
      deleteUserError: ''
    };
  },

  computed: {
    panelTitle() {
      return { 
        alta: 'Alta de Vehículos', 
        modificacion: 'Modificación de Vehículos', 
        eliminacion: 'Eliminación de Vehículos',
        mod_user: 'Modificación de Usuarios',
        del_user: 'Eliminación de Usuarios'
      }[this.panel] || '';
    }
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    fetchData() {
      fetch('/api/vehiculos/')
        .then(res => res.json())
        .then(cars => {
          this.cars = cars.map(c => ({...c, precio: Number(c.precio)}));
        });
      
      fetch('/api/usuarios/')
        .then(res => res.json())
        .then(users => {
          this.users = users;
        });
    },

    /* Navegación */
    setPanel(p) {
      this.panel            = p;
      this.altaSuccess      = false;
      this.editSuccess      = false;
      this.editTarget       = null;
      this.deleteTarget     = null;
      this.editUserTarget   = null;
      this.editUserSuccess  = false;
      this.deleteUserTarget = null;
      this.deleteUserError  = '';
    },

    fmtP(precio) { return formatPrice(precio); },

    /*Validaciones */
    validarAlta() {
      const e = {};
      if (!this.alta.nombre)                          e.nombre      = 'El nombre es obligatorio.';
      if (!this.alta.marca)                           e.marca       = 'La marca es obligatoria.';
      if (!this.alta.precio || this.alta.precio <= 0) e.precio      = 'Ingresa un precio mayor a 0.';
      if (!this.alta.descripcion)                     e.descripcion = 'La descripción es obligatoria.';
      if (this.alta.imagen && !isValidUrl(this.alta.imagen)) e.imagen = 'URL inválida.';
      this.altaErrors = e;
      return Object.keys(e).length === 0;
    },
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

    /* Alta Vehículos */
    submitAlta() {
      ['nombre','marca','precio','imagen','descripcion'].forEach(f => { this.altaTouched[f] = true; });
      if (!this.validarAlta()) return;
      
      fetch('/crear_auto/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.alta)
      })
      .then(r => r.json())
      .then(data => {
        if (data.status === 'ok') {
          this.altaSuccess = true;
          setTimeout(() => location.reload(), 1000);
        }
      });
    },
    resetAlta() {
      this.alta        = { nombre: '', marca: '', precio: '', imagen: '', descripcion: '', badge: '' };
      this.altaErrors  = {};
      this.altaTouched = {};
    },

    /* Modificación Vehículos */
    selectEdit(car)  { this.editTarget = car; this.editForm = { ...car }; this.editErrors = {}; this.editTouched = {}; this.editSuccess = false; },
    cancelEdit()     { this.editTarget = null; this.editSuccess = false; },
    submitEdit() {
      ['nombre','marca','precio','imagen','descripcion'].forEach(f => { this.editTouched[f] = true; });
      if (!this.validarEdit()) return;
      
      fetch('/editar_auto/' + this.editTarget.id + '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.editForm)
      })
      .then(r => r.json())
      .then(data => {
        if (data.status === 'ok') {
          this.editSuccess = true;
          setTimeout(() => location.reload(), 1000);
        }
      });
    },

    /* Eliminación Vehículos */
    selectDelete(car) { this.deleteTarget = car; this.deleteMotivo = ''; this.deleteConfirmed = false; this.deleteErrors = {}; },
    cancelDelete()    { this.deleteTarget = null; },
    confirmDelete() {
      const e = {};
      if (!this.deleteMotivo)    e.motivo  = 'Selecciona un motivo.';
      if (!this.deleteConfirmed) e.confirm = 'Debes confirmar la eliminación.';
      this.deleteErrors = e;
      if (Object.keys(e).length > 0) return;
      
      fetch('/eliminar_auto/' + this.deleteTarget.id + '/', {
        method: 'POST'
      })
      .then(r => r.json())
      .then(data => {
        if (data.status === 'ok') {
          location.reload();
        }
      });
    },

    /* Modificación Usuarios */
    selectEditUser(user) { this.editUserTarget = user; this.editUserForm = { ...user }; this.editUserSuccess = false; },
    cancelEditUser() { this.editUserTarget = null; this.editUserSuccess = false; },
    submitEditUser() {
      fetch('/editar_usuario/' + this.editUserTarget.id + '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.editUserForm)
      })
      .then(r => r.json())
      .then(data => {
        if (data.status === 'ok') {
          this.editUserSuccess = true;
          setTimeout(() => location.reload(), 1000);
        }
      });
    },

    /* Eliminación Usuarios */
    selectDeleteUser(user) { this.deleteUserTarget = user; this.deleteUserConfirmed = false; this.deleteUserError = ''; },
    cancelDeleteUser() { this.deleteUserTarget = null; },
    confirmDeleteUser() {
      fetch('/eliminar_usuario/' + this.deleteUserTarget.id + '/', {
        method: 'POST'
      })
      .then(r => {
        if (!r.ok) {
          return r.json().then(e => Promise.reject(e));
        }
        return r.json();
      })
      .then(data => {
        if (data.status === 'ok') {
          location.reload();
        }
      })
      .catch(err => {
        this.deleteUserError = err.message || 'Error al eliminar usuario';
        this.deleteUserConfirmed = false;
      });
    }

  }

}).mount('#app-admin');
