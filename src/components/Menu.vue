<template>
  <nav class="menu">
    
    <RouterLink to="/" class="nav-item">
      <span class="icon">Icono</span>
      <span class="label">Inicio</span>
    </RouterLink>
    <RouterLink to="/buses" class="nav-item">
      <span class="icon">Icono</span>
      <span class="label">Buses</span>
    </RouterLink>
    <RouterLink to="/taxis" class="nav-item">
      <span class="icon">Icono</span>
      <span class="label">Taxis</span>
    </RouterLink>
    <RouterLink to="/motos" class="nav-item">
      <span class="icon">Icono</span>
      <span class="label">Motomandados</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 4%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  gap: 2rem;
  z-index: 1000;
  padding: 1rem 0;
}

.logo {
  width: 50px;
}
.logoMovil {
  display: none;
  width: 50px;
}

/* Ítems */
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  font-size: 24px;
  transition: color 0.3s;
  position: relative;
  padding: 3px;
}

.nav-item:hover {
  color: #3b82f6;
}

.label {
  position: absolute;
  left: 60px;
  top: 50%;
  transform: translateY(-50%);
  background: #374151;
  color: white;
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.nav-item:hover .label {
  opacity: 1;
}

.router-link-active {
  color: #3b82f6;
  font-weight: bold;
  background-color: #f3f3f3;
  padding: 3px;
  border-radius: 4px;
}

.icon img {
  width: 24px;
}
@media (max-width: 740px){
  .menu{
    width: 7%;
  }
}
/* Vista móvil estilo TikTok */
@media (max-width: 640px) {
  .menu {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 60px;
    width: 100%;
    bottom: 0;
    top: auto;
    left: 0;
    right: 0;
    padding: 0 1rem;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  }

  .logo {
    display: none;
  }

  .logoMovil {
    display: block;
    position: fixed;
    top: 8px;
    left: 8px;
    z-index: 999;
  }

  .nav-item {
    flex-direction: column; /* icono arriba, texto abajo */
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #555;
    position: relative;
    background-color: #ffffff;
  }

  .label {
    position: static;
    transform: none;
    background: none;
    color: #333;
    padding: 0;
    font-size: 12px;
    opacity: 1;
  }

  .router-link-active .label {
    color: #d19a02;
    font-weight: bold;
    
    background-color: #ffffff;
    padding: 0px;
  }
}
</style>
