<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { IMAGES, COVER_IMAGES } from '@/utils/assets'

const shuoshuoList = [
  {
    id: 1,
    content: '今天天气真好，适合写代码！☀️',
    time: '2026-02-05 14:30',
    likes: 12,
    mood: 'happy',
    images: [],
  },
  {
    id: 2,
    content: '终于把这个 Vue 博客重构好了，花了不少时间，但是效果很满意。感谢自己的坚持！',
    time: '2026-02-04 22:15',
    likes: 28,
    mood: 'proud',
    images: [COVER_IMAGES[0]],
  },
  {
    id: 3,
    content: '读了一本好书《代码整洁之道》，收获很多。好的代码就像好的文章一样，需要反复打磨。',
    time: '2026-02-03 10:00',
    likes: 45,
    mood: 'thoughtful',
    images: [],
  },
  {
    id: 4,
    content: '周末去爬山了，山顶的风景真的太美了！🏔️',
    time: '2026-02-01 18:30',
    likes: 67,
    mood: 'excited',
    images: [COVER_IMAGES[4], COVER_IMAGES[5]],
  },
  {
    id: 5,
    content: '新年快乐！2026年的第一条说说，希望今年一切顺利！🎉',
    time: '2026-01-01 00:01',
    likes: 128,
    mood: 'happy',
    images: [],
  },
]

function getMoodIcon(mood: string) {
  const moods: Record<string, string> = {
    happy: 'fas:smile-beam',
    proud: 'fas:grin-stars',
    thoughtful: 'fas:lightbulb',
    excited: 'fas:heart',
    sad: 'fas:sad-tear',
  }
  return moods[mood] || 'fas:meh'
}

function getMoodColor(mood: string) {
  const colors: Record<string, string> = {
    happy: 'text-yellow-500',
    proud: 'text-purple-500',
    thoughtful: 'text-blue-500',
    excited: 'text-pink-500',
    sad: 'text-gray-500',
  }
  return colors[mood] || 'text-gray-500'
}
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/30"></div>
      
      <div class="relative text-center text-white z-10">
        <Icon icon="fas:feather-alt" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">说说</h1>
        <p class="mt-3 text-white/80 text-lg">记录生活的点点滴滴</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- 说说列表 -->
      <div class="space-y-5">
        <div 
          v-for="shuoshuo in shuoshuoList"
          :key="shuoshuo.id"
          class="card p-5"
        >
          <!-- 头部 -->
          <div class="flex items-center mb-4">
            <div class="avatar-ring w-12 h-12">
              <img 
                :src="IMAGES.avatar" 
                alt="Avatar"
                class="w-full h-full rounded-full object-cover"
              />
            </div>
            <div class="ml-3">
              <div class="font-bold text-gray-800 dark:text-white">乐官</div>
              <div class="text-xs text-gray-500 flex items-center">
                <Icon icon="fas:clock" class="w-3 h-3 mr-1" />
                {{ shuoshuo.time }}
              </div>
            </div>
            <Icon 
              :icon="getMoodIcon(shuoshuo.mood)" 
              class="w-6 h-6 ml-auto"
              :class="getMoodColor(shuoshuo.mood)"
            />
          </div>

          <!-- 内容 -->
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {{ shuoshuo.content }}
          </p>

          <!-- 图片 -->
          <div v-if="shuoshuo.images.length > 0" class="mt-4">
            <div 
              class="grid gap-2"
              :class="{
                'grid-cols-1': shuoshuo.images.length === 1,
                'grid-cols-2': shuoshuo.images.length === 2,
                'grid-cols-3': shuoshuo.images.length >= 3,
              }"
            >
              <img 
                v-for="(img, index) in shuoshuo.images"
                :key="index"
                :src="img"
                class="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                loading="lazy"
              />
            </div>
          </div>

          <!-- 底部操作 -->
          <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
            <button class="flex items-center text-gray-500 hover:text-pink-500 transition-colors text-sm group">
              <Icon icon="fas:heart" class="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" />
              <span>{{ shuoshuo.likes }}</span>
            </button>
            <button class="flex items-center text-gray-500 hover:text-[#49b1f5] transition-colors text-sm">
              <Icon icon="fas:comment" class="w-4 h-4 mr-1.5" />
              <span>评论</span>
            </button>
            <button class="flex items-center text-gray-500 hover:text-green-500 transition-colors text-sm">
              <Icon icon="fas:share" class="w-4 h-4 mr-1.5" />
              <span>分享</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="text-center mt-8">
        <button class="btn border border-[#49b1f5] text-[#49b1f5] hover:bg-[#49b1f5] hover:text-white">
          <Icon icon="fas:plus" class="w-4 h-4 mr-2" />
          加载更多
        </button>
      </div>
    </div>
  </div>
</template>
