<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import PostCard from '@/components/PostCard.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const selectedCategory = ref<string | null>(null)
const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

watch(
  () => route.query.category,
  (category) => { selectedCategory.value = category as string | null },
  { immediate: true }
)

const filteredPosts = computed(() => {
  if (!selectedCategory.value) return []
  return blogStore.getPostsByCategory(selectedCategory.value)
})

function selectCategory(category: string) {
  if (selectedCategory.value === category) {
    selectedCategory.value = null
    router.push('/categories')
  } else {
    selectedCategory.value = category
    router.push({ path: '/categories', query: { category } })
  }
}

const categoryStyles: Record<string, { icon: string, gradient: string }> = {
  '技术': { icon: 'fas:code', gradient: 'from-blue-500 to-cyan-500' },
  '生活': { icon: 'fas:heart', gradient: 'from-pink-500 to-rose-500' },
  '随笔': { icon: 'fas:pen-fancy', gradient: 'from-purple-500 to-violet-500' },
  '学习': { icon: 'fas:graduation-cap', gradient: 'from-green-500 to-emerald-500' },
}

function getCategoryStyle(name: string) {
  return categoryStyles[name] || { icon: 'fas:folder', gradient: 'from-[#49b1f5] to-[#0abcf9]' }
}
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/30"></div>
      
      <div 
        class="relative text-center text-white z-10 banner-content"
        :class="{ 'animate-in': isVisible }"
      >
        <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#49b1f5] to-[#0abcf9] p-[2px] shadow-lg shadow-[#49b1f5]/30">
          <div class="w-full h-full rounded-2xl bg-black/30 backdrop-blur flex items-center justify-center">
            <Icon icon="fas:folder-open" class="w-10 h-10 drop-shadow-lg" />
          </div>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">分类</h1>
        <p class="mt-3 text-white/80 text-lg">共 {{ blogStore.allCategories.length }} 个分类</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div v-if="blogStore.isLoading" class="card p-16 text-center">
        <div class="inline-flex flex-col items-center">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#49b1f5]/20 to-[#0abcf9]/20 flex items-center justify-center mb-4">
            <div class="animate-spin rounded-full h-8 w-8 border-4 border-[#49b1f5] border-t-transparent"></div>
          </div>
          <p class="text-gray-500">加载中...</p>
        </div>
      </div>

      <div v-else>
        <!-- Category Cards -->
        <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <button
            v-for="(category, index) in blogStore.allCategories"
            :key="category.name"
            @click="selectCategory(category.name)"
            class="card p-6 text-left transition-all duration-300 hover:shadow-xl group category-card"
            :class="[
              selectedCategory === category.name ? 'ring-2 ring-[#49b1f5] shadow-xl' : '',
              { 'animate-in': isVisible }
            ]"
            :style="{ animationDelay: `${100 + index * 80}ms` }"
          >
            <div class="flex items-center space-x-4">
              <div 
                class="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                :class="getCategoryStyle(category.name).gradient"
              >
                <Icon :icon="getCategoryStyle(category.name).icon" class="w-8 h-8" />
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-lg text-gray-800 dark:text-white group-hover:text-[#49b1f5] transition-colors">
                  {{ category.name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                  <Icon icon="fas:file-alt" class="w-3.5 h-3.5 mr-1.5" />
                  {{ category.count }} 篇文章
                </p>
              </div>
              <Icon 
                icon="fas:chevron-right" 
                class="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-[#49b1f5] group-hover:translate-x-1 transition-all" 
              />
            </div>
          </button>
        </div>

        <!-- Selected Category Posts -->
        <div v-if="selectedCategory">
          <div 
            class="flex items-center justify-between mb-6 selection-header"
            :class="{ 'animate-in': isVisible }"
          >
            <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <div 
                class="w-8 h-8 rounded-lg flex items-center justify-center mr-2 bg-gradient-to-br"
                :class="getCategoryStyle(selectedCategory).gradient"
              >
                <Icon :icon="getCategoryStyle(selectedCategory).icon" class="w-4 h-4 text-white" />
              </div>
              {{ selectedCategory }}
              <span class="text-base font-normal text-gray-400 ml-2">({{ filteredPosts.length }} 篇)</span>
            </h2>
            <button 
              @click="selectCategory(selectedCategory!)"
              class="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-red-500 rounded-lg transition-all flex items-center"
            >
              <Icon icon="fas:times" class="w-4 h-4 mr-1" />
              清除筛选
            </button>
          </div>

          <div class="space-y-5">
            <PostCard 
              v-for="(post, index) in filteredPosts"
              :key="post.slug"
              :post="post"
              :layout="index % 2 === 0 ? 'left' : 'right'"
              :index="index"
            />
          </div>
        </div>

        <div 
          v-else 
          class="card p-16 text-center empty-state"
          :class="{ 'animate-in': isVisible }"
          :style="{ animationDelay: '300ms' }"
        >
          <div class="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
            <Icon icon="fas:hand-pointer" class="w-12 h-12 text-gray-300 dark:text-gray-600" />
          </div>
          <p class="text-gray-500 dark:text-gray-400 mb-2">点击上方分类查看相关文章</p>
          <p class="text-sm text-gray-400 dark:text-gray-500">共有 {{ blogStore.allCategories.length }} 个分类等你探索</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner-content,
.category-card,
.selection-header,
.empty-state {
  opacity: 0;
  transform: translateY(20px);
}

.banner-content.animate-in,
.category-card.animate-in,
.selection-header.animate-in,
.empty-state.animate-in {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
