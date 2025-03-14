<template>
  <div class="tech-portal">
    <!-- 头部导航 -->
    <nav class="nav-header" :class="{ 'header-hidden': !isHeaderVisible }">
      <div class="logo">
        <img :src="logoImg" alt="Logo">
        <span class="logo-text">{{ pageConfig[currentPage].title }}</span>
      </div>
      <el-drawer v-if="isMobile" v-model="isMenuOpen" direction="ltr" size="80%">
        <el-menu :default-active="currentPage" class="el-menu-vertical-demo">
          <el-menu-item v-for="(page, key) in pageConfig" 
                        :key="key" 
                        :index="key"
                        @click="navigateTo(key)">
            {{ page.title }}
          </el-menu-item>
        </el-menu>
      </el-drawer>
      <div class="nav-menu" v-else :class="{ 'active': isMenuOpen }">
        <a v-for="(page, key) in pageConfig" 
           :key="key"
           href="#" 
           class="nav-item"
           :class="{ 'active': currentPage === key }"
           @click.prevent="navigateTo(key)">
          {{ page.title }}
        </a>
      </div>
      <div class="user-info" @click="showLoginModal = true">
        <img :src="userInfo.avatar || avatarImg" alt="Avatar" class="avatar">
        <div class="user-detail">
          <span class="username">{{ userInfo.name || '点击登录' }}</span>
          <span v-if="userInfo.name" class="user-role">{{ userInfo.role }}</span>
        </div>
      </div>
      <div class="menu-toggle" @click="toggleMenu" @touchstart.prevent="toggleMenu">
        <span class="menu-icon"></span>
        <span class="menu-icon"></span>
        <span class="menu-icon"></span>
      </div>
    </nav>

    <!-- 主要内容区 -->
    <pull-refresh @refresh="handleRefresh" @loadMore="handleLoadMore" :has-more="hasMore">
      <div class="content">
        <!-- 动态渲染当前页面内容 -->
        <template v-if="currentPage === '技术门户'">
          <section v-for="(category, index) in currentPageData" :key="index" class="card-section">
            <div class="category-header">
              <h3 class="category-title">{{ category.category }}</h3>
            </div>
            <div class="card-grid">
              <div v-for="(item, itemIndex) in category.items" 
                  :key="itemIndex" 
                  class="card"
                  @click="openCard(item)"
                  @touchstart="handleTouchStart"
                  @touchend="handleTouchEnd">
                <div class="card-content">
                  <span class="card-name">{{ item.name }}</span>
                </div>
                <span v-if="item.hot" class="hot-tag">热</span>
              </div>
            </div>
          </section>
        </template>

        <template v-else-if="currentPage === '工单中心'">
          <section v-for="(category, index) in currentPageData" :key="index" class="card-section">
            <div class="category-header">
              <h3 class="category-title">{{ category.category }}</h3>
            </div>
            <div class="card-grid">
              <div v-for="(item, itemIndex) in category.items" 
                  :key="itemIndex" 
                  class="card"
                  @click="openCard(item)"
                  @touchstart="handleTouchStart"
                  @touchend="handleTouchEnd">
                <div class="card-content">
                  <span class="card-name">{{ item.name }}</span>
                </div>
                <span v-if="item.hot" class="hot-tag">热</span>
              </div>
            </div>
          </section>
        </template>

        <template v-else>
          <div class="coming-soon">
            <h2>功能开发中</h2>
            <p>敬请期待</p>
          </div>
        </template>
      </div>
    </pull-refresh>
    
    <!-- 移动端底部导航 -->
    <div class="mobile-tabbar" v-if="isMobile" :class="{ 'tabbar-hidden': !isTabbarVisible }">
      <div v-for="(page, key) in pageConfig" 
           :key="key"
           class="tab-item" 
           :class="{ 'active': currentPage === key }"
           @click="navigateTo(key)">
        <div class="tab-icon" :class="`${key.toLowerCase()}-icon`"></div>
        <span>{{ page.title }}</span>
      </div>
    </div>

    <!-- 登录弹窗 -->
    <div class="login-modal" v-if="showLoginModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>用户登录</h3>
          <span class="close-btn" @click="showLoginModal = false">×</span>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>用户名</label>
            <input type="text" v-model="loginForm.username" placeholder="请输入用户名">
          </div>
          <div class="form-group">
            <label>密码</label>
            <input type="password" v-model="loginForm.password" placeholder="请输入密码">
          </div>
          <div class="remember-me">
            <input type="checkbox" id="remember" v-model="loginForm.remember">
            <label for="remember">记住我</label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="showLoginModal = false">取消</button>
          <button class="login-btn" @click="handleLogin">登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import PullRefresh from '../components/PullRefresh.vue'
