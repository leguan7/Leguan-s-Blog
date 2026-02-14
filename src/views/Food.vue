<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { IMAGES } from '@/utils/assets'

const animateAll = ref(false)

onMounted(() => {
  animateAll.value = true
})

interface Game {
  name: string
  cover: string
}

interface GameSection {
  title: string
  emoji: string
  color: string
  glow: string
  games: Game[]
}

const sections: GameSection[] = [
  {
    title: 'Wishlist',
    emoji: '🎯',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.4)',
    games: [
      { name: 'NBA 2K26', cover: IMAGES.nba2k26 },
      { name: 'Shadow Blade Zero', cover: IMAGES.yingzhiren },
      { name: 'Monster Hunter Wilds', cover: IMAGES.guailiehuangye },
      { name: "Baldur's Gate 3", cover: IMAGES.bodezhimen3 },
    ],
  },
  {
    title: 'Up Next',
    emoji: '🕹️',
    color: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.4)',
    games: [
      { name: 'Elden Ring', cover: IMAGES.laotouhuan },
      { name: 'Civilization VI', cover: IMAGES.wenming6 },
    ],
  },
  {
    title: 'Played',
    emoji: '🏆',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)',
    games: [
      { name: 'League of Legends', cover: IMAGES.lol },
      { name: 'CS:GO', cover: IMAGES.csgo },
      { name: 'Valorant', cover: IMAGES.valorant },
      { name: 'Monster Hunter: World', cover: IMAGES.guailieshijie },
      { name: 'NBA 2K25', cover: IMAGES.nba2k25 },
      { name: 'Black Myth: Wukong', cover: IMAGES.heiwukong },
      { name: 'NBA 2K24', cover: IMAGES.nba2k24 },
      { name: 'Red Dead Redemption 2', cover: IMAGES.dabiaoke2 },
      { name: 'NBA 2K23', cover: IMAGES.nba2k23 },
      { name: 'Sekiro: Shadows Die Twice', cover: IMAGES.zhilang },
      { name: 'Pummel Party', cover: IMAGES.paidui },
      { name: 'It Takes Two', cover: IMAGES.shuangrenchengxing },
      { name: 'Sifu', cover: IMAGES.sifu },
      { name: 'Dragon Ball Z: Kakarot', cover: IMAGES.kakaluote },
      { name: 'Left 4 Dead 2', cover: IMAGES.qiushengzhilu2 },
      { name: 'PUBG', cover: IMAGES.pubg },
      { name: 'The Forest', cover: IMAGES.forest },
      { name: 'Jump Force', cover: IMAGES.jumpforce },
      { name: 'Backrooms', cover: IMAGES.backrooms },
      { name: 'The Witcher 3: Wild Hunt', cover: IMAGES.wushi3 },
      { name: 'Fall Guys', cover: IMAGES.tangdouren },
      { name: 'Tekken 7', cover: IMAGES.tiequan7 },
      { name: 'Apex Legends', cover: IMAGES.apex },
      { name: 'Lethal Company', cover: IMAGES.zhiminggongsi },
      { name: 'PICO PARK', cover: IMAGES.picopark },
      { name: 'Witch It', cover: IMAGES.nvwulaile },
      { name: 'Goose Goose Duck', cover: IMAGES.eyasha },
      { name: 'Project Winter', cover: IMAGES.dongrijihua },
      { name: 'Rubber Bandits', cover: IMAGES.xiangjiaoqiangdao },
      { name: 'Naraka: Bladepoint', cover: IMAGES.yongjiewujian },
      { name: "Assassin's Creed Origins", cover: IMAGES.qiyuan },
    ],
  },
  {
    title: 'Backlog',
    emoji: '📦',
    color: '#6b7280',
    glow: 'rgba(107, 114, 128, 0.3)',
    games: [
      { name: 'Ghostwire: Tokyo', cover: IMAGES.youlingxian },
      { name: 'Payday 2', cover: IMAGES.payday2 },
      { name: 'Steep', cover: IMAGES.jixiandianfeng },
      { name: 'Need for Speed Heat', cover: IMAGES.jipinfeiche },
      { name: 'Borderlands 2', cover: IMAGES.wuzhuzhidi2 },
      { name: 'Football Manager 2022', cover: IMAGES.zuqiu2022 },
      { name: 'Football Manager 2024', cover: IMAGES.zuqiu2024 },
      { name: 'Death Stranding', cover: IMAGES.siwanggeqian },
      { name: 'Destiny 2', cover: IMAGES.mingyun2 },
      { name: 'Shadow of the Tomb Raider', cover: IMAGES.gumuliying },
      { name: 'Dying Light', cover: IMAGES.xiaoguang },
      { name: 'Supraland', cover: IMAGES.supulalan },
      { name: 'Ghostrunner', cover: IMAGES.youlingxingzhe },
      { name: 'Ghostrunner 2', cover: IMAGES.youlingxingzhe2 },
      { name: 'Farming Simulator 22', cover: IMAGES.moninongchang22 },
      { name: 'Moving Out', cover: IMAGES.hunaobanjia },
      { name: 'Bus Simulator 21', cover: IMAGES.monibashi21 },
      { name: 'Dead Island 2', cover: IMAGES.siwangdao2 },
      { name: 'Shift Happens', cover: IMAGES.yixinghuanwei },
      { name: 'ARK: Survival Evolved', cover: IMAGES.fangzhou },
    ],
  },
]

