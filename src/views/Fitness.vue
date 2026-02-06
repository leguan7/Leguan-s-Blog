<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

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
          }, index * 150)
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
  )

  cardElements.value.forEach((el, index) => {
    ;(el as any).__cardIndex = index
    observer?.observe(el)
  })
})

onUnmounted(() => {
  observer?.disconnect()
})

const fitnessLogs: any[] = []
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/40"></div>
      
      <div class="relative text-center text-white z-10">
        <Icon icon="lucide:dumbbell" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">Fitness Log</h1>
        <p class="mt-3 text-white/80 text-lg">Discipline gives me freedom</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Notice -->
      <div
        :ref="(el) => setCardRef(el, 0)"
        class="card p-6 text-center animate-card"
        :class="{ 'animate-in': isCardVisible(0) }"
      >
        <Icon icon="lucide:dumbbell" class="w-12 h-12 text-[#7CB342] mx-auto mb-3" />
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          Been hitting the gym since college — from school gyms to hometown, then Hangzhou. Just moved to Shenzhen, planning to restart in early 2026. Workout logs coming soon!
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-card {
  opacity: 0;
  transform: translateX(-20px);
}

.animate-card.animate-in {
  animation: slideIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
