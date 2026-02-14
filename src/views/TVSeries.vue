<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { IMAGES } from '@/utils/assets'

// Animation visibility - use a single reactive trigger instead of per-card setTimeout
const animateAll = ref(false)

onMounted(() => {
  animateAll.value = true
})

const seriesList = [
  // 2025
  { name: 'Into the Blue Clouds', year: '2025', cover: IMAGES.ruqingyun },
  { name: 'Let Me Shine', year: '2025', cover: IMAGES.xuwoyaoyan },
  { name: 'Morning Snow Record', year: '2025', cover: IMAGES.zhaoxuelu },
  { name: 'Falling Into Our Love', year: '2025', cover: IMAGES.relian },
  { name: 'Hard to Get Over', year: '2025', cover: IMAGES.nanhong },
  // 2024
  { name: 'Amidst a Snowstorm of Love', year: '2024', cover: IMAGES.baoxue },
  { name: 'Stranger Things', year: '2024', cover: IMAGES.strangerthings },
  // 2023
  { name: 'Hidden Love', year: '2023', cover: IMAGES.toutoucangbuzhu },
  { name: 'Secret in the Lattice', year: '2023', cover: IMAGES.angelidemimi },
  { name: 'I Heard You Like Me', year: '2023', cover: IMAGES.tingshuonixihuan },
  // 2022
  { name: 'Love Like the Galaxy', year: '2022', cover: IMAGES.xinghancanlan },
  { name: 'Love in the City', year: '2022', cover: IMAGES.dushiaiqing },
  { name: 'Uncontrollably Fond', year: '2022', cover: IMAGES.renyiyilian },
  // 2021
  { name: 'Go Go Squid 2', year: '2021', cover: IMAGES.shidai },
  // 2019
  { name: 'A Lifetime Promise', year: '2019', cover: IMAGES.baisuizhihao },
  { name: 'While You Were Sleeping', year: '2019', cover: IMAGES.dangnichenshui },
  // 2018
  { name: 'Pinocchio', year: '2018', cover: IMAGES.pinuocao },
]

// Group by year
const groupedByYear = computed(() => {
  const groups: { year: string; shows: typeof seriesList }[] = []
  const yearMap = new Map<string, typeof seriesList>()
  
  for (const show of seriesList) {
    if (!yearMap.has(show.year)) {
      yearMap.set(show.year, [])
    }
    yearMap.get(show.year)!.push(show)
  }
  
  // Sort years descending
  const sortedYears = [...yearMap.keys()].sort((a, b) => parseInt(b) - parseInt(a))
  for (const year of sortedYears) {
    groups.push({ year, shows: yearMap.get(year)! })
  }
  
  return groups
})

// Flat index for animation
function getFlatIndex(groupIdx: number, showIdx: number): number {
  let idx = 0
  for (let g = 0; g < groupIdx; g++) {
    idx += groupedByYear.value[g].shows.length
  }
  return idx + showIdx
}
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/40"></div>
      
      <div class="relative text-center text-white z-10">
        <Icon icon="lucide:tv" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">TV Series</h1>
        <p class="mt-3 text-white/80 text-lg">Shows that captivate the soul</p>

        <!-- Description Tooltip -->
        <div class="relative inline-flex justify-center mt-4 group/tip">
          <div class="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/40 hover:scale-110">
            <Icon icon="lucide:quote" class="w-4 h-4 text-white" />
          </div>
          <div class="absolute top-12 left-1/2 -translate-x-1/2 w-[480px] max-w-[95vw] px-8 py-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/25 dark:border-gray-700/20 shadow-lg opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible translate-y-2 group-hover/tip:translate-y-0 transition-all duration-300 z-20 pointer-events-none">
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white/60 dark:bg-gray-800/60 border-l border-t border-white/25 dark:border-gray-700/20"></div>
            <p class="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed relative z-10">
              A timeline of the blogger's occasional drama-watching moments.
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

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Timeline -->
      <div class="relative">
        <!-- Center line -->
        <div class="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#7CB342] via-[#7CB342]/40 to-transparent hidden md:block"></div>

        <div v-for="(group, gIdx) in groupedByYear" :key="group.year" class="mb-12 last:mb-0">
          <!-- Year marker -->
          <div class="flex justify-center mb-8">
            <div class="relative z-10 px-6 py-2 rounded-full bg-[#7CB342] text-white font-bold text-lg shadow-lg shadow-[#7CB342]/30">
              {{ group.year }}
            </div>
          </div>

          <!-- Shows in this year -->
          <div class="space-y-6">
            <div
              v-for="(show, sIdx) in group.shows"
              :key="show.name"
              class="animate-card"
              :class="[
                { 'animate-in': animateAll },
                sIdx % 2 === 0 ? 'md:pr-[52%] md:text-right' : 'md:pl-[52%]'
              ]"
              :style="{ animationDelay: (getFlatIndex(gIdx, sIdx) * 150) + 'ms' }"
            >
              <div class="inline-block card overflow-hidden group relative max-w-[200px]">
                <!-- Cover image -->
                <div class="relative overflow-hidden">
                  <img
                    :src="show.cover"
                    :alt="show.name"
                    class="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                  />
                  <!-- Gradient overlay -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <!-- Title overlay -->
                  <div class="absolute bottom-0 left-0 right-0 p-4">
                    <h3 class="text-white font-bold text-lg drop-shadow-lg leading-[1.4] pb-0.5">
                      {{ show.name }}
                    </h3>
                  </div>
                </div>
              </div>

              <!-- Connection dot (center line) -->
              <div class="hidden md:block absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#7CB342] shadow-md shadow-[#7CB342]/40"
                :class="sIdx % 2 === 0 ? 'right-[calc(50%-6px)]' : 'left-[calc(50%-6px)]'"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div 
        class="card p-6 mt-12 stats-card"
        :class="{ 'animate-in': animateAll }"
      >
        <div class="flex justify-around text-center">
          <div>
            <div class="text-3xl font-bold text-[#7CB342]">{{ seriesList.length }}</div>
            <div class="text-sm text-gray-500 mt-1">Total Series</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-blue-500">{{ groupedByYear.length }}</div>
            <div class="text-sm text-gray-500 mt-1">Years</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-purple-500">{{ groupedByYear[0]?.shows.length || 0 }}</div>
            <div class="text-sm text-gray-500 mt-1">This Year</div>
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
