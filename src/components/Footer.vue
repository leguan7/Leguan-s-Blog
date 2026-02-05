<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import QQModal from '@/components/QQModal.vue'

const currentYear = new Date().getFullYear()
const isVisible = ref(false)
const showQQModal = ref(false)

const footerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // Observe footer entering viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isVisible.value) {
          isVisible.value = true
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  )
  
  if (footerRef.value) {
    observer.observe(footerRef.value)
  }
})

const socialLinks = [
  { icon: 'ri:github-fill', href: 'https://github.com/leguan7', label: 'GitHub', color: 'hover:bg-[#333]' },
  { icon: 'lucide:mail', href: 'mailto:leguan701@gmail.com', label: 'leguan701@gmail.com', color: 'hover:bg-gradient-to-br hover:from-orange-500 hover:to-pink-500' },
  { icon: 'ri:qq-fill', href: '#', label: 'QQ', isModal: true, color: 'hover:bg-[#12B7F5]' },
  { icon: 'lucide:message-circle', href: '/messageboard', label: 'Guestbook', isRouter: true, color: 'hover:bg-[#7CB342]' },
]
</script>

<template>
  <footer ref="footerRef" class="relative mt-8">
    <!-- Semi-transparent Overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 backdrop-blur-sm"></div>
    
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white/90">
      <div class="flex flex-col items-center space-y-6">
        <!-- Logo & Slogan -->
        <div 
          class="text-center footer-item"
          :class="{ 'animate-in': isVisible }"
          :style="{ animationDelay: '0ms' }"
        >
          <div class="flex items-center justify-center mb-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7CB342] to-[#8BC34A] p-[2px] shadow-lg shadow-[#7CB342]/30">
              <div class="w-full h-full rounded-2xl bg-black/50 backdrop-blur flex items-center justify-center">
                <Icon icon="lucide:leaf" class="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h3 class="text-2xl font-bold mb-3 pb-1 leading-[1.4] bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Leguan's Blog
          </h3>
          <p class="text-white/60 italic text-sm leading-relaxed max-w-md">
            "Just go ahead"
          </p>
        </div>

        <!-- Social Links -->
        <div 
          class="flex items-center space-x-3 footer-item"
          :class="{ 'animate-in': isVisible }"
          :style="{ animationDelay: '100ms' }"
        >
          <template v-for="(link, index) in socialLinks" :key="index">
            <!-- QQ Modal Button -->
            <div v-if="link.isModal" class="relative">
              <button
                @click.stop="showQQModal = !showQQModal"
                class="group w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                :class="link.color"
              >
                <Icon :icon="link.icon" class="w-5 h-5 transition-transform group-hover:scale-110" />
              </button>
              <QQModal :visible="showQQModal" @close="showQQModal = false" />
            </div>
            <!-- Router Link -->
            <router-link
              v-else-if="link.isRouter"
              :to="link.href"
              class="group relative w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
              :class="link.color"
            >
              <Icon :icon="link.icon" class="w-5 h-5 transition-transform group-hover:scale-110" />
              <span class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {{ link.label }}
                <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></span>
              </span>
            </router-link>
            <!-- External Link -->
            <a
              v-else
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="group relative w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
              :class="link.color"
            >
              <Icon :icon="link.icon" class="w-5 h-5 transition-transform group-hover:scale-110" />
              <span class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {{ link.label }}
                <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></span>
              </span>
            </a>
          </template>
        </div>

        <!-- Quick Links -->
        <div 
          class="flex items-center justify-center flex-wrap gap-4 text-sm footer-item"
          :class="{ 'animate-in': isVisible }"
          :style="{ animationDelay: '200ms' }"
        >
          <router-link to="/" class="text-white/70 hover:text-[#7CB342] transition-colors flex items-center">
            <Icon icon="lucide:home" class="w-3.5 h-3.5 mr-1.5" />
            Home
          </router-link>
          <router-link to="/archives" class="text-white/70 hover:text-[#7CB342] transition-colors flex items-center">
            <Icon icon="lucide:archive" class="w-3.5 h-3.5 mr-1.5" />
            Archives
          </router-link>
          <router-link to="/tags" class="text-white/70 hover:text-[#7CB342] transition-colors flex items-center">
            <Icon icon="lucide:tags" class="w-3.5 h-3.5 mr-1.5" />
            Tags
          </router-link>
          <router-link to="/categories" class="text-white/70 hover:text-[#7CB342] transition-colors flex items-center">
            <Icon icon="lucide:folder" class="w-3.5 h-3.5 mr-1.5" />
            Categories
          </router-link>
          <router-link to="/about" class="text-white/70 hover:text-[#7CB342] transition-colors flex items-center">
            <Icon icon="lucide:user" class="w-3.5 h-3.5 mr-1.5" />
            About
          </router-link>
        </div>

        <!-- Copyright -->
        <div 
          class="text-center text-sm text-white/50 space-y-2 pt-6 border-t border-white/10 w-full footer-item"
          :class="{ 'animate-in': isVisible }"
          :style="{ animationDelay: '300ms' }"
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
          <p class="flex items-center justify-center text-xs text-white/40 mt-2">
            <Icon icon="lucide:heart" class="w-3 h-3 mr-1 text-red-500 animate-pulse" />
            Thanks for visiting
          </p>
        </div>
      </div>
    </div>
  </footer>

</template>

<style scoped>
.footer-item {
  opacity: 0;
  transform: scale(0.85);
  transform-origin: center center;
}

.footer-item.animate-in {
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
