<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TechPortal from './views/TechPortal.vue'
</script>

<template>
  <div class="app-container">
    <main class="app-main">
      <TechPortal msg="Vite + Vue" />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-header {
  background-color: #333;
  color: white;
  width: 100%;
  padding: 0rem;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.logo {
  width: 8rem;
  height: auto;
  transition: transform 0.3s ease;
  filter: brightness(150%);
}

.logo:hover {
  transform: scale(1.1);
}

.app-main {
  flex: 1;
  width: 100%;
  max-width: 128rem;
  box-sizing: border-box;
  background-color: #f9f9f9;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .app-header {
    padding: 1.5rem;
  }
  
  .logo {
    width: 6rem;
  }
  

}

/* 小屏幕手机适配 */
@media screen and (max-width: 480px) {
  .app-header {
    padding: 1rem;
  }
  
  .logo {
    width: 5rem;
  }
  
  .app-main {
    padding: 0 1rem;
  }
}
</style>
