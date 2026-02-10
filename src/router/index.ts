import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { title: 'Home' }
    },
    {
      path: '/post/:slug',
      name: 'post',
      component: () => import('@/views/Post.vue'),
      meta: { title: 'Post' }
    },
    {
      path: '/archives',
      name: 'archives',
      component: () => import('@/views/Archives.vue'),
      meta: { title: 'Archives' }
    },
    {
      path: '/tags',
      name: 'tags',
      component: () => import('@/views/Tags.vue'),
      meta: { title: 'Tags' }
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/Categories.vue'),
      meta: { title: 'Categories' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue'),
      meta: { title: 'About Me' }
    },
    {
      path: '/links',
      name: 'links',
      component: () => import('@/views/Links.vue'),
      meta: { title: 'Friends' }
    },
    {
      path: '/messageboard',
      name: 'messageboard',
      component: () => import('@/views/MessageBoard.vue'),
      meta: { title: 'Guestbook' }
    },
    {
      path: '/bangumi',
      name: 'bangumi',
      component: () => import('@/views/Bangumi.vue'),
      meta: { title: 'Anime' }
    },
    {
      path: '/fitness',
      name: 'fitness',
      component: () => import('@/views/Fitness.vue'),
      meta: { title: 'Fitness' }
    },
    {
      path: '/shuoshuo',
      name: 'shuoshuo',
      component: () => import('@/views/Shuoshuo.vue'),
      meta: { title: 'Thoughts' }
    },
    {
      path: '/memory',
      name: 'memory',
      component: () => import('@/views/Memory.vue'),
      meta: { title: 'Memories' }
    },
    {
      path: '/tvseries',
      name: 'tvseries',
      component: () => import('@/views/TVSeries.vue'),
      meta: { title: 'TV Series' }
    },
    {
      path: '/movies',
      name: 'movies',
      component: () => import('@/views/Movies.vue'),
      meta: { title: 'Movies' }
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('@/views/Food.vue'),
      meta: { title: 'Games' }
    },
    {
      path: '/celebrities',
      name: 'celebrities',
      component: () => import('@/views/Celebrities.vue'),
      meta: { title: 'Celebrities' }
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

// Route guard - Update page title
router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string
  document.title = title ? `${title} | Leguan's Blog` : "Leguan's Blog"
  next()
})

export default router
