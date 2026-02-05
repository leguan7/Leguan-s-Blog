<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import { formatDate } from '@/utils/markdown'

const blogStore = useBlogStore()

// Banner visibility
const bannerRef = ref<HTMLElement | null>(null)
const bannerVisible = ref(false)

// Year section visibility
const visibleSections = ref<Set<string>>(new Set())
const sectionRefs = ref<Map<string, HTMLElement>>(new Map())

let observer: IntersectionObserver | null = null

const setSectionRef = (el: any, key: string) => {
  if (el) {
    sectionRefs.value.set(key, el)
    ;(el as any).__sectionKey = key
    observer?.observe(el)
  }
}

const isSectionVisible = (key: string) => visibleSections.value.has(key)

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const key = (entry.target as any).__sectionKey as string
        if (entry.isIntersecting && !visibleSections.value.has(key)) {
          visibleSections.value.add(key)
          visibleSections.value = new Set(visibleSections.value)
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
  )

  // Observe banner
  if (bannerRef.value) {
    ;(bannerRef.value as any).__sectionKey = 'banner'
    observer.observe(bannerRef.value)
  }

  // Observe existing year sections
  sectionRefs.value.forEach((el, key) => {
    ;(el as any).__sectionKey = key
    observer?.observe(el)
  })

  // Banner visible immediately
  setTimeout(() => {
    bannerVisible.value = true
  }, 100)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/30"></div>
      
      <div 
        ref="bannerRef"
        class="relative text-center text-white z-10 banner-content"
        :class="{ 'animate-in': bannerVisible }"
      >
        <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#7CB342] to-[#8BC34A] p-[2px] shadow-lg shadow-[#7CB342]/30">
          <div class="w-full h-full rounded-2xl bg-black/30 backdrop-blur flex items-center justify-center">
            <Icon icon="lucide:archive" class="w-10 h-10 drop-shadow-lg" />
          </div>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">Archives</h1>
        <p class="mt-3 text-white/80 text-lg">{{ blogStore.posts.length }} posts in total</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <!-- Timeline -->
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div v-if="blogStore.isLoading" class="card p-16 text-center">
        <div class="inline-flex flex-col items-center">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7CB342]/20 to-[#8BC34A]/20 flex items-center justify-center mb-4">
            <div class="animate-spin rounded-full h-8 w-8 border-4 border-[#7CB342] border-t-transparent"></div>
          </div>
          <p class="text-gray-500">Loading...</p>
        </div>
      </div>

      <div v-else class="relative">
        <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#7CB342] via-[#7CB342]/50 to-transparent"></div>

        <div 
          v-for="([year, posts], yearIndex) in blogStore.archivesByYear" 
          :key="year"
          :ref="(el) => setSectionRef(el, `year-${year}`)"
          class="mb-10 year-section"
          :class="{ 'animate-in': isSectionVisible(`year-${year}`) }"
        >
          <!-- Year Badge -->
          <div class="relative flex items-center mb-6">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#7CB342] to-[#8BC34A] text-white flex items-center justify-center shadow-lg shadow-[#7CB342]/30 z-10">
              <Icon icon="lucide:calendar" class="w-5 h-5" />
            </div>
            <span class="ml-4 text-2xl font-bold text-gray-800 dark:text-white">{{ year }}</span>
            <span class="ml-2 px-2 py-0.5 text-xs bg-[#7CB342]/10 text-[#7CB342] rounded-full">({{ posts.length }} posts)</span>
          </div>

          <!-- Posts -->
          <div class="space-y-3 pl-6">
            <router-link 
              v-for="(post, postIndex) in posts"
              :key="post.slug"
              :to="`/post/${post.slug}`"
              class="card p-4 ml-6 flex items-center group relative hover:border-[#7CB342]/30 post-item"
              :class="{ 'animate-in': isSectionVisible(`year-${year}`) }"
              :style="{ animationDelay: `${(postIndex + 1) * 80}ms` }"
            >
              <div class="absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white dark:bg-gray-800 border-2 border-[#7CB342] group-hover:bg-[#7CB342] group-hover:scale-150 transition-all duration-300 z-10"></div>
              
              <div class="text-sm text-gray-400 w-24 shrink-0 font-mono flex items-center">
                <Icon icon="lucide:calendar-days" class="w-3.5 h-3.5 mr-1.5 text-[#7CB342]" />
                {{ formatDate(post.date, 'short') }}
              </div>
              
              <h3 class="flex-1 font-medium text-gray-800 dark:text-white group-hover:text-[#7CB342] transition-colors line-clamp-1">
                {{ post.title }}
              </h3>

              <div class="hidden md:flex gap-1.5 ml-4">
                <span 
                  v-for="tag in post.tags.slice(0, 2)"
                  :key="tag"
                  class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400"
                >
                  <Icon icon="lucide:hash" class="w-2 h-2 inline mr-0.5" />{{ tag }}
                </span>
              </div>

              <Icon icon="lucide:chevron-right" class="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-[#7CB342] group-hover:translate-x-1 transition-all ml-3" />
            </router-link>
          </div>
        </div>

        <!-- End Mark -->
        <div 
          :ref="(el) => setSectionRef(el, 'end-mark')"
          class="relative flex items-center justify-center"
          :class="{ 'animate-in': isSectionVisible('end-mark') }"
        >
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center z-10">
            <Icon icon="lucide:flag" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner-content,
.year-section,
.post-item {
  opacity: 0;
  transform: scale(0.85);
  transform-origin: center center;
}

.banner-content.animate-in,
.year-section.animate-in,
.post-item.animate-in {
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
