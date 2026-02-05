<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import { IMAGES } from '@/utils/assets'

const router = useRouter()
const route = useRoute()
const blogStore = useBlogStore()

const isMenuOpen = ref(false)
const isSearchOpen = ref(false)
const searchInput = ref('')
const isScrolled = ref(false)

// 导航菜单 - Kyle's Blog 一致的结构
const navItems = [
  { name: '首页', path: '/', icon: 'fas:home' },
  { 
    name: '文章', 
    icon: 'fas:book',
    children: [
      { name: '归档', path: '/archives', icon: 'fas:archive' },
      { name: '标签', path: '/tags', icon: 'fas:tags' },
      { name: '分类', path: '/categories', icon: 'fas:folder-open' }
    ]
  },
  { 
    name: '休闲', 
    icon: 'fas:coffee',
    children: [
      { name: '健身日寄', path: '/fitness', icon: 'fas:dumbbell' },
      { name: '番剧', path: '/bangumi', icon: 'fas:video' },
      { name: '记忆胶囊', path: '/memory', icon: 'fas:camera-retro' }
    ]
  },
  { 
    name: '社交', 
    icon: 'fas:users',
    children: [
      { name: '留言板', path: '/messageboard', icon: 'fas:comment-dots' },
      { name: '友人帐', path: '/links', icon: 'fas:user-friends' }
    ]
  },
  { 
    name: '个人', 
    icon: 'fas:user',
    children: [
      { name: '闲言碎语', path: '/shuoshuo', icon: 'fas:comment' },
      { name: '关于我', path: '/about', icon: 'fas:heart' }
    ]
  }
]

const activeDropdown = ref<string | null>(null)

function isActive(path: string): boolean {
  return route.path === path
}

