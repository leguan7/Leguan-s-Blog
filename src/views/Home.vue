<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import PostCard from '@/components/PostCard.vue'
import Sidebar from '@/components/Sidebar.vue'

const blogStore = useBlogStore()

const currentPage = ref(1)
const postsPerPage = 6
const typedText = ref('')
const phrases = [
  'Digest your emotions',
  'No cross, no crown',
  "Don't let the past steal your present",
  "Stars can't shine without darkness",
  'Spend your life in your own way',
  "It's up to you how far you'll go",
  'I am not afraid of tomorrow for I have seen yesterday and love today'
]
let phraseIndex = 0
const cursorVisible = ref(true)

// Clock
const now = ref(new Date())
let clockTimer: ReturnType<typeof setInterval> | null = null

const clockTime = computed(() => {
  const h = now.value.getHours().toString().padStart(2, '0')
  const m = now.value.getMinutes().toString().padStart(2, '0')
  const s = now.value.getSeconds().toString().padStart(2, '0')
  return `${h}:${m}:${s}`
})

const clockDate = computed(() => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const d = now.value
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
})

// Analog clock hand angles
const hourAngle = computed(() => {
  const h = now.value.getHours() % 12
  const m = now.value.getMinutes()
  return h * 30 + m * 0.5 // 360/12=30 per hour, 0.5 per minute
})

const minuteAngle = computed(() => {
  const m = now.value.getMinutes()
  const s = now.value.getSeconds()
  return m * 6 + s * 0.1 // 360/60=6 per minute
})

const secondAngle = computed(() => {
  return now.value.getSeconds() * 6 // 360/60=6 per second
})


// Greeting — time-based with location
const visitorLocation = ref('')
const locationLoading = ref(true)
const LOCATION_CACHE_KEY = 'blog_location_cache'
const LOCATION_CACHE_TTL = 6 * 60 * 60 * 1000  // 6 hours

async function fetchLocation() {
  locationLoading.value = true
  // Check cache first
  try {
    const raw = localStorage.getItem(LOCATION_CACHE_KEY)
    if (raw) {
      const cached = JSON.parse(raw)
      if (cached.location && cached.ts && (Date.now() - cached.ts < LOCATION_CACHE_TTL)) {
        visitorLocation.value = cached.location
        locationLoading.value = false
        return
      }
    }
  } catch { /* ignore */ }

  try {
    const resp = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) })
    const data = await resp.json()
    if (data.error) throw new Error(data.reason)
    const parts = [data.city, data.region, data.country_name].filter(Boolean)
    const deduped = parts.filter((p: string, i: number) => i === 0 || p !== parts[i - 1])
    visitorLocation.value = deduped.join(', ')
    // Save to cache
    try {
      localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({ location: visitorLocation.value, ts: Date.now() }))
    } catch { /* ignore */ }
  } catch {
    visitorLocation.value = ''
  } finally {
    locationLoading.value = false
  }
}

const greeting = computed(() => {
  const h = now.value.getHours()
  if (h < 6) return {
    text: 'Night Owl Mode',
    icon: 'lucide:moon-star',
    emoji: '🌙',
    message: 'Burning the midnight oil? Remember to rest well. Grab a warm drink and enjoy some quiet reading.'
  }
  if (h < 12) return {
    text: 'Good Morning',
    icon: 'lucide:sunrise',
    emoji: '🌅',
    message: 'A brand new day begins! Start with something inspiring — a fresh article awaits you.'
  }
  if (h < 14) return {
    text: 'Good Afternoon',
    icon: 'lucide:sun',
    emoji: '☀️',
    message: 'Lunch break? Perfect time to browse through some posts and recharge your mind.'
  }
  if (h < 18) return {
    text: 'Good Afternoon',
    icon: 'lucide:cloud-sun',
    emoji: '🌤️',
    message: 'The afternoon is rolling along. Take a break, explore something new, and enjoy the journey.'
  }
  if (h < 22) return {
    text: 'Good Evening',
    icon: 'lucide:sunset',
    emoji: '🌇',
    message: 'Wind down your day with some light reading. There\'s always something interesting to discover.'
  }
  return {
    text: 'Night Owl Mode',
    icon: 'lucide:moon-star',
    emoji: '🌙',
    message: 'Burning the midnight oil? Remember to rest well. Grab a warm drink and enjoy some quiet reading.'
  }
})

