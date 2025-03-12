<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <div class="hello-world">
    <h1>{{ msg }}</h1>

    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test HMR
      </p>
    </div>

    <div class="links">
      <p>
        Check out
        <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
          >create-vue</a
        >, the official Vue + Vite starter
      </p>
      <p>
        Install
        <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
        in your IDE for a better DX
      </p>
    </div>
    <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  </div>
</template>

<style scoped>
.hello-world {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

h1 {
  text-align: center;
  width: 100%;
  margin-bottom: 2rem;
}

.card {
  width: 100%;
  max-width: 60rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.links {
  width: 100%;
  max-width: 60rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}

button {
  min-width: 20rem;
  max-width: 100%;
}

.read-the-docs {
  color: #888;
  text-align: center;
  width: 100%;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .hello-world {
    gap: 1.5rem;
  }

  .card {
    padding: 1.5rem;
  }

  button {
    min-width: auto;
    width: 100%;
  }
}

/* 小屏幕手机适配 */
@media screen and (max-width: 480px) {
  .hello-world {
    gap: 1rem;
  }

  .card {
    padding: 1rem;
  }

  h1 {
    margin-bottom: 1rem;
  }
}
</style>
