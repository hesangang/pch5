import { createRouter, createWebHistory } from 'vue-router'
import TechPortal from '../views/TechPortal.vue'

const routes = [
  {
    path: '/',
    name: 'TechPortal',
    component: TechPortal
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 