// Weather
type WeatherData = {
  temp: number; desc: string; icon: string;
  windDir: string; precipMM: string; aqi: string; aqiLevel: string
}
const WEATHER_CACHE_KEY = 'blog_weather_cache'
const WEATHER_CACHE_TTL = 30 * 60 * 1000  // 30 minutes
const AQI_CACHE_TTL = 60 * 60 * 1000      // 1 hour

const weather = ref<WeatherData | null>(null)
const weatherLoading = ref(true)
const weatherRefreshing = ref(false)

function loadWeatherCache(): { weather?: WeatherData; weatherTs?: number; aqiTs?: number } {
  try {
    const raw = localStorage.getItem(WEATHER_CACHE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveWeatherCache(data: WeatherData, weatherTs: number, aqiTs: number) {
  try {
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({ weather: data, weatherTs, aqiTs }))
  } catch { /* quota exceeded, ignore */ }
}

async function fetchWithRetry(url: string, retries = 2, timeout = 6000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const resp = await fetch(url, { signal: AbortSignal.timeout(timeout) })
      if (resp.ok) return resp
    } catch {
      if (i === retries - 1) throw new Error('Fetch failed after retries')
    }
    // Wait before retry (500ms, 1000ms...)
    await new Promise(r => setTimeout(r, (i + 1) * 500))
  }
  throw new Error('Fetch failed')
}

async function fetchWeather() {
  weatherLoading.value = true
  const cache = loadWeatherCache()
  const now = Date.now()

  // Use cache if still fresh
  if (cache.weather && cache.weatherTs && (now - cache.weatherTs < WEATHER_CACHE_TTL)) {
    weather.value = cache.weather
    weatherLoading.value = false
    // Refresh AQI in background if its cache expired
    if (!cache.aqiTs || (now - cache.aqiTs >= AQI_CACHE_TTL)) {
      refreshAqi(cache.weather, cache.weatherTs)
    }
    return
  }

  try {
    const resp = await fetchWithRetry('https://wttr.in/Nanshan,Shenzhen?format=j1')
    const data = await resp.json()
    const current = data.current_condition?.[0]
    if (current) {
      const weatherData: WeatherData = {
        temp: parseInt(current.temp_C),
        desc: current.weatherDesc?.[0]?.value || 'Unknown',
        icon: getWeatherIcon(parseInt(current.weatherCode)),
        windDir: current.winddir16Point || '',
        precipMM: current.precipMM || '0.0',
        aqi: cache.weather?.aqi || '--',
        aqiLevel: cache.weather?.aqiLevel || ''
      }
      weather.value = weatherData
      const weatherTs = now
      // Fetch AQI
      const aqiTs = await refreshAqi(weatherData, weatherTs)
      saveWeatherCache(weather.value, weatherTs, aqiTs || cache.aqiTs || 0)
    }
  } catch {
    // Network failed — fall back to stale cache if available
    if (cache.weather) {
      weather.value = cache.weather
    } else {
      weather.value = null
    }
  } finally {
    weatherLoading.value = false
  }
}

