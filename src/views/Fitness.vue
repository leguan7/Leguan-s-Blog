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

const fitnessLogs = [
  {
    date: '2026-02-05',
    type: 'Strength Training',
    icon: 'lucide:dumbbell',
    color: 'from-orange-500 to-red-500',
    exercises: ['Barbell Bench Press 4x10', 'Dumbbell Fly 3x12', 'Cable Crossover 3x15'],
    duration: 60,
    note: 'Great form today, increased bench press by 5kg',
  },
  {
    date: '2026-02-03',
    type: 'Cardio',
    icon: 'lucide:footprints',
    color: 'from-green-500 to-emerald-500',
    exercises: ['Treadmill 5km', 'Elliptical 20min', 'Stretching 10min'],
    duration: 50,
    note: 'Pace improved by 10 sec/km compared to last time',
  },
  {
    date: '2026-02-01',
    type: 'Back Training',
    icon: 'lucide:user',
    color: 'from-blue-500 to-cyan-500',
    exercises: ['Pull-ups 4x8', 'Barbell Row 4x10', 'Lat Pulldown 3x12'],
    duration: 55,
    note: 'Finally able to do 8 pull-ups!',
  },
]

const stats = {
  totalDays: 45,
  thisWeek: 4,
  streak: 12,
}
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
      <!-- Stats Cards -->
      <div 
        :ref="(el) => setCardRef(el, 0)"
        class="grid grid-cols-3 gap-4 mb-8 animate-card"
        :class="{ 'animate-in': isCardVisible(0) }"
      >
        <div class="card p-5 text-center">
          <Icon icon="lucide:calendar-check" class="w-8 h-8 text-[#7CB342] mx-auto" />
          <div class="text-2xl font-bold text-gray-800 dark:text-white mt-2">{{ stats.totalDays }}</div>
          <div class="text-sm text-gray-500">Total Days</div>
        </div>
        <div class="card p-5 text-center">
          <Icon icon="lucide:flame" class="w-8 h-8 text-orange-500 mx-auto" />
          <div class="text-2xl font-bold text-gray-800 dark:text-white mt-2">{{ stats.streak }}</div>
          <div class="text-sm text-gray-500">Streak</div>
        </div>
        <div class="card p-5 text-center">
          <Icon icon="lucide:trending-up" class="w-8 h-8 text-green-500 mx-auto" />
          <div class="text-2xl font-bold text-gray-800 dark:text-white mt-2">{{ stats.thisWeek }}</div>
          <div class="text-sm text-gray-500">This Week</div>
        </div>
      </div>

      <!-- Fitness Log -->
      <div class="space-y-5">
        <div 
          v-for="(log, index) in fitnessLogs"
          :key="log.date"
          :ref="(el) => setCardRef(el, index + 1)"
          class="card p-5 md:p-6 animate-card"
          :class="{ 'animate-in': isCardVisible(index + 1) }"
        >
          <div class="flex items-start gap-4">
            <!-- Icon -->
            <div 
              class="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0 bg-gradient-to-br"
              :class="log.color"
            >
              <Icon :icon="log.icon" class="w-7 h-7" />
            </div>

            <div class="flex-1 min-w-0">
              <!-- Header Info -->
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h3 class="font-bold text-lg text-gray-800 dark:text-white">{{ log.type }}</h3>
                  <p class="text-sm text-gray-500 flex items-center mt-0.5">
                    <Icon icon="lucide:calendar" class="w-3.5 h-3.5 mr-1" />
                    {{ log.date }}
                    <span class="mx-2">•</span>
                    <Icon icon="lucide:clock" class="w-3.5 h-3.5 mr-1" />
                    {{ log.duration }} min
                  </p>
                </div>
              </div>

              <!-- Exercises -->
              <div class="space-y-1.5 mb-3">
                <div 
                  v-for="exercise in log.exercises"
                  :key="exercise"
                  class="flex items-center text-gray-600 dark:text-gray-400 text-sm"
                >
                  <Icon icon="lucide:check" class="w-3.5 h-3.5 mr-2 text-green-500" />
                  {{ exercise }}
                </div>
              </div>

              <!-- Notes -->
              <div v-if="log.note" class="text-sm text-gray-500 dark:text-gray-400 italic border-l-2 border-[#7CB342] pl-3 bg-gray-50 dark:bg-gray-800/30 py-2 rounded-r">
                <Icon icon="lucide:quote" class="w-3 h-3 inline mr-1 opacity-50" />
                {{ log.note }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Motivation -->
      <div 
        :ref="(el) => setCardRef(el, fitnessLogs.length + 1)"
        class="card p-6 mt-8 text-center bg-gradient-to-r from-[#7CB342]/10 to-[#8BC34A]/10 animate-card"
        :class="{ 'animate-in': isCardVisible(fitnessLogs.length + 1) }"
      >
        <Icon icon="lucide:trophy" class="w-12 h-12 text-yellow-500 mx-auto mb-3" />
        <p class="text-lg font-medium text-gray-800 dark:text-white">
          "The only bad workout is the one that didn't happen."
        </p>
        <p class="text-sm text-gray-500 mt-1">— Keep pushing forward</p>
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
