import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Post, PostMeta } from '@/types'
import { parseMarkdown, extractExcerpt } from '@/utils/markdown'

export const useBlogStore = defineStore('blog', () => {
  // State
  const posts = ref<Post[]>([])
  const isLoading = ref(false)
  const isDark = ref(false)
  const searchQuery = ref('')

  // Computed properties
  const sortedPosts = computed(() => {
    return [...posts.value].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  })

  const filteredPosts = computed(() => {
    if (!searchQuery.value) return sortedPosts.value
    const query = searchQuery.value.toLowerCase()
    return sortedPosts.value.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query)) ||
      post.categories.some(cat => cat.toLowerCase().includes(query))
    )
  })

  const allTags = computed(() => {
    const tagMap = new Map<string, number>()
    posts.value.forEach(post => {
      post.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
      })
    })
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  })

  const allCategories = computed(() => {
    const catMap = new Map<string, number>()
    posts.value.forEach(post => {
      post.categories.forEach(cat => {
        catMap.set(cat, (catMap.get(cat) || 0) + 1)
      })
    })
    return Array.from(catMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  })

  const archivesByYear = computed(() => {
    const archiveMap = new Map<string, Post[]>()
    sortedPosts.value.forEach(post => {
      const year = new Date(post.date).getFullYear().toString()
      if (!archiveMap.has(year)) {
        archiveMap.set(year, [])
      }
      archiveMap.get(year)!.push(post)
    })
    return Array.from(archiveMap.entries())
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
  })

  // Methods
  async function loadPosts() {
    isLoading.value = true
    try {
      // Load post list metadata
      const response = await fetch(`${import.meta.env.BASE_URL}posts/index.json`)
      const postMetas: PostMeta[] = await response.json()

      // Load each post's content
      const loadedPosts = await Promise.all(
        postMetas.map(async (meta) => {
          try {
            const contentResponse = await fetch(`${import.meta.env.BASE_URL}posts/${meta.slug}.md`)
            const markdown = await contentResponse.text()
            const { content, html } = parseMarkdown(markdown)
            
            return {
              ...meta,
              content,
              html,
              excerpt: meta.excerpt || extractExcerpt(content)
            } as Post
          } catch (error) {
            console.error(`Failed to load post: ${meta.slug}`, error)
            return null
          }
        })
      )

      posts.value = loadedPosts.filter((post): post is Post => post !== null)
    } catch (error) {
      console.error('Failed to load posts:', error)
      // Use built-in default posts
      posts.value = getDefaultPosts()
    } finally {
      isLoading.value = false
    }
  }

  function getPostBySlug(slug: string): Post | undefined {
    return posts.value.find(post => post.slug === slug)
  }

  function getPostsByTag(tag: string): Post[] {
    return sortedPosts.value.filter(post => post.tags.includes(tag))
  }

  function getPostsByCategory(category: string): Post[] {
    return sortedPosts.value.filter(post => post.categories.includes(category))
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      isDark.value = true
      document.documentElement.classList.add('dark')
    }
  }

  function toggleTheme() {
    isDark.value = !isDark.value
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  return {
    // State
    posts,
    isLoading,
    isDark,
    searchQuery,
    // Computed
    sortedPosts,
    filteredPosts,
    allTags,
    allCategories,
    archivesByYear,
    // Methods
    loadPosts,
    getPostBySlug,
    getPostsByTag,
    getPostsByCategory,
    initTheme,
    toggleTheme,
    setSearchQuery
  }
})

// Default posts (used when loading fails)
function getDefaultPosts(): Post[] {
  return [
    {
      slug: 'english-listening-study',
      title: "English Listening: A Beginner's Guide",
      date: '2026-02-09',
      tags: ['English Learning', 'Listening', 'Study Methods'],
      categories: ['English Learning'],
      cover: 'img/EnglishListening.webp',
      excerpt: 'Two proven methods for improving English listening — intensive drills with YouTube and learning through Peppa Pig cartoons on Bilibili.',
      content: "# A Beginner's Guide to Improving English Listening\n\nTwo effective approaches — intensive listening drills and learning through cartoons.",
      html: "<h1>A Beginner's Guide to Improving English Listening</h1><p>Two effective approaches — intensive listening drills and learning through cartoons.</p>"
    },
    {
      slug: 'photography-sea-bridge',
      title: 'Photography Notes: How to Photograph a Sea Bridge',
      date: '2026-02-07',
      tags: ['Photography', 'Composition', 'Mobile Photography', 'Landscape'],
      categories: ['Photography Learning'],
      cover: 'img/sea05.jpeg',
      excerpt: 'Three composition techniques for shooting a sea bridge — half-split, negative space, and frame composition with trees.',
      content: '# Photography Notes: Shooting a Sea Bridge\n\nThree composition techniques for photographing a sea bridge with a smartphone.',
      html: '<h1>Photography Notes: Shooting a Sea Bridge</h1><p>Three composition techniques for photographing a sea bridge with a smartphone.</p>'
    }
  ]
}
