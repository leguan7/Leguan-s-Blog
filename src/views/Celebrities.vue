<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { getAssetUrl } from '@/utils/assets'

// Current celebrity
const activeCelebrity = ref<'tao' | 'harden'>('tao')

// Animation
const animateAll = ref(false)

onMounted(() => {
  animateAll.value = true
})

function switchCelebrity(id: 'tao' | 'harden') {
  if (activeCelebrity.value === id) return
  animateAll.value = false
  activeCelebrity.value = id
  nextTick(() => {
    animateAll.value = true
  })
}

// David Tao data
const taoImage = getAssetUrl('/img/Tao.avif')
const taoInfo = {
  name: 'David Tao',
  nameCn: '陶喆',
  born: 'July 11, 1969',
  birthPlace: 'Hong Kong, China',
  ancestralHome: 'Nanjing, Jiangsu',
  education: 'UCLA (University of California, Los Angeles)',
  roles: ['Mandopop Singer', 'Songwriter', 'Music Producer'],
  bio: 'Entered the music industry as a behind-the-scenes musician in 1993. In 1997, he released his debut album "David Tao" and introduced R&B into the Mandarin pop scene, winning both the "Best New Artist" and "Best Album Producer" awards at the 9th Golden Melody Awards in Taiwan.',
  quote: '"Music is the only language without borders."',
}

const taoDiscography = [
  { album: 'David Tao', year: '1997', highlight: true, songs: [
    { en: 'Beach', cn: '沙滩' },
    { en: 'Airport 10:30', cn: '飞机场的10:30' },
    { en: 'Love Can Be So Simple', cn: '爱，很简单' },
    { en: 'Spring Breeze', cn: '望春风' },
  ]},
  { album: "I'm OK", year: '1999', highlight: false, songs: [
    { en: 'Find Myself', cn: '找自己' },
    { en: 'Small Town Girl', cn: '小镇姑娘' },
    { en: 'Angeline', cn: 'Angeline' },
    { en: 'Moon Represents Whose Heart', cn: '月亮代表谁的心' },
  ]},
  { album: 'Black Tangerine', year: '2002', highlight: false, songs: [
    { en: 'Black Tangerine', cn: '黑色柳丁' },
    { en: 'Ghost', cn: '鬼' },
    { en: 'Dear God', cn: 'Dear God' },
    { en: 'Katrina', cn: 'Katrina' },
  ]},
  { album: 'The Road of Music 1997–2003', year: '2003', highlight: false, songs: [
    { en: 'Ordinary Friends', cn: '普通朋友' },
    { en: 'Olia', cn: 'Olia' },
    { en: 'Butterfly', cn: '蝴蝶' },
    { en: 'Hate Dream of the Red Chamber', cn: '讨厌红楼梦' },
  ]},
  { album: 'The Great Leap', year: '2005', highlight: false, songs: [
    { en: 'I Just Love You', cn: '就是爱你' },
    { en: 'Art of War', cn: '孙子兵法' },
    { en: 'Day by Day', cn: '天天' },
    { en: 'Susan Says', cn: 'Susan说' },
  ]},
  { album: 'Too Beautiful', year: '2006', highlight: false, songs: [
    { en: 'Too Beautiful', cn: '太美丽' },
    { en: 'Today You Will Marry Me', cn: '今天你要嫁给我' },
    { en: "Can't Forget", cn: '忘不了' },
    { en: 'Catherine', cn: 'Catherine' },
  ]},
  { album: '69 Movement', year: '2009', highlight: false, songs: [
    { en: '69 Movement', cn: '69乐章' },
    { en: 'In a Thought', cn: '一念之间' },
    { en: 'Aloha', cn: 'Aloha' },
    { en: 'About David Tao', cn: '关于陶喆' },
  ]},
  { album: 'Hello Goodbye', year: '2013', highlight: false, songs: [
    { en: 'Say Goodbye Properly', cn: '好好说再见' },
    { en: 'If One Day', cn: '如果有一天' },
    { en: 'Angel', cn: 'Angel' },
    { en: 'True Love Hold On', cn: '真爱等一下' },
  ]},
]