import logoImg from '../assets/vue.svg'
import avatarImg from '../assets/vue.svg'

// 响应式状态
const isMenuOpen = ref(false)
const searchText = ref('')
const hasMore = ref(true)
const showLoginModal = ref(false)
const isHeaderVisible = ref(true)
const isTabbarVisible = ref(true)
const isMobile = ref(window.innerWidth <= 768)
const currentPage = ref('技术门户') // 添加当前页面状态
let lastScrollTop = 0
let scrollTimer = null

// 登录表单
const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

// 用户信息
const userInfo = ref({
  name: '',
  role: '',
  avatar: ''
})

// 技术门户
const techPortalData = ref([
  {
    category: '研发工具',
    items: [
      { name: 'CODING', icon: logoImg, hot: true, desc: '代码托管平台' },
      { name: '集成平台', icon: logoImg, desc: '系统集成工具' },
      { name: '伊利通服务', icon: logoImg, desc: '通用服务平台' },
      { name: '权限中心', icon: logoImg, desc: '统一权限管理' },
      { name: '低代码', icon: logoImg, hot: true, desc: '快速应用构建' },
      { name: '数据平台', icon: logoImg, desc: '数据分析工具' },
      { name: '测试平台', icon: logoImg, hot: true, desc: '自动化测试' },
      { name: '监控中心', icon: logoImg, desc: '系统监控' }
    ]
  },
  {
    category: '混合云',
    items: [
      { name: '便签办公系统', icon: logoImg, hot: true, desc: '高效办公工具' },
      { name: '私有云K8s-测试', icon: logoImg, hot: true, desc: '容器编排测试环境' },
      { name: '私有云K8s-生产', icon: logoImg, hot: true, desc: '容器编排生产环境' },
      { name: '云存储服务', icon: logoImg, desc: '对象存储' },
      { name: '数据库服务', icon: logoImg, desc: '关系型数据库' },
      { name: '消息队列', icon: logoImg, desc: '分布式消息服务' }
    ]
  },
  {
    category: 'AI工具',
    items: [
      { name: 'YILI-GPT', icon: logoImg, hot: true, desc: 'AI助手' },
      { name: 'AI代码助手', icon: logoImg, desc: '智能编程辅助' },
      { name: 'AI数据分析', icon: logoImg, desc: '智能数据处理' },
      { name: '知识库智能搜索', icon: logoImg, hot: true, desc: '智能文档检索' }
    ]
  },
  {
    category: '云服务',
    items: [
      { name: '便签办公系统', icon: logoImg, hot: true, desc: '高效办公工具' },
      { name: '私有云K8s-测试', icon: logoImg, hot: true, desc: '容器编排测试环境' },
      { name: '私有云K8s-生产', icon: logoImg, hot: true, desc: '容器编排生产环境' },
      { name: '云存储服务', icon: logoImg, desc: '对象存储' },
      { name: '数据库服务', icon: logoImg, desc: '关系型数据库' },
      { name: '消息队列', icon: logoImg, desc: '分布式消息服务' }
    ]
  }
]);

