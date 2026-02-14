<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import PostCardCompact from '@/components/PostCardCompact.vue'

const route = useRoute()
const blogStore = useBlogStore()

const selectedTag = ref<string | null>(null)
const contentVisible = ref(false)

onMounted(() => {
  setTimeout(() => { contentVisible.value = true }, 200)
})

watch(
  () => route.query.tag,
  (tag) => { selectedTag.value = tag as string | null },
  { immediate: true }
)

const filteredPosts = computed(() => {
  if (!selectedTag.value) return []
  return blogStore.getPostsByTag(selectedTag.value)
})

function selectTag(tag: string) {
  if (selectedTag.value === tag) {
    selectedTag.value = null
    // Update URL without triggering router navigation
    const base = import.meta.env.BASE_URL || '/'
    window.history.replaceState({}, '', `${base}tags`)
  } else {
    selectedTag.value = tag
    const base = import.meta.env.BASE_URL || '/'
    window.history.replaceState({}, '', `${base}tags?tag=${encodeURIComponent(tag)}`)
  }
}

// Tag cloud: compute font size based on count
function getTagFontSize(count: number): string {
  const max = Math.max(...blogStore.allTags.map(t => t.count), 1)
  const min = Math.min(...blogStore.allTags.map(t => t.count), 1)
  const range = max - min || 1
  const ratio = (count - min) / range
  // Scale from 13px to 32px
  const size = 13 + ratio * 19
  return `${size}px`
}

// Tag cloud: compute font weight based on count
function getTagFontWeight(count: number): number {
  const max = Math.max(...blogStore.allTags.map(t => t.count), 1)
  const ratio = count / max
  if (ratio > 0.6) return 700
  if (ratio > 0.3) return 600
  return 400
}

// Deterministic color from tag name
const tagColors = [
  '#E53935', '#D81B60', '#8E24AA', '#5E35B1',
  '#3949AB', '#1E88E5', '#039BE5', '#00ACC1',
  '#00897B', '#43A047', '#7CB342', '#C0CA33',
  '#FDD835', '#FFB300', '#FB8C00', '#F4511E',
  '#6D4C41', '#546E7A', '#EC407A', '#AB47BC',
  '#7E57C2', '#5C6BC0', '#42A5F5', '#26C6DA',
  '#26A69A', '#66BB6A', '#9CCC65', '#D4E157',
  '#FFEE58', '#FFCA28', '#FFA726', '#FF7043',
]

function getTagColor(name: string): string {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return tagColors[hash % tagColors.length]
}

// Top 10 tags for bar chart
const top10Tags = computed(() => {
  return [...blogStore.allTags]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
})

const maxTopCount = computed(() => {
  return top10Tags.value.length > 0 ? top10Tags.value[0].count : 1
})

