// 获取正确的资源路径，考虑 base URL
const BASE_URL = import.meta.env.BASE_URL || '/'

export function getAssetUrl(path: string): string {
  // 如果已经是完整 URL 或者 data URL，直接返回
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path
  }
  
  // 移除开头的斜杠
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // 拼接 base URL
  return `${BASE_URL}${cleanPath}`
}

// 图片路径常量
export const IMAGES = {
  background: getAssetUrl('/img/background.jpg'),
  avatar: getAssetUrl('/img/avatar.jpg'),
  defaultCover: getAssetUrl('/img/default-cover.jpg'),
  aboutBg: getAssetUrl('/img/about-bg.jpg'),
  archiveBg: getAssetUrl('/img/archive-bg.jpg'),
  animeRainbowLandscape: getAssetUrl('/img/anime-rainbow-landscape.jpg'),
  fantasyAnimeScene: getAssetUrl('/img/fantasy-anime-style-scene.jpg'),
  illustrationAnimeCity: getAssetUrl('/img/illustration-anime-city.jpg'),
  animeCharactersSpace: getAssetUrl('/img/anime-style-characters-space.jpg'),
  fantasyMagicLandscape: getAssetUrl('/img/fantasy-magic-landscape.jpg'),
  animeLandscapeTraveling: getAssetUrl('/img/anime-landscape-person-traveling.jpg'),
  animeCharacterTraveling: getAssetUrl('/img/anime-character-traveling.jpg'),
}

// 封面图片池
export const COVER_IMAGES = [
  IMAGES.animeRainbowLandscape,
  IMAGES.fantasyAnimeScene,
  IMAGES.illustrationAnimeCity,
  IMAGES.animeCharactersSpace,
  IMAGES.fantasyMagicLandscape,
  IMAGES.animeLandscapeTraveling,
  IMAGES.animeCharacterTraveling,
]

// 根据字符串哈希获取封面图
export function getCoverImage(seed: string): string {
  const hash = seed.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)
  const index = Math.abs(hash) % COVER_IMAGES.length
  return COVER_IMAGES[index]
}
