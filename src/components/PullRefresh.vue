<template>
  <div class="pull-refresh-container" 
       @touchstart="handleTouchStart" 
       @touchmove="handleTouchMove" 
       @touchend="handleTouchEnd">
    <div class="pull-refresh-header" :style="{ height: `${refreshHeight}px` }">
      <div class="refresh-icon" :class="{ 'refreshing': isRefreshing }"></div>
      <span>{{ refreshText }}</span>
    </div>
    <div class="pull-refresh-content">
      <slot></slot>
    </div>
    <div class="pull-refresh-footer" v-if="hasMore || isLoading">
      <div class="loading-icon" v-if="isLoading"></div>
      <span>{{ loadingText }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  hasMore: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['refresh', 'loadMore'])

const startY = ref(0)
const distance = ref(0)
const refreshHeight = ref(0)
const maxDistance = 80
const refreshThreshold = 50
const isRefreshing = ref(false)
const isLoading = ref(false)

const refreshText = computed(() => {
  if (isRefreshing.value) return '刷新中...'
  return distance.value >= refreshThreshold ? '释放刷新' : '下拉刷新'
})

const loadingText = computed(() => {
  if (!props.hasMore) return '没有更多数据了'
  return isLoading.value ? '加载中...' : '上拉加载更多'
})

const handleTouchStart = (e) => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  // 只有在顶部才能下拉刷新
  if (scrollTop === 0) {
    startY.value = e.touches[0].clientY
  }
}

const handleTouchMove = (e) => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop === 0 && !isRefreshing.value) {
    const currentY = e.touches[0].clientY
    distance.value = Math.max(0, currentY - startY.value)
    
    if (distance.value > 0) {
      e.preventDefault()
      // 添加阻尼效果
      refreshHeight.value = Math.min(maxDistance, distance.value * 0.6)
    }
  }
}

const handleTouchEnd = () => {
  if (distance.value >= refreshThreshold && !isRefreshing.value) {
    refresh()
  } else {
    resetRefresh()
  }
}

const refresh = () => {
  isRefreshing.value = true
  refreshHeight.value = 50 // 固定高度显示刷新状态
  
  emit('refresh')
  
  // 模拟刷新完成
  setTimeout(() => {
    resetRefresh()
    isRefreshing.value = false
  }, 2000)
}

const resetRefresh = () => {
  distance.value = 0
  refreshHeight.value = 0
}

// 检测滚动到底部
const checkScrollBottom = () => {
  if (isLoading.value || !props.hasMore) return
  
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const clientHeight = document.documentElement.clientHeight
  
  if (scrollTop + clientHeight >= scrollHeight - 50) {
    loadMore()
  }
}

const loadMore = () => {
  if (isLoading.value) return
  
  isLoading.value = true
  emit('loadMore')
  
  // 模拟加载完成
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
}

// 监听滚动事件
window.addEventListener('scroll', checkScrollBottom)
</script>

<style scoped>
.pull-refresh-container {
  position: relative;
  width: 100%;
}

.pull-refresh-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 0;
  overflow: hidden;
  transition: height 0.3s;
  color: #666;
  font-size: 1.4rem;
}

.refresh-icon {
  width: 2rem;
  height: 2rem;
  margin-right: 0.8rem;
  border: 2px solid #1890ff;
  border-radius: 50%;
  border-bottom-color: transparent;
}

.refresh-icon.refreshing {
  animation: rotate 1s linear infinite;
}

.pull-refresh-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5rem;
  color: #666;
  font-size: 1.4rem;
}

.loading-icon {
  width: 2rem;
  height: 2rem;
  margin-right: 0.8rem;
  border: 2px solid #1890ff;
  border-radius: 50%;
  border-bottom-color: transparent;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style> 