// Bar chart gradient colors
const barGradients = [
  ['#00C9A7', '#00B4D8'],
  ['#00D2B4', '#20C997'],
  ['#2DC9A0', '#38D9A9'],
  ['#45D9A5', '#51CF66'],
  ['#5DD9A0', '#69DB7C'],
  ['#6DD99A', '#82D98C'],
  ['#80D990', '#94D082'],
  ['#92D985', '#A9C97A'],
  ['#A4D07A', '#BCC172'],
  ['#B5C76F', '#CEB968'],
]
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
        <Icon icon="lucide:tags" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-3xl md:text-4xl font-bold drop-shadow-lg">Tags</h1>
        <p class="mt-2 text-white/80 text-sm leading-relaxed">{{ blogStore.allTags.length }} tags in total</p>
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
        <!-- Tag Cloud -->
        <div
          class="card p-8 md:p-10 mb-8 content-block"
          :class="{ 'animate-in': contentVisible }"
        >
          <div class="tag-cloud text-center leading-loose">
            <button
              v-for="tag in blogStore.allTags"
              :key="tag.name"
              @click="selectTag(tag.name)"
              class="tag-cloud-item"
              :class="{ 'tag-active': selectedTag === tag.name }"
              :style="{
                fontSize: getTagFontSize(tag.count),
                fontWeight: getTagFontWeight(tag.count),
                color: selectedTag === tag.name ? 'white' : getTagColor(tag.name),
              }"
            >
              {{ tag.name }}<sup class="tag-sup">{{ tag.count }}</sup>
            </button>
          </div>
        </div>

        <!-- Selected tag posts (above chart) -->
        <div v-if="selectedTag" class="content-block mb-8" :class="{ 'animate-in': contentVisible }">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-gray-800 dark:text-white flex items-center leading-relaxed">
              <span class="w-7 h-7 rounded-lg bg-[#7CB342]/20 flex items-center justify-center mr-2">
                <Icon icon="lucide:hash" class="w-3.5 h-3.5 text-[#7CB342]" />
              </span>
              {{ selectedTag }}
              <span class="text-sm font-normal text-gray-400 ml-2 leading-relaxed">({{ filteredPosts.length }} posts)</span>
            </h2>
            <button
              @click="selectTag(selectedTag)"
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

        <!-- Top 10 Bar Chart -->
        <div
          class="card p-6 md:p-8 mb-8 content-block"
          :class="{ 'animate-in': contentVisible }"
          style="animation-delay: 100ms"
        >
          <div class="flex items-center gap-2 mb-6">
            <div class="w-8 h-8 rounded-lg bg-[#7CB342]/20 flex items-center justify-center">
              <Icon icon="lucide:bar-chart-3" class="w-4 h-4 text-[#7CB342]" />
            </div>
            <h3 class="text-sm font-bold text-gray-800 dark:text-white leading-relaxed">Top 10 Tags</h3>
          </div>
          <div class="chart-area">
            <!-- Y axis labels + bars -->
            <div class="chart-body">
              <!-- Y axis gridlines -->
              <div class="chart-grid">
                <div
                  v-for="tick in 7"
                  :key="tick"
                  class="chart-gridline"
                  :style="{ bottom: ((tick - 1) / 6) * 100 + '%' }"
                >
                  <span class="chart-y-label">{{ Math.round(maxTopCount * (tick - 1) / 6) }}</span>
                </div>
              </div>
              <!-- Bars -->
              <div class="chart-bars">
                <div
                  v-for="(tag, index) in top10Tags"
                  :key="tag.name"
                  class="chart-bar-col"
                >
                  <div class="chart-bar-wrapper">
                    <div
                      class="chart-bar"
                      :style="{
                        height: (tag.count / maxTopCount) * 100 + '%',
                        background: `linear-gradient(180deg, ${barGradients[index][0]}, ${barGradients[index][1]})`,
                        animationDelay: index * 80 + 'ms',
                      }"
                    >
                      <span class="chart-bar-value">{{ tag.count }}</span>
                    </div>
                  </div>
                  <span class="chart-x-label" :title="tag.name">{{ tag.name }}</span>
                </div>
              </div>
            </div>
          </div>
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

/* ============ Tag Cloud ============ */
.tag-cloud {
  line-height: 2.6;
  word-spacing: 4px;
}

.tag-cloud-item {
  display: inline;
  padding: 2px 6px;
  margin: 0 2px;
  transition: all 0.25s ease;
  border-radius: 4px;
  border: none;
  outline: none;
  background: transparent;
  vertical-align: baseline;
}

.tag-cloud-item:hover {
  opacity: 0.75;
  transform: scale(1.05);
}

.tag-cloud-item.tag-active {
  background: var(--theme-color);
  color: white !important;
  border-radius: 6px;
  padding: 2px 8px;
}

.tag-cloud-item.tag-active .tag-sup {
  color: rgba(255, 255, 255, 0.8);
}

.tag-sup {
  font-size: 0.6em;
  font-weight: 400;
  opacity: 0.7;
  margin-left: 1px;
  vertical-align: super;
  line-height: 0;
}

/* ============ Bar Chart ============ */
.chart-area {
  width: 100%;
  overflow-x: auto;
}

.chart-body {
  position: relative;
  height: 260px;
  min-width: 500px;
  padding-left: 45px;
  padding-bottom: 40px;
}

.chart-grid {
  position: absolute;
  inset: 0;
  left: 45px;
  bottom: 40px;
}

.chart-gridline {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
}

.dark .chart-gridline {
  background: rgba(255, 255, 255, 0.06);
}

.chart-y-label {
  position: absolute;
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  color: #9ca3af;
  white-space: nowrap;
  line-height: normal;
}

.chart-bars {
  position: absolute;
  left: 45px;
  right: 0;
  bottom: 40px;
  top: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  gap: 8px;
  padding: 0 8px;
}

.chart-bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  height: 100%;
}

.chart-bar-wrapper {
  flex: 1;
  width: 100%;
  max-width: 52px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.chart-bar {
  width: 100%;
  border-radius: 6px 6px 2px 2px;
  position: relative;
  min-height: 4px;
  animation: barGrow 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transform-origin: bottom;
  opacity: 0;
}

.chart-bar-value {
  position: absolute;
  top: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
  line-height: normal;
}

.dark .chart-bar-value {
  color: #9ca3af;
}

.chart-x-label {
  margin-top: 10px;
  font-size: 11px;
  color: #6b7280;
  text-align: center;
  max-width: 64px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
  line-height: normal;
}

.dark .chart-x-label {
  color: #9ca3af;
}

@keyframes barGrow {
  from {
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}
</style>
