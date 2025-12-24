<template>
  <div class="creditos-container">
    <header class="header">
      <img src="../../public/valle.png" alt="logo" style="width: 40px;">
      <p class="total">Total créditos: C$ {{ totalCreditos }}</p>

      <div class="filtros">
        <label>
          Mes:
          <select v-model="filtroMes" @change="cargarCreditos">
            <option value="">Todos</option>
            <option v-for="(m,n) in meses" :key="n" :value="n+1">{{ m }}</option>
          </select>
        </label>

        <label>
          Buscar:
          <input v-model="filtroGeneral" placeholder="Cliente, etc." @input="cargarCreditos"/>
        </label>
      </div>
    </header>

    <div class="cards">
      <div v-for="venta in creditos" :key="venta.id" class="card">
        <div class="card-body">
          <p><i class="icon-user"></i> {{ venta.cliente }}</p>
          <p><i class="icon-cash"></i> Recarga: C$ {{ venta.recarga }}</p>
          <p><i class="icon-trending-up"></i> Ganancia: C$ {{ venta.ganancia }}</p>
          <small><i class="icon-calendar"></i> {{ venta.fecha }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const creditos = ref([])
const filtroMes = ref('')
const filtroGeneral = ref('')
const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

const totalCreditos = computed(() =>
  creditos.value.reduce((sum, v) => sum + v.ganancia, 0)
)

async function cargarCreditos() {
  let query = supabase
    .from('ventas')
    .select('*')
    .eq('tipo_pago', 'CREDITO')
    .order('fecha', { ascending: false })

  // Filtrar por mes
  if (filtroMes.value) {
    const year = new Date().getFullYear()
    const mes = String(filtroMes.value).padStart(2,'0')
    query = query.gte('fecha', `${year}-${mes}-01`).lte('fecha', `${year}-${mes}-31`)
  }

  const { data, error } = await query
  if (error) {
    console.error(error)
    creditos.value = []
    return
  }

  // Filtro general por cliente o texto
  if (filtroGeneral.value) {
    const texto = filtroGeneral.value.toLowerCase()
    creditos.value = data.filter(v =>
      v.cliente.toLowerCase().includes(texto)
    )
  } else {
    creditos.value = data || []
  }
}

onMounted(cargarCreditos)
</script>

<style scoped>
.creditos-container{padding:1rem;max-width:900px;margin:auto}
.header{display:flex;flex-direction:column;gap:.5rem;margin-bottom:1rem}
.total{font-weight:600;color:#dc2626}
.filtros{display:flex;gap:1rem;margin-top:.5rem}
.filtros input, .filtros select{padding:.4rem;border-radius:6px;border:1px solid #d1d5db}

.cards{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:1rem;
}
@media(min-width:768px){.cards{grid-template-columns:repeat(3,1fr)}}

.card{
  background:linear-gradient(145deg,#fee2e2,#fca5a5);
  border-radius:16px;
  box-shadow:0 8px 20px rgba(0,0,0,0.12);
  display:flex;flex-direction:column;padding:1rem;transition:transform .2s
}
.card:hover{transform:translateY(-5px) scale(1.02);box-shadow:0 12px 30px rgba(0,0,0,0.2)}
.card-body p, .card-body small{display:flex;align-items:center;gap:.5rem;margin:.3rem 0;font-weight:500;color:#111827}

/* Íconos */
.icon-user::before { content: '👤'; }
.icon-cash::before { content: '💵'; }
.icon-trending-up::before { content: '📈'; }
.icon-calendar::before { content: '📅'; }
</style>
