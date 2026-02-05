<script setup lang="ts">
import { Icon } from '@iconify/vue'

const fitnessLogs = [
  {
    date: '2026-02-05',
    type: '力量训练',
    icon: 'fas:dumbbell',
    color: 'from-orange-500 to-red-500',
    exercises: ['杠铃卧推 4x10', '哑铃飞鸟 3x12', '绳索夹胸 3x15'],
    duration: 60,
    note: '今天状态不错，卧推重量提升了5kg',
  },
  {
    date: '2026-02-03',
    type: '有氧运动',
    icon: 'fas:running',
    color: 'from-green-500 to-emerald-500',
    exercises: ['跑步机 5km', '椭圆机 20min', '拉伸 10min'],
    duration: 50,
    note: '配速比上次快了10秒/km',
  },
  {
    date: '2026-02-01',
    type: '背部训练',
    icon: 'fas:user',
    color: 'from-blue-500 to-cyan-500',
    exercises: ['引体向上 4x8', '杠铃划船 4x10', '高位下拉 3x12'],
    duration: 55,
    note: '引体向上终于能做8个了！',
  },
]

const stats = {
  totalDays: 45,
  thisWeek: 4,
  streak: 12,
}
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/40"></div>
      
      <div class="relative text-center text-white z-10">
        <Icon icon="fas:dumbbell" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">健身日寄</h1>
        <p class="mt-3 text-white/80 text-lg">自律给我自由</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="card p-5 text-center">
          <Icon icon="fas:calendar-check" class="w-8 h-8 text-[#49b1f5] mx-auto" />
          <div class="text-2xl font-bold text-gray-800 dark:text-white mt-2">{{ stats.totalDays }}</div>
          <div class="text-sm text-gray-500">累计打卡</div>
        </div>
        <div class="card p-5 text-center">
          <Icon icon="fas:fire" class="w-8 h-8 text-orange-500 mx-auto" />
          <div class="text-2xl font-bold text-gray-800 dark:text-white mt-2">{{ stats.streak }}</div>
          <div class="text-sm text-gray-500">连续打卡</div>
        </div>
        <div class="card p-5 text-center">
          <Icon icon="fas:chart-line" class="w-8 h-8 text-green-500 mx-auto" />
          <div class="text-2xl font-bold text-gray-800 dark:text-white mt-2">{{ stats.thisWeek }}</div>
          <div class="text-sm text-gray-500">本周训练</div>
        </div>
      </div>

      <!-- 健身日志 -->
      <div class="space-y-5">
        <div 
          v-for="log in fitnessLogs"
          :key="log.date"
          class="card p-5 md:p-6"
        >
          <div class="flex items-start gap-4">
            <!-- 图标 -->
            <div 
              class="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0 bg-gradient-to-br"
              :class="log.color"
            >
              <Icon :icon="log.icon" class="w-7 h-7" />
            </div>

            <div class="flex-1 min-w-0">
              <!-- 头部信息 -->
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h3 class="font-bold text-lg text-gray-800 dark:text-white">{{ log.type }}</h3>
                  <p class="text-sm text-gray-500 flex items-center mt-0.5">
                    <Icon icon="fas:calendar" class="w-3.5 h-3.5 mr-1" />
                    {{ log.date }}
                    <span class="mx-2">•</span>
                    <Icon icon="fas:clock" class="w-3.5 h-3.5 mr-1" />
                    {{ log.duration }} 分钟
                  </p>
                </div>
              </div>

              <!-- 训练内容 -->
              <div class="space-y-1.5 mb-3">
                <div 
                  v-for="exercise in log.exercises"
                  :key="exercise"
                  class="flex items-center text-gray-600 dark:text-gray-400 text-sm"
                >
                  <Icon icon="fas:check" class="w-3.5 h-3.5 mr-2 text-green-500" />
                  {{ exercise }}
                </div>
              </div>

              <!-- 备注 -->
              <div v-if="log.note" class="text-sm text-gray-500 dark:text-gray-400 italic border-l-2 border-[#49b1f5] pl-3 bg-gray-50 dark:bg-gray-800/30 py-2 rounded-r">
                <Icon icon="fas:quote-left" class="w-3 h-3 inline mr-1 opacity-50" />
                {{ log.note }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 激励 -->
      <div class="card p-6 mt-8 text-center bg-gradient-to-r from-[#49b1f5]/10 to-[#0abcf9]/10">
        <Icon icon="fas:trophy" class="w-12 h-12 text-yellow-500 mx-auto mb-3" />
        <p class="text-lg font-medium text-gray-800 dark:text-white">
          "The only bad workout is the one that didn't happen."
        </p>
        <p class="text-sm text-gray-500 mt-1">—— 最差的锻炼就是那没发生的</p>
      </div>
    </div>
  </div>
</template>
