<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

// Intersection Observer for animations
const visibleCards = ref<Set<number>>(new Set())
const cardElements = ref<Map<number, HTMLElement>>(new Map())
let observer: IntersectionObserver | null = null

const setCardRef = (el: any, index: number) => {
  if (el) {
    cardElements.value.set(index, el)
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
          }, index * 100)
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
  )

  // Observe all stored elements
  cardElements.value.forEach((el, index) => {
    ;(el as any).__cardIndex = index
    observer?.observe(el)
  })
})

onUnmounted(() => {
  observer?.disconnect()
})

const friends = [
  {
    name: 'Kyle Violet',
    avatar: 'https://cyborg2077.github.io/img/avatar.png',
    link: 'https://cyborg2077.github.io/',
    description: '技术大佬的博客',
    color: 'from-purple-500 to-violet-500'
  },
  {
    name: '张洪Heo',
    avatar: 'https://bu.dusays.com/2022/12/28/63ac2812183aa.png',
    link: 'https://blog.zhheo.com/',
    description: '分享设计与科技生活',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: "Cheeph's Blog",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cheeph',
    link: '#',
    description: '道阻且长，行则将至',
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: "Wzh's Blog",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wzh',
    link: '#',
    description: '薄薄一页，寥寥一生',
    color: 'from-orange-500 to-red-500'
  },
  {
    name: "liangbm3's blog",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liangbm3',
    link: '#',
    description: '总有人间一两风，填我十万八千梦。',
    color: 'from-pink-500 to-rose-500'
  },
]
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/30"></div>
      
      <div class="relative text-center text-white z-10">
        <Icon icon="lucide:user-plus" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">友人帐</h1>
        <p class="mt-3 text-white/80 text-lg">海内存知己，天涯若比邻</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- 友链卡片 -->
      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <a
          v-for="(friend, index) in friends"
          :key="friend.name"
          :ref="(el) => setCardRef(el, index)"
          :href="friend.link"
          target="_blank"
          rel="noopener noreferrer"
          class="card p-5 flex items-center space-x-4 group overflow-hidden relative animate-card"
          :class="{ 'animate-in': isCardVisible(index) }"
        >
          <!-- 悬浮背景 -->
          <div 
            class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br"
            :class="friend.color"
          ></div>
          
          <div class="relative">
            <div 
              class="w-16 h-16 rounded-full p-0.5 bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform duration-300"
              :class="friend.color"
            >
              <img 
                :src="friend.avatar" 
                :alt="friend.name"
                class="w-full h-full rounded-full object-cover bg-white"
                loading="lazy"
                decoding="async"
                onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(this.alt)"
              />
            </div>
          </div>

          <div class="flex-1 min-w-0 relative">
            <h3 class="font-bold text-gray-800 dark:text-white group-hover:text-[#49b1f5] transition-colors flex items-center">
              {{ friend.name }}
              <Icon icon="lucide:external-link" class="w-3 h-3 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
              {{ friend.description }}
            </p>
          </div>
        </a>
      </div>

      <!-- 申请友链 -->
      <div 
        :ref="(el) => setCardRef(el, friends.length)"
        class="card p-6 md:p-8 mt-8 animate-card"
        :class="{ 'animate-in': isCardVisible(friends.length) }"
      >
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <Icon icon="lucide:plus-circle" class="w-5 h-5 mr-2 text-[#49b1f5]" />
          申请友链
        </h2>
        <div class="text-gray-600 dark:text-gray-400 space-y-3">
          <p>欢迎交换友链！请按以下格式留言：</p>
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <code>
              name: 你的网站名称<br/>
              link: https://你的网址.com<br/>
              avatar: 头像链接<br/>
              description: 一句话描述
            </code>
          </div>
          <p class="text-sm text-gray-500">
            <Icon icon="lucide:info" class="w-4 h-4 inline mr-1" />
            请确保你的网站可以正常访问，且已添加本站友链
          </p>
          <router-link to="/messageboard" class="btn btn-primary inline-flex mt-2">
            <Icon icon="lucide:send" class="w-4 h-4 mr-2" />
            前往留言
          </router-link>
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
