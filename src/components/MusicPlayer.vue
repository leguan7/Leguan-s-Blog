<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useMusicStore } from '@/stores/music'

const musicStore = useMusicStore()
const isExpanded = ref(false)
const showPlaylist = ref(false)
const isDragging = ref(false)
const playerRef = ref<HTMLElement | null>(null)

// Format time mm:ss
function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

// Play mode icon
const modeIcon = computed(() => {
  switch (musicStore.playMode) {
    case 'sequence': return 'lucide:repeat'
    case 'shuffle': return 'lucide:shuffle'
    case 'repeat-one': return 'lucide:repeat-1'
    default: return 'lucide:repeat'
  }
})

const modeLabel = computed(() => {
  switch (musicStore.playMode) {
    case 'sequence': return 'Sequential'
    case 'shuffle': return 'Shuffle'
    case 'repeat-one': return 'Repeat One'
    default: return 'Sequential'
  }
})

// Volume icon
const volumeIcon = computed(() => {
  if (musicStore.volume === 0) return 'lucide:volume-x'
  if (musicStore.volume < 0.5) return 'lucide:volume-1'
  return 'lucide:volume-2'
})

// Progress bar click
function handleProgressClick(e: MouseEvent) {
  const bar = (e.currentTarget as HTMLElement)
  const rect = bar.getBoundingClientRect()
  const percent = ((e.clientX - rect.left) / rect.width) * 100
  musicStore.seek(Math.max(0, Math.min(100, percent)))
}

