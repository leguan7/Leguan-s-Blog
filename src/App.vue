<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useBlogStore } from '@/stores/blog'
import { IMAGES } from '@/utils/assets'

const route = useRoute()
const blogStore = useBlogStore()
const showScrollTop = ref(false)
const scrollPercent = ref(0)
const isLoading = ref(true)

// 判断是否在首页
const isHome = computed(() => route.path === '/')

// 使用 requestAnimationFrame 优化滚动性能
let ticking = false
function handleScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      showScrollTop.value = window.scrollY > 300
      
      // 计算滚动百分比
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      scrollPercent.value = Math.round((scrollTop / docHeight) * 100) || 0
      
      ticking = false
    })
    ticking = true
  }
}

// 点击烟花效果
function createClickEffect(e: MouseEvent) {
  const colors = ['#ff7242', '#49b1f5', '#ffc107', '#e91e63', '#4caf50']
  const particles = 6
  
  for (let i = 0; i < particles; i++) {
    const particle = document.createElement('div')
    particle.className = 'click-particle'
    particle.style.cssText = `
      position: fixed;
      pointer-events: none;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      z-index: 9999;
      animation: particle-${i} 0.6s ease-out forwards;
    `
    document.body.appendChild(particle)
    
    // 动态创建动画
    const angle = (i / particles) * 360
    const distance = 30 + Math.random() * 20
    const style = document.createElement('style')
    style.textContent = `
      @keyframes particle-${i} {
        to {
          transform: translate(${Math.cos(angle * Math.PI / 180) * distance}px, ${Math.sin(angle * Math.PI / 180) * distance}px) scale(0);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
    
    setTimeout(() => {
      particle.remove()
      style.remove()
    }, 600)
  }
}

onMounted(() => {
  blogStore.initTheme()
  blogStore.loadPosts()

  // 使用 passive 选项优化滚动监听
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // 点击效果
  document.addEventListener('click', createClickEffect)
  
  // 模拟加载完成
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', createClickEffect)
})

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <!-- 页面加载进度条 -->
  <div 
    v-if="isLoading"
    class="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#49b1f5] via-[#ff7242] to-[#49b1f5] z-[9999] loading-bar"
  ></div>

  <!-- 固定背景图 -->
  <div 
    class="fixed inset-0 -z-10 fixed-bg"
    :style="{ backgroundImage: `url(${IMAGES.background})` }"
  >
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20 dark:to-black/30"></div>
  </div>
  
  <div class="min-h-screen flex flex-col relative">
    <Navbar />
    
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <Footer />

    <!-- 右侧固定按钮组 - Kyle's Blog 风格 -->
    <div class="rightside-buttons">
      <!-- 深色模式切换 -->
      <button 
        @click.stop="blogStore.toggleTheme"
        :title="blogStore.isDark ? '浅色模式' : '深色模式'"
        class="group"
      >
        <Icon 
          :icon="blogStore.isDark ? 'lucide:sun' : 'lucide:moon'" 
          class="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" 
        />
      </button>
      
      <!-- 返回顶部 + 百分比 -->
      <transition name="slide-up">
        <button 
          v-if="showScrollTop"
          @click.stop="scrollToTop"
          title="返回顶部"
          class="relative group"
        >
          <Icon icon="lucide:arrow-up" class="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold">
            {{ scrollPercent }}%
          </span>
        </button>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* 加载进度条动画 */
.loading-bar {
  background-size: 200% 100%;
  animation: loading-gradient 1s ease infinite;
}

@keyframes loading-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 页面切换动画 */
.page-enter-active {
  animation: page-in 0.4s ease-out;
}

.page-leave-active {
  animation: page-out 0.3s ease-in;
}

@keyframes page-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes page-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

/* 按钮滑入动画 */
.slide-up-enter-active {
  animation: slide-up-in 0.3s ease-out;
}

.slide-up-leave-active {
  animation: slide-up-out 0.3s ease-in;
}

@keyframes slide-up-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slide-up-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
}
</style>
