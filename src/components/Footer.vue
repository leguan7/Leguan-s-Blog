<script setup lang="ts">
import { Icon } from '@iconify/vue'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="relative mt-8">
    <!-- 半透明遮罩 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 backdrop-blur-sm"></div>
    
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white/90">
      <div class="flex flex-col items-center space-y-5">
        <!-- Logo & Slogan -->
        <div class="text-center">
          <h3 class="text-2xl font-bold mb-2">Leguan's Blog</h3>
          <p class="text-white/60 italic text-sm">
            "The furthest distance in the world<br/>
            is not between life and death<br/>
            But when I stand in front of you<br/>
            Yet you don't know that I love you"
          </p>
        </div>

        <!-- Social Links -->
        <div class="flex items-center space-x-4">
          <a 
            href="https://github.com/leguan7" 
            target="_blank"
            rel="noopener noreferrer"
            class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#49b1f5] hover:scale-110 transition-all duration-300"
          >
            <Icon icon="fab:github" class="w-5 h-5" />
          </a>
          <a 
            href="mailto:leguan@example.com"
            class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#49b1f5] hover:scale-110 transition-all duration-300"
          >
            <Icon icon="fas:envelope" class="w-5 h-5" />
          </a>
          <router-link 
            to="/messageboard"
            class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#49b1f5] hover:scale-110 transition-all duration-300"
          >
            <Icon icon="fas:comment-dots" class="w-5 h-5" />
          </router-link>
        </div>

        <!-- Copyright -->
        <div class="text-center text-sm text-white/50 space-y-1 pt-4 border-t border-white/10 w-full">
          <p>©2025 - {{ currentYear }} By <span class="text-[#49b1f5]">Leguan</span></p>
          <p class="flex items-center justify-center space-x-1">
            <span>Powered by</span>
            <a href="https://vuejs.org" target="_blank" class="text-[#42b883] hover:underline">Vue</a>
            <span>&</span>
            <a href="https://vitejs.dev" target="_blank" class="text-[#646cff] hover:underline">Vite</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
