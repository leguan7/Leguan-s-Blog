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

const seriesList = [
  { name: '狂飙', status: '已追完', rating: '9.6', cover: COVER_IMAGES[0], tags: ['犯罪', '剧情', '悬疑'], year: '2023' },
  { name: '繁花', status: '追剧中', rating: '9.2', cover: COVER_IMAGES[1], tags: ['年代', '商战', '剧情'], year: '2024' },
  { name: '漫长的季节', status: '已追完', rating: '9.5', cover: COVER_IMAGES[2], tags: ['悬疑', '剧情', '犯罪'], year: '2023' },
  { name: '三体', status: '已追完', rating: '8.8', cover: COVER_IMAGES[3], tags: ['科幻', '剧情'], year: '2023' },
  { name: '庆余年2', status: '追剧中', rating: '8.5', cover: COVER_IMAGES[4], tags: ['古装', '权谋', '喜剧'], year: '2024' },
  { name: '开端', status: '已追完', rating: '9.0', cover: COVER_IMAGES[5], tags: ['悬疑', '科幻', '剧情'], year: '2022' },
]

function getStatusColor(status: string) {
  switch (status) {
    case '追剧中': return 'bg-green-500'
    case '已追完': return 'bg-blue-500'
    case '想追': return 'bg-yellow-500'
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
        <Icon icon="lucide:tv" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">追剧</h1>
        <p class="mt-3 text-white/80 text-lg">那些令人沉浸的好剧</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- 剧集网格 -->
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="(series, index) in seriesList"
          :key="series.name"
          :ref="(el) => setCardRef(el, index)"
          class="card overflow-hidden group animate-card"
          :class="{ 'animate-in': isCardVisible(index) }"
        >
          <!-- 封面 -->
          <div class="aspect-[16/9] relative overflow-hidden">
            <img 
              :src="series.cover" 
              :alt="series.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />
            <!-- 状态角标 -->
            <span 
              class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-medium"
              :class="getStatusColor(series.status)"
            >
              {{ series.status }}
            </span>
            <!-- 评分 -->
            <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center text-yellow-400 text-sm">
              <Icon icon="lucide:star" class="w-3.5 h-3.5 mr-1" />
              {{ series.rating }}
            </div>
            <!-- 年份 -->
            <div class="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 text-white/90 text-xs">
              {{ series.year }}
            </div>
            <!-- 遮罩 -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <!-- 信息 -->
          <div class="p-4">
            <h3 class="font-bold text-lg text-gray-800 dark:text-white group-hover:text-[#7CB342] transition-colors">
              {{ series.name }}
            </h3>
            <div class="flex flex-wrap gap-1.5 mt-2">
              <span 
                v-for="tag in series.tags"
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
        :ref="(el) => setCardRef(el, seriesList.length)"
        class="card p-6 mt-8 animate-card"
        :class="{ 'animate-in': isCardVisible(seriesList.length) }"
      >
        <div class="flex justify-around text-center">
          <div>
            <div class="text-3xl font-bold text-[#7CB342]">{{ seriesList.length }}</div>
            <div class="text-sm text-gray-500 mt-1">总剧集</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-green-500">{{ seriesList.filter(s => s.status === '追剧中').length }}</div>
            <div class="text-sm text-gray-500 mt-1">追剧中</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-blue-500">{{ seriesList.filter(s => s.status === '已追完').length }}</div>
            <div class="text-sm text-gray-500 mt-1">已追完</div>
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
