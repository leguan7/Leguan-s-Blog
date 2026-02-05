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
          visibleCards.value.add(index)
          visibleCards.value = new Set(visibleCards.value)
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
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="text-center">
      <!-- 404 Animated Number -->
      <div class="relative mb-8">
        <div class="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7CB342] to-[#8BC34A] leading-none select-none opacity-20">
          404
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <Icon icon="lucide:ghost" class="w-24 h-24 md:w-32 md:h-32 text-[#7CB342] animate-float" />
        </div>
      </div>

      <!-- Info -->
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
        Oops, page not found
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
        The page you're looking for may have been deleted, moved, or never existed.<br>
        Don't worry, let us help you find your way back!
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <router-link to="/" class="btn btn-primary">
          <Icon icon="lucide:home" class="w-4 h-4 mr-2" />
          Back to Home
        </router-link>
        <button @click="$router.back()" class="btn border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[#7CB342] hover:text-[#7CB342]">
          <Icon icon="lucide:arrow-left" class="w-4 h-4 mr-2" />
          Go Back
        </button>
      </div>

      <!-- Popular Page Recommendations -->
      <div 
        :ref="(el) => setCardRef(el, 0)"
        class="mt-12 text-left max-w-md mx-auto card p-5 animate-card"
        :class="{ 'animate-in': isCardVisible(0) }"
      >
        <h3 class="font-bold text-gray-800 dark:text-white mb-3 flex items-center text-sm">
          <Icon icon="lucide:compass" class="w-4 h-4 mr-2 text-[#7CB342]" />
          Pages you might want to visit
        </h3>
        <div class="space-y-2">
          <router-link 
            to="/archives"
            class="flex items-center text-gray-600 dark:text-gray-400 hover:text-[#7CB342] transition-colors text-sm py-1"
          >
            <Icon icon="lucide:archive" class="w-4 h-4 mr-2" />
            Archives - View all posts
          </router-link>
          <router-link 
            to="/categories"
            class="flex items-center text-gray-600 dark:text-gray-400 hover:text-[#7CB342] transition-colors text-sm py-1"
          >
            <Icon icon="lucide:folder-open" class="w-4 h-4 mr-2" />
            Categories - Browse by category
          </router-link>
          <router-link 
            to="/tags"
            class="flex items-center text-gray-600 dark:text-gray-400 hover:text-[#7CB342] transition-colors text-sm py-1"
          >
            <Icon icon="lucide:tags" class="w-4 h-4 mr-2" />
            Tags - Browse by tag
          </router-link>
          <router-link 
            to="/about"
            class="flex items-center text-gray-600 dark:text-gray-400 hover:text-[#7CB342] transition-colors text-sm py-1"
          >
            <Icon icon="lucide:user" class="w-4 h-4 mr-2" />
            About - Learn about the author
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

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