// 工单中心数据
const workOrdersData = ref([
  {
    category: '系统变更',
    items: [
      { name: '系统流量申请', icon: 'flow-icon', hot: true, desc: '系统变更相关申请' },
      { name: '系统变更申请', icon: 'change-icon', desc: '系统变更相关申请' },
      { name: '网络策略申请', icon: 'network-icon', desc: '网络策略相关申请' },
      { name: '用户权限变更', icon: 'permission-icon', desc: '用户权限相关变更' }
    ]
  },
  {
    category: '人员',
    items: [
      { name: '人员进场', icon: 'entry-icon', desc: '人员进场相关申请' },
      { name: '人员离场', icon: 'exit-icon', desc: '人员离场相关申请' }
    ]
  },
  {
    category: '项目',
    items: [
      { name: '新签约包需求审批', icon: 'package-icon', desc: '项目相关审批' },
      { name: '采购需求审批', icon: 'purchase-icon', desc: '采购相关审批' }
    ]
  },
  {
    category: '技术',
    items: [
      { name: '集成平台系统链路入口注册', icon: 'integration-icon', desc: '技术相关注册' },
      { name: '大数据工单', icon: 'bigdata-icon', desc: '技术相关工单' }
    ]
  },
  {
    category: 'AI工具',
    items: [
      { name: '人工智能解决方案工单', icon: 'ai-icon', desc: 'AI工具相关工单' }
    ]
  }
]);

// 页面配置
const pageConfig = {
  '技术门户': {
    data: techPortalData,
    title: '技术门户'
  },
  '工单中心': {
    data: workOrdersData,
    title: '工单中心'
  },
  '研发指引': {
    data: techPortalData,
    title: '研发指引'
  },
  '开发工具': {
    data: techPortalData,
    title: '开发工具'
  }
}

// 计算当前页面数据
const currentPageData = computed(() => {
  return pageConfig[currentPage.value]?.data.value || []
})

// 监听窗口大小变化
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

// 切换菜单
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 触摸交互处理
const handleTouchStart = (e) => {
  e.currentTarget.classList.add('touch-active')
}

const handleTouchEnd = (e) => {
  e.currentTarget.classList.remove('touch-active')
}

// 打开卡片
const openCard = (item) => {
  console.log('打开卡片:', item.name)
  // 这里可以添加导航或弹窗逻辑
}

// 处理登录
const handleLogin = () => {
  // 模拟登录
  if (loginForm.value.username && loginForm.value.password) {
    userInfo.value = {
      name: loginForm.value.username,
      role: '开发工程师',
      avatar: avatarImg
    }
    showLoginModal.value = false
  }
}

// 处理滚动事件，控制顶栏和底栏的显示/隐藏
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  
  // 向下滚动超过50px时隐藏顶栏和底栏
  if (scrollTop > lastScrollTop && scrollTop > 50) {
    isHeaderVisible.value = false
    isTabbarVisible.value = false
  } 
  // 向上滚动时显示顶栏和底栏
  else if (scrollTop < lastScrollTop) {
    isHeaderVisible.value = true
    isTabbarVisible.value = true
  }
  
  lastScrollTop = scrollTop
  
  // 停止滚动3秒后显示底栏
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    isTabbarVisible.value = true
  }, 3000)
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
  handleResize() // 初始化检测
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  clearTimeout(scrollTimer)
})

// 计算属性
const filteredDevTools = computed(() => {
  if (!searchText.value) return techPortalData.value[0].items;
  return techPortalData.value[0].items.filter(item => 
    item.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
    (item.desc && item.desc.toLowerCase().includes(searchText.value.toLowerCase()))
  );
});

const filteredCloudServices = computed(() => {
  if (!searchText.value) return techPortalData.value[1].items;
  return techPortalData.value[1].items.filter(item => 
    item.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
    (item.desc && item.desc.toLowerCase().includes(searchText.value.toLowerCase()))
  );
});

const filteredAiTools = computed(() => {
  if (!searchText.value) return techPortalData.value[2].items;
  return techPortalData.value[2].items.filter(item => 
    item.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
    (item.desc && item.desc.toLowerCase().includes(searchText.value.toLowerCase()))
  );
});

const filteredWorkOrders = computed(() => {
  if (!searchText.value) return techPortalData.value[3].items;
  const text = searchText.value.toLowerCase();
  return techPortalData.value[3].items.filter(item => 
    item.name.toLowerCase().includes(text) || 
    item.description.toLowerCase().includes(text)
  );
});

