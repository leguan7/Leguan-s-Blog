<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import PostCard from '@/components/PostCard.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const selectedTag = ref<string | null>(null)

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
      
      <div class="relative text-center text-white z-10">
        <Icon icon="fas:tags" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
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
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#49b1f5] border-t-transparent"></div>
      </div>

      <div v-else>
        <!-- Tag Cloud - 彩虹色 -->
        <div class="card p-8 mb-8">
          <div class="flex flex-wrap items-center justify-center gap-3">
            <button
              v-for="(tag, index) in blogStore.allTags"
              :key="tag.name"
              @click="selectTag(tag.name)"
              class="rounded-full text-white font-medium transition-all duration-300 hover:scale-110 hover:shadow-lg bg-gradient-to-r"
              :class="[
                getTagSize(tag.count),
                getTagColor(index),
                selectedTag === tag.name ? 'ring-2 ring-offset-2 ring-white shadow-xl scale-110' : ''
              ]"
            >
              <Icon icon="fas:hashtag" class="w-3 h-3 inline mr-0.5 opacity-70" />
              {{ tag.name }}
              <span class="text-xs ml-1 opacity-70">({{ tag.count }})</span>
            </button>
          </div>
        </div>

        <!-- Selected Tag Posts -->
        <div v-if="selectedTag">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center">
              <Icon icon="fas:hashtag" class="w-5 h-5 mr-1 text-[#49b1f5]" />
              {{ selectedTag }}
              <span class="text-base font-normal text-gray-400 ml-2">({{ filteredPosts.length }} 篇)</span>
            </h2>
            <button 
              @click="selectTag(selectedTag!)"
              class="text-sm text-gray-400 hover:text-[#ff7242] transition-colors flex items-center"
            >
              <Icon icon="fas:times" class="w-4 h-4 mr-1" />
              清除
            </button>
          </div>

          <div class="space-y-5">
            <PostCard 
              v-for="(post, index) in filteredPosts"
              :key="post.slug"
              :post="post"
              :layout="index % 2 === 0 ? 'left' : 'right'"
            />
          </div>
        </div>

        <div v-else class="card p-16 text-center">
          <Icon icon="fas:hand-pointer" class="w-20 h-20 mx-auto text-gray-200 dark:text-gray-700 mb-4" />
          <p class="text-gray-400">点击上方标签查看相关文章</p>
        </div>
      </div>
    </div>
  </div>
</template>
