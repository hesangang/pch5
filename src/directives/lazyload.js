export const vLazyload = {
  mounted(el, binding) {
    const imgSrc = binding.value
    const defaultSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=='
    
    // 设置默认占位图
    el.setAttribute('src', defaultSrc)
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 当元素进入视口时加载真实图片
          const img = new Image()
          img.src = imgSrc
          img.onload = () => {
            el.setAttribute('src', imgSrc)
            el.classList.add('img-loaded')
          }
          observer.unobserve(el)
        }
      })
    })
    
    observer.observe(el)
    
    // 存储清理函数
    el._lazyLoadCleanup = () => {
      observer.unobserve(el)
    }
  },
  
  unmounted(el) {
    el._lazyLoadCleanup && el._lazyLoadCleanup()
  }
} 