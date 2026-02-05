<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import { IMAGES, COVER_IMAGES } from '@/utils/assets'
import QQModal from '@/components/QQModal.vue'

const router = useRouter()
const showQQModal = ref(false)
const blogStore = useBlogStore()

// 为每个侧边栏卡片使用独立的可见状态
const visibleCards = ref<Set<number>>(new Set())
const cardRefs = ref<(HTMLElement | null)[]>([])
let observer: IntersectionObserver | null = null

const setCardRef = (el: any, index: number) => {
  if (el) {
    cardRefs.value[index] = el
    if (observer) {
      ;(el as any).__cardIndex = index
      observer.observe(el)
    }
  }
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = (entry.target as any).__cardIndex as number
        if (entry.isIntersecting && !visibleCards.value.has(index)) {
          // 根据卡片索引添加延迟
          setTimeout(() => {
            visibleCards.value.add(index)
            visibleCards.value = new Set(visibleCards.value)
          }, index * 120)
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
  )

  // 观察已有的元素
  cardRefs.value.forEach((el, index) => {
    if (el) {
      ;(el as any).__cardIndex = index
      observer?.observe(el)
    }
  })
})

onUnmounted(() => {
  observer?.disconnect()
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

// 标签颜色
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
    <!-- 博主信息卡片 -->
    <div 
      :ref="(el) => setCardRef(el, 0)"
      class="card overflow-hidden sidebar-card"
      :class="{ 'animate-in': isCardVisible(0) }"
    >
      <!-- 封面背景 -->
      <div 
        class="h-32 bg-cover bg-center relative overflow-hidden group"
        :style="{ backgroundImage: `url(${IMAGES.fantasyMagicLandscape})` }"
      >
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
        <!-- 悬浮动效 -->
        <div class="absolute inset-0 bg-[#7CB342]/0 group-hover:bg-[#7CB342]/10 transition-colors duration-500"></div>
      </div>
      
      <!-- 头像和信息 -->
      <div class="px-5 pb-5 -mt-16 text-center relative">
        <div class="avatar-ring inline-block mb-3 group cursor-pointer">
          <img 
            :src="IMAGES.avatar" 
            alt="Leguan" 
            class="w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 shadow-xl transition-transform duration-500 group-hover:scale-105"
            onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=Leguan'"
          />
        </div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-white">Leguan</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">A person who wants to see the world</p>
        
        <!-- 统计 -->
        <div class="flex justify-around mt-5 py-4 border-t border-b border-gray-100 dark:border-gray-700/50">
          <router-link to="/archives" class="text-center group cursor-pointer flex-1">
            <div class="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-[#7CB342] transition-all duration-300 group-hover:scale-110">
              {{ stats.posts }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400 mt-0.5 flex items-center justify-center">
              <Icon icon="lucide:file-text" class="w-3 h-3 mr-1" />
              文章
            </div>
          </router-link>
          <div class="w-px bg-gray-100 dark:bg-gray-700/50"></div>
          <router-link to="/tags" class="text-center group cursor-pointer flex-1">
            <div class="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-[#7CB342] transition-all duration-300 group-hover:scale-110">
              {{ stats.tags }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400 mt-0.5 flex items-center justify-center">
              <Icon icon="lucide:tags" class="w-3 h-3 mr-1" />
              标签
            </div>
          </router-link>
          <div class="w-px bg-gray-100 dark:bg-gray-700/50"></div>
          <router-link to="/categories" class="text-center group cursor-pointer flex-1">
            <div class="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-[#7CB342] transition-all duration-300 group-hover:scale-110">
              {{ stats.categories }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400 mt-0.5 flex items-center justify-center">
              <Icon icon="lucide:folder" class="w-3 h-3 mr-1" />
              分类
            </div>
          </router-link>
        </div>

        <!-- 社交按钮 -->
        <div class="flex justify-center space-x-3 mt-4">
          <div class="relative group">
            <a 
              href="https://github.com/leguan7" 
              target="_blank"
              class="w-10 h-10 rounded-xl bg-gray-800 text-white flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300"
            >
              <Icon icon="ri:github-fill" class="w-5 h-5" />
            </a>
            <div class="social-tooltip">GitHub</div>
          </div>
          <div class="relative">
            <button 
              @click.stop="showQQModal = !showQQModal"
              class="w-10 h-10 rounded-xl bg-[#12B7F5] text-white flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-[#12B7F5]/30 transition-all duration-300"
            >
              <Icon icon="ri:qq-fill" class="w-5 h-5" />
            </button>
            <QQModal :visible="showQQModal" @close="showQQModal = false" />
          </div>
          <div class="relative group">
            <a 
              href="mailto:leguan701@gmail.com"
              class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7CB342] to-[#8BC34A] text-white flex items-center justify-center hover:scale-110 hover:shadow-lg hover:shadow-[#7CB342]/30 transition-all duration-300"
            >
              <Icon icon="lucide:mail" class="w-5 h-5" />
            </a>
            <div class="social-tooltip">leguan701@gmail.com</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 公告栏 -->
    <div 
      :ref="(el) => setCardRef(el, 1)"
      class="card p-5 sidebar-card"
      :class="{ 'animate-in': isCardVisible(1) }"
    >
      <div class="flex items-center space-x-2 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700/50">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
          <Icon icon="lucide:megaphone" class="w-4 h-4 text-white" />
        </div>
        <h4 class="font-bold text-gray-800 dark:text-white">公告栏</h4>
      </div>
      <div class="p-3 rounded-xl bg-gradient-to-br from-[#7CB342]/5 to-[#8BC34A]/5 border border-[#7CB342]/10">
        <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          欢迎来到 <span class="text-[#7CB342] font-medium">Leguan's Blog</span>！
        </p>
        <p class="text-sm text-[#7CB342] mt-2 italic flex items-center">
          <Icon icon="lucide:quote" class="w-3 h-3 mr-1 text-[#7CB342]/60" />
          Digest your emotions.
        </p>
      </div>
    </div>

    <!-- 最新文章 -->
    <div 
      :ref="(el) => setCardRef(el, 2)"
      class="card p-5 sidebar-card"
      :class="{ 'animate-in': isCardVisible(2) }"
    >
      <div class="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700/50">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
          <Icon icon="lucide:clock" class="w-4 h-4 text-white" />
        </div>
        <h4 class="font-bold text-gray-800 dark:text-white">最新文章</h4>
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
            <h5 class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#7CB342] transition-colors line-clamp-2 leading-tight font-medium">
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

    <!-- 标签云 -->
    <div 
      :ref="(el) => setCardRef(el, 3)"
      class="card p-5 sidebar-card"
      :class="{ 'animate-in': isCardVisible(3) }"
    >
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700/50">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center">
            <Icon icon="lucide:tags" class="w-4 h-4 text-white" />
          </div>
          <h4 class="font-bold text-gray-800 dark:text-white">标签云</h4>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">{{ blogStore.allTags.length }} 个</span>
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
        查看全部
        <Icon icon="lucide:arrow-right" class="w-3 h-3 ml-1" />
      </router-link>
    </div>

    <!-- 分类 -->
    <div 
      :ref="(el) => setCardRef(el, 4)"
      class="card p-5 sidebar-card"
      :class="{ 'animate-in': isCardVisible(4) }"
    >
      <div class="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700/50">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
          <Icon icon="lucide:folder-open" class="w-4 h-4 text-white" />
        </div>
        <h4 class="font-bold text-gray-800 dark:text-white">分类</h4>
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

    <!-- 网站资讯 -->
    <div 
      :ref="(el) => setCardRef(el, 5)"
      class="card p-5 sidebar-card"
      :class="{ 'animate-in': isCardVisible(5) }"
    >
      <div class="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700/50">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <Icon icon="lucide:bar-chart-2" class="w-4 h-4 text-white" />
        </div>
        <h4 class="font-bold text-gray-800 dark:text-white">小站资讯</h4>
      </div>
      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <span class="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <Icon icon="lucide:file-text" class="w-4 h-4 mr-2 text-blue-500" />
            文章数目
          </span>
          <span class="text-[#7CB342] font-bold">{{ stats.posts }}</span>
        </div>
        <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <span class="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <Icon icon="lucide:type" class="w-4 h-4 mr-2 text-green-500" />
            本站总字数
          </span>
          <span class="text-[#7CB342] font-bold">10k+</span>
        </div>
        <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <span class="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <Icon icon="lucide:refresh-cw" class="w-4 h-4 mr-2 text-purple-500" />
            最后更新
          </span>
          <span class="text-[#7CB342] font-bold text-sm">{{ new Date().toLocaleDateString('zh-CN') }}</span>
        </div>
      </div>
    </div>
  </aside>

</template>

<style scoped>
.social-tooltip {
  @apply absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:-translate-y-1 z-10 pointer-events-none;
}
.social-tooltip::after {
  content: '';
  @apply absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900;
}


.sidebar-card {
  opacity: 0;
  transform: scale(0.85);
  transform-origin: center center;
}

.sidebar-card.animate-in {
  animation: sidebarScaleIn 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes sidebarScaleIn {
  0% {
    opacity: 0;
    transform: scale(0.85);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
