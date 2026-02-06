// Get correct asset path with base URL
const BASE_URL = import.meta.env.BASE_URL || '/'

export function getAssetUrl(path: string): string {
  // If already a full URL or data URL, return directly
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path
  }
  
  // Remove leading slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // Concatenate base URL
  return `${BASE_URL}${cleanPath}`
}

// Image path constants
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
  qqQrCode: getAssetUrl('/img/QQ.png'),
  zhoushuhuizhan: getAssetUrl('/img/zhoushuhuizhan.png'),
}

// Cover image pool
export const COVER_IMAGES = [
  IMAGES.animeRainbowLandscape,
  IMAGES.fantasyAnimeScene,
  IMAGES.illustrationAnimeCity,
  IMAGES.animeCharactersSpace,
  IMAGES.fantasyMagicLandscape,
  IMAGES.animeLandscapeTraveling,
  IMAGES.animeCharacterTraveling,
]

// Get cover image by string hash
export function getCoverImage(seed: string): string {
  const hash = seed.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)
  const index = Math.abs(hash) % COVER_IMAGES.length
  return COVER_IMAGES[index]
}
