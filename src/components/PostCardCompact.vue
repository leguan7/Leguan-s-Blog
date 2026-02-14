<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { Post } from '@/types'
import { formatDate } from '@/utils/markdown'

defineProps<{
  post: Post
  index?: number
}>()
</script>

<template>
  <router-link
    :to="`/post/${post.slug}`"
    class="card compact-post-card group block p-4 border-l-4 border-transparent hover:border-[#7CB342] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <p class="text-xs font-mono text-gray-500 dark:text-gray-400 flex items-center mb-1.5">
          <Icon icon="lucide:calendar-days" class="w-3 h-3 mr-1 text-[#7CB342]" />
          {{ formatDate(post.date, 'short') }}
        </p>
        <h3 class="font-medium text-gray-800 dark:text-white group-hover:text-[#7CB342] transition-colors line-clamp-2 leading-snug">
          {{ post.title }}
        </h3>
        <div v-if="post.tags.length" class="flex flex-wrap gap-1.5 mt-2">
          <span
            v-for="tag in post.tags.slice(0, 2)"
            :key="tag"
            class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400"
          >
            <Icon icon="lucide:hash" class="w-2.5 h-2.5 inline mr-0.5" />
            {{ tag }}
          </span>
        </div>
      </div>
      <Icon
        icon="lucide:chevron-right"
        class="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-[#7CB342] group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
      />
    </div>
  </router-link>
</template>

<style scoped>
.compact-post-card {
  border: 1px solid rgba(255, 255, 255, 0.18);
}
</style>
