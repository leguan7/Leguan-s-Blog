<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import PostCardCompact from '@/components/PostCardCompact.vue'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([PieChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const route = useRoute()
const blogStore = useBlogStore()

const selectedCategory = ref<string | null>(null)
const contentVisible = ref(false)
const chartContainer = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

onMounted(() => {
  setTimeout(() => { contentVisible.value = true }, 200)
})

watch(
  () => route.query.category,
  (category) => { selectedCategory.value = category as string | null },
  { immediate: true }
)

const filteredPosts = computed(() => {
  if (!selectedCategory.value) return []
  return blogStore.getPostsByCategory(selectedCategory.value)
})

function selectCategory(category: string) {
  if (selectedCategory.value === category) {
    selectedCategory.value = null
    const base = import.meta.env.BASE_URL || '/'
    window.history.replaceState({}, '', `${base}categories`)
  } else {
    selectedCategory.value = category
    const base = import.meta.env.BASE_URL || '/'
    window.history.replaceState({}, '', `${base}categories?category=${encodeURIComponent(category)}`)
  }
}

// Colors
const pieColors = [
  '#42A5F5', '#66BB6A', '#FFA726', '#EF5350',
  '#AB47BC', '#26C6DA', '#FFCA28', '#EC407A',
  '#8D6E63', '#78909C', '#5C6BC0', '#26A69A',
  '#D4E157', '#FF7043', '#7E57C2', '#29B6F6',
]

function getCategoryColor(name: string): string {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return pieColors[hash % pieColors.length]
}

// Sort categories by count desc
const sortedCategories = computed(() => {
  return [...blogStore.allCategories].sort((a, b) => b.count - a.count)
})

// ECharts pie data
const pieData = computed(() => {
  return sortedCategories.value.map(cat => ({
    name: cat.name,
    value: cat.count,
    itemStyle: { color: getCategoryColor(cat.name) },
  }))
})

// Detect dark mode
const isDark = ref(document.documentElement.classList.contains('dark'))
let darkObserver: MutationObserver | null = null

function initChart() {
  if (!chartContainer.value) return

  chartInstance = echarts.init(chartContainer.value)
  updateChart()

  window.addEventListener('resize', handleResize)
}

function handleResize() {
  chartInstance?.resize()
}

function updateChart() {
  if (!chartInstance) return

  const textColor = isDark.value ? '#d1d5db' : '#6b7280'

  chartInstance.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} posts ({d}%)',
      backgroundColor: isDark.value ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
      borderColor: isDark.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
      textStyle: {
        color: isDark.value ? '#e5e7eb' : '#374151',
        fontSize: 13,
      },
      borderRadius: 10,
      padding: [10, 14],
    },
    legend: {
      type: 'scroll',
      orient: 'horizontal',
      bottom: 0,
      left: 'center',
      itemWidth: 14,
      itemHeight: 10,
      itemGap: 16,
      textStyle: {
        color: textColor,
        fontSize: 12,
      },
      inactiveColor: isDark.value ? '#4b5563' : '#d1d5db',
      inactiveBorderColor: 'transparent',
      // Keep text color unchanged when deselected
      formatter: (name: string) => {
        return `{a|${name}}`
      },
      textStyle: {
        color: textColor,
        fontSize: 12,
        rich: {
          a: {
            color: textColor,
            fontSize: 12,
          },
        },
      },
      pageTextStyle: {
        color: textColor,
      },
      pageIconColor: isDark.value ? '#9ca3af' : '#6b7280',
      pageIconInactiveColor: isDark.value ? '#4b5563' : '#d1d5db',
      selectedMode: true,
    },
    series: [
      {
        type: 'pie',
        radius: ['0%', '70%'],
        center: ['50%', '45%'],
        data: pieData.value,
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: false,
          },
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
          scaleSize: 10,
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: (_idx: number) => Math.random() * 200,
      },
    ],
  })
}

// Watch for data changes
watch(pieData, () => {
  nextTick(() => { updateChart() })
}, { deep: true })

// Watch for dark mode changes
watch(isDark, () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  nextTick(() => { initChart() })
})

onMounted(() => {
  // Observe dark mode class changes
  darkObserver = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  darkObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  setTimeout(() => {
    initChart()
  }, 400)
})

