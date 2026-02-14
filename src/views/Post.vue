<script setup lang="ts">
import { computed, watch, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import { formatDate } from '@/utils/markdown'
import { COVER_IMAGES, getCoverImage, getAssetUrl } from '@/utils/assets'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const slug = computed(() => route.params.slug as string)
const post = computed(() => blogStore.getPostBySlug(slug.value))

const formattedDate = computed(() => post.value ? formatDate(post.value.date) : '')
const wordCount = computed(() => post.value ? post.value.content.length : 0)
const viewCount = computed(() => post.value ? blogStore.getViewCount(post.value.slug) : 0)

// Busuanzi page view counter
let busuanziTimer: ReturnType<typeof setInterval> | null = null

function loadBusuanzi() {
  // Remove any existing busuanzi script (SPA needs reload on each page)
  const old = document.querySelector('script[src*="busuanzi"]')
  if (old) old.remove()

  // Reset the global busuanzi state so it re-fetches
  ;(window as any).busuanzi = undefined

  const script = document.createElement('script')
  script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
  script.async = true
  document.head.appendChild(script)

  // Poll for the result (busuanzi writes into a hidden span)
  let elapsed = 0
  busuanziTimer = setInterval(() => {
    elapsed += 200
    const el = document.getElementById('busuanzi_value_page_pv')
    if (el && el.textContent && el.textContent !== '') {
      const count = parseInt(el.textContent)
      if (!isNaN(count) && count > 0 && slug.value) {
        blogStore.setViewCount(slug.value, count)
      }
      if (busuanziTimer) clearInterval(busuanziTimer)
    }
    // Stop polling after 5 seconds
    if (elapsed >= 5000 && busuanziTimer) {
      clearInterval(busuanziTimer)
    }
  }, 200)
}

function cleanupBusuanzi() {
  if (busuanziTimer) {
    clearInterval(busuanziTimer)
    busuanziTimer = null
  }
}

// Cover image - deterministic selection
const coverImage = computed(() => {
  if (post.value?.cover) return getAssetUrl(post.value.cover)
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

function scrollToHeading(id: string) {
  const el = document.getElementById(id)
  if (el) {
    // Offset for fixed navbar (~80px)
    const top = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: 'smooth' })
    activeTocId.value = id
  }
}

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
// Track active heading via IntersectionObserver
let tocObserver: IntersectionObserver | null = null

function setupTocObserver() {
  // Clean up previous observer
  tocObserver?.disconnect()

  const headingEls = toc.value
    .map(t => document.getElementById(t.id))
    .filter(Boolean) as HTMLElement[]

  if (headingEls.length === 0) return

  tocObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeTocId.value = entry.target.id
        }
      }
    },
    {
      rootMargin: '-80px 0px -65% 0px',
      threshold: 0,
    }
  )

  headingEls.forEach(el => tocObserver!.observe(el))
}

onMounted(() => {
  nextTick(() => {
    const articleContent = document.querySelector('.article-content')
    if (articleContent) {
      const headings = articleContent.querySelectorAll('h1, h2, h3')
      headings.forEach((heading, index) => {
        heading.id = `heading-${index}`
      })
    }
    setupTocObserver()
  })
})

onUnmounted(() => {
  tocObserver?.disconnect()
  cleanupBusuanzi()
})

