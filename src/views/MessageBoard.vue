<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

const comment = ref('')
const nickname = ref('')
const email = ref('')

function submitComment() {
  alert('评论功能正在开发中...')
}

// Intersection Observer for animations
const visibleCards = ref<Set<number>>(new Set())
const cardRefs = ref<(HTMLElement | null)[]>([])
let observer: IntersectionObserver | null = null

const setCardRef = (el: any, index: number) => {
  if (el) {
    cardRefs.value[index] = el
  }
}

const isCardVisible = (index: number) => visibleCards.value.has(index)

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = (entry.target as any).__cardIndex as number
        if (entry.isIntersecting && !visibleCards.value.has(index)) {
          setTimeout(() => {
            visibleCards.value.add(index)
            visibleCards.value = new Set(visibleCards.value)
          }, index * 150)
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
  )

  // Observe all stored elements
  cardRefs.value.forEach((el, index) => {
    if (el) {
      ;(el as any).__cardIndex = index
      observer?.observe(el)
    }
  })
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/30"></div>
      
      <div class="relative text-center text-white z-10">
        <Icon icon="lucide:message-circle" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">留言板</h1>
        <p class="mt-3 text-white/80 text-lg">有什么想说的？留下你的足迹吧！</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- 留言表单 -->
      <div 
        :ref="(el) => setCardRef(el, 0)"
        class="card p-6 md:p-8 mb-8 animate-card"
        :class="{ 'animate-in': isCardVisible(0) }"
      >
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-5 flex items-center">
          <Icon icon="lucide:pen-line" class="w-5 h-5 mr-2 text-[#49b1f5]" />
          发表留言
        </h2>
        
        <form @submit.prevent="submitComment" class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <Icon icon="lucide:user" class="w-3.5 h-3.5 inline mr-1" />
                昵称
              </label>
              <input 
                v-model="nickname"
                type="text" 
                required
                placeholder="你的昵称"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#49b1f5] focus:ring-2 focus:ring-[#49b1f5]/20 transition-all outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <Icon icon="lucide:mail" class="w-3.5 h-3.5 inline mr-1" />
                邮箱
              </label>
              <input 
                v-model="email"
                type="email" 
                placeholder="选填，用于获取头像"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#49b1f5] focus:ring-2 focus:ring-[#49b1f5]/20 transition-all outline-none"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <Icon icon="lucide:message-square" class="w-3.5 h-3.5 inline mr-1" />
              留言内容
            </label>
            <textarea 
              v-model="comment"
              rows="4"
              required
              placeholder="说点什么吧..."
              class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#49b1f5] focus:ring-2 focus:ring-[#49b1f5]/20 transition-all outline-none resize-none"
            ></textarea>
          </div>

          <button type="submit" class="btn btn-primary w-full md:w-auto">
            <Icon icon="lucide:send" class="w-4 h-4 mr-2" />
            发表留言
          </button>
        </form>
      </div>

      <!-- 提示信息 -->
      <div 
        :ref="(el) => setCardRef(el, 1)"
        class="card p-6 text-center animate-card"
        :class="{ 'animate-in': isCardVisible(1) }"
      >
        <Icon icon="lucide:heart" class="w-12 h-12 text-pink-400 mx-auto mb-3" />
        <p class="text-gray-600 dark:text-gray-400">
          评论功能正在开发中，敬请期待！<br/>
          <span class="text-sm text-gray-400">你也可以通过以下方式联系我</span>
        </p>
        <div class="flex flex-wrap justify-center gap-2 mt-4">
          <a href="https://github.com/leguan7" target="_blank" class="btn bg-gray-800 text-white hover:bg-gray-900 text-sm">
            <Icon icon="ri:github-fill" class="w-4 h-4 mr-1.5" />
            GitHub
          </a>
          <a href="#" class="btn bg-[#12B7F5] text-white hover:bg-[#0aa3e0] text-sm">
            <Icon icon="ri:qq-fill" class="w-4 h-4 mr-1.5" />
            QQ
          </a>
          <a href="#" class="btn bg-[#07C160] text-white hover:bg-[#06a850] text-sm">
            <Icon icon="ri:wechat-fill" class="w-4 h-4 mr-1.5" />
            WeChat
          </a>
          <a href="mailto:leguan@example.com" class="btn bg-red-500 text-white hover:bg-red-600 text-sm">
            <Icon icon="lucide:mail" class="w-4 h-4 mr-1.5" />
            Email
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-card {
  opacity: 0;
  transform: scale(0.85);
  transform-origin: center center;
}

.animate-card.animate-in {
  animation: scaleIn 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes scaleIn {
  0% {
    opacity: 0;
    transform: scale(0.85);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
