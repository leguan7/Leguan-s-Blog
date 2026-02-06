<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { IMAGES } from '@/utils/assets'

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
  {
    name: 'Jujutsu Kaisen',
    status: 'Completed',
    rating: '9.7',
    cover: IMAGES.zhoushuhuizhan,
    tags: ['Battle', 'Supernatural', 'Shounen'],
    link: 'https://www.bilibili.com/bangumi/media/md28229899',
    description: 'The boy fights — "in search of a proper death." Negative emotions born from humans — regret, bitterness, shame — become curses that lurk in everyday life. Curses are a source of disaster spreading throughout the world, and in the worst cases, can lead to death. And curses can only be exorcised with curses. Yuji Itadori, a boy with extraordinary physical abilities, was living an ordinary high school life. One day, to save a friend attacked by a "curse," he swallowed a Special Grade cursed object — "Ryomen Sukuna\'s Finger" — binding the curse to his own soul. Now sharing a body with the curse "Ryomen Sukuna," Yuji is guided by the strongest jujutsu sorcerer Satoru Gojo to enroll in the "Tokyo Prefectural Jujutsu High School"... A boy who became a curse to exorcise curses — an epic story of no return begins.',
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case 'Watching': return 'bg-green-500'
    case 'Completed': return 'bg-blue-500'
    case 'Plan to Watch': return 'bg-yellow-500'
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
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">Anime</h1>
        <p class="mt-3 text-white/80 text-lg">Anime is home for the soul</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Anime Grid -->
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
        <div 
          v-for="(bangumi, index) in bangumiList"
          :key="bangumi.name"
          :ref="(el) => setCardRef(el, index)"
          class="card overflow-hidden group animate-card"
          :class="{ 'animate-in': isCardVisible(index) }"
        >
          <div class="flex flex-row h-[160px]">
            <!-- Cover (horizontal, left side) -->
            <div class="w-[120px] flex-shrink-0 relative overflow-hidden">
              <img 
                :src="bangumi.cover" 
                :alt="bangumi.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />
              <!-- Status Badge -->
              <span 
                class="absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-white text-[10px] font-medium"
                :class="getStatusColor(bangumi.status)"
              >
                {{ bangumi.status }}
              </span>
            </div>

            <!-- Info (right side) -->
            <div class="flex-1 p-3.5 flex flex-col justify-between overflow-hidden">
              <div>
                <div class="flex items-center justify-between">
                  <a 
                    v-if="bangumi.link"
                    :href="bangumi.link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="font-bold text-sm text-gray-800 dark:text-white group-hover:text-[#7CB342] transition-colors inline-flex items-center pb-0.5 leading-[1.4] truncate"
                  >
                    {{ bangumi.name }}
                    <Icon icon="lucide:external-link" class="w-3 h-3 ml-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <h3 v-else class="font-bold text-sm text-gray-800 dark:text-white truncate pb-0.5 leading-[1.4]">
                    {{ bangumi.name }}
                  </h3>
                  <div class="flex items-center text-yellow-500 text-xs flex-shrink-0 ml-2">
                    <Icon icon="lucide:star" class="w-3 h-3 mr-0.5" />
                    {{ bangumi.rating }}
                  </div>
                </div>
                <p v-if="bangumi.description" class="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-3 leading-relaxed">
                  {{ bangumi.description }}
                </p>
              </div>
              <div class="flex flex-wrap gap-1 mt-1.5">
                <span 
                  v-for="tag in bangumi.tags"
                  :key="tag"
                  class="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div 
        :ref="(el) => setCardRef(el, bangumiList.length)"
        class="card p-6 mt-8 animate-card"
        :class="{ 'animate-in': isCardVisible(bangumiList.length) }"
      >
        <div class="flex justify-around text-center">
          <div>
            <div class="text-3xl font-bold text-[#7CB342]">{{ bangumiList.length }}</div>
            <div class="text-sm text-gray-500 mt-1">Total Anime</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-green-500">{{ bangumiList.filter(b => b.status === 'Watching').length }}</div>
            <div class="text-sm text-gray-500 mt-1">Watching</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-blue-500">{{ bangumiList.filter(b => b.status === 'Completed').length }}</div>
            <div class="text-sm text-gray-500 mt-1">Completed</div>
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
