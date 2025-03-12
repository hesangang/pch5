<template>
  <div class="home">
    <!-- 导航栏 -->
    <el-header class="header">
      <div class="container header-content">
        <div class="logo">
          <img src="../assets/logo.png" alt="Logo" />
          <span>公司名称</span>
        </div>
        <el-menu
          mode="horizontal"
          :ellipsis="false"
          class="nav-menu"
          :class="{ 'mobile-menu': isMobile }"
        >
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">产品</el-menu-item>
          <el-menu-item index="3">服务</el-menu-item>
          <el-menu-item index="4">关于我们</el-menu-item>
          <el-menu-item index="5">联系我们</el-menu-item>
        </el-menu>
        <div class="mobile-menu-btn" v-if="isMobile" @click="toggleMenu">
          <el-icon><Menu /></el-icon>
        </div>
      </div>
    </el-header>

    <!-- 主要内容区域 -->
    <main>
      <!-- 轮播图 -->
      <el-carousel height="500px" class="banner">
        <el-carousel-item v-for="item in 4" :key="item">
          <div class="banner-item">
            <h2>欢迎来到我们的官网</h2>
            <p>为您提供最优质的服务</p>
          </div>
        </el-carousel-item>
      </el-carousel>

      <!-- 产品特点 -->
      <section class="features">
        <div class="container">
          <h2 class="section-title">产品特点</h2>
          <div class="features-grid">
            <div class="feature-item" v-for="(feature, index) in features" :key="index">
              <el-icon><component :is="feature.icon" /></el-icon>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 关于我们 -->
      <section class="about">
        <div class="container">
          <h2 class="section-title">关于我们</h2>
          <div class="about-content">
            <div class="about-text">
              <p>我们是一家专注于创新和技术的公司，致力于为客户提供最优质的产品和服务。</p>
              <el-button type="primary" size="large">了解更多</el-button>
            </div>
            <div class="about-image">
              <img src="../assets/about.jpg" alt="关于我们" />
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <el-footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>联系方式</h3>
            <p>电话：123-456-7890</p>
            <p>邮箱：contact@example.com</p>
          </div>
          <div class="footer-section">
            <h3>关注我们</h3>
            <div class="social-links">
              <el-icon><ChatDotRound /></el-icon>
              <el-icon><Share /></el-icon>
              <el-icon><Star /></el-icon>
            </div>
          </div>
        </div>
        <div class="copyright">
          <p>&copy; 2024 公司名称. All rights reserved.</p>
        </div>
      </div>
    </el-footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, ChatDotRound, Share, Star } from '@element-plus/icons-vue'

const isMobile = ref(false)
const features = [
  {
    icon: 'Star',
    title: '创新技术',
    description: '采用最新技术，提供卓越解决方案'
  },
  {
    icon: 'Share',
    title: '全球服务',
    description: '服务网络覆盖全球，随时响应需求'
  },
  {
    icon: 'ChatDotRound',
    title: '专业支持',
    description: '专业团队提供全方位技术支持'
  }
]

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const toggleMenu = () => {
  // 移动端菜单切换逻辑
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #333;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;

    img {
      height: 40px;
    }

    span {
      font-size: 20px;
      font-weight: bold;
    }
  }

  .nav-menu {
    border: none;
  }

  .mobile-menu-btn {
    display: none;
    font-size: 24px;
    cursor: pointer;
  }
}

.banner {
  margin-top: 60px;

  .banner-item {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f5f7fa;
    color: white;
    text-align: center;
    padding: 20px;
    background-image: url('../assets/banner.jpg');
    background-size: cover;
    background-position: center;

    h2 {
      font-size: 48px;
      margin-bottom: 20px;
    }

    p {
      font-size: 24px;
    }
  }
}

.section-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 36px;
}

.features {
  padding: 80px 0;
  background-color: #f9f9f9;

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
  }

  .feature-item {
    text-align: center;
    padding: 30px;
    background-color: var(--bg-color);
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .el-icon {
      font-size: 48px;
      color: var(--primary-color);
      margin-bottom: 20px;
    }

    h3 {
      margin-bottom: 15px;
    }
  }
}

.about {
  padding: 80px 0;

  .about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
  }

  .about-text {
    p {
      margin-bottom: 20px;
      line-height: 1.6;
    }
  }

  .about-image {
    img {
      width: 100%;
      border-radius: 8px;
    }
  }
}

.footer {
  background-color: #2c3e50;
  color: #fff;
  padding: 40px 0 20px;

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 40px;
    margin-bottom: 20px;
  }

  .footer-section {
    h3 {
      margin-bottom: 15px;
    }

    .social-links {
      display: flex;
      gap: 15px;
      font-size: 24px;
      cursor: pointer;
    }
  }

  .copyright {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}

@media screen and (max-width: 768px) {
  .header {
    .nav-menu {
      display: none;
      position: absolute;
      top: 60px;
      left: 0;
      right: 0;
      background-color: var(--bg-color);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .mobile-menu-btn {
      display: block;
    }
  }

  .banner {
    .banner-item {
      h2 {
        font-size: 32px;
      }

      p {
        font-size: 18px;
      }
    }
  }

  .about {
    .about-content {
      grid-template-columns: 1fr;
    }
  }
}
</style>