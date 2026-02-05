<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import PostCard from '@/components/PostCard.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const selectedCategory = ref<string | null>(null)

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
      
      <div class="relative text-center text-white z-10">
        <Icon icon="fas:folder-open" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
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
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#49b1f5] border-t-transparent"></div>
      </div>

      <div v-else>
        <!-- Category Cards -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <button
            v-for="category in blogStore.allCategories"
            :key="category.name"
            @click="selectCategory(category.name)"
            class="card p-5 text-left transition-all duration-300 hover:shadow-xl group"
            :class="selectedCategory === category.name ? 'ring-2 ring-[#49b1f5] shadow-xl' : ''"
          >
            <div class="flex items-center space-x-4">
              <div 
                class="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br transition-transform group-hover:scale-110"
                :class="getCategoryStyle(category.name).gradient"
              >
                <Icon :icon="getCategoryStyle(category.name).icon" class="w-7 h-7" />
              </div>
              <div>
                <h3 class="font-bold text-gray-800 dark:text-white group-hover:text-[#49b1f5] transition-colors">
                  {{ category.name }}
                </h3>
                <p class="text-sm text-gray-500">{{ category.count }} 篇文章</p>
              </div>
            </div>
          </button>
        </div>

        <!-- Selected Category Posts -->
        <div v-if="selectedCategory">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <Icon icon="fas:folder-open" class="w-5 h-5 mr-2 text-[#49b1f5]" />
              {{ selectedCategory }}
              <span class="text-base font-normal text-gray-400 ml-2">({{ filteredPosts.length }} 篇)</span>
            </h2>
            <button 
              @click="selectCategory(selectedCategory!)"
              class="text-sm text-gray-400 hover:text-[#ff7242] transition-colors flex items-center"
            >
              <Icon icon="fas:times" class="w-4 h-4 mr-1" />
              清除
            </button>
          </div>

          <div class="space-y-5">
            <PostCard 
              v-for="(post, index) in filteredPosts"
              :key="post.slug"
              :post="post"
              :layout="index % 2 === 0 ? 'left' : 'right'"
            />
          </div>
        </div>

        <div v-else class="card p-16 text-center">
          <Icon icon="fas:hand-pointer" class="w-20 h-20 mx-auto text-gray-200 dark:text-gray-700 mb-4" />
          <p class="text-gray-400">点击上方分类查看相关文章</p>
        </div>
      </div>
    </div>
  </div>
</template>
