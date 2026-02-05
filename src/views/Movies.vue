<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { COVER_IMAGES } from '@/utils/assets'

// Intersection Observer for animations
const visibleCards = ref<Set<number>>(new Set())
const cardElements = ref<Map<number, HTMLElement>>(new Map())
let observer: IntersectionObserver | null = null

const setCardRef = (el: any, index: number) => {
  if (el) {
    cardElements.value.set(index, el)
  }
}

const isCardVisible = (index: number) => visibleCards.value.has(index)

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = (entry.target as any).__cardIndex as number
        if (entry.isIntersecting && !visibleCards.value.has(index)) {
          setTimeout(() => {
            visibleCards.value.add(index)
            visibleCards.value = new Set(visibleCards.value)
          }, index * 100)
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
  )

  // Observe all stored elements
  cardElements.value.forEach((el, index) => {
    ;(el as any).__cardIndex = index
    observer?.observe(el)
  })
})

onUnmounted(() => {
  observer?.disconnect()
})

const moviesList = [
  { name: '流浪地球2', status: '已看', rating: '9.0', cover: COVER_IMAGES[0], tags: ['科幻', '冒险', '灾难'], year: '2023', director: '郭帆' },
  { name: '奥本海默', status: '已看', rating: '9.2', cover: COVER_IMAGES[1], tags: ['传记', '历史', '剧情'], year: '2023', director: '诺兰' },
  { name: '封神第一部', status: '已看', rating: '8.8', cover: COVER_IMAGES[2], tags: ['神话', '奇幻', '战争'], year: '2023', director: '乌尔善' },
  { name: '消失的她', status: '已看', rating: '8.5', cover: COVER_IMAGES[3], tags: ['悬疑', '犯罪'], year: '2023', director: '崔睿' },
  { name: '沙丘2', status: '想看', rating: '8.9', cover: COVER_IMAGES[4], tags: ['科幻', '冒险'], year: '2024', director: '维伦纽瓦' },
  { name: '热辣滚烫', status: '已看', rating: '8.0', cover: COVER_IMAGES[5], tags: ['喜剧', '运动'], year: '2024', director: '贾玲' },
]

function getStatusColor(status: string) {
  switch (status) {
    case '已看': return 'bg-blue-500'
    case '想看': return 'bg-yellow-500'
    case '在看': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/40"></div>
      
      <div class="relative text-center text-white z-10">
        <Icon icon="lucide:film" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">电影</h1>
        <p class="mt-3 text-white/80 text-lg">光影世界的精彩瞬间</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- 电影网格 -->
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="(movie, index) in moviesList"
          :key="movie.name"
          :ref="(el) => setCardRef(el, index)"
          class="card overflow-hidden group animate-card"
          :class="{ 'animate-in': isCardVisible(index) }"
        >
          <!-- 封面 -->
          <div class="aspect-[2/3] relative overflow-hidden">
            <img 
              :src="movie.cover" 
              :alt="movie.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />
            <!-- 状态角标 -->
            <span 
              class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-medium"
              :class="getStatusColor(movie.status)"
            >
              {{ movie.status }}
            </span>
            <!-- 评分 -->
            <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center text-yellow-400 text-sm">
              <Icon icon="lucide:star" class="w-3.5 h-3.5 mr-1" />
              {{ movie.rating }}
            </div>
            <!-- 遮罩渐变 -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <!-- 底部信息 -->
            <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 class="font-bold text-lg mb-1">{{ movie.name }}</h3>
              <div class="flex items-center text-sm text-white/70 space-x-2">
                <span>{{ movie.year }}</span>
                <span>·</span>
                <span>{{ movie.director }}</span>
              </div>
            </div>
          </div>

          <!-- 标签 -->
          <div class="p-4">
            <div class="flex flex-wrap gap-1.5">
              <span 
                v-for="tag in movie.tags"
                :key="tag"
                class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计 -->
      <div 
        :ref="(el) => setCardRef(el, moviesList.length)"
        class="card p-6 mt-8 animate-card"
        :class="{ 'animate-in': isCardVisible(moviesList.length) }"
      >
        <div class="flex justify-around text-center">
          <div>
            <div class="text-3xl font-bold text-[#7CB342]">{{ moviesList.length }}</div>
            <div class="text-sm text-gray-500 mt-1">总电影</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-blue-500">{{ moviesList.filter(m => m.status === '已看').length }}</div>
            <div class="text-sm text-gray-500 mt-1">已看</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-yellow-500">{{ moviesList.filter(m => m.status === '想看').length }}</div>
            <div class="text-sm text-gray-500 mt-1">想看</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-card {
  opacity: 0;
  transform: scale(0.85);
  transform-origin: center center;
}

.animate-card.animate-in {
  animation: scaleIn 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes scaleIn {
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
