<template>
  <div class="dashboard-container">
    <header class="header">
      <img src="../../public/valle.png" alt="logo" style="width: 40px;">
    </header>

    <!-- FILTROS -->
    <div class="filtros">
      <div class="tipo-buttons">
        <button :class="{ active: filtroPago === '' }" @click="filtroPago = ''; filtrarVentas()">Todos</button>
        <button :class="{ active: filtroPago === 'CONTADO' }" @click="filtroPago = 'CONTADO'; filtrarVentas()">CONTADO</button>
        <button :class="{ active: filtroPago === 'CREDITO' }" @click="filtroPago = 'CREDITO'; filtrarVentas()">CRÉDITO</button>
      </div>
      <div class="mes-filtro">
        <label>Mes:
          <select v-model="filtroMes" @change="filtrarVentas">
            <option value="">Todos</option>
            <option v-for="(m,n) in meses" :key="n" :value="n+1">{{ m }}</option>
          </select>
        </label>
      </div>
    </div>

    <!-- Totales -->
    <div class="totales">
      <div class="total-card">
        <h3>Total Ventas</h3>
        <p>C$ {{ totalMonto }}</p>
      </div>
      <div class="total-card">
        <h3>Total Ganancia</h3>
        <p>C$ {{ totalGanancia }}</p>
      </div>
      <div class="total-card">
        <h3>Total Recarga</h3>
        <p>C$ {{ totalRecarga }}</p>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="graficos">
      <div class="grafico-card">
        <h4>Ventas por Tipo de Pago</h4>
        <canvas id="tipoPagoChart"></canvas>
      </div>

      <div class="grafico-card">
        <h4>Ganancia por Mes</h4>
        <canvas id="gananciaMesChart"></canvas>
      </div>

      <div class="grafico-card">
        <h4>Distribución de Clientes</h4>
        <canvas id="clientesChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { createClient } from '@supabase/supabase-js'
import Chart from 'chart.js/auto'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const ventas = ref([])
const ventasFiltradas = ref([])

const filtroPago = ref('')
const filtroMes = ref('')
const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

// Totales computados sobre ventas filtradas
const totalMonto = computed(() => ventasFiltradas.value.reduce((sum, v) => sum + Number(v.monto || 0), 0))
const totalGanancia = computed(() => ventasFiltradas.value.reduce((sum, v) => sum + Number(v.ganancia || 0), 0))
const totalRecarga = computed(() => ventasFiltradas.value.reduce((sum, v) => sum + Number(v.recarga || 0), 0))

let tipoPagoChart, gananciaMesChart, clientesChart

async function cargarVentas() {
  const { data, error } = await supabase.from('ventas').select('*')
  if(error){ console.error(error); ventas.value = [] }
  else ventas.value = data || []

  filtrarVentas()
}

function filtrarVentas() {
  const year = new Date().getFullYear()
  ventasFiltradas.value = ventas.value.filter(v => {
    let coincide = true
    if(filtroPago.value) coincide = coincide && v.tipo_pago === filtroPago.value
    if(filtroMes.value){
      const mesVenta = new Date(v.fecha).getMonth()+1
      coincide = coincide && mesVenta === Number(filtroMes.value)
    }
    return coincide
  })
  generarGraficos()
}

function generarGraficos() {
  // Destruir gráficos anteriores si existen
  tipoPagoChart?.destroy()
  gananciaMesChart?.destroy()
  clientesChart?.destroy()

  // Tipo de Pago
  const tipos = { CONTADO:0, CREDITO:0 }
  ventasFiltradas.value.forEach(v => tipos[v.tipo_pago] = (tipos[v.tipo_pago] || 0)+1)
  tipoPagoChart = new Chart(document.getElementById('tipoPagoChart'), {
    type:'doughnut',
    data:{
      labels:['Contado','Crédito'],
      datasets:[{ data:[tipos.CONTADO, tipos.CREDITO], backgroundColor:['#4f46e5','#f87171'] }]
    }
  })

  // Ganancia por Mes
  const gananciasMes = Array(12).fill(0)
  ventasFiltradas.value.forEach(v => {
    const d = new Date(v.fecha)
    if(d.getFullYear() === year) gananciasMes[d.getMonth()] += Number(v.ganancia || 0)
  })
  gananciaMesChart = new Chart(document.getElementById('gananciaMesChart'), {
    type:'bar',
    data:{
      labels: meses,
      datasets:[{ label:'Ganancia', data: gananciasMes, backgroundColor:'#4f46e5' }]
    },
    options:{responsive:true, plugins:{legend:{display:false}}}
  })

  // Distribución de Clientes
  const clientesMap = {}
  ventasFiltradas.value.forEach(v => { clientesMap[v.cliente] = (clientesMap[v.cliente]||0)+1 })
  clientesChart = new Chart(document.getElementById('clientesChart'), {
    type:'pie',
    data:{
      labels:Object.keys(clientesMap),
      datasets:[{ data:Object.values(clientesMap), backgroundColor:Object.keys(clientesMap).map(_=>`hsl(${Math.random()*360},70%,60%)`) }]
    }
  })
}

onMounted(cargarVentas)
</script>

<style scoped>
.dashboard-container{padding:1rem;max-width:1200px;margin:auto}
.header{margin-bottom:1.5rem;font-weight:600;font-size:1.2rem;}
.filtros{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem;}
.tipo-buttons button{padding:.4rem .8rem;border-radius:8px;border:1px solid #d1d5db;background:#f3f4f6; cursor:pointer; margin:2px;}
.tipo-buttons button.active{background:#4f46e5;color:#fff;border:none;}
.tipo-buttons button:hover:not(.active){background:#e0e7ff;}
.mes-filtro select{padding:.4rem;border-radius:6px;border:1px solid #d1d5db;}

.totales{display:flex;gap:1rem;margin-bottom:2rem;flex-wrap:wrap}
.total-card{background:#f3f4f6;padding:1rem;border-radius:12px;flex:1;text-align:center;font-weight:600}

.graficos{display:grid;grid-template-columns:1fr;gap:1.5rem}
@media(min-width:768px){.graficos{grid-template-columns:repeat(2,1fr)}}
.grafico-card{background:#fff;padding:1rem;border-radius:12px;box-shadow:0 4px 15px rgba(0,0,0,0.1)}
.grafico-card h4{margin-bottom:0.8rem;font-weight:600}
</style>
