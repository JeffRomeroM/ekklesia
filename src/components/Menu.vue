<template>
  <nav class="menu">
    <h2 class="logo">Valle</h2>

    <RouterLink to="/dashboard" class="nav-item">
      <span class="icon">🏠</span>
      <span class="label">Inicio</span>
    </RouterLink>

    <RouterLink to="/ventas" class="nav-item">
      <span class="icon">⛺</span>
      <span class="label">Ventas</span>
    </RouterLink>

    <RouterLink to="/creditos" class="nav-item">
      <span class="icon">💸</span>
      <span class="label">Créditos</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
<style>
    .menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 72px; /* fijo, correcto */
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #fff;
  border-right: 1px solid #eee;
  gap: 1.5rem;
  padding: 1rem 0;
  z-index: 1000;
}

.logo {
  font-family: fantasy;
  font-size: 22px;
}

/* ITEMS */
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  gap: 4px;
}

.nav-item img {
  width: 22px;
}

.label {
  font-size: 11px;
}

/* ACTIVO */
.router-link-active {
  color: #3b82f6;
}

/* MOBILE */
@media (max-width: 640px) {
  .menu {
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    height: 60px;
    bottom: 0;
    top: auto;
    border-top: 1px solid #eee;
    border-right: none;
    position: fixed; /* correcto */
  }

  .logo {
    display: none;
  }

  .nav-item {
    font-size: 12px;
  }
}

</style>