// Progress bar drag
function handleProgressMouseDown(e: MouseEvent) {
  isDragging.value = true
  handleProgressClick(e)

  const onMove = (ev: MouseEvent) => {
    const bar = document.querySelector('.music-progress-bar') as HTMLElement
    if (!bar) return
    const rect = bar.getBoundingClientRect()
    const percent = ((ev.clientX - rect.left) / rect.width) * 100
    musicStore.seek(Math.max(0, Math.min(100, percent)))
  }

  const onUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

// Volume slider
function handleVolumeInput(e: Event) {
  const val = parseFloat((e.target as HTMLInputElement).value)
  musicStore.setVolume(val)
}

// Toggle expand
function toggleExpand() {
  isExpanded.value = !isExpanded.value
  if (!isExpanded.value) {
    showPlaylist.value = false
  }
}

// Close on outside click
function handleClickOutside(e: MouseEvent) {
  if (playerRef.value && !playerRef.value.contains(e.target as Node)) {
    isExpanded.value = false
    showPlaylist.value = false
  }
}

// Has songs
const hasSongs = computed(() => musicStore.playlist.length > 0)

// Auto-play on first user interaction (browser blocks autoplay without interaction)
let autoPlayTriggered = false
function handleFirstInteraction() {
  if (autoPlayTriggered) return
  autoPlayTriggered = true
  // Only auto-play if not already playing
  if (!musicStore.isPlaying) {
    musicStore.play()
  }
  // Remove listeners after first trigger
  document.removeEventListener('click', handleFirstInteraction)
  document.removeEventListener('keydown', handleFirstInteraction)
  document.removeEventListener('touchstart', handleFirstInteraction)
}

onMounted(() => {
  musicStore.initAudio(false)
  musicStore.startPersist()
  document.addEventListener('click', handleClickOutside)
  // Listen for first user interaction to auto-play
  document.addEventListener('click', handleFirstInteraction)
  document.addEventListener('keydown', handleFirstInteraction)
  document.addEventListener('touchstart', handleFirstInteraction)
})

onUnmounted(() => {
  musicStore.stopPersist()
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('click', handleFirstInteraction)
  document.removeEventListener('keydown', handleFirstInteraction)
  document.removeEventListener('touchstart', handleFirstInteraction)
})
</script>

<template>
  <div ref="playerRef" class="music-player-wrapper" v-if="hasSongs">
    <!-- Expanded Panel -->
    <transition name="music-panel">
      <div v-if="isExpanded" class="music-panel" @click.stop>
        <!-- Header: Song info -->
        <div class="flex items-center gap-3 mb-3">
          <div class="music-cover-mini">
            <img
              v-if="musicStore.currentSong?.cover"
              :src="musicStore.currentSong.cover"
              :alt="musicStore.currentSong.title"
              class="w-full h-full object-cover rounded-lg"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Icon icon="lucide:music" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-gray-700 dark:text-gray-200 truncate leading-relaxed">
              {{ musicStore.currentSong?.title || 'No Song' }}
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500 truncate leading-relaxed">
              {{ musicStore.currentSong?.artist || 'Unknown' }}
            </p>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="mb-2">
          <div
            class="music-progress-bar h-1.5 rounded-full cursor-pointer relative group"
            @mousedown="handleProgressMouseDown"
            @click.stop="handleProgressClick"
          >
            <div
              class="absolute inset-y-0 left-0 rounded-full bg-[#7CB342] transition-all"
              :style="{ width: musicStore.progress + '%' }"
            ></div>
            <!-- Thumb -->
            <div
              class="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#7CB342] shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              :style="{ left: `calc(${musicStore.progress}% - 6px)` }"
            ></div>
          </div>
          <div class="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            <span>{{ formatTime(musicStore.currentTime) }}</span>
            <span>{{ formatTime(musicStore.duration) }}</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-center gap-3 mb-3">
          <!-- Play mode -->
          <button
            @click.stop="musicStore.toggleMode"
            class="music-ctrl-btn"
            :title="modeLabel"
          >
            <Icon :icon="modeIcon" class="w-3.5 h-3.5" />
          </button>

          <!-- Prev -->
          <button @click.stop="musicStore.prev" class="music-ctrl-btn">
            <Icon icon="lucide:skip-back" class="w-4 h-4" />
          </button>

          <!-- Play/Pause -->
          <button @click.stop="musicStore.togglePlay" class="music-play-btn">
            <Icon
              :icon="musicStore.isPlaying ? 'lucide:pause' : 'lucide:play'"
              class="w-5 h-5"
              :class="{ 'ml-0.5': !musicStore.isPlaying }"
            />
          </button>

          <!-- Next -->
          <button @click.stop="musicStore.next" class="music-ctrl-btn">
            <Icon icon="lucide:skip-forward" class="w-4 h-4" />
          </button>

          <!-- Playlist toggle -->
          <button
            @click.stop="showPlaylist = !showPlaylist"
            class="music-ctrl-btn"
            :class="{ 'text-[#7CB342]': showPlaylist }"
            title="Playlist"
          >
            <Icon icon="lucide:list-music" class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Volume -->
        <div class="flex items-center gap-2 mb-2">
          <Icon :icon="volumeIcon" class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="musicStore.volume"
            @input="handleVolumeInput"
            class="music-volume-slider flex-1"
          />
        </div>

        <!-- Playlist -->
        <transition name="playlist-slide">
          <div v-if="showPlaylist" class="music-playlist">
            <div
              v-for="(song, idx) in musicStore.playlist"
              :key="idx"
              @click.stop="musicStore.playSong(idx)"
              class="music-playlist-item"
              :class="{ 'active': idx === musicStore.currentIndex }"
            >
              <div class="flex items-center gap-2 min-w-0">
                <Icon
                  v-if="idx === musicStore.currentIndex && musicStore.isPlaying"
                  icon="lucide:volume-2"
                  class="w-3 h-3 text-[#7CB342] shrink-0"
                />
                <span v-else class="text-[10px] text-gray-400 dark:text-gray-500 w-3 text-center shrink-0">
                  {{ idx + 1 }}
                </span>
                <div class="min-w-0 flex-1">
                  <p class="text-xs truncate leading-relaxed" :class="idx === musicStore.currentIndex ? 'text-[#7CB342] font-bold' : 'text-gray-600 dark:text-gray-300'">
                    {{ song.title }}
                  </p>
                </div>
              </div>
              <span class="text-[10px] text-gray-400 dark:text-gray-500 shrink-0 ml-2">{{ song.artist }}</span>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Floating Ball -->
    <button
      @click.stop="toggleExpand"
      class="music-float-btn"
      :class="{ 'is-playing': musicStore.isPlaying, 'is-expanded': isExpanded }"
      title="Music Player"
    >
      <div class="music-disc" :class="{ spinning: musicStore.isPlaying }">
        <Icon icon="lucide:music" class="w-5 h-5" />
      </div>
    </button>
  </div>
</template>

<style scoped>
/* Wrapper — relative inside rightside-buttons */
.music-player-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

/* Floating ball — inherits rightside-buttons button styles, no overrides needed */
.music-float-btn {
  /* Size/shape/bg/color all inherited from .rightside-buttons button */
  border: none;
  outline: none;
  cursor: pointer;
}

.music-float-btn.is-expanded {
  background: var(--theme-color) !important;
  color: white !important;
}

/* Spinning disc */
.music-disc {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.music-disc.spinning {
  animation: disc-spin 4s linear infinite;
}

@keyframes disc-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Panel — glassmorphism */
.music-panel {
  position: absolute;
  bottom: 50px;
  right: 0;
  width: 280px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:global(.dark) .music-panel {
  background: rgba(30, 30, 30, 0.8);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Cover mini */
.music-cover-mini {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.05);
}

:global(.dark) .music-cover-mini {
  background: rgba(255, 255, 255, 0.05);
}

/* Progress bar */
.music-progress-bar {
  background: rgba(0, 0, 0, 0.08);
}

:global(.dark) .music-progress-bar {
  background: rgba(255, 255, 255, 0.1);
}

/* Control buttons */
.music-ctrl-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(0, 0, 0, 0.05);
  color: #666;
  border: none;
  outline: none;
}

:global(.dark) .music-ctrl-btn {
  background: rgba(255, 255, 255, 0.08);
  color: #aaa;
}

.music-ctrl-btn:hover {
  color: var(--theme-color);
  background: rgba(124, 179, 66, 0.12);
}

:global(.dark) .music-ctrl-btn:hover {
  color: #9CCC65;
  background: rgba(124, 179, 66, 0.15);
}

/* Play button — larger */
.music-play-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--theme-color);
  color: white;
  box-shadow: 0 2px 8px rgba(124, 179, 66, 0.3);
  border: none;
  outline: none;
}

