<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import PostCard from '@/components/PostCard.vue'
import Sidebar from '@/components/Sidebar.vue'

const blogStore = useBlogStore()

const currentPage = ref(1)
const postsPerPage = 6
const typedText = ref('')
const fullText = 'Digest your emotions'
const cursorVisible = ref(true)

// Typewriter effect - typing and deleting loop
onMounted(() => {
  let isTyping = true
  let charIndex = 0
  
  const runTypewriter = () => {
    if (isTyping) {
      // Typing phase
      if (charIndex < fullText.length) {
        typedText.value = fullText.substring(0, charIndex + 1)
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
        typedText.value = fullText.substring(0, charIndex)
        setTimeout(runTypewriter, 60) // Slightly faster deletion
      } else {
        // Deletion complete, wait 1s then restart typing
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
        <h1 class="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl hero-title">
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
</style>
