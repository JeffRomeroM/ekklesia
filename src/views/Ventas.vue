<template>
  <div class="ventas-container">
    <header class="header">
      <img src="../../public/valle.png" alt="logo" style="width: 40px;">
      <button class="add-btn" @click="openModal()">+ Nueva venta</button>
    </header>

  

    <!-- FILTROS -->
    <div class="filtros">
      <div class="tipo-buttons">
        <button :class="{ active: filtroPago === '' }" @click="filtroPago = ''; cargarVentas()">Todos</button>
        <button :class="{ active: filtroPago === 'CONTADO' }" @click="filtroPago = 'CONTADO'; cargarVentas()">CONTADO</button>
        <button :class="{ active: filtroPago === 'CREDITO' }" @click="filtroPago = 'CREDITO'; cargarVentas()">CRÉDITO</button>
      </div>
      <div class="mes-filtro">
        <label>Mes:
          <select v-model="filtroMes" @change="cargarVentas">
            <option value="">Todos</option>
            <option v-for="(m,n) in meses" :key="n" :value="n+1">{{ m }}</option>
          </select>
        </label>
      </div>
      <div class="buscador">
        <input type="text" v-model="filtroGeneral" placeholder="Buscar cliente..." @input="cargarVentas"/>
      </div>
    </div>
      <!-- Totales -->
    <div class="totales">
      <p>Total Monto: C$ {{ totalMonto }}</p>
      <p>Total Ganancia: C$ {{ totalGanancia }}</p>
    </div>

    <div class="cards">
      <div v-for="venta in ventas" :key="venta.id" 
           class="card" 
           :class="{ credito: venta.tipo_pago === 'CREDITO' }"
           @mouseenter="hoveredCard = venta.id" 
           @mouseleave="hoveredCard = null"
           :style="{ transform: hoveredCard === venta.id ? 'translateY(-5px) scale(1.03)' : 'translateY(0) scale(1)' }">
        <div class="card-body" @click="openModal(venta)">
          <p class="cliente"><i class="icon-user"></i> {{ venta.cliente }}</p>
          <p><p class="icon-cash"></p> Recarga: C$ {{ venta.recarga }}</p>
          <p>💸 Monto: C$ {{ venta.monto }}</p>
          <p><i class="icon-credit-card"></i> {{ venta.tipo_pago }}</p>
          <p><i class="icon-trending-up"></i> Ganancia: C$ {{ venta.ganancia }}</p>
          <small><i class="icon-calendar"></i> {{ venta.fecha }}</small>
        </div>

        <div class="card-actions">
          <button class="edit" @click.stop="openModal(venta)">
            <i class="icon-edit"></i> Editar
          </button>
          <button class="delete" @click.stop="confirmDelete(venta)">
            <i class="icon-trash"></i> Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- MODALES (igual que antes) -->
    <transition name="modal">
      <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <h3>{{ form.id ? 'Editar venta' : 'Nueva venta' }}</h3>
          <form @submit.prevent="saveVenta">
            <label>Cliente</label>
            <input v-model="form.cliente" placeholder="Cliente" required />

            <label>Recarga</label>
            <input v-model.number="form.recarga" placeholder="Recarga" />

            <label>Monto</label>
            <input type="number" v-model.number="form.monto" placeholder="Monto" />

            <div class="tipo-buttons">
              <button type="button" :class="{ active: form.tipo_pago === 'CONTADO' }" @click="form.tipo_pago = 'CONTADO'">CONTADO</button>
              <button type="button" :class="{ active: form.tipo_pago === 'CREDITO' }" @click="form.tipo_pago = 'CREDITO'">CRÉDITO</button>
            </div>

            <label>Ganancia</label>
            <input type="number" v-model.number="form.ganancia" placeholder="Ganancia" />
            <input type="date" v-model="form.fecha" />

            <div class="modal-actions">
              <button type="submit" class="save">Guardar</button>
              <button type="button" class="cancel" @click="closeModal">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div v-if="confirmOpen" class="modal-overlay">
        <div class="modal confirm">
          <h3>¿Eliminar venta?</h3>
          <p>Esta acción no se puede deshacer.</p>
          <div class="modal-actions">
            <button class="delete" @click="deleteVenta">Eliminar</button>
            <button class="cancel" @click="confirmOpen=false">Cancelar</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const ventas = ref([])
const modalOpen = ref(false)
const confirmOpen = ref(false)
const ventaEliminar = ref(null)
const hoveredCard = ref(null)

const filtroPago = ref('')
const filtroMes = ref('')
const filtroGeneral = ref('')
const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

const emptyForm = {
  cliente: '',
  recarga: 10,
  monto: 0,
  tipo_pago: 'CONTADO',
  ganancia: 0,
  fecha: new Date().toISOString().slice(0, 10)
}
const form = ref({ ...emptyForm })

function openModal(venta = null) {
  form.value = venta ? { ...venta } : { ...emptyForm }
  modalOpen.value = true
}
function closeModal() { modalOpen.value = false; form.value = { ...emptyForm } }
function confirmDelete(venta) { ventaEliminar.value = venta; confirmOpen.value = true }

