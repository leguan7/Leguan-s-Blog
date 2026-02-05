<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import PostCard from '@/components/PostCard.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const selectedTag = ref<string | null>(null)
const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

watch(
  () => route.query.tag,
  (tag) => { selectedTag.value = tag as string | null },
  { immediate: true }
)

const filteredPosts = computed(() => {
  if (!selectedTag.value) return []
  return blogStore.getPostsByTag(selectedTag.value)
})

function selectTag(tag: string) {
  if (selectedTag.value === tag) {
    selectedTag.value = null
    router.push('/tags')
  } else {
    selectedTag.value = tag
    router.push({ path: '/tags', query: { tag } })
  }
}

// 彩虹色标签
const tagColors = [
  'from-red-400 to-pink-500', 'from-orange-400 to-red-500', 'from-amber-400 to-orange-500',
  'from-yellow-400 to-amber-500', 'from-lime-400 to-green-500', 'from-green-400 to-emerald-500',
  'from-emerald-400 to-teal-500', 'from-teal-400 to-cyan-500', 'from-cyan-400 to-blue-500',
  'from-blue-400 to-indigo-500', 'from-indigo-400 to-purple-500', 'from-purple-400 to-pink-500'
]

function getTagColor(index: number): string {
  return tagColors[index % tagColors.length]
}

function getTagSize(count: number): string {
  const max = Math.max(...blogStore.allTags.map(t => t.count))
  const ratio = count / max
  if (ratio > 0.7) return 'text-lg px-4 py-2'
  if (ratio > 0.4) return 'text-base px-3 py-1.5'
  return 'text-sm px-3 py-1'
}
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
            <Icon icon="fas:tags" class="w-10 h-10 drop-shadow-lg" />
          </div>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">标签</h1>
        <p class="mt-3 text-white/80 text-lg">共 {{ blogStore.allTags.length }} 个标签</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div v-if="blogStore.isLoading" class="card p-16 text-center">
        <div class="inline-flex flex-col items-center">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#49b1f5]/20 to-[#0abcf9]/20 flex items-center justify-center mb-4">
            <div class="animate-spin rounded-full h-8 w-8 border-4 border-[#49b1f5] border-t-transparent"></div>
          </div>
          <p class="text-gray-500">加载中...</p>
        </div>
      </div>

      <div v-else>
        <!-- Tag Cloud - 彩虹色 -->
        <div 
          class="card p-8 mb-8 tag-cloud"
          :class="{ 'animate-in': isVisible }"
          :style="{ animationDelay: '100ms' }"
        >
          <div class="flex items-center justify-center mb-6">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#49b1f5] to-[#0abcf9] flex items-center justify-center mr-3">
              <Icon icon="fas:cloud" class="w-5 h-5 text-white" />
            </div>
            <h3 class="text-lg font-bold text-gray-800 dark:text-white">标签云</h3>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-3">
            <button
              v-for="(tag, index) in blogStore.allTags"
              :key="tag.name"
              @click="selectTag(tag.name)"
              class="tag-item rounded-full text-white font-medium transition-all duration-300 hover:scale-110 hover:shadow-lg bg-gradient-to-r"
              :class="[
                getTagSize(tag.count),
                getTagColor(index),
                selectedTag === tag.name ? 'ring-2 ring-offset-2 ring-white dark:ring-offset-gray-900 shadow-xl scale-110' : ''
              ]"
              :style="{ animationDelay: `${150 + index * 30}ms` }"
            >
              <Icon icon="fas:hashtag" class="w-3 h-3 inline mr-0.5 opacity-70" />
              {{ tag.name }}
              <span class="text-xs ml-1 opacity-70">({{ tag.count }})</span>
            </button>
          </div>
        </div>

        <!-- Selected Tag Posts -->
        <div v-if="selectedTag">
          <div 
            class="flex items-center justify-between mb-6 selection-header"
            :class="{ 'animate-in': isVisible }"
          >
            <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#49b1f5] to-[#0abcf9] flex items-center justify-center mr-2">
                <Icon icon="fas:hashtag" class="w-4 h-4 text-white" />
              </div>
              {{ selectedTag }}
              <span class="text-base font-normal text-gray-400 ml-2">({{ filteredPosts.length }} 篇)</span>
            </h2>
            <button 
              @click="selectTag(selectedTag!)"
              class="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-red-500 rounded-lg transition-all flex items-center"
            >
              <Icon icon="fas:times" class="w-4 h-4 mr-1" />
              清除筛选
            </button>
          </div>

          <div class="space-y-5">
            <PostCard 
              v-for="(post, index) in filteredPosts"
              :key="post.slug"
              :post="post"
              :layout="index % 2 === 0 ? 'left' : 'right'"
              :index="index"
            />
          </div>
        </div>

        <div 
          v-else 
          class="card p-16 text-center empty-state"
          :class="{ 'animate-in': isVisible }"
          :style="{ animationDelay: '200ms' }"
        >
          <div class="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
            <Icon icon="fas:hand-pointer" class="w-12 h-12 text-gray-300 dark:text-gray-600" />
          </div>
          <p class="text-gray-500 dark:text-gray-400 mb-2">点击上方标签查看相关文章</p>
          <p class="text-sm text-gray-400 dark:text-gray-500">共有 {{ blogStore.allTags.length }} 个标签等你探索</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner-content,
.tag-cloud,
.selection-header,
.empty-state {
  opacity: 0;
  transform: translateY(20px);
}

.banner-content.animate-in,
.tag-cloud.animate-in,
.selection-header.animate-in,
.empty-state.animate-in {
  animation: fadeInUp 0.6s ease-out forwards;
}

.tag-item {
  opacity: 0;
  transform: scale(0.8);
  animation: tagPopIn 0.4s ease-out forwards;
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

@keyframes tagPopIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
