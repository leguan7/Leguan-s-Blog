<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'

const router = useRouter()
const route = useRoute()
const blogStore = useBlogStore()

const isMenuOpen = ref(false)
const isSearchOpen = ref(false)
const searchInput = ref('')
const isScrolled = ref(false)
const isScrollingDown = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)
let lastScrollY = 0

// 导航菜单 - Kyle's Blog 一致的结构
const navItems = [
  { name: '首页', path: '/', icon: 'lucide:home' },
  { 
    name: '文章', 
    icon: 'lucide:book-open',
    children: [
      { name: '归档', path: '/archives', icon: 'lucide:archive' },
      { name: '标签', path: '/tags', icon: 'lucide:tags' },
      { name: '分类', path: '/categories', icon: 'lucide:folder-open' }
    ]
  },
  { 
    name: '休闲', 
    icon: 'lucide:coffee',
    children: [
      { name: '健身日记', path: '/fitness', icon: 'lucide:dumbbell' },
      { name: '番剧', path: '/bangumi', icon: 'lucide:clapperboard' },
      { name: '追剧', path: '/tvseries', icon: 'lucide:tv' },
      { name: '电影', path: '/movies', icon: 'lucide:film' },
      { name: '美食', path: '/food', icon: 'lucide:utensils' },
      { name: '记忆胶囊', path: '/memory', icon: 'lucide:camera' }
    ]
  },
  { 
    name: '社交', 
    icon: 'lucide:users',
    children: [
      { name: '留言板', path: '/messageboard', icon: 'lucide:message-circle' },
      { name: '友人帐', path: '/links', icon: 'lucide:user-plus' }
    ]
  },
  { 
    name: '个人', 
    icon: 'lucide:user',
    children: [
      { name: '闲言碎语', path: '/shuoshuo', icon: 'lucide:message-square' },
      { name: '关于我', path: '/about', icon: 'lucide:heart' }
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

// 打开搜索框时自动聚焦
watch(isSearchOpen, (val) => {
  if (val) {
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  }
})

// ESC 关闭弹框
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    isSearchOpen.value = false
    isMenuOpen.value = false
  }
  // Ctrl/Cmd + K 打开搜索
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    isSearchOpen.value = true
  }
}

