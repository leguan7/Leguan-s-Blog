export interface PostMeta {
  slug: string
  title: string
  date: string
  tags: string[]
  categories: string[]
  cover?: string
  excerpt?: string
}

export interface Post extends PostMeta {
  content: string
  html: string
}

export interface Tag {
  name: string
  count: number
}

export interface Category {
  name: string
  count: number
}

export interface NavItem {
  name: string
  path?: string
  icon?: string
  children?: NavItem[]
}

export interface SiteConfig {
  title: string
  subtitle: string
  description: string
  author: string
  avatar: string
  social: {
    github?: string
    twitter?: string
    email?: string
  }
}