// Flatten for total count
const totalGames = sections.reduce((sum, s) => sum + s.games.length, 0)
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/40"></div>
      
      <div class="relative text-center text-white z-10">
        <Icon icon="lucide:gamepad-2" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">Games</h1>
        <p class="mt-3 text-white/80 text-lg">Press Start — another world awaits</p>

        <!-- Description Tooltip -->
        <div class="relative inline-flex justify-center mt-4 group/tip">
          <div class="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/40 hover:scale-110">
            <Icon icon="lucide:quote" class="w-4 h-4 text-white" />
          </div>
          <div class="absolute top-12 left-1/2 -translate-x-1/2 w-[480px] max-w-[95vw] px-8 py-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/25 dark:border-gray-700/20 shadow-lg opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible translate-y-2 group-hover/tip:translate-y-0 transition-all duration-300 z-20 pointer-events-none">
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white/60 dark:bg-gray-800/60 border-l border-t border-white/25 dark:border-gray-700/20"></div>
            <p class="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed relative z-10">
              A PC gamer's journey — ranked battles, open-world adventures, and late-night co-op with friends.
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

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Sections -->
      <div v-for="(section, sIdx) in sections" :key="section.title" class="mb-14 last:mb-0">
        <!-- Section Header -->
        <div
          class="flex items-center gap-3 mb-6 game-section-header"
          :class="{ 'animate-in': animateAll }"
          :style="{ animationDelay: (sections.slice(0, sIdx).reduce((sum, s) => sum + s.games.length, 0) * 50 + sIdx * 150) + 'ms' }"
        >
          <div class="section-accent" :style="{ '--accent': section.color, '--accent-glow': section.glow }">
            <span class="section-accent-bar"></span>
            <span class="section-accent-dot"></span>
          </div>
          <span class="section-emoji">{{ section.emoji }}</span>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ section.title }}</h2>
          <span class="text-sm text-gray-400 ml-1">({{ section.games.length }})</span>
          <div class="flex-1 h-px ml-3" :style="{ background: `linear-gradient(to right, ${section.color}40, transparent)` }"></div>
        </div>

        <!-- Game Grid -->
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          <div
            v-for="(game, gIdx) in section.games"
            :key="game.name"
            class="game-card group"
            :class="{ 'animate-in': animateAll }"
            :style="{ animationDelay: (sections.slice(0, sIdx).reduce((sum, s) => sum + s.games.length, 0) * 50 + sIdx * 150 + gIdx * 50) + 'ms', '--glow-color': section.glow }"
          >
            <div class="aspect-[3/4] relative rounded-lg overflow-hidden">
              <img
                :src="game.cover"
                :alt="game.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <!-- Hover overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                <h3 class="text-white text-xs font-semibold leading-tight drop-shadow-lg">{{ game.name }}</h3>
              </div>
              <!-- Glow border on hover -->
              <div
                class="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-current transition-colors duration-300 pointer-events-none"
                :style="{ color: section.color }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div
        class="stats-card mt-10"
        :class="{ 'animate-in': animateAll }"
      >
        <div class="card p-6">
          <div class="flex justify-around text-center">
            <div>
              <div class="text-3xl font-bold text-purple-500">{{ totalGames }}</div>
              <div class="text-sm text-gray-500 mt-1">Total</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-green-500">{{ sections[2].games.length }}</div>
              <div class="text-sm text-gray-500 mt-1">Played</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-amber-500">{{ sections[0].games.length }}</div>
              <div class="text-sm text-gray-500 mt-1">Wishlist</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-gray-500">{{ sections[3].games.length }}</div>
              <div class="text-sm text-gray-500 mt-1">Backlog</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Game card: compact cover with glow hover */
.game-card {
  opacity: 0;
  transform: scale(0.85);
  transform-origin: center center;
  will-change: transform, opacity;
}

.game-card.animate-in {
  animation: cardPop 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.game-card:hover {
  z-index: 10;
}

.game-card .aspect-\[3\/4\] {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
}

.game-card:hover .aspect-\[3\/4\] {
  box-shadow: 0 8px 25px var(--glow-color, rgba(0,0,0,0.3));
}

/* Section header animation */
.game-section-header {
  opacity: 0;
  transform: translateX(-20px);
  will-change: transform, opacity;
}

.game-section-header.animate-in {
  animation: slideRight 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Stats card */
.stats-card {
  opacity: 0;
  transform: scale(0.85);
  transform-origin: center center;
  will-change: transform, opacity;
}

.stats-card.animate-in {
  animation: cardPop 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes cardPop {
  0% {
    opacity: 0;
    transform: scale(0.85);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideRight {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Section accent — colored bar + dot */
.section-accent {
  position: relative;
  width: 4px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
}

.section-accent-bar {
  position: absolute;
  inset: 0;
  border-radius: 2px;
  background: linear-gradient(to bottom, var(--accent), transparent);
  box-shadow: 0 0 10px var(--accent-glow);
  transition: height 0.35s ease, box-shadow 0.35s ease;
}

.section-accent-dot {
  position: absolute;
  top: -2px;
  left: 50%;
  translate: -50% 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent-glow);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.game-section-header:hover .section-accent-dot {
  transform: scale(1.4);
  box-shadow: 0 0 14px var(--accent-glow);
}

.game-section-header:hover .section-accent-bar {
  box-shadow: 0 0 16px var(--accent-glow);
}

/* Section emoji */
.section-emoji {
  font-size: 1.35rem;
  line-height: 1;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.game-section-header:hover .section-emoji {
  transform: scale(1.25) rotate(-8deg);
}
</style>