// 下拉刷新和上拉加载
const handleRefresh = () => {
  console.log('刷新数据')
  // 这里添加刷新数据的逻辑
}

const handleLoadMore = () => {
  console.log('加载更多数据');
  // 这里添加加载更多数据的逻辑
  
  // 模拟数据加载完毕
  if (techPortalData.value[1].items.length > 15) {
    hasMore.value = false;
  } else {
    // 模拟添加更多数据
    const newItems = [
      { name: '新增服务1', icon: logoImg, desc: '新增云服务' },
      { name: '新增服务2', icon: logoImg, desc: '新增云服务' }
    ];
    techPortalData.value[1].items.push(...newItems);
  }
}

// 导航到指定页面
const navigateTo = (page) => {
  currentPage.value = page
  // 重置滚动位置
  window.scrollTo(0, 0)
  // 显示头部和底部导航
  isHeaderVisible.value = true
  isTabbarVisible.value = true
}
</script>

<style scoped>
/* 全局样式变量 */
:root {
  --primary-color: #1890ff;
  --secondary-color: #52c41a;
  --text-color: #333;
  --text-secondary: #666;
  --text-light: #999;
  --bg-color: #f5f7fa;
  --card-bg: #fff;
  --border-color: #eaeaea;
  --shadow: 0 2px 8px rgba(0,0,0,0.08);
  --hover-shadow: 0 4px 12px rgba(0,0,0,0.12);
  --border-radius: 0.8rem;
  --transition: all 0.3s ease;
}

.tech-portal {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  width: 100%;
  background-color: var(--bg-color);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  overflow-x: hidden;
  position: relative;
}

/* 导航栏样式 */
.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: var(--card-bg);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: transform 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.header-hidden {
  transform: translateY(-100%);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.logo img {
  height: 2.8rem;
}

.logo-text {
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--primary-color);
  content: '开放平台';
}

.nav-menu {
  display: flex;
  gap: 2.5rem;
}

.nav-item {
  color: var(--text-color);
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 500;
  padding: 0.6rem 0;
  position: relative;
  transition: var(--transition);
}

.nav-item.active {
  color: var(--primary-color);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.2rem;
  background-color: var(--primary-color);
  border-radius: 0.1rem;
}

.nav-item:hover {
  color: var(--primary-color);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.user-info:hover {
  background-color: rgba(24, 144, 255, 0.1);
}

.avatar {
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(24, 144, 255, 0.2);
}

.user-detail {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--text-color);
}

.user-role {
  font-size: 1.1rem;
  color: var(--text-light);
}

/* 内容区样式 */
.content {
  flex: 1;
  max-width: 120rem;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: calc(6rem + env(safe-area-inset-bottom)); /* 增加底部内边距，为固定导航栏留出空间 */
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1.2rem;
}

.section-title {
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.search-box {
  display: flex;
  height: 3.6rem;
}

.search-box input {
  width: 22rem;
  padding: 0 1.2rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  font-size: 1.3rem;
  outline: none;
  transition: var(--transition);
}

.search-box input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.search-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0 1.2rem;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  cursor: pointer;
  font-size: 1.3rem;
  transition: var(--transition);
}

.search-btn:hover {
  background-color: #40a9ff;
}

.card-section {
  margin-bottom: 3rem;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.category-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  position: relative;
  padding-left: 1rem;
}

.category-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.2rem;
  height: 1.8rem;
  width: 0.3rem;
  background-color: var(--primary-color);
  border-radius: 0.15rem;
}

.view-all {
  font-size: 1.3rem;
  color: var(--primary-color);
  text-decoration: none;
}

/* 优化卡片网格布局 - 使用响应式网格 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: 1rem;
}

/* 卡片样式 */
.card {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 1rem;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow);
  transition: var(--transition);
  position: relative;
  cursor: pointer;
  height: 4rem;
  text-align: center;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--hover-shadow);
  background-color: rgba(24, 144, 255, 0.05);
}

