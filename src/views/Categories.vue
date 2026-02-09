<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import PostCardCompact from '@/components/PostCardCompact.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const selectedCategory = ref<string | null>(null)
const contentVisible = ref(false)

const colorPalette = [
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-[#7CB342] to-[#8BC34A]',
]

function hashName(name: string): number {
  return name.split('').reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0)
}

function getCategoryColor(name: string): string {
  const i = Math.abs(hashName(name)) % colorPalette.length
  return colorPalette[i]
}

const maxCount = computed(() =>
  Math.max(...blogStore.allCategories.map(c => c.count), 1)
)

onMounted(() => {
  setTimeout(() => { contentVisible.value = true }, 200)
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
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/30"></div>
      <div
        class="relative text-center text-white z-10 banner-content"
        :class="{ 'animate-in': contentVisible }"
      >
        <div class="w-14 h-14 mx-auto mb-3 rounded-xl bg-[#7CB342]/90 backdrop-blur flex items-center justify-center shadow-lg">
          <Icon icon="lucide:folder-open" class="w-7 h-7 drop-shadow" />
        </div>
        <h1 class="text-3xl md:text-4xl font-bold drop-shadow-lg">Categories</h1>
        <p class="mt-2 text-white/80 text-sm">{{ blogStore.allCategories.length }} categories in total</p>
      </div>
      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div v-if="blogStore.isLoading" class="card p-16 text-center">
        <div class="inline-flex flex-col items-center">
          <div class="w-12 h-12 rounded-xl bg-[#7CB342]/20 flex items-center justify-center mb-3">
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-[#7CB342] border-t-transparent"></div>
          </div>
          <p class="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>

      <template v-else>
        <!-- Category cards -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <button
            v-for="category in blogStore.allCategories"
            :key="category.name"
            @click="selectCategory(category.name)"
            class="card content-block text-left overflow-hidden border border-white/20 dark:border-gray-600/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            :class="[
              { 'animate-in': contentVisible },
              selectedCategory === category.name ? 'ring-2 ring-[#7CB342] shadow-lg -translate-y-0.5' : ''
            ]"
          >
            <div class="flex items-center gap-4 p-5">
              <div
                class="w-14 h-14 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shrink-0"
                :class="getCategoryColor(category.name)"
              >
                <Icon icon="lucide:folder" class="w-7 h-7" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-800 dark:text-white truncate">
                  {{ category.name }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-0.5">
                  <Icon icon="lucide:file-text" class="w-3.5 h-3.5 mr-1" />
                  {{ category.count }} posts
                </p>
              </div>
              <Icon
                icon="lucide:chevron-right"
                class="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0"
              />
            </div>
            <div class="h-1 w-full bg-gray-100 dark:bg-gray-800">
              <div
                class="h-full bg-gradient-to-r rounded-r transition-all duration-500"
                :class="getCategoryColor(category.name)"
                :style="{ width: `${(category.count / maxCount) * 100}%` }"
              />
            </div>
          </button>
        </div>

        <!-- Selected category posts -->
        <div v-if="selectedCategory" class="content-block" :class="{ 'animate-in': contentVisible }">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-gray-800 dark:text-white flex items-center">
              <span
                class="w-7 h-7 rounded-lg flex items-center justify-center mr-2 bg-gradient-to-br text-white"
                :class="getCategoryColor(selectedCategory)"
              >
                <Icon icon="lucide:folder" class="w-3.5 h-3.5" />
              </span>
              {{ selectedCategory }}
              <span class="text-sm font-normal text-gray-400 ml-2">({{ filteredPosts.length }} posts)</span>
            </h2>
            <button
              @click="selectCategory(selectedCategory)"
              class="px-3 py-1.5 text-sm text-gray-500 hover:text-white hover:bg-red-500 rounded-lg transition-all flex items-center"
            >
              <Icon icon="lucide:x" class="w-4 h-4 mr-1" />
              Clear
            </button>
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <PostCardCompact
              v-for="(post, index) in filteredPosts"
              :key="post.slug"
              :post="post"
              :index="index"
            />
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-else
          class="card p-12 text-center content-block text-gray-500 dark:text-gray-400"
          :class="{ 'animate-in': contentVisible }"
        >
          <Icon icon="lucide:pointer" class="w-10 h-10 mx-auto mb-3 opacity-60" />
          <p class="text-sm">Click a category to view related posts</p>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.banner-content,
.content-block {
  opacity: 0;
  transform: translateY(20px);
}

.banner-content.animate-in,
.content-block.animate-in {
  animation: fadeSlideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes fadeSlideUp {
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
