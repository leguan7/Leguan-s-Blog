<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { COVER_IMAGES } from '@/utils/assets'

const memories = [
  {
    year: '2025',
    items: [
      { image: COVER_IMAGES[0], title: '秋日旅行', desc: '去了一趟云南，风景如画' },
      { image: COVER_IMAGES[1], title: '毕业季', desc: '告别校园，开启新旅程' },
      { image: COVER_IMAGES[2], title: '第一份工作', desc: '成为一名前端开发工程师' },
    ]
  },
  {
    year: '2024',
    items: [
      { image: COVER_IMAGES[3], title: '学会Vue', desc: '深入学习Vue3生态系统' },
      { image: COVER_IMAGES[4], title: '寒假旅行', desc: '和朋友一起去了北海道' },
      { image: COVER_IMAGES[5], title: '参加黑客马拉松', desc: '48小时不眠不休，收获满满' },
    ]
  },
  {
    year: '2023',
    items: [
      { image: COVER_IMAGES[6], title: '开始写博客', desc: '记录学习和生活的点滴' },
      { image: COVER_IMAGES[0], title: '养了一只猫', desc: '给它取名叫"代码"' },
    ]
  }
]
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/40"></div>
      
      <div class="relative text-center text-white z-10">
        <Icon icon="fas:images" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">相册</h1>
        <p class="mt-3 text-white/80 text-lg">时光机器，记录美好瞬间</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- 年份分组 -->
      <div v-for="group in memories" :key="group.year" class="mb-12 last:mb-0">
        <!-- 年份标题 -->
        <div class="flex items-center mb-6">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#49b1f5] to-[#0abcf9] flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {{ group.year }}
          </div>
          <div class="h-0.5 flex-1 ml-4 bg-gradient-to-r from-[#49b1f5]/50 to-transparent"></div>
        </div>

        <!-- 照片网格 -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div 
            v-for="(item, index) in group.items"
            :key="index"
            class="card overflow-hidden group cursor-pointer"
          >
            <div class="aspect-[4/3] relative overflow-hidden">
              <img 
                :src="item.image"
                :alt="item.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <!-- 悬浮遮罩 -->
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <h3 class="font-bold text-lg">{{ item.title }}</h3>
                <p class="text-sm text-white/80 mt-1">{{ item.desc }}</p>
              </div>
              <!-- 角落图标 -->
              <div class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon icon="fas:expand" class="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部统计 -->
      <div class="card p-6 text-center mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div class="flex justify-around">
          <div>
            <Icon icon="fas:images" class="w-8 h-8 text-purple-500 mx-auto mb-1" />
            <div class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ memories.reduce((acc, g) => acc + g.items.length, 0) }}
            </div>
            <div class="text-sm text-gray-500">照片数量</div>
          </div>
          <div>
            <Icon icon="fas:calendar-alt" class="w-8 h-8 text-pink-500 mx-auto mb-1" />
            <div class="text-2xl font-bold text-gray-800 dark:text-white">
              {{ memories.length }}
            </div>
            <div class="text-sm text-gray-500">记录年份</div>
          </div>
          <div>
            <Icon icon="fas:heart" class="w-8 h-8 text-red-500 mx-auto mb-1" />
            <div class="text-2xl font-bold text-gray-800 dark:text-white">∞</div>
            <div class="text-sm text-gray-500">美好回忆</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
