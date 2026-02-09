<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import { formatDate } from '@/utils/markdown'
import type { Post } from '@/types'

const blogStore = useBlogStore()

const bannerVisible = ref(false)
const contentVisible = ref(false)
const expandedYears = ref<Set<string>>(new Set())
const expandedMonths = ref<Set<string>>(new Set())

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Group: year -> [ [monthLabel, posts[]] ]
const archivesByYearMonth = computed(() => {
  return blogStore.archivesByYear.map(([year, posts]) => {
    const monthMap = new Map<number, Post[]>()
    posts.forEach(post => {
      const m = new Date(post.date).getMonth()
      if (!monthMap.has(m)) monthMap.set(m, [])
      monthMap.get(m)!.push(post)
    })
    const months = Array.from(monthMap.entries())
      .sort((a, b) => b[0] - a[0]) // descending month
      .map(([m, mPosts]) => ({
        key: `${year}-${m}`,
        label: monthNames[m],
        num: String(m + 1).padStart(2, '0'),
        posts: mPosts
      }))
    return { year, posts, months }
  })
})

function toggleYear(year: string) {
  const next = new Set(expandedYears.value)
  if (next.has(year)) {
    next.delete(year)
  } else {
    next.add(year)
  }
  expandedYears.value = next
}

function toggleMonth(key: string) {
  const next = new Set(expandedMonths.value)
  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }
  expandedMonths.value = next
}

function isYearExpanded(year: string) {
  return expandedYears.value.has(year)
}

function isMonthExpanded(key: string) {
  return expandedMonths.value.has(key)
}

onMounted(() => {
  setTimeout(() => { bannerVisible.value = true }, 100)
  setTimeout(() => { contentVisible.value = true }, 300)
  // Default: expand the first year and its first month
  if (archivesByYearMonth.value.length) {
    const first = archivesByYearMonth.value[0]
    expandedYears.value.add(first.year)
    if (first.months.length) {
      expandedMonths.value.add(first.months[0].key)
    }
  }
})
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/30"></div>
      <div
        class="relative text-center text-white z-10 banner-content"
        :class="{ 'animate-in': bannerVisible }"
      >
        <div class="w-14 h-14 mx-auto mb-3 rounded-xl bg-[#7CB342]/90 backdrop-blur flex items-center justify-center shadow-lg">
          <Icon icon="lucide:archive" class="w-7 h-7 drop-shadow" />
        </div>
        <h1 class="text-3xl md:text-4xl font-bold drop-shadow-lg">Archives</h1>
        <p class="mt-2 text-white/80 text-sm">{{ blogStore.posts.length }} posts in total</p>
      </div>
      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Loading -->
      <div v-if="blogStore.isLoading" class="card p-16 text-center">
        <div class="inline-flex flex-col items-center">
          <div class="w-12 h-12 rounded-xl bg-[#7CB342]/20 flex items-center justify-center mb-3">
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-[#7CB342] border-t-transparent"></div>
          </div>
          <p class="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>

      <!-- Accordion: Year -> Month -> Posts -->
      <div v-else class="space-y-3 content-block" :class="{ 'animate-in': contentVisible }">
        <div
          v-for="entry in archivesByYearMonth"
          :key="entry.year"
          class="card overflow-hidden border border-white/20 dark:border-gray-600/30"
        >
          <!-- Year header -->
          <button
            @click="toggleYear(entry.year)"
            class="w-full flex items-center justify-between px-5 py-4 text-left group transition-colors duration-200"
            :class="isYearExpanded(entry.year) ? 'bg-[#7CB342]/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-[#7CB342] to-[#8BC34A] shadow-sm">
                <span class="text-sm font-bold">{{ entry.year.slice(2) }}</span>
              </div>
              <div>
                <h3 class="font-bold text-gray-800 dark:text-white text-lg">{{ entry.year }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ entry.posts.length }} posts</p>
              </div>
            </div>
            <Icon
              icon="lucide:chevron-down"
              class="w-5 h-5 text-gray-400 transition-transform duration-300"
              :class="isYearExpanded(entry.year) ? 'rotate-180 text-[#7CB342]' : ''"
            />
          </button>

          <!-- Months (collapsible) -->
          <div class="accordion-body" :class="{ expanded: isYearExpanded(entry.year) }">
            <div class="border-t border-gray-100 dark:border-gray-700/50">
              <div
                v-for="(month, mi) in entry.months"
                :key="month.key"
                :class="mi < entry.months.length - 1 ? 'border-b border-gray-100 dark:border-gray-700/30' : ''"
              >
                <!-- Month header -->
                <button
                  @click="toggleMonth(month.key)"
                  class="w-full flex items-center justify-between pl-8 pr-5 py-3 text-left group/month transition-colors duration-200"
                  :class="isMonthExpanded(month.key) ? 'bg-[#7CB342]/[0.03]' : 'hover:bg-gray-50/80 dark:hover:bg-gray-800/30'"
                >
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-md flex items-center justify-center bg-gray-100 dark:bg-gray-700/60 text-xs font-bold text-gray-600 dark:text-gray-300">
                      {{ month.num }}
                    </div>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ month.label }}</span>
                    <span class="text-xs text-gray-400 dark:text-gray-500">({{ month.posts.length }})</span>
                  </div>
                  <Icon
                    icon="lucide:chevron-down"
                    class="w-4 h-4 text-gray-300 dark:text-gray-600 transition-transform duration-300"
                    :class="isMonthExpanded(month.key) ? 'rotate-180 text-[#7CB342]' : ''"
                  />
                </button>

                <!-- Posts (collapsible) -->
                <div class="accordion-body" :class="{ expanded: isMonthExpanded(month.key) }">
                  <div>
                    <router-link
                      v-for="(post, pi) in month.posts"
                      :key="post.slug"
                      :to="`/post/${post.slug}`"
                      class="flex items-center gap-3 pl-12 pr-5 py-2.5 group/item transition-colors hover:bg-[#7CB342]/5"
                      :class="pi < month.posts.length - 1 ? 'border-b border-gray-50 dark:border-gray-800/30' : ''"
                    >
                      <span class="text-xs font-mono text-gray-400 dark:text-gray-500 shrink-0 flex items-center whitespace-nowrap">
                        <Icon icon="lucide:calendar-days" class="w-3 h-3 mr-1 text-[#7CB342]" />
                        {{ formatDate(post.date, 'short') }}
                      </span>
                      <h4 class="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover/item:text-[#7CB342] transition-colors line-clamp-1">
                        {{ post.title }}
                      </h4>
                      <div class="hidden sm:flex gap-1.5 shrink-0">
                        <span
                          v-for="tag in post.tags.slice(0, 2)"
                          :key="tag"
                          class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400"
                        >
                          {{ tag }}
                        </span>
                      </div>
                      <Icon
                        icon="lucide:chevron-right"
                        class="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover/item:text-[#7CB342] group-hover/item:translate-x-0.5 transition-all shrink-0"
                      />
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner-content,
.content-block {
  opacity: 0;
  transform: translateY(20px);
}

.banner-content.animate-in,
.content-block.animate-in {
  animation: fadeSlideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.accordion-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.accordion-body > div {
  overflow: hidden;
}

.accordion-body.expanded {
  grid-template-rows: 1fr;
}
</style>
