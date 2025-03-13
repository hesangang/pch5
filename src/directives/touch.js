// 移动端手势指令
export const vTouch = {
  mounted(el, binding) {
    const touchType = binding.arg || 'tap'
    let startX = 0
    let startY = 0
    let timeStamp = 0
    const threshold = 10
    
    function touchStart(e) {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      timeStamp = e.timeStamp
      el.classList.add('touch-active')
    }
    
    function touchEnd(e) {
      el.classList.remove('touch-active')
      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const deltaTime = e.timeStamp - timeStamp
      
      // 判断是否为轻触
      if (deltaTime < 300) {
        const deltaX = Math.abs(endX - startX)
        const deltaY = Math.abs(endY - startY)
        
        if (touchType === 'tap' && deltaX < threshold && deltaY < threshold) {
          binding.value(e)
        } else if (touchType === 'swipeLeft' && (endX - startX) < -threshold && deltaY < threshold) {
          binding.value(e)
        } else if (touchType === 'swipeRight' && (endX - startX) > threshold && deltaY < threshold) {
          binding.value(e)
        }
      }
    }
    
    el.addEventListener('touchstart', touchStart, { passive: true })
    el.addEventListener('touchend', touchEnd)
    
    // 存储事件清理函数
    el._touchRemove = () => {
      el.removeEventListener('touchstart', touchStart)
      el.removeEventListener('touchend', touchEnd)
    }
  },
  
  unmounted(el) {
    el._touchRemove && el._touchRemove()
  }
} 