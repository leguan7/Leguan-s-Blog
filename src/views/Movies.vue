<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { IMAGES } from '@/utils/assets'

// Pagination
const PAGE_SIZE = 12
const currentPage = ref(1)

// Animation visibility - use a single reactive trigger instead of per-card setTimeout
const animateAll = ref(false)

onMounted(() => {
  animateAll.value = true
})

const animKey = ref(0)

watch(currentPage, () => {
  animateAll.value = false
  animKey.value++
  nextTick(() => {
    animateAll.value = true
  })
})

const moviesList = [
  // 2025
  { name: 'Ne Zha 2: The Devil Child Stirs the Sea', year: '2025', rating: '9.8', cover: IMAGES.nezha2, tags: ['Animation', 'Fantasy', 'Action'] },
  { name: 'Zootopia 2', year: '2025', rating: '9.7', cover: IMAGES.dongwucheng2, tags: ['Animation', 'Comedy', 'Adventure'] },
  { name: 'Hunting Gold: The Game', year: '2025', rating: '8.9', cover: IMAGES.liejinyouxi, tags: ['Crime', 'Thriller'] },
  { name: 'Doraemon: Nobita\'s Painting Adventure', year: '2025', rating: '9.2', cover: IMAGES.huihuaqiyuji, tags: ['Animation', 'Adventure', 'Family'] },
  { name: 'Anonymous Kill', year: '2025', rating: '9.4', cover: IMAGES.nisha, tags: ['Crime', 'Thriller', 'Suspense'] },
  { name: 'Stray Life', year: '2025', rating: '9.4', cover: IMAGES.langlangrensheng, tags: ['Animation', 'Drama'] },
  { name: 'A Writer\'s Odyssey 2', year: '2025', rating: '8.9', cover: IMAGES.xiaoshuojia2, tags: ['Fantasy', 'Action', 'Adventure'] },
  { name: 'Bi Zhengming\'s Proof', year: '2025', rating: '9.4', cover: IMAGES.bizhengming, tags: ['Drama', 'Crime'] },
  { name: 'Final Destination: Bloodlines', year: '2025', rating: '8.4', cover: IMAGES.sishenlaile, tags: ['Horror', 'Thriller'] },
  { name: 'Catching Shadows', year: '2025', rating: '9.5', cover: IMAGES.bufengzhuoying, tags: ['Suspense', 'Crime'] },
  { name: 'Malice', year: '2025', rating: '9.0', cover: IMAGES.eyi, tags: ['Crime', 'Thriller', 'Mystery'] },
  { name: 'Little Monsters of Mt. Langlang', year: '2025', rating: '9.5', cover: IMAGES.xiaoyaoguai, tags: ['Animation', 'Fantasy'] },
  // 2024
  { name: 'Pegasus 2', year: '2024', rating: '9.5', cover: IMAGES.feichirensheng2, tags: ['Comedy', 'Sports', 'Racing'] },
  { name: 'Rock the Sun Together', year: '2024', rating: '9.5', cover: IMAGES.yaotaiyang, tags: ['Romance', 'Drama'] },
  { name: 'Erta Kill 3', year: '2024', rating: '8.9', cover: IMAGES.wusha3, tags: ['Crime', 'Thriller', 'Suspense'] },
  // 2023
  { name: 'Full River Red', year: '2023', rating: '9.4', cover: IMAGES.manjianghong, tags: ['History', 'Suspense', 'Comedy'] },
  { name: 'Post Safe', year: '2023', rating: '9.3', cover: IMAGES.baonipingan, tags: ['Comedy', 'Drama'] },
  { name: 'Suzume', year: '2023', rating: '9.0', cover: IMAGES.lingyazhilv, tags: ['Animation', 'Fantasy', 'Adventure'] },
  { name: 'No More Bets', year: '2023', rating: '9.1', cover: IMAGES.guzhuyizhi, tags: ['Crime', 'Drama', 'Thriller'] },
  { name: 'Ex-Files 4: Marriage Plan', year: '2023', rating: '8.7', cover: IMAGES.qianren4, tags: ['Romance', 'Comedy'] },
  // 2022
  { name: 'One Piece Film: Red', year: '2022', rating: '9.0', cover: IMAGES.hongfageji, tags: ['Animation', 'Adventure', 'Music'] },
  // 2021
  { name: 'Detective Chinatown 3', year: '2021', rating: '8.8', cover: IMAGES.tangtan3, tags: ['Comedy', 'Mystery', 'Crime'] },
  { name: 'Detective Conan: The Scarlet Bullet', year: '2021', rating: '8.3', cover: IMAGES.feihongdezidan, tags: ['Animation', 'Mystery', 'Action'] },
  { name: 'My Sister', year: '2021', rating: '8.8', cover: IMAGES.wodejiejie, tags: ['Drama', 'Family'] },
  // 2020
  { name: 'Violet Evergarden: The Movie', year: '2020', rating: '9.2', cover: IMAGES.ziluolan, tags: ['Animation', 'Drama', 'Romance'] },
  { name: 'Vanguard', year: '2020', rating: '8.3', cover: IMAGES.jixianfeng, tags: ['Action', 'Adventure', 'Comedy'] },
  // 2019
  { name: 'Pegasus', year: '2019', rating: '8.8', cover: IMAGES.feichirensheng, tags: ['Comedy', 'Sports', 'Racing'] },
  { name: 'One Piece: Stampede', year: '2019', rating: '9.3', cover: IMAGES.kuangrexingdong, tags: ['Animation', 'Adventure', 'Action'] },
  { name: 'Weathering with You', year: '2019', rating: '9.0', cover: IMAGES.tianqizhizi, tags: ['Animation', 'Romance', 'Fantasy'] },
  { name: 'Escape Room', year: '2019', rating: '8.6', cover: IMAGES.mishitaotuo, tags: ['Thriller', 'Horror', 'Mystery'] },
  { name: 'Erta Kill', year: '2019', rating: '9.4', cover: IMAGES.wusha, tags: ['Crime', 'Thriller', 'Suspense'] },
  // 2018
  { name: 'Happy Death Day', year: '2018', rating: '8.3', cover: IMAGES.jirikuaile, tags: ['Horror', 'Comedy', 'Mystery'] },
  { name: 'iPartment: The Movie', year: '2018', rating: '6.8', cover: IMAGES.aiqinggongyu, tags: ['Comedy', 'Adventure'] },
  { name: 'Johnny English Strikes Again', year: '2018', rating: '8.6', cover: IMAGES.handoutegong3, tags: ['Comedy', 'Action', 'Adventure'] },
  { name: 'Dying to Survive', year: '2018', rating: '9.6', cover: IMAGES.yaoshen, tags: ['Drama', 'Comedy', 'Biography'] },
  // 2017
  { name: 'Ex-Files 3: The Return of the Exes', year: '2017', rating: '9.1', cover: IMAGES.qianren3, tags: ['Romance', 'Comedy'] },
  { name: 'The Foreigner', year: '2017', rating: '8.4', cover: IMAGES.yinglunduijue, tags: ['Action', 'Thriller'] },
]

