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
  // Anime covers
  jojo: getAssetUrl('/img/jojo.webp'),
  shilaimu: getAssetUrl('/img/shilaimu.webp'),
  wenhaoyequan: getAssetUrl('/img/wenhaoyequan.webp'),
  jiandieguojiajia: getAssetUrl('/img/jiandieguojiajia.webp'),
  xiamuyourenzhang: getAssetUrl('/img/xiamuyourenzhang.webp'),
  feichangkeai: getAssetUrl('/img/feichangkeai.webp'),
  xugoutuili: getAssetUrl('/img/xugoutuili.webp'),
  huiyedaxiaojie: getAssetUrl('/img/huiyedaxiaojie.webp'),
  luren: getAssetUrl('/img/luren.webp'),
  shishou: getAssetUrl('/img/shishou.webp'),
  quanyecha: getAssetUrl('/img/quanyecha.webp'),
  wanitasi: getAssetUrl('/img/wanitasi.webp'),
  likelisi: getAssetUrl('/img/likelisi.webp'),
  tari: getAssetUrl('/img/tari.webp'),
  weiwenhuaming: getAssetUrl('/img/weiwenhuaming.webp'),
  siyue: getAssetUrl('/img/siyue.webp'),
  chenxi: getAssetUrl('/img/chenxi.webp'),
  chunwu: getAssetUrl('/img/chunwu.webp'),
  clannad: getAssetUrl('/img/clannad.webp'),
  yinghuazhuang: getAssetUrl('/img/yinghuazhuang.webp'),
  zeroone: getAssetUrl('/img/zeroone.webp'),
  buxiaomao: getAssetUrl('/img/buxiaomao.webp'),
  baixiang: getAssetUrl('/img/baixiang.jpeg'),
  bingguo: getAssetUrl('/img/bingguo.webp'),
  onepiece: getAssetUrl('/img/onepiece.webp'),
  naruto: getAssetUrl('/img/naruto.webp'),
  dragonball: getAssetUrl('/img/dragonball.webp'),
  yiquan: getAssetUrl('/img/yiquan.webp'),
  re: getAssetUrl('/img/re.webp'),
  shuangchengzhizhan: getAssetUrl('/img/shuangchengzhizhan.webp'),
  eightysixbu: getAssetUrl('/img/86bu.jpg'),
  jinjidejuren: getAssetUrl('/img/jinjidejuren.png'),
  // Movie covers
  qianren3: getAssetUrl('/img/qianren3.webp'),
  yinglunduijue: getAssetUrl('/img/yinglunduijue.webp'),
  jirikuaile: getAssetUrl('/img/jirikuaile.png'),
  aiqinggongyu: getAssetUrl('/img/aiqinggongyu.webp'),
  handoutegong3: getAssetUrl('/img/handoutegong3.jpg'),
  yaoshen: getAssetUrl('/img/yaoshen.jpg'),
  feichirensheng: getAssetUrl('/img/feichirensheng.jpg'),
  kuangrexingdong: getAssetUrl('/img/kuangrexingdong.jpg'),
  tianqizhizi: getAssetUrl('/img/tianqizhizi.jpeg'),
  mishitaotuo: getAssetUrl('/img/mishitaotuo.webp'),
  wusha: getAssetUrl('/img/wusha.jpg'),
  ziluolan: getAssetUrl('/img/ziluolan.webp'),
  tangtan3: getAssetUrl('/img/tangtan3.webp'),
  feihongdezidan: getAssetUrl('/img/feihongdezidan.jpg'),
  wodejiejie: getAssetUrl('/img/wodejiejie.jpg'),
  hongfageji: getAssetUrl('/img/hongfageji.jpg'),
  manjianghong: getAssetUrl('/img/manjianghong.jpg'),
  baonipingan: getAssetUrl('/img/baonipingan.png'),
  lingyazhilv: getAssetUrl('/img/lingyazhilv.jpg'),
  guzhuyizhi: getAssetUrl('/img/guzhuyizhi.webp'),
  qianren4: getAssetUrl('/img/qianren4.webp'),
  feichirensheng2: getAssetUrl('/img/feichirensheng2.jpg'),
  yaotaiyang: getAssetUrl('/img/yaotaiyang.webp'),
  wusha3: getAssetUrl('/img/wusha3.webp'),
  nezha2: getAssetUrl('/img/nezha2.webp'),
  liejinyouxi: getAssetUrl('/img/liejinyouxi.webp'),
  huihuaqiyuji: getAssetUrl('/img/huihuaqiyuji.jpg'),
  nisha: getAssetUrl('/img/nisha.webp'),
  langlangrensheng: getAssetUrl('/img/langlangrensheng.webp'),
  xiaoshuojia2: getAssetUrl('/img/xiaoshuojia2.webp'),
  bizhengming: getAssetUrl('/img/bizhengming.webp'),
  sishenlaile: getAssetUrl('/img/sishenlaile.jpg'),
  bufengzhuoying: getAssetUrl('/img/bufengzhuoying.webp'),
  eyi: getAssetUrl('/img/eyi.jpg'),
  xiaoyaoguai: getAssetUrl('/img/xiaoyaoguai.jpg'),
  dongwucheng2: getAssetUrl('/img/dongwucheng2.webp'),
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
