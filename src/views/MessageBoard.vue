<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const comment = ref('')
const nickname = ref('')
const email = ref('')

function submitComment() {
  alert('评论功能正在开发中...')
}
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/30"></div>
      
      <div class="relative text-center text-white z-10">
        <Icon icon="fas:comment-dots" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">留言板</h1>
        <p class="mt-3 text-white/80 text-lg">有什么想说的？留下你的足迹吧！</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- 留言表单 -->
      <div class="card p-6 md:p-8 mb-8">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-5 flex items-center">
          <Icon icon="fas:pen" class="w-5 h-5 mr-2 text-[#49b1f5]" />
          发表留言
        </h2>
        
        <form @submit.prevent="submitComment" class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <Icon icon="fas:user" class="w-3.5 h-3.5 inline mr-1" />
                昵称
              </label>
              <input 
                v-model="nickname"
                type="text" 
                required
                placeholder="你的昵称"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#49b1f5] focus:ring-2 focus:ring-[#49b1f5]/20 transition-all outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <Icon icon="fas:envelope" class="w-3.5 h-3.5 inline mr-1" />
                邮箱
              </label>
              <input 
                v-model="email"
                type="email" 
                placeholder="选填，用于获取头像"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#49b1f5] focus:ring-2 focus:ring-[#49b1f5]/20 transition-all outline-none"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <Icon icon="fas:comment" class="w-3.5 h-3.5 inline mr-1" />
              留言内容
            </label>
            <textarea 
              v-model="comment"
              rows="4"
              required
              placeholder="说点什么吧..."
              class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#49b1f5] focus:ring-2 focus:ring-[#49b1f5]/20 transition-all outline-none resize-none"
            ></textarea>
          </div>

          <button type="submit" class="btn btn-primary w-full md:w-auto">
            <Icon icon="fas:paper-plane" class="w-4 h-4 mr-2" />
            发表留言
          </button>
        </form>
      </div>

      <!-- 提示信息 -->
      <div class="card p-6 text-center">
        <Icon icon="fas:heart" class="w-12 h-12 text-pink-400 mx-auto mb-3" />
        <p class="text-gray-600 dark:text-gray-400">
          评论功能正在开发中，敬请期待！<br/>
          <span class="text-sm text-gray-400">你也可以通过邮件或 GitHub 联系我</span>
        </p>
        <div class="flex justify-center space-x-3 mt-4">
          <a href="https://github.com/leguan7" target="_blank" class="btn bg-gray-800 text-white hover:bg-gray-900 text-sm">
            <Icon icon="fab:github" class="w-4 h-4 mr-1.5" />
            GitHub
          </a>
          <a href="mailto:leguan@example.com" class="btn bg-red-500 text-white hover:bg-red-600 text-sm">
            <Icon icon="fas:envelope" class="w-4 h-4 mr-1.5" />
            Email
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
