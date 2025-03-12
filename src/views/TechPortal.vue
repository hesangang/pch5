<template>
  <div class="tech-portal">
    <!-- 头部导航 -->
    <nav class="nav-header">
      <div class="logo">
        <img :src="logoImg" alt="Logo">
      </div>
      <div class="nav-menu" :class="{ 'active': isMenuOpen }">
        <a href="#" class="nav-item">技术门户</a>
        <a href="#" class="nav-item">工单中心</a>
        <a href="#" class="nav-item">研发指引</a>
        <a href="#" class="nav-item">开发工具</a>
      </div>
      <div class="user-info">
        <img :src="avatarImg" alt="Avatar">
        <span>欢迎登录</span>
      </div>
      <div class="menu-toggle" @click="toggleMenu">
        <i class="el-icon-menu"></i>
      </div>
    </nav>

    <!-- 主要内容区 -->
    <div class="content">
      <h2 class="section-title">技术门户</h2>

      <!-- 研发工具区域 -->
      <section class="card-section">
        <h3 class="category-title">研发工具</h3>
        <div class="card-grid">
          <div v-for="(item, index) in devTools" :key="index" class="card">
            <img :src="item.icon" :alt="item.name">
            <span class="card-name">{{ item.name }}</span>
            <span v-if="item.hot" class="hot-tag">🔥</span>
          </div>
        </div>
      </section>

      <!-- 混合云区域 -->
      <section class="card-section">
        <h3 class="category-title">混合云</h3>
        <div class="card-grid">
          <div v-for="(item, index) in cloudServices" :key="index" class="card">
            <img :src="item.icon" :alt="item.name">
            <span class="card-name">{{ item.name }}</span>
            <span v-if="item.hot" class="hot-tag">🔥</span>
          </div>
        </div>
      </section>

      <!-- 其他区域类似... -->
    </div>
    <!-- 新增技术文章推荐区域 -->
    <section class="card-section">
      <h3 class="category-title">技术文章推荐</h3>
      <div class="card-grid">
        <div v-for="(article, index) in techArticles" :key="index" class="card">
          <img :src="article.icon" :alt="article.title">
          <div>
            <span class="card-name">{{ article.title }}</span>
            <p>{{ article.summary }}</p>
          </div>
        </div>
      </div>
    </section>
    <!-- 新增热门工单区域 -->
    <section class="card-section">
      <h3 class="category-title">热门工单</h3>
      <div class="card-grid">
        <div v-for="(ticket, index) in hotTickets" :key="index" class="card">
          <img :src="ticket.icon" :alt="ticket.title">
          <div>
            <span class="card-name">{{ ticket.title }}</span>
            <p>{{ ticket.status }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import logoImg from '../assets/vue.svg'
// 使用默认的 Vue logo 作为临时头像
import avatarImg from '../assets/vue.svg'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 更新示例数据使用实际的图标
const devTools = [
  { 
    name: 'CODING', 
    icon: logoImg, 
    hot: true 
  },
  { 
    name: '集成平台', 
    icon: logoImg 
  },
  { 
    name: '伊利通服务', 
    icon: logoImg 
  },
  { 
    name: '权限中心', 
    icon: logoImg 
  },
  { 
    name: '低代码', 
    icon: logoImg, 
    hot: true 
  }
]

const cloudServices = [
  { 
    name: '便签办公系统', 
    icon: logoImg, 
    hot: true 
  },
  { 
    name: '私有云K8s-测试', 
    icon: logoImg, 
    hot: true 
  },
  { 
    name: '私有云K8s-生产', 
    icon: logoImg, 
    hot: true 
  }
]
const techArticles = [
  { title: '文章标题1', summary: '文章摘要1', icon: logoImg },
  { title: '文章标题2', summary: '文章摘要2', icon: logoImg },
  // 可添加更多文章
]
const hotTickets = [
  { title: '工单标题1', status: '处理中', icon: logoImg },
  { title: '工单标题2', status: '已完成', icon: logoImg },
  // 可添加更多工单
]
</script>

<style scoped>
.tech-portal {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 导航栏样式 */
.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 2rem; /* 调小导航栏内边距 */
  background: #333;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo img {
  height: 2.4rem; /* 进一步调小 logo 高度 */
}

.nav-menu {
  display: flex;
  gap: 2rem; /* 调小导航项间距 */
}

.nav-item {
  color: white;
  text-decoration: none;
  font-size: 1.6rem; /* 调小导航项字体大小 */
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem; /* 调小用户信息间距 */
}

.user-info img {
  width: 2.8rem; /* 调小用户头像宽度 */
  height: 2.8rem; /* 调小用户头像高度 */
  border-radius: 50%;
}

/* 内容区样式 */
.content {
  max-width: 120rem; /* 调小内容区最大宽度 */
  margin: 0 auto;
  padding: 2rem; /* 调小内容区内边距 */
}

.section-title {
  font-size: 2.2rem; /* 调小标题字体大小 */
  margin-bottom: 1.8rem; /* 调小标题底部间距 */
  color: #333;
}

.card-section {
  margin-bottom: 3rem; /* 调小卡片区域底部间距 */
}

.category-title {
  font-size: 1.8rem; /* 调小分类标题字体大小 */
  margin-bottom: 1.5rem; /* 调小分类标题底部间距 */
  color: #666;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr)); /* 调小卡片列最小宽度 */
  gap: 2rem; /* 调小卡片间距 */
}

.card {
  background: #fff;
  border-radius: 0.8rem;
  padding: 1.5rem; /* 调小卡片内边距 */
  display: flex;
  align-items: center;
  gap: 1.5rem; /* 调小卡片内元素间距 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  transform: scale(1);
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.card img {
  width: 2.2rem; /* 调小卡片内图标宽度 */
  height: 2.2rem; /* 调小卡片内图标高度 */
  object-fit: contain;
}

.card-name {
  font-size: 1.4rem; /* 原 1.6rem */
  color: #333;
  flex: 1;
}

.hot-tag {
  font-size: 1.2rem; /* 调小热门标签字体大小 */
  color: #ff4d4f;
}

.menu-toggle {
  display: none;
  font-size: 2.2rem; /* 调小菜单切换按钮字体大小 */
  cursor: pointer;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .nav-menu {
    position: fixed;
    top: 6rem; /* 调整菜单弹出位置 */
    left: 0;
    right: 0;
    background: #fff;
    flex-direction: column;
    padding: 1.5rem; /* 调小菜单内边距 */
    transform: translateY(-150%);
    transition: transform 0.3s ease;
    display: none;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  .nav-menu.active {
    transform: translateY(0);
    display: flex;
  }

  .nav-item {
    padding: 0.8rem 0; /* 进一步调小导航项内边距 */
    border-bottom: 1px solid #eee;
  }

  .nav-item:last-child {
    border-bottom: none;
  }

  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr)); /* 进一步调小卡片列最小宽度 */
    gap: 0.8rem; /* 进一步调小卡片间距 */
  }

  .card {
    padding: 1rem; /* 进一步调小卡片内边距 */
  }
}