watch(post, (newPost) => {
  // Only load busuanzi when post is actually available
  cleanupBusuanzi()
  if (newPost) {
    loadBusuanzi()
  }

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
    setupTocObserver()
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

// Reward feature — faithful port of coin-flip-donate-button
const rewardStage = ref(0) // 0=idle, 1=flipping, 2=landed, 3=cat
const isRewardAnimating = ref(false)
const coinRef = ref<HTMLElement | null>(null)
const tipBtnRef = ref<HTMLElement | null>(null)
let coinAnimFrame: number | null = null

// Button state classes
const tipClicked = ref(false)
const tipShrinkLanding = ref(false)
const tipCoinLanded = ref(false)

function triggerReward() {
  if (isRewardAnimating.value) return

  if (rewardStage.value === 3) {
    rewardStage.value = 0
    return
  }

  isRewardAnimating.value = true
  rewardStage.value = 1
  tipClicked.value = true

  // Small delay before coin flip (button tilt animation)
  setTimeout(() => {
    nextTick(() => startCoinFlip())
  }, 50)
}

function startCoinFlip() {
  const el = coinRef.value
  if (!el) return

  const duration = 1500 // fixed 1.5s regardless of frame rate
  const startTime = performance.now()
  // Randomize flip speed & side rotation
  const sideRotationCount = Math.floor(Math.random() * 5) * 90
  const maxFlipAngle = (Math.floor(Math.random() * 4) + 3) * Math.PI
  let shrinkTriggered = false

  const animate = (now: number) => {
    const elapsed = now - startTime
    const pct = Math.min(elapsed / duration, 1)

    // Flip angle (eased — fast start, slow end)
    const angle = -maxFlipAngle * Math.pow(pct - 1, 2) + maxFlipAngle

    // Parabolic arc: peaks at pct=0.5
    el.style.setProperty('--coin-y-multiplier', `${-11 * Math.pow(pct * 2 - 1, 4) + 11}`)
    el.style.setProperty('--coin-x-multiplier', `${pct}`)
    el.style.setProperty('--coin-scale-multiplier', `${pct * 0.6}`)
    el.style.setProperty('--coin-rotation-multiplier', `${pct * sideRotationCount}`)

    // 3D face simulation
    el.style.setProperty('--front-scale-multiplier', `${Math.max(Math.cos(angle), 0)}`)
    el.style.setProperty('--front-y-multiplier', `${Math.sin(angle)}`)
    el.style.setProperty('--middle-scale-multiplier', `${Math.abs(Math.cos(angle))}`)
    el.style.setProperty('--middle-y-multiplier', `${Math.cos((angle + Math.PI / 2) % Math.PI)}`)
    el.style.setProperty('--back-scale-multiplier', `${Math.max(Math.cos(angle - Math.PI), 0)}`)
    el.style.setProperty('--back-y-multiplier', `${Math.sin(angle - Math.PI)}`)

    // Shine
    el.style.setProperty('--shine-opacity-multiplier', `${4 * Math.sin((angle + Math.PI / 2) % Math.PI) - 3.2}`)
    el.style.setProperty('--shine-bg-multiplier', `${-40 * (Math.cos((angle + Math.PI / 2) % Math.PI) - 0.5)}%`)

    if (pct < 1) {
      // Shrink the slot just before landing (~last 100ms)
      if (!shrinkTriggered && pct > 0.93) {
        shrinkTriggered = true
        tipShrinkLanding.value = true
      }
      coinAnimFrame = requestAnimationFrame(animate)
    } else {
      // Coin landed
      tipCoinLanded.value = true
      el.style.setProperty('opacity', '0')

      // Show cat gif after "Thank you!" displays
      setTimeout(() => {
        // Reset button states
        tipClicked.value = false
        tipShrinkLanding.value = false
        tipCoinLanded.value = false
        // Reset coin CSS vars
        setTimeout(() => {
          resetCoin()
          rewardStage.value = 3
          isRewardAnimating.value = false
        }, 300)
      }, 1500)
    }
  }

  coinAnimFrame = requestAnimationFrame(animate)
}

function resetCoin() {
  const el = coinRef.value
  if (!el) return
  el.style.setProperty('--coin-x-multiplier', '0')
  el.style.setProperty('--coin-scale-multiplier', '0')
  el.style.setProperty('--coin-rotation-multiplier', '0')
  el.style.setProperty('--shine-opacity-multiplier', '0.4')
  el.style.setProperty('--shine-bg-multiplier', '50%')
  el.style.setProperty('opacity', '1')
}

onUnmounted(() => {
  if (coinAnimFrame) cancelAnimationFrame(coinAnimFrame)
})
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
      <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
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
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-2xl" style="line-height: 1.6em; padding-bottom: 0.15em;">
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
              <Icon icon="lucide:eye" class="w-4 h-4 text-[#7CB342]" />
              <span><span class="inline-block min-w-[1.5em] text-center">{{ viewCount || '--' }}</span> views</span>
            </span>
            <span class="hidden sm:inline text-white/50">|</span>
            <span class="flex items-center space-x-1.5">
              <Icon icon="lucide:book-open" class="w-4 h-4 text-[#7CB342]" />
              <span>~{{ wordCount }} words</span>
            </span>
          </div>
          <!-- Hidden span for busuanzi to write page view count into -->
          <span id="busuanzi_value_page_pv" class="hidden"></span>
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

              <!-- Reward button with coin-flip animation -->
              <div class="mt-8 text-center">
                <button
                  ref="tipBtnRef"
                  @click="triggerReward"
                  class="tip-button"
                  :class="{
                    'clicked': tipClicked,
                    'shrink-landing': tipShrinkLanding,
                    'coin-landed': tipCoinLanded
                  }"
                >
                  <span class="tip-button__text">Support Me</span>
                  <div class="coin-wrapper">
                    <div ref="coinRef" class="coin">
                      <div class="coin__middle"></div>
                      <div class="coin__back"></div>
                      <div class="coin__front"></div>
                    </div>
                  </div>
                </button>

                <!-- Cat gif result -->
                <transition name="reward-cat">
                  <div v-if="rewardStage === 3" class="mt-6">
                    <img
                      src="/img/aixinmao.gif"
                      alt="sending love"
                      class="w-28 h-28 mx-auto drop-shadow-lg"
                    />
                    <p class="text-sm text-pink-500 mt-3 font-medium">Thank you for your support!</p>
                    <button
                      @click="triggerReward"
                      class="mt-2 text-xs text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      Click to dismiss
                    </button>
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
              <nav class="space-y-1">
                <a 
                  v-for="item in toc"
                  :key="item.id"
                  href="javascript:void(0)"
                  @click.prevent="scrollToHeading(item.id)"
                  class="toc-item block py-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400 hover:text-[#7CB342] transition-all duration-200 border-l-2 border-transparent hover:border-[#7CB342] hover:pl-1"
                  :class="[
                    item.level === 1 ? 'pl-3 font-medium' : '',
                    item.level === 2 ? 'pl-6' : '',
                    item.level === 3 ? 'pl-9 text-xs' : '',
                    activeTocId === item.id ? '!text-[#7CB342] !font-bold border-[#7CB342] bg-[#7CB342]/10' : ''
                  ]"
                >
                  <span class="flex items-center">
                    <span v-if="item.level === 1" class="w-1.5 h-1.5 rounded-full bg-[#7CB342] mr-2"></span>
                    <span v-else-if="item.level === 2" class="w-1 h-1 rounded-full bg-gray-400 mr-2"></span>
                    <span class="truncate">{{ item.text }}</span>
                  </span>
                </a>
              </nav>
            </div>

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

