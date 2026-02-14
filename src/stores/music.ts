import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { defaultPlaylist, type Song } from '@/config/playlist'

export type PlayMode = 'sequence' | 'shuffle' | 'repeat-one'

const STORAGE_KEY = 'blog_music_state'

interface MusicState {
  currentIndex: number
  volume: number
  currentTime: number
  playMode: PlayMode
}

function loadState(): Partial<MusicState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveState(state: MusicState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* ignore */ }
}

export const useMusicStore = defineStore('music', () => {
  const saved = loadState()

  // State
  const playlist = ref<Song[]>([...defaultPlaylist])
  const currentIndex = ref(saved.currentIndex ?? 0)
  const isPlaying = ref(false)
  const volume = ref(saved.volume ?? 0.5)
  const currentTime = ref(0)
  const duration = ref(0)
  const playMode = ref<PlayMode>((saved.playMode as PlayMode) || 'sequence')

  // Audio element
  let audio: HTMLAudioElement | null = null
  let gapTimer: ReturnType<typeof setTimeout> | null = null

  // Computed
  const currentSong = computed(() => {
    if (playlist.value.length === 0) return null
    const idx = Math.max(0, Math.min(currentIndex.value, playlist.value.length - 1))
    return playlist.value[idx] || null
  })

  const progress = computed(() => {
    if (duration.value <= 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  // Resolve src path: add base URL for local files and encode for Chinese/spaces/special chars
  function resolveSrc(src: string): string {
    // If it's already a full URL (http/https), return as-is
    if (src.startsWith('http://') || src.startsWith('https://')) return src
    // Prepend Vite base URL for local paths
    const base = import.meta.env.BASE_URL || '/'
    // Remove leading slash from src to avoid double slash
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src
    // encodeURI doesn't encode " ~ etc, use encodeURIComponent per segment
    const encoded = cleanSrc.split('/').map(segment => encodeURIComponent(segment)).join('/')
    return base + encoded
  }

  // Initialize audio
  function initAudio(autoPlay = false) {
    if (audio) return
    audio = new Audio()
    audio.volume = volume.value

    audio.addEventListener('timeupdate', () => {
      currentTime.value = audio!.currentTime
    })

    audio.addEventListener('durationchange', () => {
      duration.value = audio!.duration || 0
    })

    audio.addEventListener('ended', () => {
      handleEnded()
    })

    audio.addEventListener('error', () => {
      // Skip to next on error
      isPlaying.value = false
    })

    // Load saved song
    if (currentSong.value) {
      audio.src = resolveSrc(currentSong.value.src)
      if (saved.currentTime) {
        audio.currentTime = saved.currentTime
      }
      // Auto-play if requested
      if (autoPlay) {
        audio.play().then(() => {
          isPlaying.value = true
        }).catch(() => {
          // Browser blocked autoplay — that's ok, user will click manually
          isPlaying.value = false
        })
      }
    }
  }

  function clearGapTimer() {
    if (gapTimer) {
      clearTimeout(gapTimer)
      gapTimer = null
    }
  }

  function delayedPlay(fn: () => void) {
    clearGapTimer()
    gapTimer = setTimeout(() => {
      gapTimer = null
      fn()
    }, 2000)
  }

  function handleEnded() {
    if (playMode.value === 'repeat-one') {
      delayedPlay(() => {
        if (audio) {
          audio.currentTime = 0
          audio.play().catch(() => {})
        }
      })
    } else if (playMode.value === 'shuffle') {
      if (playlist.value.length > 1) {
        let nextIdx: number
        do {
          nextIdx = Math.floor(Math.random() * playlist.value.length)
        } while (nextIdx === currentIndex.value)
        currentIndex.value = nextIdx
      }
      delayedPlay(() => loadAndPlay())
    } else {
      // sequence
      if (currentIndex.value < playlist.value.length - 1) {
        currentIndex.value++
      } else {
        // Loop back to start
        currentIndex.value = 0
      }
      delayedPlay(() => loadAndPlay())
    }
  }

  function loadAndPlay() {
    clearGapTimer()
    if (!audio || !currentSong.value) return
    audio.src = resolveSrc(currentSong.value.src)
    audio.currentTime = 0
    currentTime.value = 0
    audio.play().then(() => {
      isPlaying.value = true
    }).catch(() => {
      isPlaying.value = false
    })
  }

  // Actions
  function play() {
    initAudio()
    if (!audio || !currentSong.value) return

    // Ensure src is set
    const expectedSrc = resolveSrc(currentSong.value.src)
    const fileName = currentSong.value.src.split('/').pop() || ''
    if (!audio.src || !audio.src.endsWith(encodeURIComponent(fileName))) {
      audio.src = expectedSrc
    }
    audio.play().then(() => {
      isPlaying.value = true
    }).catch(() => {
      isPlaying.value = false
    })
  }

  function pause() {
    if (audio) {
      audio.pause()
      isPlaying.value = false
    }
  }

  function togglePlay() {
    if (isPlaying.value) {
      pause()
    } else {
      play()
    }
  }

  function next() {
    if (playlist.value.length === 0) return
    if (playMode.value === 'shuffle') {
      if (playlist.value.length > 1) {
        let nextIdx: number
        do {
          nextIdx = Math.floor(Math.random() * playlist.value.length)
        } while (nextIdx === currentIndex.value)
        currentIndex.value = nextIdx
      }
    } else {
      currentIndex.value = (currentIndex.value + 1) % playlist.value.length
    }
    loadAndPlay()
  }

  function prev() {
    if (playlist.value.length === 0) return
    if (playMode.value === 'shuffle') {
      if (playlist.value.length > 1) {
        let nextIdx: number
        do {
          nextIdx = Math.floor(Math.random() * playlist.value.length)
        } while (nextIdx === currentIndex.value)
        currentIndex.value = nextIdx
      }
    } else {
      currentIndex.value = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
    }
    loadAndPlay()
  }

  function playSong(index: number) {
    if (index < 0 || index >= playlist.value.length) return
    currentIndex.value = index
    loadAndPlay()
  }

  function setVolume(val: number) {
    volume.value = Math.max(0, Math.min(1, val))
    if (audio) {
      audio.volume = volume.value
    }
  }

  function seek(percent: number) {
    if (audio && duration.value > 0) {
      const time = (percent / 100) * duration.value
      audio.currentTime = time
      currentTime.value = time
    }
  }

  function toggleMode() {
    const modes: PlayMode[] = ['sequence', 'shuffle', 'repeat-one']
    const idx = modes.indexOf(playMode.value)
    playMode.value = modes[(idx + 1) % modes.length]
  }

  // Persist state periodically
  let saveTimer: ReturnType<typeof setInterval> | null = null

  function startPersist() {
    if (saveTimer) return
    saveTimer = setInterval(() => {
      saveState({
        currentIndex: currentIndex.value,
        volume: volume.value,
        currentTime: currentTime.value,
        playMode: playMode.value
      })
    }, 5000)
  }

  function stopPersist() {
    if (saveTimer) {
      clearInterval(saveTimer)
      saveTimer = null
    }
  }

  // Save on key changes
  watch([currentIndex, volume, playMode], () => {
    saveState({
      currentIndex: currentIndex.value,
      volume: volume.value,
      currentTime: currentTime.value,
      playMode: playMode.value
    })
  })

  // Cleanup
  function destroy() {
    stopPersist()
    clearGapTimer()
    if (audio) {
      audio.pause()
      audio.src = ''
      audio = null
    }
  }

  return {
    // State
    playlist,
    currentIndex,
    isPlaying,
    volume,
    currentTime,
    duration,
    playMode,
    // Computed
    currentSong,
    progress,
    // Actions
    initAudio,
    play,
    pause,
    togglePlay,
    next,
    prev,
    playSong,
    setVolume,
    seek,
    toggleMode,
    startPersist,
    stopPersist,
    destroy
  }
})
