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
        <a href="#" class="nav-link" :class="{ active: panel === 'alta' }"
           @click.prevent="setPanel('alta')">Alta</a>
        <a href="#" class="nav-link" :class="{ active: panel === 'modificacion' }"
           @click.prevent="setPanel('modificacion')">Modificación</a>
        <a href="#" class="nav-link" :class="{ active: panel === 'eliminacion' }"
           @click.prevent="setPanel('eliminacion')">Eliminación</a>
        <a href="Catalogo.html" class="nav-link">Ver Catálogo</a>
        <a href="index.html"    class="nav-link">Volver al Sitio</a>
      </nav>
    </aside>

    <main>
      <header class="topbar">
        <span>Gestión de Vehículos &nbsp;/&nbsp; <b>{{ panelTitle }}</b></span>
        <span class="dot"></span>
      </header>

      <!-- PANEL 01: ALTA -->
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

      <!-- PANEL 02: MODIFICACIÓN -->
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

      <!-- PANEL 03: ELIMINACIÓN -->
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

    </main>
  `,

  data() {
    return {
      panel: 'alta',
      cars:  [],
      
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
      deleteErrors:    {}
    };
  },

  computed: {
    panelTitle() {
      return { alta: 'Alta', modificacion: 'Modificación', eliminacion: 'Eliminación' }[this.panel] || '';
    }
  },

  mounted() {
    this.cars = getCars();
  },

  methods: {

    /* Navegación */
    setPanel(p) {
      this.panel       = p;
      this.altaSuccess  = false;
      this.editSuccess  = false;
      this.editTarget   = null;
      this.deleteTarget = null;
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

    /* Alta */
    submitAlta() {
      ['nombre','marca','precio','imagen','descripcion'].forEach(f => { this.altaTouched[f] = true; });
      if (!this.validarAlta()) return;
      this.cars.push({ id: Date.now(), ...this.alta });
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

    /* Modificación */
    selectEdit(car)  { this.editTarget = car; this.editForm = { ...car }; this.editErrors = {}; this.editTouched = {}; this.editSuccess = false; },
    cancelEdit()     { this.editTarget = null; this.editSuccess = false; },
    submitEdit() {
      ['nombre','marca','precio','imagen','descripcion'].forEach(f => { this.editTouched[f] = true; });
      if (!this.validarEdit()) return;
      const idx = this.cars.findIndex(c => c.id === this.editTarget.id);
      if (idx !== -1) { this.cars[idx] = { ...this.editForm }; saveCars(this.cars); }
      this.editSuccess = true;
      setTimeout(() => { this.editSuccess = false; this.cancelEdit(); }, 2500);
    },

    /* Eliminación */
    selectDelete(car) { this.deleteTarget = car; this.deleteMotivo = ''; this.deleteConfirmed = false; this.deleteErrors = {}; },
    cancelDelete()    { this.deleteTarget = null; },
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
