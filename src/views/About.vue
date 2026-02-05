<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { IMAGES } from '@/utils/assets'
import QQModal from '@/components/QQModal.vue'

const avatar = IMAGES.avatar
const showQQModal = ref(false)

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

const skills = [
  { name: 'Vue.js', icon: 'fab:vuejs', color: '#42b883' },
  { name: 'TypeScript', icon: 'devicon-plain:typescript', color: '#3178c6' },
  { name: 'Node.js', icon: 'fab:node-js', color: '#339933' },
  { name: 'Python', icon: 'fab:python', color: '#3776ab' },
  { name: 'Git', icon: 'fab:git-alt', color: '#f05032' },
  { name: 'Docker', icon: 'fab:docker', color: '#2496ed' },
]

const timeline = [
  { year: '2026', event: '开始写博客，分享技术与生活', icon: 'lucide:pen-line' },
  { year: '2025', event: '探索新技术，不断学习成长', icon: 'lucide:rocket' },
  { year: '2024', event: '在编程的道路上持续前行', icon: 'lucide:code-2' },
]
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[50vh] min-h-[380px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/40"></div>
      
      <div class="relative text-center text-white z-10">
        <div class="avatar-ring inline-block mb-4">
          <img 
            :src="avatar" 
            alt="Leguan" 
            class="w-32 h-32 rounded-full border-4 border-white/80 shadow-2xl"
            onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=Leguan'"
          />
        </div>
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">关于我</h1>
        <p class="mt-3 text-white/80 text-xl">Leguan</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- 个人介绍 -->
      <div 
        :ref="(el) => setCardRef(el, 0)"
        class="card p-6 md:p-8 mb-6 animate-card"
        :class="{ 'animate-in': isCardVisible(0) }"
      >
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-5 flex items-center">
          <Icon icon="lucide:user" class="w-6 h-6 mr-2 text-[#7CB342]" />
          个人简介
        </h2>
        <div class="text-gray-600 dark:text-gray-400 space-y-4 leading-relaxed">
          <p>
            你好！我是 <strong class="text-[#7CB342]">Leguan</strong>，一个想要看看世界的人。
          </p>
          <blockquote class="border-l-4 border-[#7CB342] pl-4 py-3 bg-gradient-to-r from-[#7CB342]/10 to-transparent rounded-r-lg">
            <p class="italic text-[#7CB342]">"Digest your emotions"</p>
            <p class="text-sm text-gray-500 mt-1">— 消化你的情绪</p>
          </blockquote>
          <p>这个博客是我记录生活、分享技术、沉淀思考的地方。</p>
          <ul class="space-y-2">
            <li class="flex items-center">
              <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-500 mr-2" />
              技术分享与学习笔记
            </li>
            <li class="flex items-center">
              <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-500 mr-2" />
              生活随笔与感悟
            </li>
            <li class="flex items-center">
              <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-500 mr-2" />
              追番记录与动漫推荐
            </li>
            <li class="flex items-center">
              <Icon icon="lucide:check-circle" class="w-5 h-5 text-green-500 mr-2" />
              健身日志与自我提升
            </li>
          </ul>
        </div>
      </div>

      <!-- 技术栈 -->
      <div 
        :ref="(el) => setCardRef(el, 1)"
        class="card p-6 md:p-8 mb-6 animate-card"
        :class="{ 'animate-in': isCardVisible(1) }"
      >
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <Icon icon="lucide:code-2" class="w-6 h-6 mr-2 text-[#7CB342]" />
          技术栈
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div 
            v-for="skill in skills"
            :key="skill.name"
            class="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
          >
            <Icon :icon="skill.icon" class="w-8 h-8 transition-transform group-hover:scale-110" :style="{ color: skill.color }" />
            <span class="font-medium text-gray-700 dark:text-gray-300">{{ skill.name }}</span>
          </div>
        </div>
      </div>

      <!-- 时间线 -->
      <div 
        :ref="(el) => setCardRef(el, 2)"
        class="card p-6 md:p-8 mb-6 animate-card"
        :class="{ 'animate-in': isCardVisible(2) }"
      >
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <Icon icon="lucide:history" class="w-6 h-6 mr-2 text-[#7CB342]" />
          时间线
        </h2>
        <div class="relative pl-8">
          <div class="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#7CB342] to-transparent"></div>
          <div class="space-y-6">
            <div 
              v-for="item in timeline"
              :key="item.year"
              class="relative"
            >
              <div class="absolute -left-5 w-4 h-4 rounded-full bg-[#7CB342] shadow-lg shadow-[#7CB342]/30"></div>
              <div class="ml-4">
                <div class="font-bold text-[#7CB342] text-lg">{{ item.year }}</div>
                <div class="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                  <Icon :icon="item.icon" class="w-4 h-4 mr-2" />
                  {{ item.event }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 联系方式 -->
      <div 
        :ref="(el) => setCardRef(el, 3)"
        class="card p-6 md:p-8 animate-card"
        :class="{ 'animate-in': isCardVisible(3) }"
      >
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <Icon icon="lucide:mail" class="w-6 h-6 mr-2 text-[#7CB342]" />
          联系我
        </h2>
        <div class="flex flex-wrap gap-3">
          <a 
            href="https://github.com/leguan7" 
            target="_blank"
            class="btn bg-gray-800 text-white hover:bg-gray-900"
          >
            <Icon icon="ri:github-fill" class="w-5 h-5 mr-2" />
            GitHub
          </a>
          <div class="relative">
            <button 
              @click.stop="showQQModal = !showQQModal"
              class="btn bg-[#12B7F5] text-white hover:bg-[#0aa3e0]"
            >
              <Icon icon="ri:qq-fill" class="w-5 h-5 mr-2" />
              QQ
            </button>
            <QQModal :visible="showQQModal" @close="showQQModal = false" />
          </div>
          <div class="relative group">
            <a 
              href="mailto:leguan701@gmail.com"
              class="btn bg-red-500 text-white hover:bg-red-600"
            >
              <Icon icon="lucide:mail" class="w-5 h-5 mr-2" />
              Email
            </a>
            <div class="tooltip">leguan701@gmail.com</div>
          </div>
          <router-link to="/messageboard" class="btn btn-primary">
            <Icon icon="lucide:message-circle" class="w-5 h-5 mr-2" />
            留言板
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tooltip {
  @apply absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:-translate-y-1 z-10;
}
.tooltip::after {
  content: '';
  @apply absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900;
}


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
