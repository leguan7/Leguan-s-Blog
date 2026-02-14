<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import { COVER_IMAGES, IMAGES } from '@/utils/assets'

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

const stats = computed(() => {
  // Count total words across all posts
  const totalWords = blogStore.posts.reduce((sum, post) => {
    const text = post.content || ''
    // Count Chinese characters as 1 word each, English words by spaces
    const chinese = (text.match(/[\u4e00-\u9fff]/g) || []).length
    const english = text.replace(/[\u4e00-\u9fff]/g, '').split(/\s+/).filter(Boolean).length
    return sum + chinese + english
  }, 0)

  return {
    posts: blogStore.posts.length,
    tags: blogStore.allTags.length,
    categories: blogStore.allCategories.length,
    totalWords
  }
})

const topTags = computed(() => blogStore.allTags.slice(0, 20))
const recentPosts = computed(() => blogStore.sortedPosts.slice(0, 5))

// Last updated: relative time from the most recent post
const lastUpdatedAgo = computed(() => {
  const latest = blogStore.sortedPosts[0]
  if (!latest) return '--'
  const postDate = new Date(latest.date)
  const now = new Date()
  const diffMs = now.getTime() - postDate.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin} min ago`
  if (diffHour < 24) return `${diffHour} hr ago`
  if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
  if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`
  return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`
})

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
    <!-- Profile Card -->
    <div class="card p-6 sidebar-card" :class="{ 'animate-in': isCardVisible(0) }">
      <!-- Avatar -->
      <div class="flex justify-center mb-4">
        <div class="neu-avatar">
          <img
            :src="IMAGES.avatar"
            alt="Leguan"
            class="neu-avatar-img"
          />
        </div>
      </div>

      <!-- Name -->
      <h3 class="text-center text-lg font-bold text-gray-800 dark:text-white leading-normal mb-3">Leguan</h3>

      <!-- Flip box: front = bio, back = social links -->
      <div class="flip-box mx-auto">
        <div class="flip-box-inner">
          <!-- Front: Bio -->
          <div class="flip-box-front">
            <p class="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed text-center px-2">Better late than never</p>
          </div>
          <!-- Back: Social links -->
          <div class="flip-box-back">
            <div class="flex items-center justify-center gap-3">
              <a href="https://github.com/leguan7" target="_blank" rel="noopener noreferrer"
                class="social-icon-btn group w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-600/40 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#333] dark:hover:text-white transition-all hover:scale-110">
                <Icon icon="ri:github-fill" class="w-4.5 h-4.5" />
                <span class="social-tip">github.com/leguan7<i class="social-tip-arrow"></i></span>
              </a>
              <a href="mailto:leguan701@gmail.com"
                class="social-icon-btn group w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-600/40 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-all hover:scale-110">
                <Icon icon="lucide:mail" class="w-4.5 h-4.5" />
                <span class="social-tip">leguan701@gmail.com<i class="social-tip-arrow"></i></span>
              </a>
              <span class="social-icon-btn group w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-600/40 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#12B7F5] dark:hover:text-[#12B7F5] transition-all hover:scale-110">
                <Icon icon="ri:qq-fill" class="w-4.5 h-4.5" />
                <span class="social-tip">1944553927<i class="social-tip-arrow"></i></span>
              </span>
              <router-link to="/messageboard"
                class="social-icon-btn group w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-600/40 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#7CB342] dark:hover:text-[#9CCC65] transition-all hover:scale-110">
                <Icon icon="lucide:message-circle" class="w-4.5 h-4.5" />
                <span class="social-tip">Guestbook<i class="social-tip-arrow"></i></span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Posts -->
    <div 
      :ref="(el) => setCardRef(el, 1)"
      class="card p-5 sidebar-card"
      :class="{ 'animate-in': isCardVisible(1) }"
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
      :ref="(el) => setCardRef(el, 2)"
      class="card p-5 sidebar-card"
      :class="{ 'animate-in': isCardVisible(2) }"
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
      :ref="(el) => setCardRef(el, 3)"
      class="card p-5 sidebar-card"
      :class="{ 'animate-in': isCardVisible(3) }"
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
      :ref="(el) => setCardRef(el, 4)"
      class="card p-5 sidebar-card"
      :class="{ 'animate-in': isCardVisible(4) }"
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
          <span class="text-[#7CB342] font-bold">{{ stats.totalWords >= 1000 ? (stats.totalWords / 1000).toFixed(1) + 'k' : stats.totalWords }}</span>
        </div>
        <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <span class="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <Icon icon="lucide:refresh-cw" class="w-4 h-4 mr-2 text-purple-500" />
            Last Updated
          </span>
          <span class="text-[#7CB342] font-bold text-sm">{{ lastUpdatedAgo }}</span>
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

/* Neumorphism avatar */
.neu-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow:
    6px 6px 12px rgba(163, 170, 180, 0.5),
    -6px -6px 12px rgba(255, 255, 255, 0.8);
}

:root.dark .neu-avatar {
  box-shadow:
    6px 6px 12px rgba(0, 0, 0, 0.4),
    -6px -6px 12px rgba(55, 60, 70, 0.25);
}

.neu-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Flip box — Y-axis (left-right) */
.flip-box {
  width: 100%;
  height: 42px;
  perspective: 800px;
}

.flip-box-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.flip-box:hover .flip-box-inner {
  transform: rotateY(180deg);
}

.flip-box-front,
.flip-box-back {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  border-radius: 12px;
}

/* Front — neumorphism inset */
.flip-box-front {
  background: #e8ecf1;
  box-shadow:
    inset 3px 3px 6px rgba(163, 170, 180, 0.45),
    inset -3px -3px 6px rgba(255, 255, 255, 0.8);
}

:root.dark .flip-box-front {
  background: #2a2d35;
  box-shadow:
    inset 3px 3px 6px rgba(0, 0, 0, 0.35),
    inset -3px -3px 6px rgba(55, 60, 70, 0.2);
}

/* Back — same neumorphism style */
.flip-box-back {
  background: #e8ecf1;
  box-shadow:
    inset 3px 3px 6px rgba(163, 170, 180, 0.45),
    inset -3px -3px 6px rgba(255, 255, 255, 0.8);
  transform: rotateY(180deg);
}

:root.dark .flip-box-back {
  background: #2a2d35;
  box-shadow:
    inset 3px 3px 6px rgba(0, 0, 0, 0.35),
    inset -3px -3px 6px rgba(55, 60, 70, 0.2);
}

/* Social icon tooltip */
.social-icon-btn {
  position: relative;
}

.social-tip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(4px);
  color: white;
  font-size: 11px;
  font-style: normal;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 50;
}

.social-icon-btn:hover .social-tip {
  opacity: 1;
}

.social-tip-arrow {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: rgba(0, 0, 0, 0.78);
}
</style>