.card-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  justify-content: center;
}

.card-name {
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hot-tag {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  background-color: #ff4d4f;
  color: white;
  font-size: 0.9rem;
  padding: 0 0.3rem;
  border-radius: 0.5rem;
  line-height: 1.4rem;
}

/* 登录弹窗 */
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  width: 32rem;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  padding: 2.5rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.4rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.6rem;
  color: var(--text-color);
}

.close-btn {
  font-size: 2.2rem;
  color: var(--text-light);
  cursor: pointer;
}

.modal-body {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.8rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.6rem;
  font-size: 1.3rem;
  color: var(--text-color);
}

.form-group input {
  width: 100%;
  padding: 1.2rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 1.5rem;
  outline: none;
  transition: var(--transition);
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(24, 144, 255, 0.3);
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.3rem;
  color: var(--text-secondary);
}

.modal-footer {
  padding: 1.4rem 2rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn {
  padding: 0.7rem 1.4rem;
  border: 1px solid var(--border-color);
  background-color: white;
  border-radius: var(--border-radius);
  font-size: 1.3rem;
  cursor: pointer;
  transition: var(--transition);
}

.cancel-btn:hover {
  background-color: #f5f5f5;
}

.login-btn {
  padding: 0.7rem 1.4rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1.3rem;
  cursor: pointer;
  transition: var(--transition);
}

.login-btn:hover {
  background-color: #40a9ff;
}

/* 触摸反馈效果 */
.touch-active {
  background-color: #f0f0f0 !important;
  transform: scale(0.98) !important;
}

/* 汉堡菜单图标 */
.menu-toggle {
  display: none;
  width: 2.8rem;
  height: 2.8rem;
  flex-direction: column;
  justify-content: space-around;
  padding: 0.5rem;
  box-sizing: border-box;
  cursor: pointer;
}

.menu-icon {
  display: block;
  width: 100%;
  height: 0.2rem;
  background-color: var(--text-color);
  border-radius: 0.1rem;
}

/* 移动端底部导航 */
.mobile-tabbar {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5rem;
  background: #ffffff;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.08);
  z-index: 1000;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
  transition: transform 0.3s ease;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  box-sizing: border-box;
}

.tabbar-hidden {
  transform: none;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  color: var(--text-color);
  font-size: 1.2rem;
  font-weight: 500;
  transition: color 0.3s ease;
  padding: 0.5rem 0;
}

.tab-item.active {
  color: var(--primary-color);
}

.tab-icon {
  width: 2.4rem;
  height: 2.4rem;
  margin-bottom: 0.3rem;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

/* 底部导航图标 */
.技术门户-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>');
}

.工单中心-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>');
}

.研发指引-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><path d="M12 2L1 12h3v9h7v-6h2v6h7v-9h3L12 2zm0 2.84L19.93 12H18v7h-4v-6H10v6H6v-7H4.07L12 4.84z"/></svg>');
}

.开发工具-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>');
}

/* 激活状态的图标颜色 */
.tab-item.active .tab-icon {
  filter: invert(45%) sepia(98%) saturate(1233%) hue-rotate(199deg) brightness(97%) contrast(101%);
}

