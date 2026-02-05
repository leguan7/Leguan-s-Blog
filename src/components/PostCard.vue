<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import type { Post } from '@/types'
import { formatDate, estimateReadingTime } from '@/utils/markdown'
import { getCoverImage } from '@/utils/assets'

const props = defineProps<{
  post: Post
  layout?: 'left' | 'right'
  index?: number
}>()

const isVisible = ref(false)

onMounted(() => {
  // 延迟显示动画
  const delay = (props.index || 0) * 100
  setTimeout(() => {
    isVisible.value = true
  }, delay)
})

const readingTime = computed(() => estimateReadingTime(props.post.content))
const formattedDate = computed(() => formatDate(props.post.date))

const coverImage = computed(() => {
  if (props.post.cover) return props.post.cover
  return getCoverImage(props.post.slug)
})

// 随机渐变色
const gradientColors = [
  'from-[#49b1f5] to-[#0abcf9]',
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
    class="card overflow-hidden group post-card"
    :class="[
      layout === 'right' ? 'md:flex md:flex-row-reverse' : 'md:flex',
      { 'animate-in': isVisible }
    ]"
    :style="{ animationDelay: `${(index || 0) * 100}ms` }"
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
          class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <!-- 遮罩层 -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
        <div class="absolute inset-0 bg-[#49b1f5]/0 group-hover:bg-[#49b1f5]/20 transition-colors duration-500"></div>
        
        <!-- 日期角标 -->
        <div 
          class="absolute top-4 left-4 text-white flex flex-col items-center justify-center w-14 h-14 rounded-xl shadow-lg"
          :class="`bg-gradient-to-br ${categoryGradient}`"
        >
          <span class="text-2xl font-bold leading-none">{{ new Date(post.date).getDate() }}</span>
          <span class="text-xs opacity-90">{{ new Date(post.date).toLocaleDateString('zh-CN', { month: 'short' }) }}</span>
        </div>

        <!-- 置顶标记 -->
        <div 
          v-if="post.sticky"
          class="absolute top-4 right-4 bg-gradient-to-br from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center"
        >
          <Icon icon="fas:thumbtack" class="w-3 h-3 mr-1" />
          置顶
        </div>

        <!-- 悬浮显示阅读按钮 -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          <span class="px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-800 dark:text-white shadow-lg flex items-center">
            <Icon icon="fas:book-open" class="w-4 h-4 mr-2 text-[#49b1f5]" />
            阅读全文
          </span>
        </div>
      </div>
    </router-link>

    <!-- 内容 -->
    <div class="md:w-[55%] p-5 md:p-6 flex flex-col justify-center relative">
      <!-- 分类 -->
      <div class="flex flex-wrap gap-2 mb-3">
        <router-link
          v-for="category in post.categories"
          :key="category"
          :to="{ path: '/categories', query: { category } }"
          class="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r text-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
          :class="categoryGradient"
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
            class="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 hover:bg-[#49b1f5] hover:text-white transition-all duration-300 flex items-center"
          >
            <Icon icon="fas:hashtag" class="w-2.5 h-2.5 mr-0.5 opacity-70" />
            {{ tag }}
          </router-link>
          <span v-if="post.tags.length > 3" class="text-xs text-gray-400 self-center">
            +{{ post.tags.length - 3 }}
          </span>
        </div>

        <!-- 阅读信息 -->
        <div class="flex items-center space-x-3 text-xs text-gray-400">
          <span class="flex items-center">
            <Icon icon="fas:clock" class="w-3.5 h-3.5 mr-1 text-[#49b1f5]" />
            {{ readingTime }} 分钟
          </span>
        </div>
      </div>

      <!-- 装饰元素 -->
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
  transform: translateY(30px);
}

.post-card.animate-in {
  animation: slideUp 0.6s ease-out forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
