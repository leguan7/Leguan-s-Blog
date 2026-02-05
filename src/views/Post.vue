<script setup lang="ts">
import { computed, watch, ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import { formatDate, estimateReadingTime } from '@/utils/markdown'
import Sidebar from '@/components/Sidebar.vue'
import { COVER_IMAGES, getCoverImage } from '@/utils/assets'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const slug = computed(() => route.params.slug as string)
const post = computed(() => blogStore.getPostBySlug(slug.value))

const readingTime = computed(() => post.value ? estimateReadingTime(post.value.content) : 0)
const formattedDate = computed(() => post.value ? formatDate(post.value.date) : '')
const wordCount = computed(() => post.value ? post.value.content.length : 0)

// Cover image - deterministic selection
const coverImage = computed(() => {
  if (post.value?.cover) return post.value.cover
  if (!post.value) return COVER_IMAGES[0]
  return getCoverImage(post.value.slug)
})

// Related posts
const relatedPosts = computed(() => {
  if (!post.value) return []
  return blogStore.sortedPosts
    .filter(p => 
      p.slug !== post.value!.slug && 
      (p.tags.some(t => post.value!.tags.includes(t)) ||
       p.categories.some(c => post.value!.categories.includes(c)))
    )
    .slice(0, 6)
})

// Previous/Next post
const prevPost = computed(() => {
  if (!post.value) return null
  const index = blogStore.sortedPosts.findIndex(p => p.slug === post.value!.slug)
  return index < blogStore.sortedPosts.length - 1 ? blogStore.sortedPosts[index + 1] : null
})

const nextPost = computed(() => {
  if (!post.value) return null
  const index = blogStore.sortedPosts.findIndex(p => p.slug === post.value!.slug)
  return index > 0 ? blogStore.sortedPosts[index - 1] : null
})

// TOC
const toc = ref<Array<{ id: string, text: string, level: number }>>([])
const activeTocId = ref('')

function generateToc() {
  if (!post.value) return
  
  const container = document.createElement('div')
  container.innerHTML = post.value.html
  const headings = container.querySelectorAll('h1, h2, h3')
  
  toc.value = Array.from(headings).map((heading, index) => {
    const level = parseInt(heading.tagName[1])
    const text = heading.textContent || ''
    const id = `heading-${index}`
    return { id, text, level }
  })
}

// Update article heading IDs
onMounted(() => {
  nextTick(() => {
    const articleContent = document.querySelector('.article-content')
    if (articleContent) {
      const headings = articleContent.querySelectorAll('h1, h2, h3')
      headings.forEach((heading, index) => {
        heading.id = `heading-${index}`
      })
    }
  })
})

watch(post, () => {
  nextTick(() => {
    generateToc()
    // Add IDs to article headings
    const articleContent = document.querySelector('.article-content')
    if (articleContent) {
      const headings = articleContent.querySelectorAll('h1, h2, h3')
      headings.forEach((heading, index) => {
        heading.id = `heading-${index}`
      })
    }
  })
}, { immediate: true })

// 404 handling
watch(
  () => [blogStore.isLoading, post.value],
  ([loading, p]) => {
    if (!loading && !p && blogStore.posts.length > 0) {
      router.push('/404')
    }
  }
)

// Reward feature
const showReward = ref(false)
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="blogStore.isLoading" class="min-h-screen flex items-center justify-center">
      <Icon icon="lucide:loader-2" class="w-12 h-12 animate-spin text-[#7CB342]" />
    </div>

    <!-- Post Content -->
    <article v-else-if="post">
      <!-- Banner -->
      <header class="relative h-[55vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <!-- Semi-transparent overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20"></div>
        
        <!-- Title Info -->
        <div class="relative text-center text-white px-4 max-w-4xl mx-auto z-10">
          <!-- Categories -->
          <div class="flex justify-center gap-2 mb-5 flex-wrap">
            <router-link
              v-for="category in post.categories"
              :key="category"
              :to="{ path: '/categories', query: { category } }"
              class="px-4 py-1.5 text-sm bg-[#7CB342]/80 rounded-full backdrop-blur-sm hover:bg-[#D4A04D] transition-all duration-300 shadow-lg"
            >
              <Icon icon="lucide:folder" class="w-3.5 h-3.5 inline mr-1.5" />
              {{ category }}
            </router-link>
          </div>

          <!-- Title -->
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-2xl">
            {{ post.title }}
          </h1>

          <!-- Meta Info -->
          <div class="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 mt-6 text-white/90 text-sm">
            <span class="flex items-center space-x-1.5">
              <Icon icon="lucide:calendar" class="w-4 h-4 text-[#7CB342]" />
              <span>Published {{ formattedDate }}</span>
            </span>
            <span class="hidden sm:inline text-white/50">|</span>
            <span class="flex items-center space-x-1.5">
              <Icon icon="lucide:clock" class="w-4 h-4 text-[#7CB342]" />
              <span>{{ readingTime }} min read</span>
            </span>
            <span class="hidden sm:inline text-white/50">|</span>
            <span class="flex items-center space-x-1.5">
              <Icon icon="lucide:book-open" class="w-4 h-4 text-[#7CB342]" />
              <span>~{{ wordCount }} words</span>
            </span>
          </div>
        </div>

        <!-- Wave decoration -->
        <div class="wave-divider">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
          </svg>
        </div>
      </header>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="lg:flex lg:space-x-8">
          <!-- Article Content -->
          <div class="lg:w-2/3">
            <div class="card p-6 md:p-8">
              <!-- Article content -->
              <div 
                class="article-content"
                v-html="post.html"
              ></div>

              <!-- Article tags -->
              <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div class="flex flex-wrap gap-2">
                  <router-link
                    v-for="tag in post.tags"
                    :key="tag"
                    :to="{ path: '/tags', query: { tag } }"
                    class="tag"
                  >
                    <Icon icon="lucide:hash" class="w-3 h-3 inline" />{{ tag }}
                  </router-link>
                </div>
              </div>

              <!-- Reward button -->
              <div class="mt-8 text-center">
                <button 
                  @click="showReward = !showReward"
                  class="inline-flex items-center px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Icon icon="lucide:heart-handshake" class="w-5 h-5 mr-2" />
                  Support Me
                </button>
                <transition name="fade">
                  <div v-if="showReward" class="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 inline-block">
                    <p class="text-sm text-gray-500 mb-3">Thank you for your support, I will keep working hard!</p>
                    <div class="flex justify-center gap-4">
                      <div class="text-center">
                        <div class="w-28 h-28 bg-white rounded-lg p-1 shadow-md">
                          <div class="w-full h-full bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-gray-400">
                            <Icon icon="lucide:qr-code" class="w-8 h-8" />
                          </div>
                        </div>
                        <span class="text-xs text-gray-500 mt-1 block">WeChat</span>
                      </div>
                      <div class="text-center">
                        <div class="w-28 h-28 bg-white rounded-lg p-1 shadow-md">
                          <div class="w-full h-full bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-gray-400">
                            <Icon icon="lucide:qr-code" class="w-8 h-8" />
                          </div>
                        </div>
                        <span class="text-xs text-gray-500 mt-1 block">Alipay</span>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Copyright notice -->
              <div class="mt-8 p-5 rounded-xl bg-gradient-to-r from-[#7CB342]/5 to-[#8BC34A]/5 border border-[#7CB342]/20">
                <h4 class="font-bold text-gray-800 dark:text-white mb-3 flex items-center text-sm">
                  <Icon icon="lucide:copyright" class="w-4 h-4 mr-2 text-[#7CB342]" />
                  Copyright Notice
                </h4>
                <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p class="flex items-start">
                    <Icon icon="lucide:user" class="w-3.5 h-3.5 mr-2 mt-0.5 text-gray-500 shrink-0" />
                    <span><strong class="text-gray-700 dark:text-gray-300">Author:</strong> Leguan</span>
                  </p>
                  <p class="flex items-start">
                    <Icon icon="lucide:link" class="w-3.5 h-3.5 mr-2 mt-0.5 text-gray-500 shrink-0" />
                    <span class="break-all"><strong class="text-gray-700 dark:text-gray-300">Link:</strong> <span class="text-[#7CB342]">{{ `${window?.location?.origin || ''}/post/${post.slug}` }}</span></span>
                  </p>
                  <p class="flex items-start">
                    <Icon icon="lucide:scale" class="w-3.5 h-3.5 mr-2 mt-0.5 text-gray-500 shrink-0" />
                    <span><strong class="text-gray-700 dark:text-gray-300">License:</strong> Unless otherwise stated, all posts are licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" class="text-[#7CB342] hover:text-[#D4A04D]">CC BY-NC-SA 4.0</a>. Please cite the source!</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Post Navigation -->
            <div class="grid md:grid-cols-2 gap-4 mt-6">
              <router-link 
                v-if="prevPost"
                :to="`/post/${prevPost.slug}`"
                class="card overflow-hidden group relative"
              >
                <div class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                     :style="{ backgroundImage: `url(${prevPost.cover || getCoverImage(prevPost.slug)})` }">
                </div>
                <div class="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
                <div class="relative p-5 flex items-center space-x-3 text-white min-h-[100px]">
                  <Icon icon="lucide:chevron-left" class="w-6 h-6 shrink-0 group-hover:-translate-x-1 transition-transform" />
                  <div class="min-w-0">
                    <div class="text-xs text-white/70 mb-1.5 flex items-center">
                      <Icon icon="lucide:arrow-left" class="w-3 h-3 mr-1" />
                      Previous
                    </div>
                    <h4 class="font-medium line-clamp-2 group-hover:text-[#7CB342] transition-colors">
                      {{ prevPost.title }}
                    </h4>
                  </div>
                </div>
              </router-link>
              <div v-else></div>

              <router-link 
                v-if="nextPost"
                :to="`/post/${nextPost.slug}`"
                class="card overflow-hidden group relative"
              >
                <div class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                     :style="{ backgroundImage: `url(${nextPost.cover || getCoverImage(nextPost.slug)})` }">
                </div>
                <div class="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
                <div class="relative p-5 flex items-center justify-end space-x-3 text-white text-right min-h-[100px]">
                  <div class="min-w-0">
                    <div class="text-xs text-white/70 mb-1.5 flex items-center justify-end">
                      Next
                      <Icon icon="lucide:arrow-right" class="w-3 h-3 ml-1" />
                    </div>
                    <h4 class="font-medium line-clamp-2 group-hover:text-[#7CB342] transition-colors">
                      {{ nextPost.title }}
                    </h4>
                  </div>
                  <Icon icon="lucide:chevron-right" class="w-6 h-6 shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </router-link>
            </div>

            <!-- Related Posts -->
            <div v-if="relatedPosts.length > 0" class="card p-6 mt-6">
              <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-5 flex items-center">
                <Icon icon="lucide:thumbs-up" class="w-5 h-5 mr-2 text-[#7CB342]" />
                Related Posts
              </h3>
              <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <router-link 
                  v-for="related in relatedPosts"
                  :key="related.slug"
                  :to="`/post/${related.slug}`"
                  class="group block"
                >
                  <div class="aspect-video rounded-xl overflow-hidden mb-3 relative shadow-md">
                    <img 
                      :src="related.cover || getCoverImage(related.slug)"
                      :alt="related.title"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="absolute bottom-2 left-2 right-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span class="bg-[#7CB342]/80 px-2 py-0.5 rounded">
                        {{ related.categories[0] || 'Uncategorized' }}
                      </span>
                    </div>
                  </div>
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#7CB342] transition-colors line-clamp-2 leading-relaxed">
                    {{ related.title }}
                  </h4>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:w-1/3 mt-8 lg:mt-0">
            <!-- TOC -->
            <div v-if="toc.length > 0" class="card p-5 mb-5 sticky top-20">
              <div class="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div class="w-8 h-8 rounded-full bg-gradient-to-r from-[#7CB342] to-[#8BC34A] flex items-center justify-center">
                  <Icon icon="lucide:list" class="w-4 h-4 text-white" />
                </div>
                <h4 class="font-bold text-gray-800 dark:text-white">Contents</h4>
                <span class="ml-auto text-xs text-gray-400">{{ toc.length }} sections</span>
              </div>
              <nav class="space-y-1 max-h-[55vh] overflow-y-auto toc-scrollbar pr-1">
                <a 
                  v-for="item in toc"
                  :key="item.id"
                  :href="`#${item.id}`"
                  class="toc-item block py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-[#7CB342] transition-all duration-200 border-l-2 border-transparent hover:border-[#7CB342] hover:pl-1"
                  :class="[
                    item.level === 1 ? 'pl-3 font-medium' : '',
                    item.level === 2 ? 'pl-6' : '',
                    item.level === 3 ? 'pl-9 text-xs' : '',
                    activeTocId === item.id ? 'text-[#7CB342] border-[#7CB342] bg-[#7CB342]/5' : ''
                  ]"
                >
                  <span class="flex items-center">
                    <span v-if="item.level === 1" class="w-1.5 h-1.5 rounded-full bg-[#7CB342] mr-2"></span>
                    <span v-else-if="item.level === 2" class="w-1 h-1 rounded-full bg-gray-400 mr-2"></span>
                    <span class="line-clamp-1">{{ item.text }}</span>
                  </span>
                </a>
              </nav>
            </div>

            <Sidebar />
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
/* Code block styles */
:deep(.hljs) {
  background: #1e1e1e;
  color: #abb2bf;
  padding: 1em;
  border-radius: 0.5rem;
  overflow-x: auto;
}

:deep(pre) {
  margin: 1rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
}

/* TOC scrollbar styles */
.toc-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.toc-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.toc-scrollbar::-webkit-scrollbar-thumb {
  background: #7CB342;
  border-radius: 2px;
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