/* ══════════════════════════════════════
   Coin Flip Donate Button — faithful port
   ══════════════════════════════════════ */

/* ── Tip Button ── */
.tip-button {
  background: none;
  border: 0;
  border-radius: 0.5rem 0.5rem 0 0;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  height: 2.6rem;
  margin-bottom: -4rem;
  outline: 0;
  position: relative;
  top: 0;
  transform-origin: 0% 100%;
  transition: transform 50ms ease-in-out;
  width: 10rem;
  -webkit-tap-highlight-color: transparent;
}
.tip-button:active {
  transform: rotate(4deg);
}

/* Button background (becomes the coin slot) */
.tip-button::before {
  background: linear-gradient(135deg, #ec4899, #f97316);
  border-radius: 9999px;
  bottom: 0;
  content: '';
  display: block;
  height: 100%;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
  transition: height 250ms ease-in-out 400ms, width 250ms ease-in-out 300ms, border-radius 200ms ease;
  width: 100%;
  z-index: 2;
  box-shadow: 0 4px 14px rgba(236, 72, 153, 0.3);
}

/* "Thank you!" text after coin lands */
.tip-button::after {
  bottom: -1rem;
  color: #ec4899;
  content: 'Thank you!';
  font-weight: 700;
  height: 110%;
  left: 0;
  opacity: 0;
  position: absolute;
  pointer-events: none;
  text-align: center;
  transform: scale(0);
  transform-origin: 50% 20%;
  transition: transform 200ms cubic-bezier(0, 0, 0.35, 1.43);
  width: 100%;
  z-index: 1;
}

.tip-button__text {
  color: #fff;
  margin-right: 2rem;
  opacity: 1;
  position: relative;
  transition: opacity 100ms linear 500ms;
  z-index: 3;
  white-space: nowrap;
}

/* ── Clicked state: shake + slot ── */
@keyframes shake {
  0%   { transform: rotate(4deg); }
  66%  { transform: rotate(-4deg); }
  100% { transform: rotate(0deg); }
}

.tip-button.clicked {
  animation: shake 150ms ease-in-out 1;
  pointer-events: none;
}
.tip-button.clicked .tip-button__text {
  opacity: 0;
  transition: opacity 100ms linear 200ms;
}
/* Button shrinks into a coin-slot shape */
.tip-button.clicked::before {
  height: 0.5rem;
  width: 60%;
  border-radius: 0.25rem;
}
/* Coin drops into slot via margin-bottom transition */
.tip-button.clicked .coin {
  transition: margin-bottom 1s linear 200ms;
  margin-bottom: 0;
}

/* ── Shrink landing: slot closes ── */
.tip-button.shrink-landing::before {
  transition: width 200ms ease-in;
  width: 0;
}

/* ── Coin landed: thank you + dust ── */
.tip-button.coin-landed::after {
  opacity: 1;
  transform: scale(1);
  transform-origin: 50% 100%;
}
.tip-button.coin-landed .coin-wrapper {
  background:
    radial-gradient(circle at 35% 97%, rgba(236,72,153,0.4) 0.04rem, transparent 0.04rem),
    radial-gradient(circle at 45% 92%, rgba(236,72,153,0.4) 0.04rem, transparent 0.02rem),
    radial-gradient(circle at 55% 98%, rgba(236,72,153,0.4) 0.04rem, transparent 0.04rem),
    radial-gradient(circle at 65% 96%, rgba(236,72,153,0.4) 0.06rem, transparent 0.06rem);
  background-position: center bottom;
  background-size: 100%;
  bottom: -1rem;
  opacity: 0;
  transform: scale(2) translateY(-10px);
}

/* ── Coin wrapper ── */
.coin-wrapper {
  background: none;
  bottom: 0;
  height: 18rem;
  left: 0;
  opacity: 1;
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  transform: none;
  transform-origin: 50% 100%;
  transition: opacity 200ms linear 100ms, transform 300ms ease-out;
  width: 100%;
}

/* ── Coin: driven by CSS custom properties via JS ── */
.coin {
  --front-y-multiplier: 0;
  --back-y-multiplier: 0;
  --coin-y-multiplier: 0;
  --coin-x-multiplier: 0;
  --coin-scale-multiplier: 0;
  --coin-rotation-multiplier: 0;
  --shine-opacity-multiplier: 0.4;
  --shine-bg-multiplier: 50%;
  bottom: calc(var(--coin-y-multiplier) * 1rem - 3.5rem);
  height: 3.5rem;
  margin-bottom: 3.05rem;
  position: absolute;
  right: calc(var(--coin-x-multiplier) * 34% + 16%);
  transform: translateX(50%) scale(calc(0.4 + var(--coin-scale-multiplier))) rotate(calc(var(--coin-rotation-multiplier) * -1deg));
  transition: opacity 100ms linear 200ms;
  width: 3.5rem;
  z-index: 3;
}

.coin__front, .coin__middle, .coin__back,
.coin::before, .coin__front::after, .coin__back::after {
  border-radius: 50%;
  box-sizing: border-box;
  height: 100%;
  left: 0;
  position: absolute;
  width: 100%;
  z-index: 3;
}

.coin__front {
  background:
    radial-gradient(circle at 50% 50%, transparent 50%, rgba(115,124,153,0.4) 54%, #c2cadf 54%),
    linear-gradient(210deg, #8590b3 32%, transparent 32%),
    linear-gradient(150deg, #8590b3 32%, transparent 32%),
    linear-gradient(to right, #8590b3 22%, transparent 22%, transparent 78%, #8590b3 78%),
    linear-gradient(to bottom, #fcfaf9 44%, transparent 44%, transparent 65%, #fcfaf9 65%, #fcfaf9 71%, #8590b3 71%),
    linear-gradient(to right, transparent 28%, #fcfaf9 28%, #fcfaf9 34%, #8590b3 34%, #8590b3 40%, #fcfaf9 40%, #fcfaf9 47%, #8590b3 47%, #8590b3 53%, #fcfaf9 53%, #fcfaf9 60%, #8590b3 60%, #8590b3 66%, #fcfaf9 66%, #fcfaf9 72%, transparent 72%);
  background-color: #8590b3;
  transform: translateY(calc(var(--front-y-multiplier) * 0.318rem / 2)) scaleY(var(--front-scale-multiplier));
}
.coin__front::after {
  background: rgba(0, 0, 0, 0.2);
  content: '';
  opacity: var(--front-y-multiplier);
}

.coin__middle {
  background: #737c99;
  transform: translateY(calc(var(--middle-y-multiplier) * 0.318rem / 2)) scaleY(var(--middle-scale-multiplier));
}

.coin__back {
  background:
    radial-gradient(circle at 50% 50%, transparent 50%, rgba(115,124,153,0.4) 54%, #c2cadf 54%),
    radial-gradient(circle at 50% 40%, #fcfaf9 23%, transparent 23%),
    radial-gradient(circle at 50% 100%, #fcfaf9 35%, transparent 35%);
  background-color: #8590b3;
  transform: translateY(calc(var(--back-y-multiplier) * 0.318rem / 2)) scaleY(var(--back-scale-multiplier));
}
.coin__back::after {
  background: rgba(0, 0, 0, 0.2);
  content: '';
  opacity: var(--back-y-multiplier);
}

/* Coin edge */
.coin::after {
  background: #737c99;
  content: '';
  height: 0.318rem;
  left: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  z-index: 2;
}

/* Shine */
.coin::before {
  background:
    radial-gradient(circle at 25% 65%, transparent 50%, rgba(255,255,255,0.9) 90%),
    linear-gradient(55deg, transparent calc(var(--shine-bg-multiplier) + 0%), #e9f4ff calc(var(--shine-bg-multiplier) + 0%), transparent calc(var(--shine-bg-multiplier) + 50%));
  content: '';
  opacity: var(--shine-opacity-multiplier);
  transform: translateY(calc(var(--middle-y-multiplier) * 0.318rem / -2)) scaleY(var(--middle-scale-multiplier)) rotate(calc(var(--coin-rotation-multiplier) * 1deg));
  z-index: 10;
}

/* ── Cat gif entrance ── */
.reward-cat-enter-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.reward-cat-leave-active {
  transition: all 0.3s ease;
}
.reward-cat-enter-from {
  opacity: 0;
  transform: scale(0) rotate(-15deg);
}
.reward-cat-leave-to {
  opacity: 0;
  transform: scale(0.5) translateY(10px);
}
</style>
