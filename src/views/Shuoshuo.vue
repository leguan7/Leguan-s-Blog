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

const shuoshuoList = [
  {
    id: 1,
    content: 'This blog is now deployed and live! Welcome to Leguan\'s Blog — a space to document life, thoughts, and everything in between.',
    time: '2026-02-06 14:30',
    likes: 0,
    mood: 'proud',
    images: [],
  },
]

function getMoodIcon(mood: string) {
  const moods: Record<string, string> = {
    happy: 'lucide:smile',
    proud: 'lucide:sparkles',
    thoughtful: 'lucide:lightbulb',
    excited: 'lucide:heart',
    sad: 'lucide:frown',
  }
  return moods[mood] || 'lucide:meh'
}

function getMoodColor(mood: string) {
  const colors: Record<string, string> = {
    happy: 'text-yellow-500',
    proud: 'text-purple-500',
    thoughtful: 'text-blue-500',
    excited: 'text-pink-500',
    sad: 'text-gray-500',
  }
  return colors[mood] || 'text-gray-500'
}
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/30"></div>
      
      <div class="relative text-center text-white z-10">
        <Icon icon="lucide:feather" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">Thoughts</h1>
        <p class="mt-3 text-white/80 text-lg">Recording life's little moments</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Thoughts List -->
      <div class="space-y-5">
        <div 
          v-for="(shuoshuo, index) in shuoshuoList"
          :key="shuoshuo.id"
          :ref="(el) => setCardRef(el, index)"
          class="card p-5 animate-card"
          :class="{ 'animate-in': isCardVisible(index) }"
        >
          <!-- Header -->
          <div class="flex items-center mb-4">
            <div class="avatar-ring w-12 h-12">
              <img 
                :src="IMAGES.avatar" 
                alt="Avatar"
                class="w-full h-full rounded-full object-cover"
              />
            </div>
            <div class="ml-3">
              <div class="font-bold text-gray-800 dark:text-white">Leguan</div>
              <div class="text-xs text-gray-500 flex items-center">
                <Icon icon="lucide:clock" class="w-3 h-3 mr-1" />
                {{ shuoshuo.time }}
              </div>
            </div>
            <Icon 
              :icon="getMoodIcon(shuoshuo.mood)" 
              class="w-6 h-6 ml-auto"
              :class="getMoodColor(shuoshuo.mood)"
            />
          </div>

          <!-- Content -->
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {{ shuoshuo.content }}
          </p>

          <!-- Images -->
          <div v-if="shuoshuo.images.length > 0" class="mt-4">
            <div 
              class="grid gap-2"
              :class="{
                'grid-cols-1': shuoshuo.images.length === 1,
                'grid-cols-2': shuoshuo.images.length === 2,
                'grid-cols-3': shuoshuo.images.length >= 3,
              }"
            >
              <img 
                v-for="(img, index) in shuoshuo.images"
                :key="index"
                :src="img"
                class="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                loading="lazy"
                decoding="async"
              />
            </div>
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