const taoTopSongs = [
  { en: 'Love Can Be So Simple', cn: '爱，很简单', album: 'David Tao', year: '1997' },
  { en: 'Ordinary Friends', cn: '普通朋友', album: 'The Road of Music', year: '2003' },
  { en: 'Find Myself', cn: '找自己', album: "I'm OK", year: '1999' },
  { en: 'I Just Love You', cn: '就是爱你', album: 'The Great Leap', year: '2005' },
  { en: 'Black Tangerine', cn: '黑色柳丁', album: 'Black Tangerine', year: '2002' },
  { en: 'Small Town Girl', cn: '小镇姑娘', album: "I'm OK", year: '1999' },
  { en: 'Day by Day', cn: '天天', album: 'The Great Leap', year: '2005' },
  { en: 'Susan Says', cn: 'Susan说', album: 'The Great Leap', year: '2005' },
  { en: 'Beach', cn: '沙滩', album: 'David Tao', year: '1997' },
  { en: 'Today You Will Marry Me', cn: '今天你要嫁给我', album: 'Too Beautiful', year: '2006' },
  { en: 'Airport 10:30', cn: '飞机场的10:30', album: 'David Tao', year: '1997' },
  { en: 'Quicksand', cn: '流沙', album: 'Black Tangerine', year: '2002' },
  { en: 'Melody', cn: 'Melody', album: 'Black Tangerine', year: '2002' },
  { en: 'Spring Breeze', cn: '望春风', album: 'David Tao', year: '1997' },
  { en: 'Too Beautiful', cn: '太美丽', album: 'Too Beautiful', year: '2006' },
]

// Harden data
const hardenImage = getAssetUrl('/img/Harden.webp')
const hardenInfo = {
  name: 'James Harden',
  fullName: 'James Edward Harden, Jr.',
  born: 'August 26, 1989',
  birthPlace: 'Los Angeles, California, USA',
  position: 'Guard',
  currentTeam: 'Cleveland Cavaliers',
  roles: ['NBA Player', 'Guard', 'All-Star'],
  bio: 'In the summer of 2003, he enrolled at Lakewood Artesia High School. In 2007, he entered Arizona State University and competed in college basketball. In the 2009 NBA Draft, he was selected 3rd overall by the Oklahoma City Thunder. On October 28, 2009, he made his professional debut, scoring 5 points and grabbing 2 rebounds. On October 28, 2012, Harden was traded to the Houston Rockets, marking the beginning of his rise to superstardom.',
}

const hardenCareer = [
  {
    team: 'Oklahoma City Thunder',
    period: '2009–2012',
    icon: '⚡',
    color: '#007AC1',
    highlights: [
      'Selected 3rd overall pick in the 2009 NBA Draft',
      'Excelled as the 6th man, showing superstar potential',
      'Won NBA Sixth Man of the Year for the 2011–12 season',
      'Reached the 2012 NBA Finals with the team',
    ],
  },
  {
    team: 'Houston Rockets',
    period: '2012–2021',
    icon: '🚀',
    color: '#CE1141',
    highlights: [
      'Averaged 36.1 PPG in 2017–18, winning the Regular Season MVP',
      '3× consecutive Scoring Champion (2018, 2019, 2020)',
      'Set a historic record of 32 consecutive 30+ point games in a single season',
      '8× All-Star selection, becoming a top-tier guard in the league',
      'Led the team to multiple Western Conference Finals',
    ],
  },
  {
    team: 'Brooklyn Nets',
    period: '2021–2022',
    icon: '🏙️',
    color: '#000000',
    highlights: [
      'Formed the "Big Three" alongside Kevin Durant and Kyrie Irving',
      'Season performance limited by injuries',
      'Traded to the Philadelphia 76ers mid-season',
    ],
  },
  {
    team: 'Philadelphia 76ers',
    period: '2022–2023',
    icon: '🔔',
    color: '#006BB6',
    highlights: [
      'Paired with Joel Embiid to build an Eastern Conference powerhouse',
      'Demonstrated outstanding playmaking and consistent output',
      'Ranked among the league leaders in assists',
    ],
  },
  {
    team: 'LA Clippers',
    period: '2023–2026',
    icon: '⛵',
    color: '#C8102E',
    isFavorite: true,
    highlights: [
      'Opened a new chapter by joining the Clippers',
      'Developed excellent chemistry with the team core',
      'Showcased veteran wisdom and leadership',
      "The blogger's favorite era!",
    ],
  },
  {
    team: 'Cleveland Cavaliers',
    period: '2026–Present',
    icon: '⚔️',
    color: '#860038',
    highlights: [
      'Joined the Cavaliers to continue his NBA journey',
      'Provides invaluable playoff experience for the team',
    ],
  },
]

