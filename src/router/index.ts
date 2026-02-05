import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { title: '首页' }
    },
    {
      path: '/post/:slug',
      name: 'post',
      component: () => import('@/views/Post.vue'),
      meta: { title: '文章' }
    },
    {
      path: '/archives',
      name: 'archives',
      component: () => import('@/views/Archives.vue'),
      meta: { title: '归档' }
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import('@/views/Tags.vue'),
      meta: { title: '标签' }
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/Categories.vue'),
      meta: { title: '分类' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue'),
      meta: { title: '关于我' }
    },
    {
      path: '/links',
      name: 'links',
      component: () => import('@/views/Links.vue'),
      meta: { title: '友人帐' }
    },
    {
      path: '/messageboard',
      name: 'messageboard',
      component: () => import('@/views/MessageBoard.vue'),
      meta: { title: '留言板' }
    },
    {
      path: '/bangumi',
      name: 'bangumi',
      component: () => import('@/views/Bangumi.vue'),
      meta: { title: '番剧' }
    },
    {
      path: '/fitness',
      name: 'fitness',
      component: () => import('@/views/Fitness.vue'),
      meta: { title: '健身日记' }
    },
    {
      path: '/shuoshuo',
      name: 'shuoshuo',
      component: () => import('@/views/Shuoshuo.vue'),
      meta: { title: '闲言碎语' }
    },
    {
      path: '/memory',
      name: 'memory',
      component: () => import('@/views/Memory.vue'),
      meta: { title: '记忆胶囊' }
    },
    {
      path: '/tvseries',
      name: 'tvseries',
      component: () => import('@/views/TVSeries.vue'),
      meta: { title: '追剧' }
    },
    {
      path: '/movies',
      name: 'movies',
      component: () => import('@/views/Movies.vue'),
      meta: { title: '电影' }
    },
    {
      path: '/food',
      name: 'food',
      component: () => import('@/views/Food.vue'),
      meta: { title: '美食' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
      meta: { title: '404' }
    }
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// 路由守卫 - 更新页面标题
router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string
  document.title = title ? `${title} | Leguan's Blog` : "Leguan's Blog"
  next()
})

export default router
