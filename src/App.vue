<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'
import ParticleLines from '@/components/ParticleLines.vue'
import { useBlogStore } from '@/stores/blog'
import { IMAGES, COVER_IMAGES, getAssetUrl, getCoverImage } from '@/utils/assets'

const route = useRoute()
const blogStore = useBlogStore()
const showScrollTop = ref(false)
const scrollPercent = ref(0)
const isLoading = ref(true)
const loadProgress = ref(0)

// Custom cursor
const cursorRef = ref<HTMLElement | null>(null)

function onCursorMove(e: PointerEvent) {
  if (cursorRef.value) {
    cursorRef.value.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
    cursorRef.value.style.opacity = '1'
  }
}

function onCursorLeave() {
  if (cursorRef.value) cursorRef.value.style.opacity = '0'
}

function onCursorEnter() {
  if (cursorRef.value) cursorRef.value.style.opacity = '1'
}

// Collect all image URLs to preload (static + post covers, deduplicated)
function collectAllImages(): string[] {
  // All static images from IMAGES object (background, avatar, covers, bangumi, movies, games, TV, celebrities, albums...)
  const allStatic = Object.values(IMAGES) as string[]
  // Cover image pool
  const coverPool = [...COVER_IMAGES]
  // Post card covers
  const postCovers = blogStore.posts.map(post =>
    post.cover ? getAssetUrl(post.cover) : getCoverImage(post.slug)
  )
  return [...new Set([...allStatic, ...coverPool, ...postCovers])]
}

// Preload a list of image URLs
function preloadImages(urls: string[]): Promise<void> {
  return new Promise((resolve) => {
    const total = urls.length
    if (total === 0) { resolve(); return }
    let loaded = 0
    urls.forEach((src) => {
      const img = new Image()
      const onDone = () => { loaded++; if (loaded >= total) resolve() }
      img.onload = onDone
      img.onerror = onDone
      img.src = src
    })
  })
}

// Animate progress from 0 to 100 over the given duration (ms)
function animateProgress(duration: number): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now()
    function tick() {
      const elapsed = performance.now() - start
      const ratio = Math.min(elapsed / duration, 1)
      // smoothstep curve for smoother feel
      loadProgress.value = Math.round(ratio * ratio * (3 - 2 * ratio) * 100)
      if (ratio < 1) {
        requestAnimationFrame(tick)
      } else {
        loadProgress.value = 100
        resolve()
      }
    }
    requestAnimationFrame(tick)
  })
}

// Check if on homepage
const isHome = computed(() => route.path === '/')

// Use requestAnimationFrame to optimize scroll performance
let ticking = false
function handleScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      showScrollTop.value = window.scrollY > 300
      
      // Calculate scroll percentage
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      scrollPercent.value = Math.round((scrollTop / docHeight) * 100) || 0
      
      ticking = false
    })
    ticking = true
  }
}

