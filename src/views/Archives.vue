<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import { formatDate } from '@/utils/markdown'

const blogStore = useBlogStore()
const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/30"></div>
      
      <div 
        class="relative text-center text-white z-10 banner-content"
        :class="{ 'animate-in': isVisible }"
      >
        <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#49b1f5] to-[#0abcf9] p-[2px] shadow-lg shadow-[#49b1f5]/30">
          <div class="w-full h-full rounded-2xl bg-black/30 backdrop-blur flex items-center justify-center">
            <Icon icon="fas:archive" class="w-10 h-10 drop-shadow-lg" />
          </div>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">归档</h1>
        <p class="mt-3 text-white/80 text-lg">共 {{ blogStore.posts.length }} 篇文章</p>
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
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#49b1f5]/20 to-[#0abcf9]/20 flex items-center justify-center mb-4">
            <div class="animate-spin rounded-full h-8 w-8 border-4 border-[#49b1f5] border-t-transparent"></div>
          </div>
          <p class="text-gray-500">加载中...</p>
        </div>
      </div>

      <div v-else class="relative">
        <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#49b1f5] via-[#49b1f5]/50 to-transparent"></div>

        <div 
          v-for="([year, posts], yearIndex) in blogStore.archivesByYear" 
          :key="year"
          class="mb-10 year-section"
          :class="{ 'animate-in': isVisible }"
          :style="{ animationDelay: `${yearIndex * 150}ms` }"
        >
          <!-- Year Badge -->
          <div class="relative flex items-center mb-6">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#49b1f5] to-[#0abcf9] text-white flex items-center justify-center shadow-lg shadow-[#49b1f5]/30 z-10">
              <Icon icon="fas:calendar" class="w-5 h-5" />
            </div>
            <span class="ml-4 text-2xl font-bold text-gray-800 dark:text-white">{{ year }}</span>
            <span class="ml-2 px-2 py-0.5 text-xs bg-[#49b1f5]/10 text-[#49b1f5] rounded-full">({{ posts.length }}篇)</span>
          </div>

          <!-- Posts -->
          <div class="space-y-3 pl-6">
            <router-link 
              v-for="(post, postIndex) in posts"
              :key="post.slug"
              :to="`/post/${post.slug}`"
              class="card p-4 ml-6 flex items-center group relative hover:border-[#49b1f5]/30 post-item"
              :class="{ 'animate-in': isVisible }"
              :style="{ animationDelay: `${yearIndex * 150 + (postIndex + 1) * 50}ms` }"
            >
              <div class="absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white dark:bg-gray-800 border-2 border-[#49b1f5] group-hover:bg-[#49b1f5] group-hover:scale-150 transition-all duration-300 z-10"></div>
              
              <div class="text-sm text-gray-400 w-24 shrink-0 font-mono flex items-center">
                <Icon icon="fas:calendar-day" class="w-3.5 h-3.5 mr-1.5 text-[#49b1f5]" />
                {{ formatDate(post.date, 'short') }}
              </div>
              
              <h3 class="flex-1 font-medium text-gray-800 dark:text-white group-hover:text-[#49b1f5] transition-colors line-clamp-1">
                {{ post.title }}
              </h3>

              <div class="hidden md:flex gap-1.5 ml-4">
                <span 
                  v-for="tag in post.tags.slice(0, 2)"
                  :key="tag"
                  class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400"
                >
                  <Icon icon="fas:hashtag" class="w-2 h-2 inline mr-0.5 opacity-60" />{{ tag }}
                </span>
              </div>

              <Icon icon="fas:chevron-right" class="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-[#49b1f5] group-hover:translate-x-1 transition-all ml-3" />
            </router-link>
          </div>
        </div>

        <!-- End Mark -->
        <div 
          class="relative flex items-center justify-center"
          :class="{ 'animate-in': isVisible }"
          :style="{ animationDelay: '500ms' }"
        >
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center z-10">
            <Icon icon="fas:flag-checkered" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
  transform: translateY(20px);
}

.banner-content.animate-in,
.year-section.animate-in,
.post-item.animate-in {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
