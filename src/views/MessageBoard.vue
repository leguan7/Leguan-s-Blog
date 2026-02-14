<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
const comment = ref('')
const nickname = ref('')
const email = ref('')

function submitComment() {
  alert('Comment feature is under development...')
}

// Animation visibility
const visibleCards = ref<Set<number>>(new Set())

const setCardRef = (el: any, index: number) => {}

const isCardVisible = (index: number) => visibleCards.value.has(index)

onMounted(() => {
  // Immediately mark all cards visible with staggered animation
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      visibleCards.value.add(i)
      visibleCards.value = new Set(visibleCards.value)
    }, i * 150)
  }
})
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/30"></div>
      
      <div class="relative text-center text-white z-10">
        <Icon icon="lucide:message-circle" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">Guestbook</h1>
        <p class="mt-3 text-white/80 text-lg">Got something to say? Leave your mark!</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Message Form -->
      <div 
        :ref="(el) => setCardRef(el, 0)"
        class="card p-6 md:p-8 mb-8 animate-card"
        :class="{ 'animate-in': isCardVisible(0) }"
      >
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-5 flex items-center">
          <Icon icon="lucide:pen-line" class="w-5 h-5 mr-2 text-[#7CB342]" />
          Leave a Message
        </h2>
        
        <form @submit.prevent="submitComment" class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <Icon icon="lucide:user" class="w-3.5 h-3.5 inline mr-1" />
                Nickname
              </label>
              <input 
                v-model="nickname"
                type="text" 
                required
                placeholder="Your nickname"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#7CB342] focus:ring-2 focus:ring-[#7CB342]/20 transition-all outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <Icon icon="lucide:mail" class="w-3.5 h-3.5 inline mr-1" />
                Email
              </label>
              <input 
                v-model="email"
                type="email" 
                placeholder="Optional, for avatar"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#7CB342] focus:ring-2 focus:ring-[#7CB342]/20 transition-all outline-none"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <Icon icon="lucide:message-square" class="w-3.5 h-3.5 inline mr-1" />
              Message
            </label>
            <textarea 
              v-model="comment"
              rows="4"
              required
              placeholder="Say something..."
              class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#7CB342] focus:ring-2 focus:ring-[#7CB342]/20 transition-all outline-none resize-none"
            ></textarea>
          </div>

          <button type="submit" class="btn btn-primary w-full md:w-auto">
            <Icon icon="lucide:send" class="w-4 h-4 mr-2" />
            Submit
          </button>
        </form>
      </div>

      <!-- Notice -->
      <div 
        :ref="(el) => setCardRef(el, 1)"
        class="card p-6 text-center animate-card"
        :class="{ 'animate-in': isCardVisible(1) }"
      >
        <Icon icon="lucide:heart" class="w-12 h-12 text-pink-400 mx-auto mb-3" />
        <p class="text-gray-600 dark:text-gray-400">
          Comment feature is under development, stay tuned!<br/>
          <span class="text-sm text-gray-400">You can also reach me through</span>
        </p>
        <div class="flex flex-wrap justify-center gap-2 mt-4">
          <a href="https://github.com/leguan7" target="_blank" class="btn bg-gray-800 text-white hover:bg-gray-900 text-sm">
            <Icon icon="ri:github-fill" class="w-4 h-4 mr-1.5" />
            GitHub
          </a>
          <div class="relative group">
            <span class="btn bg-[#12B7F5] text-white hover:bg-[#0aa3e0] text-sm">
              <Icon icon="ri:qq-fill" class="w-4 h-4 mr-1.5" />
              QQ
            </span>
            <span class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              1944553927
              <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></span>
            </span>
          </div>
          <div class="relative group">
            <a href="mailto:leguan701@gmail.com" class="btn bg-red-500 text-white hover:bg-red-600 text-sm">
              <Icon icon="lucide:mail" class="w-4 h-4 mr-1.5" />
              Email
            </a>
            <div class="tooltip">leguan701@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.tooltip {
  @apply absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:-translate-y-1 z-10;
}
.tooltip::after {
  content: '';
  @apply absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900;
}


.animate-card {
  opacity: 0;
  transform: scale(0.6);
  transform-origin: center center;
}

.animate-card.animate-in {
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