/* 移动端适配增强 */
@media screen and (max-width: 768px) {
  .tech-portal {
    width: 100vw;
    max-width: 100%;
    overflow-x: hidden;
  }

  .content {
    padding: 1.4rem;
    padding-bottom: calc(6rem + env(safe-area-inset-bottom));
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;
    margin: 0;
  }
  
  .nav-header {
    padding: 0.8rem 1.4rem;
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;
  }
  
  .logo-text {
    font-size: 1.5rem;
  }
  
  .menu-toggle {
    display: flex;
  }
  
  .nav-menu {
    position: fixed;
    top: 5.6rem;
    left: 0;
    right: 0;
    background: var(--card-bg);
    flex-direction: column;
    padding: 1.2rem;
    transform: translateY(-150%);
    transition: var(--transition);
    display: none;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    z-index: 99;
  }
  
  .nav-menu.active {
    transform: translateY(0);
    display: flex;
  }
  
  .nav-item {
    padding: 1rem 0;
    border-bottom: 1px solid var(--border-color);
    width: 100%;
  }
  
  .nav-item:last-child {
    border-bottom: none;
  }
  
  .user-info {
    padding: 0.3rem;
  }
  
  .user-detail {
    display: none;
  }
  
  .mobile-tabbar {
    background: #ffffff;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.08);
  }
  
  .tab-item {
    font-size: 1.1rem;
  }
  
  .tab-icon {
    width: 2.2rem;
    height: 2.2rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.8rem;
  }
  
  .search-box {
    width: 100%;
  }
  
  .search-box input {
    width: 100%;
    flex: 1;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .category-title {
    font-size: 1.6rem;
  }
  
  /* 移动端卡片布局 - 四列 */
  .card-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.8rem;
  }
  
  .card {
    padding: 0.8rem;
    height: 3.8rem;
  }
  
  .card-name {
    font-size: 1.1rem;
  }
  
  .modal-content {
    width: 90%;
  }
}

/* 小屏幕手机适配 */
@media screen and (max-width: 480px) {
  .tech-portal {
    width: 100vw;
    max-width: 100%;
  }

  .content {
    padding: 1rem;
    width: 100%;
    max-width: 100vw;
  }
  
  .nav-header {
    padding: 0.7rem 1rem;
  }
  
  .logo img {
    height: 2.6rem;
  }
  
  .logo-text {
    font-size: 1.4rem;
  }
  
  .avatar {
    width: 3rem;
    height: 3rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .category-title {
    font-size: 1.5rem;
  }
  
  /* 小屏幕手机卡片布局 - 三列 */
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.7rem;
  }
  
  .card {
    padding: 0.7rem;
    height: 3.5rem;
  }
  
  .card-name {
    font-size: 1rem;
  }
  
  .hot-tag {
    font-size: 0.8rem;
    padding: 0 0.2rem;
    top: 0.3rem;
    right: 0.3rem;
    line-height: 1.3rem;
  }
  
  .tab-item {
    font-size: 1rem;
  }
  
  .tab-icon {
    width: 2rem;
    height: 2rem;
  }
}

/* 超小屏幕适配 */
@media screen and (max-width: 360px) {
  .tech-portal {
    width: 100vw;
    max-width: 100%;
  }

  .content {
    padding: 0.8rem;
  }
  
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
  }
  
  .card {
    padding: 0.6rem;
    height: 3.2rem;
  }
  
  .card-name {
    font-size: 0.9rem;
  }
}

/* 工单中心样式 */
.card-section {
  margin-bottom: 1.5rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 0.5rem;
}

@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.8rem;
    padding: 0.3rem;
  }
}

@media (max-width: 480px) {
  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.5rem;
  }
}

.card {
  position: relative;
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
}

.hot-tag {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: var(--el-color-danger);
  color: white;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

/* 开发中提示样式 */
.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40rem;
  text-align: center;
  color: var(--text-secondary);
}

.coming-soon h2 {
  font-size: 2.4rem;
  margin-bottom: 1rem;
}

.coming-soon p {
  font-size: 1.6rem;
}

/* 移除重复的导航样式 */
.nav-menu {
  display: flex;
  gap: 2.5rem;
}

.nav-item {
  color: var(--text-color);
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 500;
  padding: 0.6rem 0;
  position: relative;
  transition: var(--transition);
}

.nav-item.active {
  color: var(--primary-color);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.2rem;
  background-color: var(--primary-color);
  border-radius: 0.1rem;
}

.nav-item:hover {
  color: var(--primary-color);
}

/* 移动端菜单样式优化 */
.el-menu-vertical-demo {
  border-right: none;
}

.el-menu-item {
  height: 5rem;
  line-height: 5rem;
  font-size: 1.4rem;
}

.el-menu-item.is-active {
  color: var(--primary-color);
  background-color: rgba(24, 144, 255, 0.1);
}

.el-menu-item:hover {
  background-color: rgba(24, 144, 255, 0.05);
}
</style>