async function refreshAqi(weatherData: WeatherData, weatherTs: number): Promise<number> {
  try {
    const aqiResp = await fetchWithRetry(`https://api.waqi.info/feed/shenzhen/?token=${import.meta.env.VITE_AQI_TOKEN}`, 2, 5000)
    const aqiData = await aqiResp.json()
    if (aqiData.status === 'ok' && aqiData.data?.aqi) {
      const aqiVal = aqiData.data.aqi
      weatherData.aqi = String(aqiVal)
      weatherData.aqiLevel = getAqiLevel(aqiVal)
      if (weather.value) {
        weather.value.aqi = weatherData.aqi
        weather.value.aqiLevel = weatherData.aqiLevel
      }
      const aqiTs = Date.now()
      saveWeatherCache(weatherData, weatherTs, aqiTs)
      return aqiTs
    }
  } catch { /* AQI fetch failed, keep existing */ }
  return 0
}

async function refreshWeatherManual() {
  if (weatherRefreshing.value) return
  weatherRefreshing.value = true
  // Clear cache to force fresh fetch
  try { localStorage.removeItem(WEATHER_CACHE_KEY) } catch { /* ignore */ }
  await fetchWeather()
  weatherRefreshing.value = false
}

function getAqiLevel(aqi: number): string {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Moderate'
  if (aqi <= 150) return 'Unhealthy (S)'
  if (aqi <= 200) return 'Unhealthy'
  if (aqi <= 300) return 'Very Unhealthy'
  return 'Hazardous'
}

function getWeatherIcon(code: number): string {
  if (code === 113) return 'lucide:sun'
  if (code === 116) return 'lucide:cloud-sun'
  if (code === 119 || code === 122) return 'lucide:cloud'
  if ([176, 263, 266, 293, 296, 299, 302, 305, 308, 311, 314, 353, 356, 359].includes(code)) return 'lucide:cloud-rain'
  if ([200, 386, 389, 392, 395].includes(code)) return 'lucide:cloud-lightning'
  if ([227, 230, 323, 326, 329, 332, 335, 338, 368, 371, 374, 377].includes(code)) return 'lucide:cloud-snow'
  if ([143, 248, 260].includes(code)) return 'lucide:cloud-fog'
  return 'lucide:cloud'
}

// Typewriter effect - typing and deleting loop
onMounted(() => {
  // Start clock
  clockTimer = setInterval(() => {
    now.value = new Date()
  }, 1000)

  // Fetch weather & location
  fetchWeather()
  fetchLocation()

  let isTyping = true
  let charIndex = 0
  
  const runTypewriter = () => {
    const currentText = phrases[phraseIndex]
    if (isTyping) {
      // Typing phase
      if (charIndex < currentText.length) {
        typedText.value = currentText.substring(0, charIndex + 1)
        charIndex++
        setTimeout(runTypewriter, 100)
      } else {
        // Typing complete, wait 1s then start deleting
        isTyping = false
        setTimeout(runTypewriter, 1000)
      }
    } else {
      // Deleting phase
      if (charIndex > 0) {
        charIndex--
        typedText.value = currentText.substring(0, charIndex)
        setTimeout(runTypewriter, 60) // Slightly faster deletion
      } else {
        // Deletion complete, move to next phrase and wait 1s
        phraseIndex = (phraseIndex + 1) % phrases.length
        isTyping = true
        setTimeout(runTypewriter, 1000)
      }
    }
  }
  
  // Start typewriter effect
  runTypewriter()

  // Cursor blinking
  setInterval(() => {
    cursorVisible.value = !cursorVisible.value
  }, 530)
})

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer)
})

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return blogStore.filteredPosts.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(blogStore.filteredPosts.length / postsPerPage)
)

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    document.getElementById('posts-section')?.scrollIntoView({ behavior: 'smooth' })
  }
}

watch(() => blogStore.searchQuery, () => {
  currentPage.value = 1
})

