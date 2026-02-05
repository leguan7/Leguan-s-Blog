<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import type { Post } from '@/types'
import { formatDate, estimateReadingTime } from '@/utils/markdown'
import { getCoverImage } from '@/utils/assets'

const props = defineProps<{
  post: Post
  layout?: 'left' | 'right'
  index?: number
}>()

const cardRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isVisible.value) {
          // Add delay based on index for staggered animation
          const delay = (props.index || 0) * 150
          setTimeout(() => {
            isVisible.value = true
          }, delay)
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
  )

  if (cardRef.value) {
    observer.observe(cardRef.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})

const readingTime = computed(() => estimateReadingTime(props.post.content))
const formattedDate = computed(() => formatDate(props.post.date))

const coverImage = computed(() => {
  if (props.post.cover) return props.post.cover
  return getCoverImage(props.post.slug)
})

// Gradient colors
const gradientColors = [
  'from-[#7CB342] to-[#8BC34A]',
  'from-pink-500 to-rose-500',
  'from-purple-500 to-violet-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-amber-500',
  'from-cyan-500 to-teal-500',
]

const categoryGradient = computed(() => {
  const index = props.post.categories?.[0]?.charCodeAt(0) || 0
  return gradientColors[index % gradientColors.length]
})
</script>

<template>
  <article 
    ref="cardRef"
    class="card overflow-hidden group post-card"
    :class="[
      layout === 'right' ? 'md:flex md:flex-row-reverse' : 'md:flex',
      { 'animate-in': isVisible }
    ]"
  >
    <!-- Cover Image -->
    <router-link 
      :to="`/post/${post.slug}`"
      class="block md:w-[45%] relative overflow-hidden"
    >
      <div class="aspect-[16/10] md:aspect-auto md:h-full relative">
        <img 
          :src="coverImage" 
          :alt="post.title"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
        />
        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
        <div class="absolute inset-0 bg-[#7CB342]/0 group-hover:bg-[#7CB342]/20 transition-colors duration-500"></div>
        
        <!-- Date Badge -->
        <div 
          class="absolute top-4 left-4 text-white flex flex-col items-center justify-center w-14 h-14 rounded-xl shadow-lg"
          :class="`bg-gradient-to-br ${categoryGradient}`"
        >
          <span class="text-2xl font-bold leading-none">{{ new Date(post.date).getDate() }}</span>
          <span class="text-xs opacity-90">{{ new Date(post.date).toLocaleDateString('en-US', { month: 'short' }) }}</span>
        </div>

        <!-- Sticky Badge -->
        <div 
          v-if="post.sticky"
          class="absolute top-4 right-4 bg-gradient-to-br from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center"
        >
          <Icon icon="lucide:pin" class="w-3 h-3 mr-1" />
          Pinned
        </div>

        <!-- Hover Read Button -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          <span class="px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800 dark:text-white shadow-lg flex items-center">
            <Icon icon="lucide:book-open" class="w-4 h-4 mr-2 text-[#7CB342]" />
            Read More
          </span>
        </div>
      </div>
    </router-link>

    <!-- Content -->
    <div class="md:w-[55%] p-5 md:p-6 flex flex-col justify-center relative">
      <!-- Categories -->
      <div class="flex flex-wrap gap-2 mb-3">
        <router-link
          v-for="category in post.categories"
          :key="category"
          :to="{ path: '/categories', query: { category } }"
          class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r text-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
          :class="categoryGradient"
        >
          <Icon icon="lucide:folder" class="w-3 h-3 mr-1" />
          {{ category }}
        </router-link>
      </div>

      <!-- Title -->
      <router-link :to="`/post/${post.slug}`" class="group/title">
        <h2 class="text-xl md:text-2xl font-bold text-gray-800 dark:text-white group-hover/title:text-[#7CB342] transition-colors duration-300 line-clamp-2">
          {{ post.title }}
        </h2>
      </router-link>

      <!-- Excerpt -->
      <p class="mt-3 text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed text-sm md:text-base">
        {{ post.excerpt }}
      </p>

      <!-- Footer Info -->
      <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
        <!-- Tags -->
        <div class="flex flex-wrap gap-1.5">
          <router-link
            v-for="tag in post.tags.slice(0, 3)"
            :key="tag"
            :to="{ path: '/tags', query: { tag } }"
            class="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-[#7CB342] hover:text-white transition-all duration-300 flex items-center"
          >
            <Icon icon="lucide:hash" class="w-2.5 h-2.5 mr-0.5" />
            {{ tag }}
          </router-link>
          <span v-if="post.tags.length > 3" class="text-xs text-gray-500 dark:text-gray-400 self-center">
            +{{ post.tags.length - 3 }}
          </span>
        </div>

        <!-- Reading Info -->
        <div class="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
          <span class="flex items-center">
            <Icon icon="lucide:clock" class="w-3.5 h-3.5 mr-1 text-[#7CB342]" />
            {{ readingTime }} min
          </span>
        </div>
      </div>

      <!-- Decorative Element -->
      <div 
        class="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-5 dark:opacity-10"
        :class="`bg-gradient-to-br ${categoryGradient}`"
      ></div>
    </div>
  </article>
</template>

<style scoped>
.post-card {
  opacity: 0;
  transform: scale(0.85);
  transform-origin: center center;
}

.post-card.animate-in {
  animation: cardScaleIn 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes cardScaleIn {
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