/* 优化导航栏样式，确保在小屏幕上显示正常 */
.nav-header {
  flex-wrap: wrap;
  justify-content: space-between;
}

.menu-toggle {
  display: block;
}

.nav-menu {
  display: none;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

.nav-menu.active {
  display: flex;
}

/* 优化卡片布局，确保在小屏幕上显示正常 */
.card-grid {
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
}

/* 新增小屏幕适配样式 */
@media screen and (max-width: 480px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr); /* 移动端一行展示两个卡片 */
    gap: 0.8rem; /* 进一步调小卡片间距 */
  }
}

@media screen and (max-width: 480px) {
  .nav-header {
    padding: 0.8rem; /* 进一步调小导航栏内边距 */
  }

  .logo img {
    height: 2rem; /* 进一步调小 logo 高度 */
  }

  .user-info img {
    width: 2rem; /* 进一步调小用户头像宽度 */
    height: 2rem; /* 进一步调小用户头像高度 */
  }

  .section-title {
    font-size: 1.8rem; /* 进一步调小标题字体大小 */
    margin-bottom: 1.2rem; /* 进一步调小标题底部间距 */
  }

  .category-title {
    font-size: 1.4rem; /* 原 1.6rem */
    margin-bottom: 1.5rem; /* 调小分类标题底部间距 */
    color: #666;
  }

  .card-grid {
    grid-template-columns: repeat(4, 1fr); 
  }

  .card {
    padding: 1rem; /* 进一步调小卡片内边距 */
  }
}
</style>