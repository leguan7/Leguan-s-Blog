<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="text-center">
      <!-- 404 动画数字 -->
      <div class="relative mb-8">
        <div class="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#49b1f5] to-[#0abcf9] leading-none select-none opacity-20">
          404
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <Icon icon="fas:ghost" class="w-24 h-24 md:w-32 md:h-32 text-[#49b1f5] animate-float" />
        </div>
      </div>

      <!-- 信息 -->
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
        哎呀，页面走丢了
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
        你访问的页面可能已被删除、移动或从未存在过。<br>
        不要担心，让我们帮你找到回家的路！
      </p>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <router-link to="/" class="btn btn-primary">
          <Icon icon="fas:home" class="w-4 h-4 mr-2" />
          返回首页
        </router-link>
        <button @click="$router.back()" class="btn border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[#49b1f5] hover:text-[#49b1f5]">
          <Icon icon="fas:arrow-left" class="w-4 h-4 mr-2" />
          返回上一页
        </button>
      </div>

      <!-- 热门页面推荐 -->
      <div class="mt-12 text-left max-w-md mx-auto card p-5">
        <h3 class="font-bold text-gray-800 dark:text-white mb-3 flex items-center text-sm">
          <Icon icon="fas:compass" class="w-4 h-4 mr-2 text-[#49b1f5]" />
          你可能想去的页面
        </h3>
        <div class="space-y-2">
          <router-link 
            to="/archives"
            class="flex items-center text-gray-600 dark:text-gray-400 hover:text-[#49b1f5] transition-colors text-sm py-1"
          >
            <Icon icon="fas:archive" class="w-4 h-4 mr-2" />
            归档 - 查看所有文章
          </router-link>
          <router-link 
            to="/categories"
            class="flex items-center text-gray-600 dark:text-gray-400 hover:text-[#49b1f5] transition-colors text-sm py-1"
          >
            <Icon icon="fas:folder-open" class="w-4 h-4 mr-2" />
            分类 - 按分类浏览
          </router-link>
          <router-link 
            to="/tags"
            class="flex items-center text-gray-600 dark:text-gray-400 hover:text-[#49b1f5] transition-colors text-sm py-1"
          >
            <Icon icon="fas:tags" class="w-4 h-4 mr-2" />
            标签 - 按标签浏览
          </router-link>
          <router-link 
            to="/about"
            class="flex items-center text-gray-600 dark:text-gray-400 hover:text-[#49b1f5] transition-colors text-sm py-1"
          >
            <Icon icon="fas:user" class="w-4 h-4 mr-2" />
            关于 - 了解博主
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
