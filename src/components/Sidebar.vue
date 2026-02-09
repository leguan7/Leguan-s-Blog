<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import { COVER_IMAGES } from '@/utils/assets'

const router = useRouter()
const blogStore = useBlogStore()

// Animation visibility
const visibleCards = ref<Set<number>>(new Set())

const setCardRef = (el: any, index: number) => {}

onMounted(() => {
  // Immediately mark all cards visible with staggered animation
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      visibleCards.value.add(i)
      visibleCards.value = new Set(visibleCards.value)
    }, i * 150)
  }
})

const isCardVisible = (index: number) => visibleCards.value.has(index)

const stats = computed(() => ({
  posts: blogStore.posts.length,
  tags: blogStore.allTags.length,
  categories: blogStore.allCategories.length
}))

const topTags = computed(() => blogStore.allTags.slice(0, 20))
const recentPosts = computed(() => blogStore.sortedPosts.slice(0, 5))

function getPostCover(post: any, index: number) {
  return post.cover || COVER_IMAGES[index % COVER_IMAGES.length]
}

function navigateToTag(tag: string) {
  router.push({ path: '/tags', query: { tag } })
}

// Tag colors
const tagColors = [
  'from-pink-500/20 to-rose-500/20 text-rose-600 dark:text-rose-400',
  'from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400',
  'from-green-500/20 to-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  'from-purple-500/20 to-violet-500/20 text-violet-600 dark:text-violet-400',
  'from-orange-500/20 to-amber-500/20 text-orange-600 dark:text-orange-400',
  'from-cyan-500/20 to-teal-500/20 text-teal-600 dark:text-teal-400',
]

function getTagColor(index: number) {
  return tagColors[index % tagColors.length]
}
</script>

<template>
  <aside class="space-y-5 lg:sticky lg:top-20">
    <!-- Recent Posts -->
    <div 
      :ref="(el) => setCardRef(el, 0)"
      class="card p-5 sidebar-card"
      :class="{ 'animate-in': isCardVisible(0) }"
    >
      <div class="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700/50">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
          <Icon icon="lucide:clock" class="w-4 h-4 text-white" />
        </div>
        <h4 class="font-bold text-gray-800 dark:text-white">Recent Posts</h4>
      </div>
      <div class="space-y-3">
        <router-link 
          v-for="(post, index) in recentPosts"
          :key="post.slug"
          :to="`/post/${post.slug}`"
          class="flex items-center space-x-3 group p-2 -mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div class="relative overflow-hidden rounded-lg flex-shrink-0">
            <img 
              :src="getPostCover(post, index)"
              :alt="post.title"
              class="w-16 h-12 object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
          </div>
          <div class="flex-1 min-w-0">
            <h5 class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#7CB342] transition-colors line-clamp-2 leading-normal font-medium pb-0.5">
              {{ post.title }}
            </h5>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
              <Icon icon="lucide:calendar" class="w-3 h-3 mr-1" />
              {{ post.date }}
            </p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Tag Cloud -->
    <div 
      :ref="(el) => setCardRef(el, 1)"
      class="card p-5 sidebar-card"
      :class="{ 'animate-in': isCardVisible(1) }"
    >
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700/50">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center">
            <Icon icon="lucide:tags" class="w-4 h-4 text-white" />
          </div>
          <h4 class="font-bold text-gray-800 dark:text-white">Tag Cloud</h4>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">{{ blogStore.allTags.length }} tags</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(tag, index) in topTags"
          :key="tag.name"
          @click="navigateToTag(tag.name)"
          class="px-3 py-1.5 text-xs rounded-full bg-gradient-to-r transition-all duration-300 hover:scale-105 hover:shadow-md font-medium"
          :class="getTagColor(index)"
        >
          <Icon icon="lucide:hash" class="w-3 h-3 inline mr-0.5" />
          {{ tag.name }}
        </button>
      </div>
      <router-link 
        v-if="blogStore.allTags.length > 20"
        to="/tags" 
        class="flex items-center justify-center mt-4 py-2 text-xs text-[#7CB342] hover:text-[#D4A04D] transition-colors rounded-lg hover:bg-[#7CB342]/5"
      >
        View All
        <Icon icon="lucide:arrow-right" class="w-3 h-3 ml-1" />
      </router-link>
    </div>

    <!-- Categories -->
    <div 
      :ref="(el) => setCardRef(el, 2)"
      class="card p-5 sidebar-card"
      :class="{ 'animate-in': isCardVisible(2) }"
    >
      <div class="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700/50">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
          <Icon icon="lucide:folder-open" class="w-4 h-4 text-white" />
        </div>
        <h4 class="font-bold text-gray-800 dark:text-white">Categories</h4>
      </div>
      <div class="space-y-1">
        <router-link 
          v-for="category in blogStore.allCategories.slice(0, 8)"
          :key="category.name"
          :to="{ path: '/categories', query: { category: category.name } }"
          class="flex items-center justify-between py-2.5 px-3 -mx-1 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-[#7CB342]/10 hover:to-[#8BC34A]/10 hover:text-[#7CB342] transition-all duration-300 group"
        >
          <span class="flex items-center">
            <Icon icon="lucide:folder" class="w-4 h-4 mr-2 text-[#7CB342] group-hover:scale-110 transition-transform" />
            {{ category.name }}
          </span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700/50 group-hover:bg-[#7CB342] group-hover:text-white transition-colors">
            {{ category.count }}
          </span>
        </router-link>
      </div>
    </div>

    <!-- Site Info -->
    <div 
      :ref="(el) => setCardRef(el, 3)"
      class="card p-5 sidebar-card"
      :class="{ 'animate-in': isCardVisible(3) }"
    >
      <div class="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700/50">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <Icon icon="lucide:bar-chart-2" class="w-4 h-4 text-white" />
        </div>
        <h4 class="font-bold text-gray-800 dark:text-white">Site Info</h4>
      </div>
      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <span class="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <Icon icon="lucide:file-text" class="w-4 h-4 mr-2 text-blue-500" />
            Total Posts
          </span>
          <span class="text-[#7CB342] font-bold">{{ stats.posts }}</span>
        </div>
        <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <span class="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <Icon icon="lucide:type" class="w-4 h-4 mr-2 text-green-500" />
            Total Words
          </span>
          <span class="text-[#7CB342] font-bold">10k+</span>
        </div>
        <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <span class="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <Icon icon="lucide:refresh-cw" class="w-4 h-4 mr-2 text-purple-500" />
            Last Updated
          </span>
          <span class="text-[#7CB342] font-bold text-sm">{{ new Date().toLocaleDateString('zh-CN') }}</span>
        </div>
      </div>
    </div>
  </aside>

</template>

<style scoped>
.sidebar-card {
  opacity: 0;
  transform: scale(0.6);
  transform-origin: center center;
}

.sidebar-card.animate-in {
  animation: scaleUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes scaleUp {
  0% {
    opacity: 0;
    transform: scale(0.6);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
