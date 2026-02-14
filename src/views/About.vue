<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { IMAGES } from '@/utils/assets'
const avatar = IMAGES.avatar

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

const skills = [
  { name: 'Java', icon: 'devicon-plain:java', color: '#e76f00' },
  { name: 'Spring Boot', icon: 'simple-icons:springboot', color: '#6DB33F' },
  { name: 'MySQL', icon: 'simple-icons:mysql', color: '#4479A1' },
  { name: 'Redis', icon: 'simple-icons:redis', color: '#DC382D' },
  { name: 'Git', icon: 'mdi:git', color: '#f05032' },
  { name: 'Docker', icon: 'mdi:docker', color: '#2496ed' },
]

const timeline = [
  { year: 'Now', event: 'Working as a backend developer in Shenzhen, exploring the world', icon: 'lucide:map-pin' },
  { year: '2026', event: 'Started this blog to document life and thoughts', icon: 'lucide:pen-line' },
  { year: 'Before', event: 'First job in Hangzhou, began my backend development career', icon: 'lucide:rocket' },
]
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[50vh] min-h-[380px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/40"></div>
      
      <div class="relative text-center text-white z-10">
        <div class="inline-block mb-4 w-32 h-32 rounded-full overflow-hidden shadow-2xl">
          <img 
            :src="avatar" 
            alt="Leguan" 
            class="w-full h-full object-cover"
            onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=Leguan'"
          />
        </div>
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">About Me</h1>
        <p class="mt-3 text-white/80 text-xl">Leguan</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Personal Introduction -->
      <div 
        :ref="(el) => setCardRef(el, 0)"
        class="card p-6 md:p-8 mb-6 animate-card"
        :class="{ 'animate-in': isCardVisible(0) }"
      >
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-5 flex items-center">
          <Icon icon="lucide:user" class="w-6 h-6 mr-2 text-[#7CB342]" />
          About
        </h2>
        <div class="text-gray-600 dark:text-gray-400 space-y-4 leading-relaxed">
          <p>
            Hey there! I'm <strong class="text-[#7CB342]">Leguan</strong> — a backend developer who believes the world is meant to be explored.
          </p>
          <p>
            I started my career in Hangzhou and later moved to Shenzhen, where I'm currently working. Outside of writing code, I'm a basketball enthusiast, a fitness lover, and someone who genuinely enjoys traveling and capturing beautiful landscapes through the lens.
          </p>
          <blockquote class="border-l-4 border-[#7CB342] pl-4 py-3 bg-gradient-to-r from-[#7CB342]/10 to-transparent rounded-r-lg">
            <p class="italic text-[#7CB342]">"Stay goal-driven, stay optimistic, and never stop exploring."</p>
          </blockquote>
          <p>
            This blog is my personal space to document life — the places I've been, the things I've watched, the workouts I've done, and the thoughts worth keeping. It's less about tech and more about living fully.
          </p>
          <div class="flex flex-wrap gap-2 mt-2">
            <span class="inline-flex items-center px-3 py-1.5 rounded-full bg-[#7CB342]/10 text-[#7CB342] text-sm font-medium">
              <Icon icon="lucide:dumbbell" class="w-4 h-4 mr-1.5" /> Fitness
            </span>
            <span class="inline-flex items-center px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-sm font-medium">
              <Icon icon="lucide:dribbble" class="w-4 h-4 mr-1.5" /> Basketball
            </span>
            <span class="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium">
              <Icon icon="lucide:plane" class="w-4 h-4 mr-1.5" /> Travel
            </span>
            <span class="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium">
              <Icon icon="lucide:camera" class="w-4 h-4 mr-1.5" /> Photography
            </span>
            <span class="inline-flex items-center px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-500 text-sm font-medium">
              <Icon icon="lucide:code-2" class="w-4 h-4 mr-1.5" /> Backend Dev
            </span>
            <span class="inline-flex items-center px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500 text-sm font-medium">
              <Icon icon="lucide:globe" class="w-4 h-4 mr-1.5" /> Explorer
            </span>
          </div>
        </div>
      </div>

      <!-- Tech Stack -->
      <div 
        :ref="(el) => setCardRef(el, 1)"
        class="card p-6 md:p-8 mb-6 animate-card"
        :class="{ 'animate-in': isCardVisible(1) }"
      >
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <Icon icon="lucide:code-2" class="w-6 h-6 mr-2 text-[#7CB342]" />
          Tech Stack
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div 
            v-for="skill in skills"
            :key="skill.name"
            class="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
          >
            <Icon :icon="skill.icon" class="w-8 h-8 transition-transform group-hover:scale-110" :style="{ color: skill.color }" />
            <span class="font-medium text-gray-700 dark:text-gray-300">{{ skill.name }}</span>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div 
        :ref="(el) => setCardRef(el, 2)"
        class="card p-6 md:p-8 mb-6 animate-card"
        :class="{ 'animate-in': isCardVisible(2) }"
      >
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <Icon icon="lucide:history" class="w-6 h-6 mr-2 text-[#7CB342]" />
          Timeline
        </h2>
        <div class="relative pl-8">
          <div class="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#7CB342] to-transparent"></div>
          <div class="space-y-6">
            <div 
              v-for="item in timeline"
              :key="item.year"
              class="relative"
            >
              <div class="absolute -left-5 w-4 h-4 rounded-full bg-[#7CB342] shadow-lg shadow-[#7CB342]/30"></div>
              <div class="ml-4">
                <div class="font-bold text-[#7CB342] text-lg">{{ item.year }}</div>
                <div class="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                  <Icon :icon="item.icon" class="w-4 h-4 mr-2" />
                  {{ item.event }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div 
        :ref="(el) => setCardRef(el, 3)"
        class="card p-6 md:p-8 animate-card"
        :class="{ 'animate-in': isCardVisible(3) }"
      >
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <Icon icon="lucide:mail" class="w-6 h-6 mr-2 text-[#7CB342]" />
          Contact Me
        </h2>
        <div class="flex flex-wrap gap-3">
          <div class="relative group">
            <a 
              href="https://github.com/leguan7" 
              target="_blank"
              class="contact-btn btn bg-gray-800 text-white hover:bg-gray-900"
            >
              <Icon icon="ri:github-fill" class="w-5 h-5 mr-2" />
              GitHub
            </a>
            <div class="tooltip">github.com/leguan7</div>
          </div>
          <div class="relative group">
            <span class="contact-btn btn bg-[#12B7F5] text-white hover:bg-[#0aa3e0]">
              <Icon icon="ri:qq-fill" class="w-5 h-5 mr-2" />
              QQ
            </span>
            <div class="tooltip">1944553927</div>
          </div>
          <div class="relative group">
            <a 
              href="mailto:leguan701@gmail.com"
              class="contact-btn btn bg-red-500 text-white hover:bg-red-600"
            >
              <Icon icon="lucide:mail" class="w-5 h-5 mr-2" />
              Email
            </a>
            <div class="tooltip">leguan701@gmail.com</div>
          </div>
          <router-link to="/messageboard" class="btn btn-primary">
            <Icon icon="lucide:message-circle" class="w-5 h-5 mr-2" />
            Guestbook
          </router-link>
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


.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  filter: brightness(1.05);
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
