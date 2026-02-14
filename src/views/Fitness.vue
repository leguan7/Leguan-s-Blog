<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

// Animation visibility
const visibleCards = ref<Set<number>>(new Set())

const setCardRef = (el: any, index: number) => {}

const isCardVisible = (index: number) => visibleCards.value.has(index)

onMounted(() => {
  // Immediately mark all cards visible with staggered animation
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      visibleCards.value.add(i)
      visibleCards.value = new Set(visibleCards.value)
    }, i * 150)
  }
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
  transform: scale(0.6);
  transform-origin: center center;
}

.animate-card.animate-in {
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