function handleSearch() {
  if (searchInput.value.trim()) {
    blogStore.setSearchQuery(searchInput.value.trim())
    router.push('/')
    isSearchOpen.value = false
    searchInput.value = ''
  }
}

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    :class="isScrolled 
      ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-0' 
      : 'bg-transparent py-2'"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-14">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-3 group">
          <div class="avatar-ring">
            <img 
              :src="IMAGES.avatar" 
              alt="Logo" 
              class="w-10 h-10 rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-110"
              onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=Leguan'"
            />
          </div>
          <span 
            class="text-lg font-bold transition-colors hidden sm:block"
            :class="isScrolled ? 'text-gray-800 dark:text-white' : 'text-white drop-shadow-lg'"
          >
            Leguan's Blog
          </span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <template v-for="item in navItems" :key="item.name">
            <!-- 有子菜单 -->
            <div v-if="item.children" class="relative group">
              <button 
                class="nav-item flex items-center space-x-1.5"
                :class="isScrolled 
                  ? 'text-gray-700 dark:text-gray-200 hover:text-[#49b1f5]' 
                  : 'text-white/90 hover:text-white'"
              >
                <Icon :icon="item.icon" class="w-4 h-4" />
                <span>{{ item.name }}</span>
                <Icon icon="fas:chevron-down" class="w-3 h-3 transition-transform group-hover:rotate-180" />
              </button>
              
              <!-- 下拉菜单 -->
              <div class="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <div class="w-44 py-2 rounded-xl shadow-2xl overflow-hidden"
                     style="background: var(--card-bg); backdrop-filter: saturate(180%) blur(20px);">
                  <router-link
                    v-for="child in item.children"
                    :key="child.name"
                    :to="child.path!"
                    class="flex items-center space-x-2.5 px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-[#49b1f5] hover:text-white transition-all duration-200"
                    :class="{ 'bg-[#49b1f5]/10 text-[#49b1f5]': isActive(child.path!) }"
                  >
                    <Icon :icon="child.icon!" class="w-4 h-4" />
                    <span>{{ child.name }}</span>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- 无子菜单 -->
            <router-link 
              v-else
              :to="item.path!"
              class="nav-item flex items-center space-x-1.5"
              :class="[
                isScrolled 
                  ? 'text-gray-700 dark:text-gray-200 hover:text-[#49b1f5]' 
                  : 'text-white/90 hover:text-white',
                isActive(item.path!) ? '!text-[#49b1f5]' : ''
              ]"
            >
              <Icon :icon="item.icon" class="w-4 h-4" />
              <span>{{ item.name }}</span>
            </router-link>
          </template>

          <!-- 搜索按钮 -->
          <button 
            @click="isSearchOpen = !isSearchOpen"
            class="nav-item"
            :class="isScrolled 
              ? 'text-gray-700 dark:text-gray-200 hover:text-[#49b1f5]' 
              : 'text-white/90 hover:text-white'"
          >
            <Icon icon="fas:search" class="w-4 h-4" />
          </button>
        </div>

        <!-- Mobile Menu Toggle -->
        <button 
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden p-2 rounded-full"
          :class="isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'"
        >
          <Icon :icon="isMenuOpen ? 'fas:times' : 'fas:bars'" class="w-5 h-5" />
        </button>
      </div>

      <!-- Mobile Navigation -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div 
          v-if="isMenuOpen" 
          class="md:hidden absolute left-4 right-4 top-full mt-2 rounded-2xl shadow-2xl overflow-hidden"
          style="background: var(--card-bg); backdrop-filter: saturate(180%) blur(20px);"
        >
          <div class="py-3 max-h-[70vh] overflow-y-auto">
            <template v-for="item in navItems" :key="item.name">
              <div v-if="item.children">
                <button 
                  @click="activeDropdown = activeDropdown === item.name ? null : item.name"
                  class="w-full flex items-center justify-between px-5 py-3 text-gray-700 dark:text-gray-200"
                >
                  <div class="flex items-center space-x-2">
                    <Icon :icon="item.icon" class="w-4 h-4 text-[#49b1f5]" />
                    <span>{{ item.name }}</span>
                  </div>
                  <Icon 
                    icon="fas:chevron-down" 
                    class="w-3 h-3 transition-transform duration-300"
                    :class="{ 'rotate-180': activeDropdown === item.name }"
                  />
                </button>
                
                <div v-if="activeDropdown === item.name" class="bg-gray-50 dark:bg-gray-800/50">
                  <router-link
                    v-for="child in item.children"
                    :key="child.name"
                    :to="child.path!"
                    @click="isMenuOpen = false"
                    class="flex items-center space-x-2 px-10 py-2.5 text-gray-600 dark:text-gray-300 hover:text-[#49b1f5]"
                    :class="{ 'text-[#49b1f5]': isActive(child.path!) }"
                  >
                    <Icon :icon="child.icon!" class="w-4 h-4" />
                    <span>{{ child.name }}</span>
                  </router-link>
                </div>
              </div>

              <router-link 
                v-else
                :to="item.path!"
                @click="isMenuOpen = false"
                class="flex items-center space-x-2 px-5 py-3 text-gray-700 dark:text-gray-200"
                :class="{ 'text-[#49b1f5]': isActive(item.path!) }"
              >
                <Icon :icon="item.icon" class="w-4 h-4" :class="isActive(item.path!) ? '' : 'text-[#49b1f5]'" />
                <span>{{ item.name }}</span>
              </router-link>
            </template>
          </div>
        </div>
      </transition>
    </nav>

    <!-- Search Modal - Kyle's Blog 风格 -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isSearchOpen" class="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4" @click.self="isSearchOpen = false">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style="background: var(--card-bg);">
          <div class="flex items-center px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <Icon icon="fas:search" class="w-5 h-5 text-[#49b1f5]" />
            <input 
              v-model="searchInput"
              type="text"
              placeholder="搜索文章..."
              class="flex-1 ml-4 bg-transparent border-none outline-none text-lg text-gray-800 dark:text-gray-100 placeholder-gray-400"
              @keyup.enter="handleSearch"
              autofocus
            />
            <button @click="isSearchOpen = false" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <Icon icon="fas:times" class="w-5 h-5" />
            </button>
          </div>
          <div class="p-6 text-center text-gray-400 text-sm">
            <Icon icon="fas:keyboard" class="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>输入关键词后按 Enter 搜索</p>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>