.music-play-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(124, 179, 66, 0.4);
}

/* Volume slider */
.music-volume-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.08);
  outline: none;
  cursor: pointer;
}

:global(.dark) .music-volume-slider {
  background: rgba(255, 255, 255, 0.1);
}

.music-volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #7CB342;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.music-volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #7CB342;
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* Playlist */
.music-playlist {
  max-height: 200px;
  overflow-y: auto;
  border-radius: 10px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.04);
}

:global(.dark) .music-playlist {
  background: rgba(255, 255, 255, 0.05);
}

.music-playlist-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.music-playlist-item:hover {
  background: rgba(124, 179, 66, 0.1);
}

.music-playlist-item.active {
  background: rgba(124, 179, 66, 0.15);
}

/* Scrollbar */
.music-playlist::-webkit-scrollbar {
  width: 4px;
}

.music-playlist::-webkit-scrollbar-track {
  background: transparent;
}

.music-playlist::-webkit-scrollbar-thumb {
  background: rgba(124, 179, 66, 0.3);
  border-radius: 2px;
}

/* Panel animation */
.music-panel-enter-active {
  animation: panel-in 0.3s ease-out;
}

.music-panel-leave-active {
  animation: panel-out 0.2s ease-in;
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes panel-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
}

/* Playlist slide animation */
.playlist-slide-enter-active {
  animation: playlist-in 0.25s ease-out;
}

.playlist-slide-leave-active {
  animation: playlist-out 0.2s ease-in;
}

@keyframes playlist-in {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 200px;
  }
}

@keyframes playlist-out {
  from {
    opacity: 1;
    max-height: 200px;
  }
  to {
    opacity: 0;
    max-height: 0;
  }
}

/* Mobile responsive */
@media (max-width: 640px) {
  .music-panel {
    width: 260px;
  }
}
</style>
