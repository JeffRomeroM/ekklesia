import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../views/Dashboard.vue'
import Ventas from '../views/Ventas.vue'
import Creditos from '../views/Creditos.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: Dashboard },
  { path: '/ventas', component: Ventas },
  { path: '/creditos', component: Creditos }
]


export default createRouter({
  history: createWebHistory(),
  routes
})
