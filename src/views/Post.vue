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

// 封面图 - 确定性选择
const coverImage = computed(() => {
  if (post.value?.cover) return post.value.cover
  if (!post.value) return COVER_IMAGES[0]
  return getCoverImage(post.value.slug)
})

// 相关文章
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

// 上一篇/下一篇
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

// 更新文章中的标题ID
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
    // 为文章中的标题添加ID
    const articleContent = document.querySelector('.article-content')
    if (articleContent) {
      const headings = articleContent.querySelectorAll('h1, h2, h3')
      headings.forEach((heading, index) => {
        heading.id = `heading-${index}`
      })
    }
  })
}, { immediate: true })

// 404 处理
watch(
  () => [blogStore.isLoading, post.value],
  ([loading, p]) => {
    if (!loading && !p && blogStore.posts.length > 0) {
      router.push('/404')
    }
  }
)

// 打赏功能
const showReward = ref(false)
</script>

<template>
  <div>
    <!-- Loading -->
    <div v-if="blogStore.isLoading" class="min-h-screen flex items-center justify-center">
      <Icon icon="lucide:loader-2" class="w-12 h-12 animate-spin text-[#49b1f5]" />
    </div>

    <!-- Post Content -->
    <article v-else-if="post">
      <!-- Banner - Kyle's Blog 风格 -->
      <header class="relative h-[55vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <!-- 半透明遮罩 -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20"></div>
        
        <!-- 标题信息 -->
        <div class="relative text-center text-white px-4 max-w-4xl mx-auto z-10">
          <!-- 分类 -->
          <div class="flex justify-center gap-2 mb-5 flex-wrap">
            <router-link
              v-for="category in post.categories"
              :key="category"
              :to="{ path: '/categories', query: { category } }"
              class="px-4 py-1.5 text-sm bg-[#49b1f5]/80 rounded-full backdrop-blur-sm hover:bg-[#ff7242] transition-all duration-300 shadow-lg"
            >
              <Icon icon="lucide:folder" class="w-3.5 h-3.5 inline mr-1.5" />
              {{ category }}
            </router-link>
          </div>

          <!-- 标题 -->
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-2xl">
            {{ post.title }}
          </h1>

          <!-- 元信息 -->
          <div class="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 mt-6 text-white/90 text-sm">
            <span class="flex items-center space-x-1.5">
              <Icon icon="lucide:calendar" class="w-4 h-4 text-[#49b1f5]" />
              <span>发布于 {{ formattedDate }}</span>
            </span>
            <span class="hidden sm:inline text-white/50">|</span>
            <span class="flex items-center space-x-1.5">
              <Icon icon="lucide:clock" class="w-4 h-4 text-[#49b1f5]" />
              <span>{{ readingTime }} 分钟阅读</span>
            </span>
            <span class="hidden sm:inline text-white/50">|</span>
            <span class="flex items-center space-x-1.5">
              <Icon icon="lucide:book-open" class="w-4 h-4 text-[#49b1f5]" />
              <span>约 {{ wordCount }} 字</span>
            </span>
          </div>
        </div>

        <!-- 波浪装饰 -->
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
              <!-- 文章内容 -->
              <div 
                class="article-content"
                v-html="post.html"
              ></div>

              <!-- 文章标签 -->
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

              <!-- 打赏按钮 -->
              <div class="mt-8 text-center">
                <button 
                  @click="showReward = !showReward"
                  class="inline-flex items-center px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Icon icon="lucide:heart-handshake" class="w-5 h-5 mr-2" />
                  赞赏支持
                </button>
                <transition name="fade">
                  <div v-if="showReward" class="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 inline-block">
                    <p class="text-sm text-gray-500 mb-3">感谢你的支持，我会继续努力！</p>
                    <div class="flex justify-center gap-4">
                      <div class="text-center">
                        <div class="w-28 h-28 bg-white rounded-lg p-1 shadow-md">
                          <div class="w-full h-full bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-gray-400">
                            <Icon icon="lucide:qr-code" class="w-8 h-8" />
                          </div>
                        </div>
                        <span class="text-xs text-gray-500 mt-1 block">微信</span>
                      </div>
                      <div class="text-center">
                        <div class="w-28 h-28 bg-white rounded-lg p-1 shadow-md">
                          <div class="w-full h-full bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-gray-400">
                            <Icon icon="lucide:qr-code" class="w-8 h-8" />
                          </div>
                        </div>
                        <span class="text-xs text-gray-500 mt-1 block">支付宝</span>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>

              <!-- 版权声明 -->
              <div class="mt-8 p-5 rounded-xl bg-gradient-to-r from-[#49b1f5]/5 to-[#0abcf9]/5 border border-[#49b1f5]/20">
                <h4 class="font-bold text-gray-800 dark:text-white mb-3 flex items-center text-sm">
                  <Icon icon="lucide:copyright" class="w-4 h-4 mr-2 text-[#49b1f5]" />
                  版权声明
                </h4>
                <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p class="flex items-start">
                    <Icon icon="lucide:user" class="w-3.5 h-3.5 mr-2 mt-0.5 text-gray-500 shrink-0" />
                    <span><strong class="text-gray-700 dark:text-gray-300">本文作者：</strong>Leguan</span>
                  </p>
                  <p class="flex items-start">
                    <Icon icon="lucide:link" class="w-3.5 h-3.5 mr-2 mt-0.5 text-gray-500 shrink-0" />
                    <span class="break-all"><strong class="text-gray-700 dark:text-gray-300">本文链接：</strong><span class="text-[#49b1f5]">{{ `${window?.location?.origin || ''}/post/${post.slug}` }}</span></span>
                  </p>
                  <p class="flex items-start">
                    <Icon icon="lucide:scale" class="w-3.5 h-3.5 mr-2 mt-0.5 text-gray-500 shrink-0" />
                    <span><strong class="text-gray-700 dark:text-gray-300">版权声明：</strong>本博客所有文章除特别声明外，均采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" class="text-[#49b1f5] hover:text-[#ff7242]">CC BY-NC-SA 4.0</a> 许可协议。转载请注明来源！</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- 文章导航 - Kyle's Blog 风格 -->
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
                      上一篇
                    </div>
                    <h4 class="font-medium line-clamp-2 group-hover:text-[#49b1f5] transition-colors">
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
                      下一篇
                      <Icon icon="lucide:arrow-right" class="w-3 h-3 ml-1" />
                    </div>
                    <h4 class="font-medium line-clamp-2 group-hover:text-[#49b1f5] transition-colors">
                      {{ nextPost.title }}
                    </h4>
                  </div>
                  <Icon icon="lucide:chevron-right" class="w-6 h-6 shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </router-link>
            </div>

            <!-- 相关推荐 - Kyle's Blog 风格 -->
            <div v-if="relatedPosts.length > 0" class="card p-6 mt-6">
              <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-5 flex items-center">
                <Icon icon="lucide:thumbs-up" class="w-5 h-5 mr-2 text-[#49b1f5]" />
                相关推荐
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
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="absolute bottom-2 left-2 right-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span class="bg-[#49b1f5]/80 px-2 py-0.5 rounded">
                        {{ related.categories[0] || '未分类' }}
                      </span>
                    </div>
                  </div>
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#49b1f5] transition-colors line-clamp-2 leading-relaxed">
                    {{ related.title }}
                  </h4>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:w-1/3 mt-8 lg:mt-0">
            <!-- TOC 目录 - Kyle's Blog 风格 -->
            <div v-if="toc.length > 0" class="card p-5 mb-5 sticky top-20">
              <div class="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div class="w-8 h-8 rounded-full bg-gradient-to-r from-[#49b1f5] to-[#0abcf9] flex items-center justify-center">
                  <Icon icon="lucide:list" class="w-4 h-4 text-white" />
                </div>
                <h4 class="font-bold text-gray-800 dark:text-white">目录</h4>
                <span class="ml-auto text-xs text-gray-400">{{ toc.length }} 章节</span>
              </div>
              <nav class="space-y-1 max-h-[55vh] overflow-y-auto toc-scrollbar pr-1">
                <a 
                  v-for="item in toc"
                  :key="item.id"
                  :href="`#${item.id}`"
                  class="toc-item block py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-[#49b1f5] transition-all duration-200 border-l-2 border-transparent hover:border-[#49b1f5] hover:pl-1"
                  :class="[
                    item.level === 1 ? 'pl-3 font-medium' : '',
                    item.level === 2 ? 'pl-6' : '',
                    item.level === 3 ? 'pl-9 text-xs' : '',
                    activeTocId === item.id ? 'text-[#49b1f5] border-[#49b1f5] bg-[#49b1f5]/5' : ''
                  ]"
                >
                  <span class="flex items-center">
                    <span v-if="item.level === 1" class="w-1.5 h-1.5 rounded-full bg-[#49b1f5] mr-2"></span>
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
/* 代码块样式 */
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

/* TOC 滚动条样式 */
.toc-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.toc-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.toc-scrollbar::-webkit-scrollbar-thumb {
  background: #49b1f5;
  border-radius: 2px;
}

/* 过渡动画 */
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