// Pagination computed
const totalPages = computed(() => Math.ceil(moviesList.length / PAGE_SIZE))
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return moviesList.slice(start, start + PAGE_SIZE)
})

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function getStatusColor(year: string) {
  const y = parseInt(year)
  if (y >= 2025) return 'bg-green-500'
  if (y >= 2023) return 'bg-blue-500'
  if (y >= 2020) return 'bg-purple-500'
  return 'bg-gray-500'
}
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/40"></div>
      
      <div class="relative text-center text-white z-10">
        <Icon icon="lucide:film" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">Movies</h1>
        <p class="mt-3 text-white/80 text-lg">Magical moments in cinema</p>

        <!-- Description Tooltip -->
        <div class="relative inline-flex justify-center mt-4 group/tip">
          <div class="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/40 hover:scale-110">
            <Icon icon="lucide:quote" class="w-4 h-4 text-white" />
          </div>
          <div class="absolute top-12 left-1/2 -translate-x-1/2 w-[500px] max-w-[95vw] px-8 py-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/25 dark:border-gray-700/20 shadow-lg opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible translate-y-2 group-hover/tip:translate-y-0 transition-all duration-300 z-20 pointer-events-none">
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white/60 dark:bg-gray-800/60 border-l border-t border-white/25 dark:border-gray-700/20"></div>
            <p class="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed relative z-10">
              This page only records movies the blogger watched in theaters.
            </p>
          </div>
        </div>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Movies Grid -->
      <div class="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        <div 
          v-for="(movie, index) in paginatedList"
          :key="animKey + '-' + movie.name"
          class="card overflow-hidden group animate-card"
          :class="{ 'animate-in': animateAll }"
          :style="{ animationDelay: (index * 150) + 'ms' }"
        >
          <!-- Cover (vertical poster) -->
          <div class="aspect-[2/3] relative overflow-hidden">
            <img 
              :src="movie.cover" 
              :alt="movie.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <!-- Year Badge -->
            <span 
              class="absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-white text-[10px] font-medium"
              :class="getStatusColor(movie.year)"
            >
              {{ movie.year }}
            </span>
            <!-- Rating Badge -->
            <div class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-1.5 py-0.5 flex items-center text-yellow-400 text-[10px] font-medium">
              <Icon icon="lucide:star" class="w-3 h-3 mr-0.5" />
              {{ movie.rating }}
            </div>
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <!-- Title at bottom -->
            <div class="absolute bottom-0 left-0 right-0 p-3">
              <h3 class="font-bold text-sm text-white leading-[1.4] line-clamp-2 drop-shadow-md">
                {{ movie.name }}
              </h3>
            </div>
          </div>

          <!-- Tags -->
          <div class="p-2.5">
            <div class="flex flex-wrap gap-1">
              <span 
                v-for="tag in movie.tags"
                :key="tag"
                class="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
          :class="currentPage === 1 ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-500 dark:text-gray-400 hover:bg-[#7CB342]/10 hover:text-[#7CB342]'"
        >
          <Icon icon="lucide:chevron-left" class="w-4 h-4" />
        </button>

        <template v-for="page in totalPages" :key="page">
          <button
            @click="goToPage(page)"
            class="w-9 h-9 rounded-lg text-sm font-medium transition-all duration-300"
            :class="page === currentPage
              ? 'bg-[#7CB342] text-white shadow-md shadow-[#7CB342]/30'
              : 'text-gray-500 dark:text-gray-400 hover:bg-[#7CB342]/10 hover:text-[#7CB342]'"
          >
            {{ page }}
          </button>
        </template>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
          :class="currentPage === totalPages ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-500 dark:text-gray-400 hover:bg-[#7CB342]/10 hover:text-[#7CB342]'"
        >
          <Icon icon="lucide:chevron-right" class="w-4 h-4" />
        </button>

        <span class="ml-3 text-xs text-gray-400 dark:text-gray-500">
          {{ (currentPage - 1) * PAGE_SIZE + 1 }}-{{ Math.min(currentPage * PAGE_SIZE, moviesList.length) }} / {{ moviesList.length }}
        </span>
      </div>

      <!-- Stats -->
      <div 
        class="card p-6 mt-8 stats-card"
        :class="{ 'animate-in': animateAll }"
      >
        <div class="flex justify-around text-center">
          <div>
            <div class="text-3xl font-bold text-[#7CB342]">{{ moviesList.length }}</div>
            <div class="text-sm text-gray-500 mt-1">Total Movies</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-green-500">{{ moviesList.filter(m => parseInt(m.year) >= 2025).length }}</div>
            <div class="text-sm text-gray-500 mt-1">2025</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-blue-500">{{ moviesList.filter(m => parseInt(m.year) >= 2020 && parseInt(m.year) < 2025).length }}</div>
            <div class="text-sm text-gray-500 mt-1">2020-2024</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-purple-500">{{ moviesList.filter(m => parseInt(m.year) < 2020).length }}</div>
            <div class="text-sm text-gray-500 mt-1">Before 2020</div>
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
  will-change: transform, opacity;
}

.animate-card.animate-in {
  animation: scaleUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.stats-card {
  opacity: 0;
  transform: scale(0.85);
  transform-origin: center center;
  will-change: transform, opacity;
}

.stats-card.animate-in {
  animation: scaleUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scaleUp {
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
