<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { COVER_IMAGES } from '@/utils/assets'

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

const foodList = [
  { 
    name: '重庆小面', 
    type: '面食', 
    rating: '9.5', 
    cover: COVER_IMAGES[0], 
    tags: ['麻辣', '地道', '早餐'], 
    location: '重庆',
    description: '麻辣鲜香，一碗下肚，元气满满'
  },
  { 
    name: '广式早茶', 
    type: '点心', 
    rating: '9.3', 
    cover: COVER_IMAGES[1], 
    tags: ['精致', '粤菜', '传统'], 
    location: '广东',
    description: '虾饺、烧卖、凤爪，饮茶必点'
  },
  { 
    name: '成都火锅', 
    type: '火锅', 
    rating: '9.8', 
    cover: COVER_IMAGES[2], 
    tags: ['麻辣', '社交', '夜宵'], 
    location: '四川',
    description: '牛油锅底配毛肚，人间至味'
  },
  { 
    name: '日式拉面', 
    type: '面食', 
    rating: '9.0', 
    cover: COVER_IMAGES[3], 
    tags: ['浓郁', '日料', '治愈'], 
    location: '日本',
    description: '豚骨汤底，叉烧溏心蛋，暖心暖胃'
  },
  { 
    name: '西安肉夹馍', 
    type: '小吃', 
    rating: '9.2', 
    cover: COVER_IMAGES[4], 
    tags: ['肉食', '传统', '便携'], 
    location: '陕西',
    description: '外酥里嫩，肉香四溢'
  },
  { 
    name: '潮汕牛肉丸', 
    type: '小吃', 
    rating: '9.4', 
    cover: COVER_IMAGES[5], 
    tags: ['弹牙', '鲜美', '手打'], 
    location: '广东',
    description: '手打牛肉丸，Q弹爽口'
  },
]

const foodTypes = ['全部', '面食', '火锅', '点心', '小吃']
const selectedType = ref('全部')

const filteredFood = ref(foodList)

function filterByType(type: string) {
  selectedType.value = type
  if (type === '全部') {
    filteredFood.value = foodList
  } else {
    filteredFood.value = foodList.filter(f => f.type === type)
  }
}

function getTypeColor(type: string) {
  const colors: Record<string, string> = {
    '面食': 'bg-orange-500',
    '火锅': 'bg-red-500',
    '点心': 'bg-pink-500',
    '小吃': 'bg-yellow-500',
  }
  return colors[type] || 'bg-gray-500'
}
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/40"></div>
      
      <div class="relative text-center text-white z-10">
        <Icon icon="lucide:utensils" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">美食</h1>
        <p class="mt-3 text-white/80 text-lg">唯有美食不可辜负</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- 筛选标签 -->
      <div 
        :ref="(el) => setCardRef(el, 0)"
        class="card p-4 mb-8 animate-card"
        :class="{ 'animate-in': isCardVisible(0) }"
      >
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="type in foodTypes"
            :key="type"
            @click="filterByType(type)"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            :class="selectedType === type 
              ? 'bg-[#7CB342] text-white shadow-lg shadow-[#7CB342]/30' 
              : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600/50'"
          >
            {{ type }}
          </button>
        </div>
      </div>

      <!-- 美食网格 -->
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="(food, index) in filteredFood"
          :key="food.name"
          :ref="(el) => setCardRef(el, index + 1)"
          class="card overflow-hidden group animate-card"
          :class="{ 'animate-in': isCardVisible(index + 1) }"
        >
          <!-- 封面 -->
          <div class="aspect-[4/3] relative overflow-hidden">
            <img 
              :src="food.cover" 
              :alt="food.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />
            <!-- 类型角标 -->
            <span 
              class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-medium"
              :class="getTypeColor(food.type)"
            >
              {{ food.type }}
            </span>
            <!-- 评分 -->
            <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center text-yellow-400 text-sm">
              <Icon icon="lucide:star" class="w-3.5 h-3.5 mr-1" />
              {{ food.rating }}
            </div>
            <!-- 地点 -->
            <div class="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center text-white/90 text-xs">
              <Icon icon="lucide:map-pin" class="w-3 h-3 mr-1" />
              {{ food.location }}
            </div>
            <!-- 遮罩 -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <!-- 信息 -->
          <div class="p-4">
            <h3 class="font-bold text-lg text-gray-800 dark:text-white group-hover:text-[#7CB342] transition-colors">
              {{ food.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {{ food.description }}
            </p>
            <div class="flex flex-wrap gap-1.5 mt-3">
              <span 
                v-for="tag in food.tags"
                :key="tag"
                class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计 -->
      <div 
        :ref="(el) => setCardRef(el, filteredFood.length + 1)"
        class="card p-6 mt-8 animate-card"
        :class="{ 'animate-in': isCardVisible(filteredFood.length + 1) }"
      >
        <div class="flex justify-around text-center">
          <div>
            <div class="text-3xl font-bold text-[#7CB342]">{{ foodList.length }}</div>
            <div class="text-sm text-gray-500 mt-1">美食收藏</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-orange-500">{{ foodList.filter(f => f.type === '面食').length }}</div>
            <div class="text-sm text-gray-500 mt-1">面食</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-red-500">{{ foodList.filter(f => f.type === '火锅').length }}</div>
            <div class="text-sm text-gray-500 mt-1">火锅</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-yellow-500">{{ foodList.filter(f => f.type === '小吃').length }}</div>
            <div class="text-sm text-gray-500 mt-1">小吃</div>
          </div>
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
