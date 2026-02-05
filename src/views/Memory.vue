<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { COVER_IMAGES } from '@/utils/assets'

// Intersection Observer for animations
const visibleCards = ref<Set<string>>(new Set())
const cardElements = ref<Map<string, HTMLElement>>(new Map())
let observer: IntersectionObserver | null = null

const setCardRef = (el: any, key: string) => {
  if (el) {
    cardElements.value.set(key, el)
  }
}

const isCardVisible = (key: string) => visibleCards.value.has(key)

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const key = (entry.target as any).__cardKey as string
        if (entry.isIntersecting && !visibleCards.value.has(key)) {
          visibleCards.value.add(key)
          visibleCards.value = new Set(visibleCards.value)
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
  )

  // Observe all stored elements
  cardElements.value.forEach((el, key) => {
    ;(el as any).__cardKey = key
    observer?.observe(el)
  })
})

onUnmounted(() => {
  observer?.disconnect()
})

const memories = [
  {
    year: '2025',
    items: [
      { image: COVER_IMAGES[0], title: 'Autumn Trip', desc: 'Visited Yunnan, picturesque scenery' },
      { image: COVER_IMAGES[1], title: 'Graduation', desc: 'Farewell to campus, starting a new journey' },
      { image: COVER_IMAGES[2], title: 'First Job', desc: 'Became a frontend developer' },
    ]
  },
  {
    year: '2024',
    items: [
      { image: COVER_IMAGES[3], title: 'Learned Vue', desc: 'Deep dive into Vue 3 ecosystem' },
      { image: COVER_IMAGES[4], title: 'Winter Trip', desc: 'Visited Hokkaido with friends' },
      { image: COVER_IMAGES[5], title: 'Hackathon', desc: '48 hours of coding, so rewarding' },
    ]
  },
  {
    year: '2023',
    items: [
      { image: COVER_IMAGES[6], title: 'Started Blogging', desc: 'Recording learning and life moments' },
      { image: COVER_IMAGES[0], title: 'Got a Cat', desc: 'Named it "Code"' },
    ]
  }
]
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/40"></div>
      
      <div class="relative text-center text-white z-10">
        <Icon icon="lucide:images" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">Gallery</h1>
        <p class="mt-3 text-white/80 text-lg">Time machine, capturing beautiful moments</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Year Groups -->
      <div 
        v-for="(group, groupIndex) in memories" 
        :key="group.year" 
        :ref="(el) => setCardRef(el, `group-${groupIndex}`)"
        class="mb-12 last:mb-0 animate-card"
        :class="{ 'animate-in': isCardVisible(`group-${groupIndex}`) }"
      >
        <!-- Year Title -->
        <div class="flex items-center mb-6">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#7CB342] to-[#8BC34A] flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {{ group.year }}
          </div>
          <div class="h-0.5 flex-1 ml-4 bg-gradient-to-r from-[#7CB342]/50 to-transparent"></div>
        </div>

        <!-- Photo Grid -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="(item, index) in group.items"
            :key="index"
            :ref="(el) => setCardRef(el, `item-${groupIndex}-${index}`)"
            class="card overflow-hidden group cursor-pointer animate-card"
            :class="{ 'animate-in': isCardVisible(`item-${groupIndex}-${index}`) }"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="aspect-[4/3] relative overflow-hidden">
              <img 
                :src="item.image"
                :alt="item.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />
              <!-- Hover Overlay -->
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <h3 class="font-bold text-lg">{{ item.title }}</h3>
                <p class="text-sm text-white/80 mt-1">{{ item.desc }}</p>
              </div>
              <!-- Corner Icon -->
              <div class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon icon="lucide:expand" class="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Stats -->
      <div 
        :ref="(el) => setCardRef(el, 'stats')"
        class="card p-6 text-center mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-card"
        :class="{ 'animate-in': isCardVisible('stats') }"
      >
        <div class="flex justify-around">
          <div>
            <Icon icon="lucide:images" class="w-8 h-8 text-purple-500 mx-auto mb-1" />
            <div class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ memories.reduce((acc, g) => acc + g.items.length, 0) }}
            </div>
            <div class="text-sm text-gray-500">Photos</div>
          </div>
          <div>
            <Icon icon="lucide:calendar" class="w-8 h-8 text-pink-500 mx-auto mb-1" />
            <div class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ memories.length }}
            </div>
            <div class="text-sm text-gray-500">Years</div>
          </div>
          <div>
            <Icon icon="lucide:heart" class="w-8 h-8 text-red-500 mx-auto mb-1" />
            <div class="text-2xl font-bold text-gray-800 dark:text-white">∞</div>
            <div class="text-sm text-gray-500">Memories</div>
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
