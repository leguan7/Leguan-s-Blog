<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import PostCardCompact from '@/components/PostCardCompact.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const selectedTag = ref<string | null>(null)
const contentVisible = ref(false)

onMounted(() => {
  setTimeout(() => { contentVisible.value = true }, 200)
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

function getTagSize(count: number): string {
  const max = Math.max(...blogStore.allTags.map(t => t.count), 1)
  const ratio = count / max
  if (ratio > 0.7) return 'text-base px-4 py-2'
  if (ratio > 0.4) return 'text-sm px-3 py-1.5'
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
        :class="{ 'animate-in': contentVisible }"
      >
        <div class="w-14 h-14 mx-auto mb-3 rounded-xl bg-[#7CB342]/90 backdrop-blur flex items-center justify-center shadow-lg">
          <Icon icon="lucide:tags" class="w-7 h-7 drop-shadow" />
        </div>
        <h1 class="text-3xl md:text-4xl font-bold drop-shadow-lg">Tags</h1>
        <p class="mt-2 text-white/80 text-sm">{{ blogStore.allTags.length }} tags in total</p>
      </div>
      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div v-if="blogStore.isLoading" class="card p-16 text-center">
        <div class="inline-flex flex-col items-center">
          <div class="w-12 h-12 rounded-xl bg-[#7CB342]/20 flex items-center justify-center mb-3">
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-[#7CB342] border-t-transparent"></div>
          </div>
          <p class="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>

      <template v-else>
        <!-- Tag cloud - glass pills -->
        <div
          class="card p-6 mb-8 content-block border border-white/20 dark:border-gray-600/30"
          :class="{ 'animate-in': contentVisible }"
        >
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-[#7CB342]/20 flex items-center justify-center">
              <Icon icon="lucide:cloud" class="w-4 h-4 text-[#7CB342]" />
            </div>
            <h3 class="text-sm font-bold text-gray-800 dark:text-white">Tag Cloud</h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in blogStore.allTags"
              :key="tag.name"
              @click="selectTag(tag.name)"
              class="rounded-full font-medium transition-all duration-300 border"
              :class="[
                getTagSize(tag.count),
                selectedTag === tag.name
                  ? 'bg-[#7CB342] text-white border-[#7CB342] shadow-md'
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-white/30 dark:border-gray-600/50 hover:bg-[#7CB342] hover:text-white hover:border-[#7CB342]'
              ]"
            >
              <Icon icon="lucide:hash" class="w-3 h-3 inline mr-0.5" />
              {{ tag.name }}
              <span class="opacity-80 ml-0.5">({{ tag.count }})</span>
            </button>
          </div>
        </div>

        <!-- Selected tag posts -->
        <div v-if="selectedTag" class="content-block" :class="{ 'animate-in': contentVisible }">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-gray-800 dark:text-white flex items-center">
              <span class="w-7 h-7 rounded-lg bg-[#7CB342]/20 flex items-center justify-center mr-2">
                <Icon icon="lucide:hash" class="w-3.5 h-3.5 text-[#7CB342]" />
              </span>
              {{ selectedTag }}
              <span class="text-sm font-normal text-gray-400 ml-2">({{ filteredPosts.length }} posts)</span>
            </h2>
            <button
              @click="selectTag(selectedTag)"
              class="px-3 py-1.5 text-sm text-gray-500 hover:text-white hover:bg-red-500 rounded-lg transition-all flex items-center"
            >
              <Icon icon="lucide:x" class="w-4 h-4 mr-1" />
              Clear
            </button>
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <PostCardCompact
              v-for="(post, index) in filteredPosts"
              :key="post.slug"
              :post="post"
              :index="index"
            />
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-else
          class="card p-12 text-center content-block text-gray-500 dark:text-gray-400"
          :class="{ 'animate-in': contentVisible }"
        >
          <Icon icon="lucide:pointer" class="w-10 h-10 mx-auto mb-3 opacity-60" />
          <p class="text-sm">Click a tag to view related posts</p>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.banner-content,
.content-block {
  opacity: 0;
  transform: translateY(20px);
}

.banner-content.animate-in,
.content-block.animate-in {
  animation: fadeSlideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes fadeSlideUp {
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