async function deleteVenta() {
  await supabase.from('ventas').delete().eq('id', ventaEliminar.value.id)
  confirmOpen.value = false
  cargarVentas()
}

async function cargarVentas() {
  let query = supabase.from('ventas').select('*').order('created_at', { ascending: false })

  if(filtroPago.value) query = query.eq('tipo_pago', filtroPago.value)
  if(filtroMes.value){
    const year = new Date().getFullYear()
    const mes = String(filtroMes.value).padStart(2,'0')
    query = query.gte('fecha', `${year}-${mes}-01`).lte('fecha', `${year}-${mes}-31`)
  }

  const { data, error } = await query
  if(error) { console.error(error); ventas.value = [] }
  else {
    if(filtroGeneral.value){
      const texto = filtroGeneral.value.toLowerCase()
      ventas.value = data.filter(v => v.cliente.toLowerCase().includes(texto))
    } else ventas.value = data || []
  }
}

// Totales
const totalMonto = computed(() => ventas.value.reduce((sum, v) => sum + Number(v.monto || 0), 0))
const totalGanancia = computed(() => ventas.value.reduce((sum, v) => sum + Number(v.ganancia || 0), 0))

async function saveVenta() {
  if(form.value.id) await supabase.from('ventas').update(form.value).eq('id', form.value.id)
  else await supabase.from('ventas').insert(form.value)
  closeModal()
  cargarVentas()
}

onMounted(cargarVentas)
</script>

<style scoped>
.ventas-container{padding:1rem;max-width:1200px;margin:auto}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}
.add-btn{background:#4f46e5;color:#fff;padding:.4rem .8rem;border-radius:12px;transition:0.2s;border:none;}
.add-btn:hover{background:#4338ca}
.totales{display:flex;gap:2rem;margin-bottom:1rem;font-weight:600;font-size:1.1rem;}
.filtros{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;}
.tipo-buttons button{padding:.4rem .8rem;border-radius:8px;border:1px solid #d1d5db;background:#f3f4f6; margin: 2px; cursor:pointer;}
.tipo-buttons button.active{background:#4f46e5;color:#fff;border:none;}
.tipo-buttons button:hover:not(.active){background:#e0e7ff;}
.mes-filtro select,input{padding:.4rem;border-radius:6px;border:1px solid #d1d5db;}

.cards{display:grid;grid-template-columns:repeat(2,1fr);gap:.8rem;margin:-10px;}
@media(min-width:768px){.cards{grid-template-columns:repeat(4,1fr)}}

.card{background:linear-gradient(145deg,#ffffff,#f0f0f0);border-radius:16px;box-shadow:0 8px 20px rgba(0,0,0,0.12);display:flex;flex-direction:column;justify-content:space-between;transition:transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;}
.card.credito{background:linear-gradient(145deg,#fee2e2,#fca5a5);}
.card-body{padding:1rem;cursor:pointer}
.card-body p,.card-body small{display:flex;align-items:center;gap:0.5rem;margin:.3rem 0;font-weight:500;color:#111827}
.cliente{font-weight:600;font-size:1.1rem}
.card-actions{display:flex;border-top:1px solid rgba(0,0,0,0.05);}
.card-actions button{flex:1;padding:.5rem;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.3rem;font-weight:500;transition:0.2s;}
.edit{background:#e0e7ff;color:#1e40af}.edit:hover{background:#c7d2fe}
.delete{background:#fee2e2;color:#b91c1c}.delete:hover{background:#fecaca}

.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;justify-content:center;align-items:center;z-index:1000;}
.modal{background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);padding:1.5rem;border-radius:16px;width:90%;max-width:420px;display:flex;flex-direction:column;gap:0.6rem;}
.modal input{
  width: 90%;
  margin-bottom: 9px;
}
.modal-actions{display:flex;justify-content:space-between;margin-top:1rem}
.save{background:#4f46e5;color:#fff;transition:0.2s}.save:hover{background:#4338ca}
.cancel{background:#e5e7eb;transition:0.2s}.cancel:hover{background:#d1d5db;}

.tipo-buttons button, .recarga-buttons button{flex:1;padding:.5rem;border-radius:8px;border:1px solid #d1d5db;background:#f3f4f6;cursor:pointer;transition:0.2s;}
.tipo-buttons button.active, .recarga-buttons button.active{background:#4f46e5;color:#fff;border:none;}
.tipo-buttons button:hover:not(.active), .recarga-buttons button:hover:not(.active){background:#e0e7ff;}

.modal-enter-active,.modal-leave-active{transition:all 0.25s ease;}
.modal-enter-from,.modal-leave-to{opacity:0;transform:scale(0.95);}

.icon-user::before{content:'👤';}
.icon-cash::before{content:'💵';}
.icon-credit-card::before{content:'💳';}
.icon-trending-up::before{content:'📈';}
.icon-calendar::before{content:'📅';}
.icon-edit::before{content:'✏️';}
.icon-trash::before{content:'🗑️';}
</style>
