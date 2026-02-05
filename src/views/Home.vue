<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import PostCard from '@/components/PostCard.vue'
import Sidebar from '@/components/Sidebar.vue'
import { IMAGES } from '@/utils/assets'

const avatar = IMAGES.avatar

const blogStore = useBlogStore()

const currentPage = ref(1)
const postsPerPage = 6
const typedText = ref('')
const fullText = 'Digest your emotions'
const cursorVisible = ref(true)

// 打字机效果
onMounted(() => {
  let i = 0
  const typeInterval = setInterval(() => {
    if (i < fullText.length) {
      typedText.value += fullText.charAt(i)
      i++
    } else {
      clearInterval(typeInterval)
    }
  }, 100)

  setInterval(() => {
    cursorVisible.value = !cursorVisible.value
  }, 530)
})

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return blogStore.filteredPosts.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(blogStore.filteredPosts.length / postsPerPage)
)

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    document.getElementById('posts-section')?.scrollIntoView({ behavior: 'smooth' })
  }
}

watch(() => blogStore.searchQuery, () => {
  currentPage.value = 1
})

function scrollDown() {
  document.getElementById('posts-section')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div>
    <!-- Hero Banner - Kyle's Blog 风格 -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <!-- 半透明遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      
      <!-- 内容 -->
      <div class="relative text-center text-white z-10 px-4">
        <!-- 头像 -->
        <div class="mb-6">
          <div class="avatar-ring inline-block">
            <img 
              :src="avatar" 
              alt="Leguan" 
              class="w-28 h-28 rounded-full border-4 border-white/80 shadow-2xl"
              onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=Leguan'"
            />
          </div>
        </div>

        <h1 class="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl">
          Leguan's Blog
        </h1>
        
        <!-- 打字机效果 -->
        <p class="text-xl md:text-2xl text-white/90 mb-2 drop-shadow-lg">
          <span>{{ typedText }}</span>
          <span 
            class="typewriter-cursor"
            :class="{ 'opacity-0': !cursorVisible }"
          ></span>
        </p>
        
        <!-- 统计信息 - Kyle's Blog 风格 -->
        <div class="flex justify-center items-center space-x-2 mt-6 text-sm">
          <span class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
            文章 <strong>{{ blogStore.posts.length }}</strong>
          </span>
          <span class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
            标签 <strong>{{ blogStore.allTags.length }}</strong>
          </span>
          <span class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
            分类 <strong>{{ blogStore.allCategories.length }}</strong>
          </span>
        </div>
      </div>

      <!-- 向下滚动箭头 -->
      <button 
        @click="scrollDown"
        class="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce"
      >
        <Icon icon="fas:angle-double-down" class="w-8 h-8 drop-shadow-lg" />
      </button>

      <!-- 波浪分隔 -->
      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path 
            d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" 
            fill="rgba(255,255,255,0.1)"
          />
          <path 
            d="M0,70 C150,100 350,30 600,70 C850,110 1050,30 1200,70 C1350,110 1440,70 1440,70 L1440,100 L0,100 Z" 
            fill="rgba(255,255,255,0.15)"
          />
        </svg>
      </div>
    </section>

    <!-- 搜索结果提示 -->
    <div 
      v-if="blogStore.searchQuery" 
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
    >
      <div class="card flex items-center justify-between px-5 py-3">
        <span class="text-[#49b1f5] flex items-center">
          <Icon icon="fas:search" class="w-4 h-4 mr-2" />
          搜索 "<strong>{{ blogStore.searchQuery }}</strong>" 找到 {{ blogStore.filteredPosts.length }} 篇文章
        </span>
        <button 
          @click="blogStore.setSearchQuery('')"
          class="text-gray-400 hover:text-[#ff7242] transition-colors"
        >
          <Icon icon="fas:times-circle" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- 文章列表区域 -->
    <section id="posts-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="lg:flex lg:gap-8">
        <!-- 文章列表 -->
        <div class="lg:w-2/3 space-y-6">
          <!-- Loading -->
          <div v-if="blogStore.isLoading" class="card p-16 text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#49b1f5] border-t-transparent"></div>
            <p class="mt-4 text-gray-500">加载中...</p>
          </div>

          <!-- Empty -->
          <div v-else-if="blogStore.filteredPosts.length === 0" class="card p-16 text-center">
            <Icon icon="fas:inbox" class="w-20 h-20 text-gray-300 mx-auto" />
            <p class="mt-4 text-gray-500">暂无文章</p>
          </div>

          <!-- Posts - 交替布局 -->
          <template v-else>
            <PostCard 
              v-for="(post, index) in paginatedPosts" 
              :key="post.slug" 
              :post="post" 
              :layout="index % 2 === 0 ? 'left' : 'right'"
            />
          </template>

          <!-- Pagination - Kyle's Blog 风格 -->
          <nav v-if="totalPages > 1" class="flex justify-center items-center space-x-1 pt-6">
            <button 
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              :class="currentPage === 1 ? '' : 'card hover:bg-[#49b1f5] hover:text-white'"
            >
              <Icon icon="fas:angle-left" class="w-4 h-4" />
            </button>

            <template v-for="page in totalPages" :key="page">
              <button 
                v-if="page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)"
                @click="goToPage(page)"
                class="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all duration-300"
                :class="page === currentPage 
                  ? 'bg-[#49b1f5] text-white shadow-lg shadow-[#49b1f5]/30' 
                  : 'card hover:bg-[#49b1f5] hover:text-white'"
              >
                {{ page }}
              </button>
              <span 
                v-else-if="page === currentPage - 2 || page === currentPage + 2"
                class="w-10 h-10 flex items-center justify-center text-gray-400"
              >
                ...
              </span>
            </template>

            <button 
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              :class="currentPage === totalPages ? '' : 'card hover:bg-[#49b1f5] hover:text-white'"
            >
              <Icon icon="fas:angle-right" class="w-4 h-4" />
            </button>
          </nav>
        </div>

        <!-- Sidebar -->
        <div class="lg:w-1/3 mt-8 lg:mt-0">
          <Sidebar />
        </div>
      </div>
    </section>
  </div>
</template>
