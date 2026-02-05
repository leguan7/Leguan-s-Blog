<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useBlogStore } from '@/stores/blog'
import { IMAGES, COVER_IMAGES, getCoverImage } from '@/utils/assets'

const router = useRouter()
const blogStore = useBlogStore()

const stats = computed(() => ({
  posts: blogStore.posts.length,
  tags: blogStore.allTags.length,
  categories: blogStore.allCategories.length
}))

const topTags = computed(() => blogStore.allTags.slice(0, 20))
const recentPosts = computed(() => blogStore.sortedPosts.slice(0, 5))

function getPostCover(post: any, index: number) {
  return post.cover || COVER_IMAGES[index % COVER_IMAGES.length]
}

function navigateToTag(tag: string) {
  router.push({ path: '/tags', query: { tag } })
}
</script>

<template>
  <aside class="space-y-5 lg:sticky lg:top-20">
    <!-- 博主信息卡片 - Kyle's Blog 风格 -->
    <div class="card overflow-hidden">
      <!-- 封面背景 -->
      <div 
        class="h-28 bg-cover bg-center relative"
        :style="{ backgroundImage: `url(${IMAGES.fantasyMagicLandscape})` }"
      >
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
      </div>
      
      <!-- 头像和信息 -->
      <div class="px-5 pb-5 -mt-14 text-center relative">
        <div class="avatar-ring inline-block mb-3">
          <img 
            :src="IMAGES.avatar" 
            alt="Leguan" 
            class="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-xl"
            onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=Leguan'"
          />
        </div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-white">Leguan</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">A person who wants to see the world</p>
        
        <!-- 统计 - Kyle's Blog 风格 -->
        <div class="flex justify-around mt-5 py-4 border-t border-b border-gray-100 dark:border-gray-700/50">
          <router-link to="/archives" class="text-center group cursor-pointer">
            <div class="text-xl font-bold text-gray-800 dark:text-white group-hover:text-[#49b1f5] transition-colors">{{ stats.posts }}</div>
            <div class="text-xs text-gray-500 mt-0.5">文章</div>
          </router-link>
          <router-link to="/tags" class="text-center group cursor-pointer">
            <div class="text-xl font-bold text-gray-800 dark:text-white group-hover:text-[#49b1f5] transition-colors">{{ stats.tags }}</div>
            <div class="text-xs text-gray-500 mt-0.5">标签</div>
          </router-link>
          <router-link to="/categories" class="text-center group cursor-pointer">
            <div class="text-xl font-bold text-gray-800 dark:text-white group-hover:text-[#49b1f5] transition-colors">{{ stats.categories }}</div>
            <div class="text-xs text-gray-500 mt-0.5">分类</div>
          </router-link>
        </div>

        <!-- 关注按钮 -->
        <a 
          href="https://github.com/leguan7" 
          target="_blank"
          class="mt-4 w-full btn btn-primary text-sm"
        >
          <Icon icon="fab:github" class="w-4 h-4 mr-2" />
          Follow Me
        </a>
      </div>
    </div>

    <!-- 公告栏 - Kyle's Blog 风格 -->
    <div class="card p-4">
      <div class="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700/50">
        <Icon icon="fas:bullhorn" class="w-4 h-4 text-[#49b1f5]" />
        <h4 class="font-bold text-gray-800 dark:text-white text-sm">公告栏</h4>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        欢迎来到 Leguan's Blog！<br/>
        <span class="text-[#49b1f5]">Digest your emotions.</span>
      </p>
    </div>

    <!-- 最新文章 -->
    <div class="card p-4">
      <div class="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700/50">
        <Icon icon="fas:history" class="w-4 h-4 text-[#49b1f5]" />
        <h4 class="font-bold text-gray-800 dark:text-white text-sm">最新文章</h4>
      </div>
      <div class="space-y-3">
        <router-link 
          v-for="(post, index) in recentPosts"
          :key="post.slug"
          :to="`/post/${post.slug}`"
          class="flex items-center space-x-3 group"
        >
          <img 
            :src="getPostCover(post, index)"
            :alt="post.title"
            class="w-16 h-12 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow"
          />
          <div class="flex-1 min-w-0">
            <h5 class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#49b1f5] transition-colors line-clamp-2 leading-tight">
              {{ post.title }}
            </h5>
            <p class="text-xs text-gray-400 mt-1">{{ post.date }}</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 标签云 - Kyle's Blog 风格 -->
    <div class="card p-4">
      <div class="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700/50">
        <Icon icon="fas:tags" class="w-4 h-4 text-[#49b1f5]" />
        <h4 class="font-bold text-gray-800 dark:text-white text-sm">标签</h4>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in topTags"
          :key="tag.name"
          @click="navigateToTag(tag.name)"
          class="tag text-xs"
        >
          {{ tag.name }}
        </button>
      </div>
      <router-link 
        v-if="blogStore.allTags.length > 20"
        to="/tags" 
        class="block mt-3 text-xs text-[#49b1f5] hover:text-[#ff7242] transition-colors text-center"
      >
        查看全部 <Icon icon="fas:angle-right" class="w-3 h-3 inline" />
      </router-link>
    </div>

    <!-- 分类 -->
    <div class="card p-4">
      <div class="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700/50">
        <Icon icon="fas:folder-open" class="w-4 h-4 text-[#49b1f5]" />
        <h4 class="font-bold text-gray-800 dark:text-white text-sm">分类</h4>
      </div>
      <div class="space-y-1.5">
        <router-link 
          v-for="category in blogStore.allCategories.slice(0, 8)"
          :key="category.name"
          :to="{ path: '/categories', query: { category: category.name } }"
          class="flex items-center justify-between py-1.5 px-2 -mx-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-[#49b1f5]/10 hover:text-[#49b1f5] transition-all duration-300"
        >
          <span class="flex items-center">
            <Icon icon="fas:caret-right" class="w-3 h-3 mr-1.5 text-[#49b1f5]" />
            {{ category.name }}
          </span>
          <span class="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-full">{{ category.count }}</span>
        </router-link>
      </div>
    </div>

    <!-- 网站资讯 -->
    <div class="card p-4">
      <div class="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700/50">
        <Icon icon="fas:chart-line" class="w-4 h-4 text-[#49b1f5]" />
        <h4 class="font-bold text-gray-800 dark:text-white text-sm">小站资讯</h4>
      </div>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between text-gray-600 dark:text-gray-400">
          <span>文章数目</span>
          <span class="text-[#49b1f5] font-medium">{{ stats.posts }}</span>
        </div>
        <div class="flex justify-between text-gray-600 dark:text-gray-400">
          <span>本站总字数</span>
          <span class="text-[#49b1f5] font-medium">10k+</span>
        </div>
        <div class="flex justify-between text-gray-600 dark:text-gray-400">
          <span>最后更新</span>
          <span class="text-[#49b1f5] font-medium">{{ new Date().toLocaleDateString('zh-CN') }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>