onUnmounted(() => {
  chartInstance?.dispose()
  chartInstance = null
  window.removeEventListener('resize', handleResize)
  darkObserver?.disconnect()
})
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/30"></div>
      <div
        class="relative text-center text-white z-10 banner-content"
        :class="{ 'animate-in': contentVisible }"
      >
        <Icon icon="lucide:folder-open" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-3xl md:text-4xl font-bold drop-shadow-lg">Categories</h1>
        <p class="mt-2 text-white/80 text-sm leading-relaxed">{{ blogStore.allCategories.length }} categories in total</p>
      </div>
      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div v-if="blogStore.isLoading" class="card p-16 text-center">
        <div class="inline-flex flex-col items-center">
          <div class="w-12 h-12 rounded-xl bg-[#7CB342]/20 flex items-center justify-center mb-3">
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-[#7CB342] border-t-transparent"></div>
          </div>
          <p class="text-gray-500 text-sm leading-relaxed">Loading...</p>
        </div>
      </div>

      <template v-else>
        <!-- Category List -->
        <div
          class="card p-8 md:p-10 mb-8 content-block"
          :class="{ 'animate-in': contentVisible }"
        >
          <div class="cat-list text-center leading-loose">
            <button
              v-for="cat in sortedCategories"
              :key="cat.name"
              @click="selectCategory(cat.name)"
              class="cat-item"
              :class="{ 'cat-active': selectedCategory === cat.name }"
            >
              <span class="cat-dot" :style="{ borderColor: getCategoryColor(cat.name) }"></span>
              <span class="cat-name">{{ cat.name }}</span>
              <span class="cat-count">（{{ cat.count }}）</span>
            </button>
          </div>
        </div>

        <!-- Selected category posts -->
        <div v-if="selectedCategory" class="content-block mb-8" :class="{ 'animate-in': contentVisible }">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-gray-800 dark:text-white flex items-center leading-relaxed">
              <span
                class="w-7 h-7 rounded-lg flex items-center justify-center mr-2"
                :style="{ backgroundColor: getCategoryColor(selectedCategory) }"
              >
                <Icon icon="lucide:folder" class="w-3.5 h-3.5 text-white" />
              </span>
              {{ selectedCategory }}
              <span class="text-sm font-normal text-gray-400 ml-2 leading-relaxed">({{ filteredPosts.length }} posts)</span>
            </h2>
            <button
              @click="selectCategory(selectedCategory)"
              class="px-3 py-1.5 text-sm text-gray-500 hover:text-white hover:bg-red-500 rounded-lg transition-all flex items-center leading-relaxed"
            >
              <Icon icon="lucide:x" class="w-4 h-4 mr-1" />
              Clear
            </button>
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <PostCardCompact
              v-for="(post, index) in filteredPosts"
              :key="post.slug"
              :post="post"
              :index="index"
            />
          </div>
        </div>

        <!-- ECharts Pie Chart -->
        <div
          class="card p-6 md:p-8 content-block"
          :class="{ 'animate-in': contentVisible }"
          style="animation-delay: 100ms"
        >
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 rounded-lg bg-[#7CB342]/20 flex items-center justify-center">
              <Icon icon="lucide:pie-chart" class="w-4 h-4 text-[#7CB342]" />
            </div>
            <h3 class="text-sm font-bold text-gray-800 dark:text-white leading-relaxed">Category Distribution</h3>
          </div>
          <div ref="chartContainer" class="chart-box"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* ============ Animations ============ */
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

/* ============ Category List ============ */
.cat-list {
  line-height: 2.8;
  word-spacing: 2px;
}

.cat-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px 5px;
  margin: 0 4px;
  cursor: pointer;
  transition: all 0.25s ease;
  border-radius: 6px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: var(--font-color);
  line-height: 1.6;
}

.cat-item:hover {
  background: rgba(124, 179, 66, 0.08);
}

.cat-item.cat-active {
  background: var(--theme-color);
  color: white;
}

.cat-item.cat-active .cat-dot {
  border-color: white !important;
}

.cat-item.cat-active .cat-count {
  color: rgba(255, 255, 255, 0.8);
}

.cat-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 3px solid currentColor;
  background: transparent;
}

.cat-name {
  font-weight: 500;
}

.cat-count {
  font-size: 12px;
  color: var(--font-color-muted);
  line-height: 1;
}

/* ============ ECharts Container ============ */
.chart-box {
  width: 100%;
  height: 420px;
}

@media (max-width: 640px) {
  .chart-box {
    height: 360px;
  }
}
</style>
