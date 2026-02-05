<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
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

// 判断是否在首页
const isHome = computed(() => route.path === '/')

onMounted(() => {
  blogStore.initTheme()
  blogStore.loadPosts()

  // 滚动监听
  window.addEventListener('scroll', () => {
    showScrollTop.value = window.scrollY > 300
    
    // 计算滚动百分比
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    scrollPercent.value = Math.round((scrollTop / docHeight) * 100) || 0
  })
})

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
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
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <Footer />

    <!-- 右侧固定按钮组 - Kyle's Blog 风格 -->
    <div class="rightside-buttons">
      <!-- 阅读模式 (可选) -->
      
      <!-- 深色模式切换 -->
      <button 
        @click="blogStore.toggleTheme"
        :title="blogStore.isDark ? '浅色模式' : '深色模式'"
      >
        <Icon :icon="blogStore.isDark ? 'fas:sun' : 'fas:moon'" class="w-5 h-5" />
      </button>
      
      <!-- 返回顶部 + 百分比 -->
      <transition name="fade">
        <button 
          v-if="showScrollTop"
          @click="scrollToTop"
          title="返回顶部"
          class="relative"
        >
          <Icon icon="fas:arrow-up" class="w-4 h-4" />
          <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold">
            {{ scrollPercent }}%
          </span>
        </button>
      </transition>
    </div>
  </div>
</template>
