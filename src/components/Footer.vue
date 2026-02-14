<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
const currentYear = new Date().getFullYear()
const isVisible = ref(false)

// Site start date: 2026-02-04 15:00
const SITE_START = new Date('2026-02-04T15:00:00').getTime()
const runDays = ref(0)
const runHours = ref(0)
const runMinutes = ref(0)
const runSeconds = ref(0)
let runTimer: ReturnType<typeof setInterval> | null = null

function updateRuntime() {
  const diff = Date.now() - SITE_START
  runDays.value = Math.floor(diff / (1000 * 60 * 60 * 24))
  runHours.value = Math.floor((diff / (1000 * 60 * 60)) % 24)
  runMinutes.value = Math.floor((diff / (1000 * 60)) % 60)
  runSeconds.value = Math.floor((diff / 1000) % 60)
}

// "Guess You Like" — random page routes
const allPages = [
  { title: 'Archives', path: '/archives', icon: 'lucide:archive' },
  { title: 'Tags', path: '/tags', icon: 'lucide:tags' },
  { title: 'Categories', path: '/categories', icon: 'lucide:folder' },
  { title: 'Anime', path: '/bangumi', icon: 'lucide:tv' },
  { title: 'Fitness', path: '/fitness', icon: 'lucide:dumbbell' },
  { title: 'Thoughts', path: '/shuoshuo', icon: 'lucide:message-square' },
  { title: 'Memories', path: '/memory', icon: 'lucide:images' },
  { title: 'TV Series', path: '/tvseries', icon: 'lucide:clapperboard' },
  { title: 'Movies', path: '/movies', icon: 'lucide:film' },
  { title: 'Games', path: '/games', icon: 'lucide:gamepad-2' },
  { title: 'Celebrities', path: '/celebrities', icon: 'lucide:star' },
  { title: 'Guestbook', path: '/messageboard', icon: 'lucide:message-circle' },
  { title: 'About Me', path: '/about', icon: 'lucide:user' },
]

// Shuffle and pick 5
const shuffled = [...allPages]
for (let i = shuffled.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
}
const guessLikePages = shuffled.slice(0, 5)

const socialLinks = [
  { icon: 'ri:github-fill', href: 'https://github.com/leguan7', label: 'github.com/leguan7', color: 'hover:bg-[#333]' },
  { icon: 'lucide:mail', href: 'mailto:leguan701@gmail.com', label: 'leguan701@gmail.com', color: 'hover:bg-gradient-to-br hover:from-orange-500 hover:to-pink-500' },
  { icon: 'ri:qq-fill', href: '#', label: '1944553927', isQQ: true, color: 'hover:bg-[#12B7F5]' },
  { icon: 'lucide:message-circle', href: '/messageboard', label: 'Guestbook', isRouter: true, color: 'hover:bg-[#7CB342]' },
]

onMounted(() => {
  setTimeout(() => { isVisible.value = true }, 80)
  updateRuntime()
  runTimer = setInterval(updateRuntime, 1000)
})

onUnmounted(() => {
  if (runTimer) clearInterval(runTimer)
})
</script>

<template>
  <footer class="relative mt-8">
    <!-- Semi-transparent Overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 backdrop-blur-sm"></div>
    
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white/90">
      <!-- Three-column layout -->
      <div 
        class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 footer-item"
        :class="{ 'animate-in': isVisible }"
        :style="{ animationDelay: '0ms' }"
      >
        <!-- Left: Quote -->
        <div>
          <h4 class="text-sm font-bold text-white/80 mb-3">Quote</h4>
          <p class="text-white/50 text-sm italic leading-relaxed">
            "Don't compare your life with others. There's no comparison between the sun and the moon. They shine when it's their time."
          </p>
        </div>

        <!-- Center: Guess You Like (two columns) -->
        <div>
          <h4 class="text-sm font-bold text-white/80 mb-3">Guess You Like</h4>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <router-link
              v-for="page in guessLikePages"
              :key="page.path"
              :to="page.path"
              class="text-sm text-white/50 hover:text-[#7CB342] transition-colors leading-relaxed"
            >
              {{ page.title }}
            </router-link>
          </div>
        </div>

        <!-- Right: Social + Contact -->
        <div>
          <h4 class="text-sm font-bold text-white/80 mb-3">Contact</h4>
          <div class="flex items-center gap-2 mb-4">
            <template v-for="(link, index) in socialLinks" :key="index">
              <!-- QQ -->
              <span
                v-if="link.isQQ"
                class="group relative w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                :class="link.color"
              >
                <Icon :icon="link.icon" class="w-4.5 h-4.5" />
                <span class="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-gray-800 text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {{ link.label }}
                  <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></span>
                </span>
              </span>
              <!-- Router Link -->
              <router-link
                v-else-if="link.isRouter"
                :to="link.href"
                class="group relative w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                :class="link.color"
              >
                <Icon :icon="link.icon" class="w-4.5 h-4.5" />
                <span class="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-gray-800 text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {{ link.label }}
                  <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></span>
                </span>
              </router-link>
              <!-- External -->
              <a
                v-else
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="group relative w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                :class="link.color"
              >
                <Icon :icon="link.icon" class="w-4.5 h-4.5" />
                <span class="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-gray-800 text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {{ link.label }}
                  <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></span>
                </span>
              </a>
            </template>
          </div>
        </div>
      </div>

      <!-- Runtime -->
      <div 
        class="text-center py-4 border-t border-white/10 footer-item"
        :class="{ 'animate-in': isVisible }"
        :style="{ animationDelay: '100ms' }"
      >
        <p class="flex items-center justify-center text-sm text-white/50 mb-2">
          Site has been running for
          <span class="text-[#7CB342] font-bold mx-1">{{ runDays }}</span> days
          <span class="text-[#7CB342] font-bold mx-1">{{ runHours }}</span> hours
          <span class="text-[#7CB342] font-bold mx-1">{{ runMinutes }}</span> min
          <span class="text-[#7CB342] font-bold mx-1">{{ runSeconds }}</span> sec
        </p>
      </div>

      <!-- Copyright -->
      <div 
        class="text-center text-sm text-white/40 space-y-2 pt-4 footer-item"
        :class="{ 'animate-in': isVisible }"
        :style="{ animationDelay: '200ms' }"
      >
        <p class="flex items-center justify-center">
          <Icon icon="lucide:copyright" class="w-3.5 h-3.5 mr-1.5" />
          2025 - {{ currentYear }} By 
          <span class="text-[#7CB342] ml-1 font-medium">Leguan</span>
        </p>
        <p class="flex items-center justify-center space-x-1.5">
          <span>Powered by</span>
          <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-[#42b883] hover:underline">
            <Icon icon="logos:vue" class="w-4 h-4 mr-0.5" />
            Vue
          </a>
          <span>&</span>
          <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-[#646cff] hover:underline">
            <Icon icon="logos:vitejs" class="w-4 h-4 mr-0.5" />
            Vite
          </a>
        </p>
        <p class="flex items-center justify-center text-xs text-white/30 mt-1">
          <Icon icon="lucide:heart" class="w-3 h-3 mr-1 text-red-500 animate-pulse" />
          Thanks for visiting
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-item {
  opacity: 0;
  transform: scale(0.6);
  transform-origin: center center;
}

.footer-item.animate-in {
  animation: scaleUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes scaleUp {
  0% {
    opacity: 0;
    transform: scale(0.6);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