const hardenHonors = [
  { title: 'NBA Regular Season MVP', count: '1×', year: '2018', icon: 'lucide:trophy' },
  { title: 'NBA All-Star', count: '10×', year: '2013–2023', icon: 'lucide:star' },
  { title: 'NBA Scoring Champion', count: '3×', year: '2018–2020', icon: 'lucide:flame' },
  { title: 'NBA Sixth Man of the Year', count: '1×', year: '2012', icon: 'lucide:medal' },
  { title: 'All-NBA First Team', count: '6×', year: '', icon: 'lucide:award' },
  { title: 'Olympic Gold Medal', count: '1×', year: '2012 London', icon: 'lucide:circle-dot' },
]
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/40"></div>

      <div class="relative text-center text-white z-10">
        <Icon icon="lucide:sparkles" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">My Favorites</h1>
        <p class="mt-3 text-white/80 text-lg leading-relaxed">Celebrities I admire</p>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Celebrity Switcher -->
      <div class="flex justify-center mb-8">
        <div class="celeb-switcher inline-flex rounded-full p-1">
          <button
            @click="switchCelebrity('tao')"
            class="celeb-switch-btn"
            :class="activeCelebrity === 'tao' ? 'active' : ''"
          >
            <Icon icon="lucide:music" class="w-4 h-4 mr-2" />
            David Tao
          </button>
          <button
            @click="switchCelebrity('harden')"
            class="celeb-switch-btn"
            :class="activeCelebrity === 'harden' ? 'active' : ''"
          >
            <Icon icon="lucide:dribbble" class="w-4 h-4 mr-2" />
            James Harden
          </button>
        </div>
      </div>

      <!-- ==================== TAO ==================== -->
      <transition name="content-switch" mode="out-in">
        <div v-if="activeCelebrity === 'tao'" key="tao">
          <!-- Profile Card: image + bio side by side -->
          <div
            class="card p-0 overflow-hidden mb-6 celeb-anim"
            :class="{ 'celeb-anim-in': animateAll }"
            style="animation-delay: 0ms"
          >
            <div class="flex flex-col md:flex-row">
              <!-- Portrait Image -->
              <div class="md:w-64 lg:w-72 flex-shrink-0 relative overflow-hidden profile-img-wrapper">
                <img
                  :src="taoImage"
                  alt="David Tao"
                  class="w-full h-64 md:h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <!-- Bio -->
              <div class="flex-1 p-6 md:p-8">
                <h2 class="text-3xl font-black text-gray-800 dark:text-white mb-0.5">{{ taoInfo.name }}</h2>
                <p class="text-[#7CB342] font-medium tracking-wider text-sm mb-4">{{ taoInfo.nameCn }}</p>
                <div class="flex flex-wrap gap-2 mb-5">
                  <span v-for="role in taoInfo.roles" :key="role" class="celeb-tag">{{ role }}</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm leading-relaxed">
                  <div class="flex items-center gap-2">
                    <Icon icon="lucide:cake" class="w-4 h-4 text-[#7CB342] flex-shrink-0" />
                    <span class="text-gray-500 dark:text-gray-400">Born</span>
                    <span class="ml-auto font-medium text-gray-800 dark:text-gray-200">{{ taoInfo.born }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon icon="lucide:map-pin" class="w-4 h-4 text-[#7CB342] flex-shrink-0" />
                    <span class="text-gray-500 dark:text-gray-400">Birthplace</span>
                    <span class="ml-auto font-medium text-gray-800 dark:text-gray-200">{{ taoInfo.birthPlace }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon icon="lucide:home" class="w-4 h-4 text-[#7CB342] flex-shrink-0" />
                    <span class="text-gray-500 dark:text-gray-400">Ancestry</span>
                    <span class="ml-auto font-medium text-gray-800 dark:text-gray-200">{{ taoInfo.ancestralHome }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon icon="lucide:graduation-cap" class="w-4 h-4 text-[#7CB342] flex-shrink-0" />
                    <span class="text-gray-500 dark:text-gray-400">Education</span>
                    <span class="ml-auto font-medium text-gray-800 dark:text-gray-200 text-right text-xs leading-relaxed">UCLA</span>
                  </div>
                </div>
                <div class="mt-5 p-4 rounded-xl bg-[#7CB342]/5 border border-[#7CB342]/10">
                  <p class="text-gray-700 dark:text-gray-300 leading-loose text-sm">{{ taoInfo.bio }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Blogger's Note -->
          <div
            class="card p-6 mb-6 celeb-anim blogger-note"
            :class="{ 'celeb-anim-in': animateAll }"
            style="animation-delay: 120ms"
          >
            <div class="flex items-start gap-4">
              <div class="w-11 h-11 rounded-full bg-gradient-to-br from-[#7CB342] to-[#8BC34A] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#7CB342]/20">
                <Icon icon="lucide:heart" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-800 dark:text-white mb-2">Blogger's Note</h3>
                <p class="text-gray-800 dark:text-gray-100 leading-relaxed">
                  Back when I was working in Hangzhou, I was going through a rough patch — burnout from
                  work had been quietly wearing me down. By sheer luck, a friend managed to grab a ticket
                  for me after I'd completely missed out on the sale. And so, by a twist of fate, I found
                  myself at <strong class="text-[#7CB342] font-semibold">Soul Power II in Hangzhou</strong>.
                  Hearing David Tao sing live washed away so much of that heaviness — it was the kind of
                  release I didn't know I needed. More than that, his music gave me a quiet push of courage
                  to step out of my comfort zone and seek a fresh start somewhere new. It's amazing what
                  music can do.
                </p>
              </div>
            </div>
          </div>

          <!-- Top Songs Playlist -->
          <div
            class="card p-6 md:p-8 mb-6 celeb-anim"
            :class="{ 'celeb-anim-in': animateAll }"
            style="animation-delay: 240ms"
          >
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7CB342]/20 to-[#8BC34A]/20 flex items-center justify-center">
                <Icon icon="lucide:list-music" class="w-5 h-5 text-[#7CB342]" />
              </div>
              <h2 class="text-xl font-bold text-gray-800 dark:text-white">Top Tracks</h2>
              <span class="text-gray-500 dark:text-gray-400 text-sm ml-auto leading-relaxed">{{ taoTopSongs.length }} songs</span>
            </div>
            <div class="playlist-list">
              <div
                v-for="(song, index) in taoTopSongs"
                :key="song.en"
                class="playlist-row group"
              >
                <div class="playlist-idx">
                  <span class="group-hover:hidden text-gray-400 dark:text-gray-500 text-sm font-mono leading-normal">{{ String(index + 1).padStart(2, '0') }}</span>
                  <Icon icon="lucide:play" class="w-4 h-4 text-[#7CB342] hidden group-hover:block" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-gray-800 dark:text-gray-100 text-sm font-medium leading-relaxed group-hover:text-[#7CB342] transition-colors">
                    {{ song.en }}
                    <span class="text-gray-400 dark:text-gray-500 font-normal text-xs ml-1.5">({{ song.cn }})</span>
                  </div>
                  <div class="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{{ song.album }}</div>
                </div>
                <div class="text-gray-400 dark:text-gray-500 text-xs font-mono leading-normal">{{ song.year }}</div>
              </div>
            </div>
          </div>

          <!-- Discography -->
          <div
            class="card p-6 md:p-8 mb-6 celeb-anim"
            :class="{ 'celeb-anim-in': animateAll }"
            style="animation-delay: 360ms"
          >
            <div class="flex items-center gap-3 mb-5">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7CB342]/20 to-[#8BC34A]/20 flex items-center justify-center">
                <Icon icon="lucide:disc-3" class="w-5 h-5 text-[#7CB342]" />
              </div>
              <h2 class="text-xl font-bold text-gray-800 dark:text-white">Discography</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="album in taoDiscography"
                :key="album.album"
                class="album-item group"
                :class="{ 'album-hl': album.highlight }"
              >
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-full bg-[#7CB342]/10 flex items-center justify-center">
                    <Icon icon="lucide:disc" class="w-5 h-5 text-[#7CB342] group-hover:animate-spin" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-gray-800 dark:text-white font-bold text-sm leading-relaxed">{{ album.album }}</h4>
                    <span class="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{{ album.year }}</span>
                  </div>
                  <span v-if="album.highlight" class="px-2.5 py-1 rounded-full bg-[#7CB342]/10 text-[#7CB342] text-[11px] font-bold flex-shrink-0 leading-normal">
                    DEBUT
                  </span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="song in album.songs"
                    :key="song.en"
                    class="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 leading-normal"
                    :title="song.cn"
                  >
                    {{ song.en }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== HARDEN ==================== -->
        <div v-else key="harden">
          <!-- Profile Card: image + bio side by side -->
          <div
            class="card p-0 overflow-hidden mb-6 celeb-anim"
            :class="{ 'celeb-anim-in': animateAll }"
            style="animation-delay: 0ms"
          >
            <div class="flex flex-col md:flex-row">
              <!-- Portrait Image -->
              <div class="md:w-64 lg:w-72 flex-shrink-0 relative overflow-hidden profile-img-wrapper">
                <img
                  :src="hardenImage"
                  alt="James Harden"
                  class="w-full h-64 md:h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <!-- Bio -->
              <div class="flex-1 p-6 md:p-8">
                <h2 class="text-3xl font-black text-gray-800 dark:text-white mb-0.5">{{ hardenInfo.name }}</h2>
                <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed mb-4">{{ hardenInfo.fullName }}</p>
                <div class="flex flex-wrap gap-2 mb-5">
                  <span v-for="role in hardenInfo.roles" :key="role" class="celeb-tag">{{ role }}</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm leading-relaxed">
                  <div class="flex items-center gap-2">
                    <Icon icon="lucide:cake" class="w-4 h-4 text-[#7CB342] flex-shrink-0" />
                    <span class="text-gray-500 dark:text-gray-400">Born</span>
                    <span class="ml-auto font-medium text-gray-800 dark:text-gray-200">{{ hardenInfo.born }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon icon="lucide:map-pin" class="w-4 h-4 text-[#7CB342] flex-shrink-0" />
                    <span class="text-gray-500 dark:text-gray-400">Birthplace</span>
                    <span class="ml-auto font-medium text-gray-800 dark:text-gray-200 text-right">{{ hardenInfo.birthPlace }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon icon="lucide:target" class="w-4 h-4 text-[#7CB342] flex-shrink-0" />
                    <span class="text-gray-500 dark:text-gray-400">Position</span>
                    <span class="ml-auto font-medium text-gray-800 dark:text-gray-200">{{ hardenInfo.position }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon icon="lucide:shield" class="w-4 h-4 text-[#7CB342] flex-shrink-0" />
                    <span class="text-gray-500 dark:text-gray-400">Team</span>
                    <span class="ml-auto font-medium text-gray-800 dark:text-gray-200 text-right">{{ hardenInfo.currentTeam }}</span>
                  </div>
                </div>
                <div class="mt-5 p-4 rounded-xl bg-[#7CB342]/5 border border-[#7CB342]/10">
                  <p class="text-gray-700 dark:text-gray-300 leading-loose text-sm">{{ hardenInfo.bio }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Blogger's Note -->
          <div
            class="card p-6 mb-6 celeb-anim blogger-note"
            :class="{ 'celeb-anim-in': animateAll }"
            style="animation-delay: 120ms"
          >
            <div class="flex items-start gap-4">
              <div class="w-11 h-11 rounded-full bg-gradient-to-br from-[#7CB342] to-[#8BC34A] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#7CB342]/20">
                <Icon icon="lucide:heart" class="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-800 dark:text-white mb-2">Blogger's Note</h3>
                <p class="text-gray-800 dark:text-gray-100 leading-relaxed">
                  I've always admired Harden, but I didn't become a true fan during his Rockets days —
                  I simply wasn't watching NBA regularly back then. Once I got to college, playing basketball
                  became a daily thing, and naturally I started following the league much more closely.
                  That's when I began paying real attention to Harden's journey. Watching him move from
                  team to team in pursuit of a championship hit differently — it made me genuinely root for
                  him to finally lift that trophy one day. By the way, my personal favorite version of
                  The Beard is <strong class="text-[#7CB342] font-semibold">Clippers Harden</strong> —
                  something about that era just feels right.
                </p>
              </div>
            </div>
          </div>

          <!-- Career Timeline -->
          <div
            class="card p-6 md:p-8 mb-6 celeb-anim"
            :class="{ 'celeb-anim-in': animateAll }"
            style="animation-delay: 240ms"
          >
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7CB342]/20 to-[#8BC34A]/20 flex items-center justify-center">
                <Icon icon="lucide:route" class="w-5 h-5 text-[#7CB342]" />
              </div>
              <h2 class="text-xl font-bold text-gray-800 dark:text-white">Career Journey</h2>
            </div>
            <div class="relative pl-8">
              <div class="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#7CB342] via-[#7CB342]/30 to-transparent"></div>
              <div class="space-y-5">
                <div
                  v-for="career in hardenCareer"
                  :key="career.team"
                  class="relative career-block"
                  :class="{ 'career-fav': career.isFavorite }"
                >
                  <!-- Dot -->
                  <div
                    class="absolute -left-5 w-4 h-4 rounded-full shadow-md"
                    :class="career.isFavorite ? 'ring-2 ring-[#7CB342]/30' : ''"
                    :style="{ backgroundColor: career.color }"
                  ></div>
                  <!-- Content -->
                  <div
                    class="ml-4 p-4 rounded-xl transition-all duration-300"
                    :class="career.isFavorite
                      ? 'bg-[#7CB342]/5 border border-[#7CB342]/15 hover:border-[#7CB342]/30'
                      : 'bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-800/50'"
                  >
                    <div class="flex items-center gap-3 mb-2 flex-wrap">
                      <span class="text-xl">{{ career.icon }}</span>
                      <div>
                        <h4 class="text-gray-800 dark:text-white font-bold text-sm leading-relaxed">{{ career.team }}</h4>
                        <span class="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{{ career.period }}</span>
                      </div>
                      <span
                        v-if="career.isFavorite"
                        class="ml-auto px-3 py-1.5 rounded-full bg-[#7CB342]/10 text-[#7CB342] text-xs font-bold flex items-center gap-1 leading-normal"
                      >
                        <Icon icon="lucide:heart" class="w-3 h-3" /> My Favorite
                      </span>
                    </div>
                    <ul class="space-y-1.5 mt-3">
                      <li
                        v-for="highlight in career.highlights"
                        :key="highlight"
                        class="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                      >
                        <Icon icon="lucide:chevron-right" class="w-4 h-4 text-[#7CB342]/60 mt-0.5 flex-shrink-0" />
                        <span>{{ highlight }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Honors -->
          <div
            class="card p-6 md:p-8 celeb-anim"
            :class="{ 'celeb-anim-in': animateAll }"
            style="animation-delay: 360ms"
          >
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7CB342]/20 to-[#8BC34A]/20 flex items-center justify-center">
                <Icon icon="lucide:trophy" class="w-5 h-5 text-[#7CB342]" />
              </div>
              <h2 class="text-xl font-bold text-gray-800 dark:text-white">Hall of Honors</h2>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div
                v-for="honor in hardenHonors"
                :key="honor.title"
                class="honor-item group text-center p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7CB342]/20 to-[#8BC34A]/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Icon :icon="honor.icon" class="w-6 h-6 text-[#7CB342]" />
                </div>
                <div class="text-gray-800 dark:text-gray-200 font-medium text-xs leading-relaxed mb-1">{{ honor.title }}</div>
                <div class="text-[#7CB342] font-black text-xl leading-normal">{{ honor.count }}</div>
                <div class="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mt-1" v-if="honor.year">{{ honor.year }}</div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* ============ Celebrity Switcher ============ */
.celeb-switcher {
  background: var(--card-bg);
  backdrop-filter: saturate(180%) blur(20px);
  border: 1px solid rgba(124, 179, 66, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.celeb-switch-btn {
  display: flex;
  align-items: center;
  padding: 10px 24px 12px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  border: none;
  outline: none;
  background: transparent;
  color: var(--font-color-muted);
}

.celeb-switch-btn:hover:not(.active) {
  color: var(--font-color);
  background: rgba(124, 179, 66, 0.06);
}

.celeb-switch-btn.active {
  background: linear-gradient(135deg, #7CB342, #8BC34A);
  color: white;
  box-shadow: 0 4px 15px rgba(124, 179, 66, 0.35);
}

/* ============ Tags (override for descender-safe padding) ============ */
.celeb-tag {
  display: inline-block;
  padding: 4px 12px 6px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 9999px;
  background: rgba(124, 179, 66, 0.15);
  color: var(--theme-color);
  transition: all 0.3s;
}

.celeb-tag:hover {
  background: var(--theme-color);
  color: white;
}

/* ============ Profile Image ============ */
.profile-img-wrapper {
  min-height: 240px;
}

@media (min-width: 768px) {
  .profile-img-wrapper {
    min-height: 320px;
  }
}

/* ============ Blogger Note ============ */
.blogger-note {
  border-left: 4px solid #7CB342;
  background: linear-gradient(135deg, rgba(124, 179, 66, 0.04), transparent);
}

/* ============ Playlist ============ */
.playlist-list {
  border-radius: 12px;
  overflow: hidden;
}

.playlist-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px 14px;
  border-bottom: 1px solid rgba(124, 179, 66, 0.06);
  transition: background 0.2s;
  cursor: default;
  border-radius: 8px;
}

.playlist-row:last-child {
  border-bottom: none;
}

.playlist-row:hover {
  background: rgba(124, 179, 66, 0.06);
}

.playlist-idx {
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ============ Album Items ============ */
.album-item {
  padding: 16px;
  border-radius: 14px;
  background: rgba(124, 179, 66, 0.03);
  border: 1px solid rgba(124, 179, 66, 0.06);
  transition: all 0.3s ease;
}

.album-item:hover {
  background: rgba(124, 179, 66, 0.06);
  border-color: rgba(124, 179, 66, 0.15);
  transform: translateY(-2px);
}

.album-hl {
  border-color: rgba(124, 179, 66, 0.2);
  background: rgba(124, 179, 66, 0.06);
}

/* ============ Career Block ============ */
.career-fav {
  position: relative;
}

/* ============ Animations ============ */
.celeb-anim {
  opacity: 0;
  transform: scale(0.92);
  transform-origin: center center;
}

.celeb-anim.celeb-anim-in {
  animation: celebScaleUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes celebScaleUp {
  0% {
    opacity: 0;
    transform: scale(0.92);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Content switch transitions */
.content-switch-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.content-switch-leave-active {
  transition: all 0.25s ease;
}

.content-switch-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.content-switch-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* ============ Responsive ============ */
@media (max-width: 640px) {
  .celeb-switch-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