function scrollDown() {
  document.getElementById('posts-section')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div>
    <!-- Hero Banner -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <!-- Semi-transparent Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      
      <!-- Content -->
      <div class="relative text-center text-white z-10 px-4 hero-content">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl hero-title">
          Leguan's Blog
        </h1>
        
        <!-- Typewriter Effect -->
        <p class="text-xl md:text-2xl text-white/90 mb-2 drop-shadow-lg hero-subtitle">
          <span>{{ typedText }}</span>
          <span 
            class="typewriter-cursor"
            :class="{ 'opacity-0': !cursorVisible }"
          ></span>
        </p>
      </div>

      <!-- Scroll Down Arrow -->
      <button 
        @click="scrollDown"
        class="absolute bottom-10 left-1/2 -translate-x-1/2 text-white scroll-down-btn group"
      >
        <Icon icon="lucide:chevrons-down" class="w-8 h-8 drop-shadow-lg group-hover:scale-125 transition-transform" />
      </button>

      <!-- Wave Divider -->
      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path 
            d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" 
            fill="rgba(255,255,255,0.1)"
          />
          <path 
            d="M0,70 C150,100 350,30 600,70 C850,110 1050,30 1200,70 C1350,110 1440,70 1440,70 L1440,100 L0,100 Z" 
            fill="rgba(255,255,255,0.15)"
          />
        </svg>
      </div>
    </section>

    <!-- Search Results Tip -->
    <div 
      v-if="blogStore.searchQuery" 
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
    >
      <div class="card flex items-center justify-between px-5 py-3">
        <span class="text-[#7CB342] flex items-center">
          <Icon icon="lucide:search" class="w-4 h-4 mr-2" />
          Found {{ blogStore.filteredPosts.length }} posts for "<strong>{{ blogStore.searchQuery }}</strong>"
        </span>
        <button 
          @click="blogStore.setSearchQuery('')"
          class="text-gray-400 hover:text-[#D4A04D] transition-colors"
        >
          <Icon icon="lucide:x-circle" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Posts Section -->
    <section id="posts-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="lg:flex lg:gap-8">
        <!-- Posts List -->
        <div class="lg:w-2/3 space-y-6">
          <!-- Loading -->
          <div v-if="blogStore.isLoading" class="card p-16 text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#7CB342] border-t-transparent"></div>
            <p class="mt-4 text-gray-500">Loading...</p>
          </div>

          <!-- Empty -->
          <div v-else-if="blogStore.filteredPosts.length === 0" class="card p-16 text-center">
            <Icon icon="lucide:inbox" class="w-20 h-20 text-gray-400 dark:text-gray-500 mx-auto" />
            <p class="mt-4 text-gray-500">No posts yet</p>
          </div>

          <!-- Posts - Alternating Layout -->
          <template v-else>
            <PostCard 
              v-for="(post, index) in paginatedPosts" 
              :key="post.slug" 
              :post="post" 
              :layout="index % 2 === 0 ? 'left' : 'right'"
              :index="index"
            />
          </template>

          <!-- Pagination -->
          <nav v-if="totalPages > 1" class="flex justify-center items-center space-x-1 pt-6">
            <button 
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              :class="currentPage === 1 ? '' : 'card hover:bg-[#7CB342] hover:text-white'"
            >
              <Icon icon="lucide:chevron-left" class="w-4 h-4" />
            </button>

            <template v-for="page in totalPages" :key="page">
              <button 
                v-if="page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)"
                @click="goToPage(page)"
                class="w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all duration-300"
                :class="page === currentPage 
                  ? 'bg-[#7CB342] text-white shadow-lg shadow-[#7CB342]/30' 
                  : 'card hover:bg-[#7CB342] hover:text-white'"
              >
                {{ page }}
              </button>
              <span 
                v-else-if="page === currentPage - 2 || page === currentPage + 2"
                class="w-10 h-10 flex items-center justify-center text-gray-400"
              >
                ...
              </span>
            </template>

            <button 
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              :class="currentPage === totalPages ? '' : 'card hover:bg-[#7CB342] hover:text-white'"
            >
              <Icon icon="lucide:chevron-right" class="w-4 h-4" />
            </button>
          </nav>

          <!-- Info Bar -->
          <div class="info-bar mt-10 rounded-2xl p-5 backdrop-blur-xl">
            <!-- Header — centered -->
            <div class="text-center mb-5 pb-3 border-b border-white/20 dark:border-gray-600/30">
              <h3 class="font-bold text-gray-800 dark:text-white text-lg tracking-wide">Info Bar</h3>
            </div>

            <!-- Widget Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <!-- Welcome Card -->
              <div class="neu-clock-card p-4 rounded-2xl group transition-all duration-300">
                <div class="text-center mb-3">
                  <div class="neu-icon-circle w-11 h-11 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Icon icon="lucide:hand" class="w-5 h-5 text-[#7CB342]" />
                  </div>
                  <h4 class="font-bold text-gray-600 dark:text-gray-300 text-sm leading-normal">Welcome</h4>
                  <p class="text-xs text-[#7CB342] dark:text-[#9CCC65] mt-0.5">{{ greeting.text }}</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 leading-normal mt-0.5">
                    <template v-if="locationLoading">
                      <span class="inline-block w-20 h-3 bg-gray-300/50 dark:bg-gray-600 rounded animate-pulse"></span>
                    </template>
                    <template v-else-if="visitorLocation">
                      Welcome from {{ visitorLocation }}
                    </template>
                    <template v-else>Welcome to Leguan's Blog</template>
                  </p>
                </div>
                <div class="neu-inset p-2.5 rounded-xl">
                  <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed text-center">
                    {{ greeting.message }}
                  </p>
                </div>
                <div class="flex items-center justify-center gap-4 mt-3 pt-2.5 border-t border-gray-300/30 dark:border-gray-600/20 text-xs text-gray-400 dark:text-gray-500">
                  <div class="flex flex-col items-center">
                    <span class="font-bold text-sm text-gray-600 dark:text-gray-300">{{ blogStore.posts.length }}</span>
                    <span>posts</span>
                  </div>
                  <span class="text-gray-300 dark:text-gray-600">|</span>
                  <div class="flex flex-col items-center">
                    <span class="font-bold text-sm text-gray-600 dark:text-gray-300">{{ blogStore.allTags.length }}</span>
                    <span>tags</span>
                  </div>
                  <span class="text-gray-300 dark:text-gray-600">|</span>
                  <div class="flex flex-col items-center">
                    <span class="font-bold text-sm text-gray-600 dark:text-gray-300">{{ blogStore.allCategories.length }}</span>
                    <span>categories</span>
                  </div>
                </div>
              </div>

              <!-- Clock Card (Neumorphism) -->
              <div class="neu-clock-card p-4 rounded-2xl group transition-all duration-300">
                <!-- Icon & Title -->
                <div class="text-center mb-2">
                  <div class="neu-icon-circle w-11 h-11 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Icon icon="lucide:clock-3" class="w-5 h-5 text-[#9C27B0]" />
                  </div>
                  <h4 class="font-bold text-gray-600 dark:text-gray-300 text-sm leading-normal">Clock</h4>
                </div>
                <!-- Analog Clock -->
                <div class="flex justify-center py-1">
                  <div class="neu-clock-face">
                    <svg viewBox="0 0 200 200" class="w-full h-full">
                      <!-- Hour tick marks -->
                      <line v-for="i in 12" :key="'h'+i"
                        :x1="100 + 78 * Math.sin(i * 30 * Math.PI / 180)"
                        :y1="100 - 78 * Math.cos(i * 30 * Math.PI / 180)"
                        :x2="100 + 86 * Math.sin(i * 30 * Math.PI / 180)"
                        :y2="100 - 86 * Math.cos(i * 30 * Math.PI / 180)"
                        class="neu-tick-major"
                        stroke-width="2" stroke-linecap="round"
                      />

                      <!-- Minute tick marks -->
                      <line v-for="i in 60" :key="'m'+i"
                        v-show="i % 5 !== 0"
                        :x1="100 + 82 * Math.sin(i * 6 * Math.PI / 180)"
                        :y1="100 - 82 * Math.cos(i * 6 * Math.PI / 180)"
                        :x2="100 + 86 * Math.sin(i * 6 * Math.PI / 180)"
                        :y2="100 - 86 * Math.cos(i * 6 * Math.PI / 180)"
                        class="neu-tick-minor"
                        stroke-width="1" stroke-linecap="round"
                      />

                      <!-- Hour numbers: 12, 3, 6, 9 -->
                      <text v-for="i in [12, 3, 6, 9]" :key="'n'+i"
                        :x="100 + 66 * Math.sin(i * 30 * Math.PI / 180)"
                        :y="100 - 66 * Math.cos(i * 30 * Math.PI / 180) + 5.5"
                        text-anchor="middle" font-size="16" font-weight="600"
                        class="neu-number"
                      >{{ i }}</text>

                      <!-- Hour hand -->
                      <line x1="100" y1="100"
                        :x2="100 + 46 * Math.sin(hourAngle * Math.PI / 180)"
                        :y2="100 - 46 * Math.cos(hourAngle * Math.PI / 180)"
                        class="neu-hand-hour" stroke-width="5" stroke-linecap="round"
                      />

                      <!-- Minute hand -->
                      <line x1="100" y1="100"
                        :x2="100 + 62 * Math.sin(minuteAngle * Math.PI / 180)"
                        :y2="100 - 62 * Math.cos(minuteAngle * Math.PI / 180)"
                        class="neu-hand-minute" stroke-width="3" stroke-linecap="round"
                      />

                      <!-- Second hand -->
                      <line x1="100" y1="100"
                        :x2="100 + 70 * Math.sin(secondAngle * Math.PI / 180)"
                        :y2="100 - 70 * Math.cos(secondAngle * Math.PI / 180)"
                        class="neu-hand-second" stroke-width="1.5" stroke-linecap="round"
                      />

                      <!-- Center dot -->
                      <circle cx="100" cy="100" r="5" class="neu-center-dot" />
                      <circle cx="100" cy="100" r="2.5" class="neu-center-inner" />
                    </svg>
                  </div>
                </div>

                <!-- Digital time + date -->
                <div class="text-center mt-2">
                  <div class="text-base font-bold tracking-wider text-gray-500 dark:text-gray-400 clock-digits">
                    {{ clockTime }}
                  </div>
                  <p class="text-xs text-gray-400 dark:text-gray-500 leading-normal">{{ clockDate }}</p>
                </div>
              </div>

              <!-- Weather Card -->
              <div class="neu-clock-card p-4 rounded-2xl group transition-all duration-300">
                <div class="text-center mb-3">
                  <div class="neu-icon-circle w-11 h-11 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Icon icon="lucide:cloud-sun" class="w-5 h-5 text-[#4a6cf7]" />
                  </div>
                  <h4 class="font-bold text-gray-600 dark:text-gray-300 text-sm leading-normal">Weather</h4>
                </div>

                <!-- Loading -->
                <div v-if="weatherLoading" class="text-center py-4">
                  <div class="neu-inset rounded-xl p-4 inline-flex">
                    <Icon icon="lucide:loader-2" class="w-7 h-7 animate-spin text-[#4a6cf7]" />
                  </div>
                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">Fetching...</p>
                </div>

                <!-- Weather Data -->
                <div v-else-if="weather">
                  <!-- Main temp -->
                  <div class="neu-inset rounded-xl p-3 mb-3">
                    <div class="flex items-center justify-center space-x-3">
                      <Icon :icon="weather.icon" class="w-10 h-10 text-[#4a6cf7]" />
                      <div class="text-left">
                        <div class="text-3xl font-bold text-gray-600 dark:text-gray-300">{{ weather.temp }}°C</div>
                        <p class="text-xs text-gray-400 dark:text-gray-500 leading-normal">{{ weather.desc }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Detail grid -->
                  <div class="grid grid-cols-2 gap-2 mb-3">
                    <div class="neu-inset rounded-lg px-2.5 py-2 text-center">
                      <p class="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Wind</p>
                      <p class="text-sm font-bold text-gray-600 dark:text-gray-300 mt-0.5">{{ weather.windDir }}</p>
                    </div>
                    <div class="neu-inset rounded-lg px-2.5 py-2 text-center">
                      <p class="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Precip</p>
                      <p class="text-sm font-bold text-gray-600 dark:text-gray-300 mt-0.5">{{ weather.precipMM }} mm</p>
                    </div>
                    <div class="neu-inset rounded-lg px-2.5 py-2 text-center">
                      <p class="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Air Quality</p>
                      <p class="text-sm font-bold text-gray-600 dark:text-gray-300 mt-0.5">{{ weather.aqi }} <span v-if="weather.aqiLevel" class="text-[10px] font-normal text-gray-400">{{ weather.aqiLevel }}</span></p>
                    </div>
                    <div class="neu-inset rounded-lg px-2.5 py-2 text-center">
                      <p class="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">District</p>
                      <p class="text-sm font-bold text-gray-600 dark:text-gray-300 mt-0.5">Nanshan</p>
                    </div>
                  </div>

                  <!-- Location & Refresh -->
                  <div class="flex items-center justify-center gap-1.5">
                    <p class="text-xs text-gray-400 dark:text-gray-500">Shenzhen · Blogger's Location</p>
                    <button @click="refreshWeatherManual" class="text-gray-400 dark:text-gray-500 hover:text-[#7CB342] dark:hover:text-[#9CCC65] transition-colors" title="Refresh">
                      <Icon icon="lucide:refresh-cw" class="w-3 h-3" :class="{ 'animate-spin': weatherRefreshing }" />
                    </button>
                  </div>
                </div>

                <!-- Fallback -->
                <div v-else class="text-center py-3">
                  <div class="neu-inset rounded-xl p-4 inline-flex mb-2">
                    <Icon icon="lucide:cloud-off" class="w-7 h-7 text-gray-400 dark:text-gray-600" />
                  </div>
                  <p class="text-xs text-gray-400 dark:text-gray-500">Unavailable</p>
                  <button @click="fetchWeather" class="text-xs text-[#7CB342] hover:underline mt-1">Retry</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:w-1/3 mt-8 lg:mt-0">
          <Sidebar />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Hero Animations */
.hero-title {
  animation: fade-in-up 1.4s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: center center;
}

.hero-subtitle {
  animation: fade-in-up 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
  transform-origin: center center;
}

.scroll-down-btn {
  animation: bounce-gentle 2s infinite;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce-gentle {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
  }
}

/* Info Bar — outer wrapper (glass) */
.info-bar {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  animation: widgetFadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
}

:global(.dark) .info-bar {
  background: rgba(18, 18, 18, 0.8);
}

/* Neumorphism inset (for content areas) */
.neu-inset {
  background: #e0e5ec;
  box-shadow:
    inset 3px 3px 6px rgba(163, 170, 180, 0.5),
    inset -3px -3px 6px rgba(255, 255, 255, 0.8);
}

:global(.dark) .neu-inset {
  background: #2a2d35;
  box-shadow:
    inset 3px 3px 6px rgba(0, 0, 0, 0.4),
    inset -3px -3px 6px rgba(55, 60, 70, 0.25);
}

/* Neumorphism icon circle */
.neu-icon-circle {
  background: #e0e5ec;
  box-shadow:
    4px 4px 8px rgba(163, 170, 180, 0.5),
    -4px -4px 8px rgba(255, 255, 255, 0.8),
    inset 1px 1px 2px rgba(255, 255, 255, 0.5),
    inset -1px -1px 2px rgba(163, 170, 180, 0.2);
  transition: box-shadow 0.3s;
}

.group:hover .neu-icon-circle {
  box-shadow:
    inset 3px 3px 6px rgba(163, 170, 180, 0.5),
    inset -3px -3px 6px rgba(255, 255, 255, 0.8);
}

:global(.dark) .neu-icon-circle {
  background: #2a2d35;
  box-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.4),
    -4px -4px 8px rgba(55, 60, 70, 0.25),
    inset 1px 1px 2px rgba(55, 60, 70, 0.15),
    inset -1px -1px 2px rgba(0, 0, 0, 0.2);
}

:global(.dark) .group:hover .neu-icon-circle {
  box-shadow:
    inset 3px 3px 6px rgba(0, 0, 0, 0.4),
    inset -3px -3px 6px rgba(55, 60, 70, 0.25);
}

@keyframes widgetFadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Clock digits monospace */
.clock-digits {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
}

/* Neumorphism clock card */
.neu-clock-card {
  background: #e0e5ec;
  border: none;
  box-shadow:
    8px 8px 16px rgba(163, 170, 180, 0.5),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
  transition: box-shadow 0.3s, transform 0.3s;
}

.neu-clock-card:hover {
  box-shadow:
    10px 10px 20px rgba(163, 170, 180, 0.55),
    -10px -10px 20px rgba(255, 255, 255, 0.85);
}

:global(.dark) .neu-clock-card {
  background: #2a2d35;
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.4),
    -8px -8px 16px rgba(55, 60, 70, 0.3);
}

:global(.dark) .neu-clock-card:hover {
  box-shadow:
    10px 10px 20px rgba(0, 0, 0, 0.45),
    -10px -10px 20px rgba(55, 60, 70, 0.35);
}

/* Neumorphism clock face */
.neu-clock-face {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: #e0e5ec;
  box-shadow:
    6px 6px 14px rgba(163, 170, 180, 0.6),
    -6px -6px 14px rgba(255, 255, 255, 0.9),
    inset 2px 2px 5px rgba(255, 255, 255, 0.6),
    inset -2px -2px 5px rgba(163, 170, 180, 0.3);
  padding: 4px;
  transition: box-shadow 0.4s;
}

:global(.dark) .neu-clock-face {
  background: #2a2d35;
  box-shadow:
    6px 6px 14px rgba(0, 0, 0, 0.5),
    -6px -6px 14px rgba(55, 60, 70, 0.25),
    inset 2px 2px 5px rgba(55, 60, 70, 0.2),
    inset -2px -2px 5px rgba(0, 0, 0, 0.3);
}

/* Tick marks */
.neu-tick-major {
  stroke: #8a919c;
}

.neu-tick-minor {
  stroke: #b0b7c3;
}

:global(.dark) .neu-tick-major {
  stroke: #6b7280;
}

:global(.dark) .neu-tick-minor {
  stroke: #4b5563;
}

/* Numbers */
.neu-number {
  fill: #6b7280;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

:global(.dark) .neu-number {
  fill: #9ca3af;
}

/* Hands */
.neu-hand-hour {
  stroke: #2d3142;
  filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.15));
}

.neu-hand-minute {
  stroke: #9C27B0;
  filter: drop-shadow(1px 1px 2px rgba(156,39,176,0.2));
}

.neu-hand-second {
  stroke: #f43f7a;
  filter: drop-shadow(0 0 3px rgba(244,63,122,0.3));
}

:global(.dark) .neu-hand-hour {
  stroke: #d1d5db;
}

:global(.dark) .neu-hand-minute {
  stroke: #6b8cff;
}

:global(.dark) .neu-hand-second {
  stroke: #f76e9e;
}

/* Center dot */
.neu-center-dot {
  fill: #9C27B0;
  filter: drop-shadow(0 1px 3px rgba(156,39,176,0.4));
}

.neu-center-inner {
  fill: #e0e5ec;
}

:global(.dark) .neu-center-dot {
  fill: #6b8cff;
}

:global(.dark) .neu-center-inner {
  fill: #2a2d35;
}
</style>