// Click firework effect
function createClickEffect(e: MouseEvent) {
  const colors = ['#D4A04D', '#7CB342', '#ffc107', '#e91e63', '#4caf50']
  const particles = 6
  
  for (let i = 0; i < particles; i++) {
    const particle = document.createElement('div')
    particle.className = 'click-particle'
    particle.style.cssText = `
      position: fixed;
      pointer-events: none;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      z-index: 9999;
      animation: particle-${i} 0.6s ease-out forwards;
    `
    document.body.appendChild(particle)
    
    // Dynamically create animation
    const angle = (i / particles) * 360
    const distance = 30 + Math.random() * 20
    const style = document.createElement('style')
    style.textContent = `
      @keyframes particle-${i} {
        to {
          transform: translate(${Math.cos(angle * Math.PI / 180) * distance}px, ${Math.sin(angle * Math.PI / 180) * distance}px) scale(0);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
    
    setTimeout(() => {
      particle.remove()
      style.remove()
    }, 600)
  }
}

// Generate circular favicon from image
function setCircleFavicon(src: string, size = 64) {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // Clip to circle
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    // Draw image covering the circle (center crop)
    const scale = Math.max(size / img.width, size / img.height)
    const w = img.width * scale
    const h = img.height * scale
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)
    // Set as favicon
    const link = document.querySelector("link[rel='icon']") as HTMLLinkElement
      || document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/png'
    link.href = canvas.toDataURL('image/png')
    document.head.appendChild(link)
  }
  img.src = src
}

// Background preload Memory page original photos (sequential, non-blocking)
function preloadMemoryPhotos() {
  const dirs: [string, number[]][] = [
    ['xiamen', [1,2,3,4,5,6]],
    ['wuhan', [7,8,9,10,11,12,13,14,15,16]],
    ["xi'an", [17,18,19,20,21,22,23,24,25]],
    ['nanjing', [26,27,28,29,30,31,32,33]],
    ['hangzhou', Array.from({ length: 19 }, (_, i) => i + 34)],
    ['suzhou', Array.from({ length: 10 }, (_, i) => i + 53)],
    ['shenzhen', Array.from({ length: 10 }, (_, i) => i + 63)],
    ['soulpowerⅡ', Array.from({ length: 8 }, (_, i) => i + 73)],
  ]
  const urls = dirs.flatMap(([dir, ids]) =>
    ids.map(n => getAssetUrl(`/img/album/${dir}/${n}.jpg`))
  )
  let idx = 0
  function loadNext() {
    if (idx >= urls.length) return
    const img = new Image()
    img.onload = img.onerror = () => {
      idx++
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(loadNext)
      } else {
        setTimeout(loadNext, 50)
      }
    }
    img.src = urls[idx]
  }
  // Small delay so initial page rendering settles first
  setTimeout(loadNext, 1000)
}

onMounted(async () => {
  blogStore.initTheme()

  // Set circular favicon
  setCircleFavicon(getAssetUrl('/img-backup/about-bg.jpg'))

  // Use passive option to optimize scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // Click effect
  document.addEventListener('click', createClickEffect)

  // Custom cursor: only enable on devices with a mouse (not touch-only)
  const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (hasPointer) {
    document.documentElement.classList.add('has-custom-cursor')
    document.addEventListener('pointermove', onCursorMove)
    document.addEventListener('mouseleave', onCursorLeave)
    document.addEventListener('mouseenter', onCursorEnter)
  }
  
  // 1. Load posts data first so we know their cover URLs
  await blogStore.loadPosts()

  // 2. Collect all images: static (all pages) + post covers (deduplicated)
  const allUrls = collectAllImages()

  // 3. Preload all images + smooth progress animation (at least 2s, max 4s)
  const maxTime = new Promise(resolve => setTimeout(resolve, 4000))
  await Promise.race([
    Promise.all([preloadImages(allUrls), animateProgress(2000)]),
    maxTime
  ])
  loadProgress.value = 100
  isLoading.value = false

  // 4. Background preload: Memory page original photos (non-blocking, sequential)
  preloadMemoryPhotos()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', createClickEffect)
  document.removeEventListener('pointermove', onCursorMove)
  document.removeEventListener('mouseleave', onCursorLeave)
  document.removeEventListener('mouseenter', onCursorEnter)
  document.documentElement.classList.remove('has-custom-cursor')
})

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <!-- Custom Cursor (desktop only) -->
  <div ref="cursorRef" class="curzr-arrow" aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="28" height="28">
      <path d="M25,30a5.82,5.82,0,0,1-1.09-.17l-.2-.07-7.36-3.48a.72.72,0,0,0-.35-.08.78.78,0,0,0-.33.07L8.24,29.54a.66.66,0,0,1-.2.06,5.17,5.17,0,0,1-1,.15,3.6,3.6,0,0,1-3.29-5L12.68,4.2a3.59,3.59,0,0,1,6.58,0l9,20.74A3.6,3.6,0,0,1,25,30Z" fill="#F2F5F8"/>
      <path d="M16,3A2.59,2.59,0,0,1,18.34,4.6l9,20.74A2.59,2.59,0,0,1,25,29a5.42,5.42,0,0,1-.86-.15l-7.37-3.48a1.84,1.84,0,0,0-.77-.17,1.69,1.69,0,0,0-.73.16l-7.4,3.31a5.89,5.89,0,0,1-.79.12,2.59,2.59,0,0,1-2.37-3.62L13.6,4.6A2.58,2.58,0,0,1,16,3m0-2h0A4.58,4.58,0,0,0,11.76,3.8L2.84,24.33A4.58,4.58,0,0,0,7,30.75a6.08,6.08,0,0,0,1.21-.17,1.87,1.87,0,0,0,.4-.13L16,27.18l7.29,3.44a1.64,1.64,0,0,0,.39.14A6.37,6.37,0,0,0,25,31a4.59,4.59,0,0,0,4.21-6.41l-9-20.75A4.62,4.62,0,0,0,16,1Z" fill="#111920"/>
    </svg>
  </div>

  <!-- Loading Screen -->
  <transition name="loading-fade">
    <div v-if="isLoading" class="loading-screen">
      <div class="loading-content">
        <img :src="getAssetUrl('/img/loading.gif')" alt="Loading" class="loading-gif" />
        <!-- Progress bar -->
        <div class="loading-progress-track">
          <div class="loading-progress-fill" :style="{ width: loadProgress + '%' }"></div>
        </div>
        <p class="loading-text">Loading {{ loadProgress }}%</p>
      </div>
    </div>
  </transition>

  <!-- Fixed background image -->
  <div 
    class="fixed inset-0 -z-10 fixed-bg"
    :style="{ backgroundImage: `url(${IMAGES.background})` }"
  >
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20 dark:to-black/30"></div>
  </div>

  <!-- Particle lines mouse effect -->
  <ParticleLines />
  
  <div class="min-h-screen flex flex-col relative">
    <Navbar />
    
    <main class="flex-1">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>
    
    <Footer />

    <!-- Right side fixed button group -->
    <div class="rightside-buttons">
      <!-- Music Player -->
      <MusicPlayer />

      <!-- Dark mode toggle (temporarily hidden) -->
      <!-- <button 
        @click.stop="blogStore.toggleTheme"
        :title="blogStore.isDark ? 'Light Mode' : 'Dark Mode'"
        class="group"
      >
        <Icon 
          :icon="blogStore.isDark ? 'lucide:sun' : 'lucide:moon'" 
          class="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" 
        />
      </button> -->
      
      <!-- Back to top + percentage -->
      <transition name="slide-up">
        <button 
          v-if="showScrollTop"
          @click.stop="scrollToTop"
          title="Back to Top"
          class="relative group"
        >
          <Icon icon="lucide:arrow-up" class="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold">
            {{ scrollPercent }}%
          </span>
        </button>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* ====== Custom Cursor ====== */
.curzr-arrow {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 2147483647;
  user-select: none;
  will-change: transform;
  opacity: 0;
  transition: opacity 0.15s;
}

.curzr-arrow svg {
  display: block;
  margin-left: -14px;
  margin-top: -2px;
  transform: rotate(-30deg);
  transform-origin: 14px 2px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.18));
}

/* Hide default cursor globally when custom cursor is active */
:global(.has-custom-cursor),
:global(.has-custom-cursor *),
:global(.has-custom-cursor *::before),
:global(.has-custom-cursor *::after) {
  cursor: none !important;
}

/* ====== Loading Screen ====== */
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e8eedf 0%, #dce6d0 50%, #e2ead6 100%);
}

:global(.dark) .loading-screen {
  background: linear-gradient(135deg, #111122 0%, #0e1a2e 50%, #111122 100%);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* Loading gif */
.loading-gif {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

/* Progress bar */
.loading-progress-track {
  width: 200px;
  height: 6px;
  border-radius: 3px;
  background: rgba(124, 179, 66, 0.12);
  overflow: hidden;
}

:global(.dark) .loading-progress-track {
  background: rgba(124, 179, 66, 0.15);
}

.loading-progress-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #7CB342, #9CCC65);
}

.loading-text {
  font-size: 12px;
  color: #999;
  letter-spacing: 0.5px;
}

:global(.dark) .loading-text {
  color: #666;
}

/* Loading fade-out transition */
.loading-fade-leave-active {
  transition: opacity 0.5s ease;
}

.loading-fade-leave-to {
  opacity: 0;
}

/* Page transition animation */
.page-enter-active {
  animation: page-in 0.4s ease-out;
}

.page-leave-active {
  animation: page-out 0.3s ease-in;
}

@keyframes page-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes page-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

/* Button slide-in animation */
.slide-up-enter-active {
  animation: slide-up-in 0.3s ease-out;
}

.slide-up-leave-active {
  animation: slide-up-out 0.3s ease-in;
}

@keyframes slide-up-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slide-up-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
}
</style>
