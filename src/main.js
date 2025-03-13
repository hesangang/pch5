import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/main.css'
import './assets/mobile.css'
import { vTouch } from './directives/touch'
import { vLazyload } from './directives/lazyload'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)

// 注册全局指令
app.directive('touch', vTouch)
app.directive('lazyload', vLazyload)

app.mount('#app')

// 移动端性能优化
if (/mobile/i.test(navigator.userAgent)) {
  // 减少不必要的动画
  document.documentElement.classList.add('mobile-device')
  
  // 延迟加载非关键资源
  window.addEventListener('load', () => {
    setTimeout(() => {
      // 加载非关键资源
      const nonCriticalStyles = document.createElement('link')
      nonCriticalStyles.rel = 'stylesheet'
      nonCriticalStyles.href = '/non-critical.css'
      document.head.appendChild(nonCriticalStyles)
    }, 1000)
  })
}