// 使用 requestAnimationFrame 优化滚动监听
let ticking = false
function handleScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY
      isScrolled.value = currentScrollY > 50
      
      // 检测滚动方向
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        isScrollingDown.value = true
      } else {
        isScrollingDown.value = false
      }
      
      lastScrollY = currentScrollY
      ticking = false
    })
    ticking = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-2"
    :class="isScrolled ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-md' : 'bg-transparent'"
  >
    <nav class="w-full px-6 lg:px-12">
      <!-- 下滑时：只显示居中标题 -->
      <div 
        v-if="isScrollingDown" 
        class="flex justify-center items-center h-14"
      >
        <router-link to="/" class="group">
          <span 
            class="text-xl font-bold transition-all hover:scale-105"
            :class="isScrolled ? 'text-gray-800 dark:text-white' : 'text-white drop-shadow-lg'"
          >
            Leguan's Blog
          </span>
        </router-link>
      </div>
      
      <!-- 上滑或顶部：标题左侧，按钮右侧 -->
      <div 
        v-else
        class="flex justify-between items-center h-14"
      >
        <!-- Logo -->
        <router-link to="/" class="flex items-center group">
          <span 
            class="text-xl font-bold transition-colors"
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
                class="nav-item flex items-center space-x-1.5 group/btn hover:text-[#7CB342]"
                :class="isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white/90 hover:text-white'"
              >
                <Icon :icon="item.icon" class="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                <span>{{ item.name }}</span>
                <Icon icon="lucide:chevron-down" class="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              
              <!-- 下拉菜单 - 优化样式 -->
              <div class="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <div class="dropdown-menu w-48 py-2 rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                  <router-link
                    v-for="(child, index) in item.children"
                    :key="child.name"
                    :to="child.path!"
                    class="dropdown-item flex items-center space-x-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-[#7CB342] hover:to-[#8BC34A] hover:text-white transition-all duration-300"
                    :class="{ 'bg-[#7CB342]/10 text-[#7CB342]': isActive(child.path!) }"
                    :style="{ animationDelay: `${index * 50}ms` }"
                  >
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7CB342]/20 to-[#8BC34A]/20 flex items-center justify-center">
                      <Icon :icon="child.icon!" class="w-4 h-4" />
                    </div>
                    <span class="font-medium">{{ child.name }}</span>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- 无子菜单 -->
            <router-link 
              v-else
              :to="item.path!"
              class="nav-item flex items-center space-x-1.5 group/link"
              :class="[
                isScrolled ? 'text-gray-700 dark:text-gray-200 hover:text-[#7CB342]' : 'text-white/90 hover:text-white',
                isActive(item.path!) ? '!text-[#7CB342]' : ''
              ]"
            >
              <Icon :icon="item.icon" class="w-4 h-4 transition-transform group-hover/link:scale-110 group-hover/link:rotate-12" />
              <span>{{ item.name }}</span>
            </router-link>
          </template>

          <!-- 搜索按钮 -->
          <button 
            @click="isSearchOpen = true"
            class="nav-item group/search flex items-center space-x-2"
            :class="isScrolled ? 'text-gray-700 dark:text-gray-200 hover:text-[#7CB342]' : 'text-white/90 hover:text-white'"
            title="搜索 (Ctrl+K)"
          >
            <Icon icon="lucide:search" class="w-4 h-4 transition-transform group-hover/search:scale-110" />
            <kbd class="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] rounded bg-white/20 text-current">
              <span class="text-[8px]">⌘</span>K
            </kbd>
          </button>
        </div>

        <!-- Mobile Menu Toggle -->
        <div class="md:hidden flex items-center space-x-2">
          <button 
            @click="isSearchOpen = true"
            class="p-2 rounded-full transition-colors"
            :class="isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'"
          >
            <Icon icon="lucide:search" class="w-5 h-5" />
          </button>
          <button 
            @click="isMenuOpen = !isMenuOpen"
            class="p-2 rounded-full transition-all duration-300"
            :class="isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'"
          >
            <Icon 
              :icon="isMenuOpen ? 'lucide:x' : 'lucide:menu'" 
              class="w-5 h-5 transition-transform duration-300"
              :class="{ 'rotate-90': isMenuOpen }"
            />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation - 优化样式 -->
      <transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 -translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-4 scale-95"
      >
        <div 
          v-if="isMenuOpen" 
          class="md:hidden absolute left-4 right-4 top-full mt-2 rounded-2xl shadow-2xl overflow-hidden border border-white/10 mobile-menu"
        >
          <div class="py-4 max-h-[70vh] overflow-y-auto">
            <!-- 搜索框 -->
            <div class="px-4 mb-4">
              <div class="relative">
                <Icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  v-model="searchInput"
                  type="text"
                  placeholder="搜索文章..."
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none outline-none text-sm focus:ring-2 focus:ring-[#7CB342]/50 transition-all"
                  @keyup.enter="handleSearch(); isMenuOpen = false"
                />
              </div>
            </div>

            <template v-for="(item, itemIndex) in navItems" :key="item.name">
              <div v-if="item.children" class="mobile-menu-item" :style="{ animationDelay: `${itemIndex * 50}ms` }">
                <button 
                  @click="activeDropdown = activeDropdown === item.name ? null : item.name"
                  class="w-full flex items-center justify-between px-5 py-3.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7CB342]/20 to-[#8BC34A]/20 flex items-center justify-center">
                      <Icon :icon="item.icon" class="w-4 h-4 text-[#7CB342]" />
                    </div>
                    <span class="font-medium">{{ item.name }}</span>
                  </div>
                  <Icon 
                    icon="lucide:chevron-down" 
                    class="w-4 h-4 transition-transform duration-300 text-gray-500"
                    :class="{ 'rotate-180 text-[#7CB342]': activeDropdown === item.name }"
                  />
                </button>
                
                <transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="opacity-0 max-h-0"
                  enter-to-class="opacity-100 max-h-96"
                  leave-active-class="transition ease-in duration-150"
                  leave-from-class="opacity-100 max-h-96"
                  leave-to-class="opacity-0 max-h-0"
                >
                  <div v-if="activeDropdown === item.name" class="overflow-hidden bg-gray-50/50 dark:bg-gray-800/30">
                    <router-link
                      v-for="child in item.children"
                      :key="child.name"
                      :to="child.path!"
                      @click="isMenuOpen = false"
                      class="flex items-center space-x-3 px-5 py-3 ml-12 text-gray-600 dark:text-gray-300 hover:text-[#7CB342] transition-colors border-l-2 border-transparent hover:border-[#7CB342]"
                      :class="{ 'text-[#7CB342] border-[#7CB342]': isActive(child.path!) }"
                    >
                      <Icon :icon="child.icon!" class="w-4 h-4" />
                      <span>{{ child.name }}</span>
                    </router-link>
                  </div>
                </transition>
              </div>

              <router-link 
                v-else
                :to="item.path!"
                @click="isMenuOpen = false"
                class="mobile-menu-item flex items-center space-x-3 px-5 py-3.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                :class="{ 'text-[#7CB342] bg-[#7CB342]/5': isActive(item.path!) }"
                :style="{ animationDelay: `${itemIndex * 50}ms` }"
              >
                <div 
                  class="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  :class="isActive(item.path!) ? 'bg-[#7CB342] text-white' : 'bg-gradient-to-br from-[#7CB342]/20 to-[#8BC34A]/20 text-[#7CB342]'"
                >
                  <Icon :icon="item.icon" class="w-4 h-4" />
                </div>
                <span class="font-medium">{{ item.name }}</span>
                <Icon v-if="isActive(item.path!)" icon="lucide:check" class="w-4 h-4 ml-auto text-[#7CB342]" />
              </router-link>
            </template>
          </div>
        </div>
      </transition>
    </nav>

    <!-- Search Modal - 全新设计 -->
    <teleport to="body">
      <transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isSearchOpen" class="fixed inset-0 z-[100]" @click.self="isSearchOpen = false">
          <!-- 背景模糊层 -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
          
          <!-- 搜索框容器 -->
          <div class="relative flex items-start justify-center pt-[15vh] px-4">
            <transition
              enter-active-class="transition ease-out duration-300 delay-100"
              enter-from-class="opacity-0 scale-95 -translate-y-8"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-200"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-8"
            >
              <div 
                v-if="isSearchOpen"
                class="w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden search-modal"
              >
                <!-- 搜索头部 -->
                <div class="flex items-center px-6 py-5 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7CB342] to-[#8BC34A] flex items-center justify-center mr-4">
                    <Icon icon="lucide:search" class="w-5 h-5 text-white" />
                  </div>
                  <input 
                    ref="searchInputRef"
                    v-model="searchInput"
                    type="text"
                    placeholder="输入关键词搜索文章..."
                    class="flex-1 bg-transparent border-none outline-none text-lg text-gray-800 dark:text-gray-100 placeholder-gray-400"
                    @keyup.enter="handleSearch"
                  />
                  <button 
                    @click="isSearchOpen = false" 
                    class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  >
                    <Icon icon="lucide:x" class="w-5 h-5" />
                  </button>
                </div>
                
                <!-- 搜索提示 -->
                <div class="p-8 text-center">
                  <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#7CB342]/10 to-[#8BC34A]/10 flex items-center justify-center">
                    <Icon icon="lucide:lightbulb" class="w-10 h-10 text-[#7CB342] animate-pulse" />
                  </div>
                  <p class="text-gray-500 dark:text-gray-400 mb-2">输入关键词后按 Enter 搜索</p>
                  <div class="flex items-center justify-center space-x-2 text-xs text-gray-400">
                    <kbd class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 font-mono">Enter</kbd>
                    <span>搜索</span>
                    <span class="mx-2">·</span>
                    <kbd class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 font-mono">Esc</kbd>
                    <span>关闭</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </teleport>
  </header>
</template>

<style scoped>
/* 下拉菜单样式 */
.dropdown-menu {
  background: var(--card-bg);
  backdrop-filter: saturate(180%) blur(20px);
}

/* 移动端菜单样式 */
.mobile-menu {
  background: var(--card-bg);
  backdrop-filter: saturate(180%) blur(20px);
}

.mobile-menu-item {
  animation: slideInLeft 0.3s ease-out both;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 搜索框样式 */
.search-modal {
  background: var(--card-bg);
  backdrop-filter: saturate(180%) blur(20px);
}

/* 下拉菜单项动画 */
.dropdown-item {
  animation: fadeInUp 0.3s ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
