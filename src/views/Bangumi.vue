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

const bangumiList = [
  { name: '孤独摇滚', status: '已看完', rating: '9.5', cover: COVER_IMAGES[0], tags: ['日常', '音乐', '治愈'] },
  { name: '葬送的芙莉莲', status: '追番中', rating: '9.8', cover: COVER_IMAGES[1], tags: ['奇幻', '冒险', '治愈'] },
  { name: '间谍过家家', status: '已看完', rating: '9.2', cover: COVER_IMAGES[2], tags: ['喜剧', '动作', '家庭'] },
  { name: '鬼灭之刃', status: '追番中', rating: '9.0', cover: COVER_IMAGES[3], tags: ['战斗', '热血', '超自然'] },
  { name: '咒术回战', status: '已看完', rating: '8.8', cover: COVER_IMAGES[4], tags: ['战斗', '超自然', '热血'] },
  { name: '进击的巨人', status: '已看完', rating: '9.9', cover: COVER_IMAGES[5], tags: ['战斗', '剧情', '史诗'] },
]

function getStatusColor(status: string) {
  switch (status) {
    case '追番中': return 'bg-green-500'
    case '已看完': return 'bg-blue-500'
    case '想看': return 'bg-yellow-500'
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
        <Icon icon="lucide:clapperboard" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">番剧</h1>
        <p class="mt-3 text-white/80 text-lg">二次元，是精神的故乡</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- 番剧网格 -->
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="(bangumi, index) in bangumiList"
          :key="bangumi.name"
          :ref="(el) => setCardRef(el, index)"
          class="card overflow-hidden group animate-card"
          :class="{ 'animate-in': isCardVisible(index) }"
        >
          <!-- 封面 -->
          <div class="aspect-[16/9] relative overflow-hidden">
            <img 
              :src="bangumi.cover" 
              :alt="bangumi.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />
            <!-- 状态角标 -->
            <span 
              class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-medium"
              :class="getStatusColor(bangumi.status)"
            >
              {{ bangumi.status }}
            </span>
            <!-- 评分 -->
            <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center text-yellow-400 text-sm">
              <Icon icon="lucide:star" class="w-3.5 h-3.5 mr-1" />
              {{ bangumi.rating }}
            </div>
            <!-- 遮罩 -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <!-- 信息 -->
          <div class="p-4">
            <h3 class="font-bold text-lg text-gray-800 dark:text-white group-hover:text-[#49b1f5] transition-colors">
              {{ bangumi.name }}
            </h3>
            <div class="flex flex-wrap gap-1.5 mt-2">
              <span 
                v-for="tag in bangumi.tags"
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
        :ref="(el) => setCardRef(el, bangumiList.length)"
        class="card p-6 mt-8 animate-card"
        :class="{ 'animate-in': isCardVisible(bangumiList.length) }"
      >
        <div class="flex justify-around text-center">
          <div>
            <div class="text-3xl font-bold text-[#49b1f5]">{{ bangumiList.length }}</div>
            <div class="text-sm text-gray-500 mt-1">总番剧</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-green-500">{{ bangumiList.filter(b => b.status === '追番中').length }}</div>
            <div class="text-sm text-gray-500 mt-1">追番中</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-blue-500">{{ bangumiList.filter(b => b.status === '已看完').length }}</div>
            <div class="text-sm text-gray-500 mt-1">已看完</div>
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
