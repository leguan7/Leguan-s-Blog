<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { Post } from '@/types'
import { formatDate, estimateReadingTime } from '@/utils/markdown'
import { COVER_IMAGES, getCoverImage } from '@/utils/assets'

const props = defineProps<{
  post: Post
  layout?: 'left' | 'right'
}>()

const readingTime = computed(() => estimateReadingTime(props.post.content))
const formattedDate = computed(() => formatDate(props.post.date))

const coverImage = computed(() => {
  if (props.post.cover) return props.post.cover
  return getCoverImage(props.post.slug)
})
</script>

<template>
  <article 
    class="card overflow-hidden group"
    :class="layout === 'right' ? 'md:flex md:flex-row-reverse' : 'md:flex'"
  >
    <!-- 封面图 -->
    <router-link 
      :to="`/post/${post.slug}`"
      class="block md:w-[45%] relative overflow-hidden"
    >
      <div class="aspect-[16/10] md:aspect-auto md:h-full relative">
        <img 
          :src="coverImage" 
          :alt="post.title"
          class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          loading="lazy"
        />
        <!-- 遮罩 -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <!-- 日期角标 -->
        <div class="absolute top-4 left-4 bg-[#49b1f5] text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg">
          <Icon icon="fas:calendar-alt" class="w-3.5 h-3.5 inline mr-1" />
          {{ formattedDate }}
        </div>
      </div>
    </router-link>

    <!-- 内容 -->
    <div class="md:w-[55%] p-5 md:p-6 flex flex-col justify-center">
      <!-- 分类 -->
      <div class="flex flex-wrap gap-2 mb-3">
        <router-link
          v-for="category in post.categories"
          :key="category"
          :to="{ path: '/categories', query: { category } }"
          class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#49b1f5]/10 text-[#49b1f5] hover:bg-[#49b1f5] hover:text-white transition-all duration-300"
        >
          <Icon icon="fas:folder" class="w-3 h-3 mr-1" />
          {{ category }}
        </router-link>
      </div>

      <!-- 标题 -->
      <router-link :to="`/post/${post.slug}`" class="group/title">
        <h2 class="text-xl md:text-2xl font-bold text-gray-800 dark:text-white group-hover/title:text-[#49b1f5] transition-colors duration-300 line-clamp-2">
          {{ post.title }}
        </h2>
      </router-link>

      <!-- 摘要 -->
      <p class="mt-3 text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed text-sm md:text-base">
        {{ post.excerpt }}
      </p>

      <!-- 底部信息 -->
      <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
        <!-- 标签 -->
        <div class="flex flex-wrap gap-1.5">
          <router-link
            v-for="tag in post.tags.slice(0, 3)"
            :key="tag"
            :to="{ path: '/tags', query: { tag } }"
            class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 hover:bg-[#49b1f5] hover:text-white transition-all duration-300"
          >
            <Icon icon="fas:hashtag" class="w-2.5 h-2.5 inline" />{{ tag }}
          </router-link>
        </div>

        <!-- 阅读时间 -->
        <span class="text-xs text-gray-400 flex items-center">
          <Icon icon="fas:clock" class="w-3.5 h-3.5 mr-1" />
          {{ readingTime }} 分钟
        </span>
      </div>
    </div>
  </article>
</template>
