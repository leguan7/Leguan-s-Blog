<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'
import { getAssetUrl } from '@/utils/assets'

const frameUrl = getAssetUrl('/img/xiangkuang.png')
const FRAME_PADDING = 4  // small extra margin inside the pool

/* ── Album & photo data from public/img/album ─────── */
interface AlbumPhoto {
  src: string    // original full-size image
  thumb: string  // compressed thumbnail for floating pool
  title: string
}

interface Album {
  name: string
  label: string
  photos: AlbumPhoto[]
}

function makePhotos(dir: string, label: string, ids: number[]): AlbumPhoto[] {
  return ids.map(n => ({
    src: getAssetUrl(`/img/album/${dir}/${n}.jpg`),
    thumb: getAssetUrl(`/img/album/${dir}/thumb/${n}.jpg`),
    title: `${label} ${n}`
  }))
}

const albums: Album[] = [
  { name: 'xiamen', label: 'Xiamen', photos: makePhotos('xiamen', 'Xiamen', [1,2,3,4,5,6]) },
  { name: 'wuhan', label: 'Wuhan', photos: makePhotos('wuhan', 'Wuhan', [7,8,9,10,11,12,13,14,15,16]) },
  { name: 'xian', label: "Xi'an", photos: makePhotos("xi'an", "Xi'an", [17,18,19,20,21,22,23,24,25]) },
  { name: 'nanjing', label: 'Nanjing', photos: makePhotos('nanjing', 'Nanjing', [26,27,28,29,30,31,32,33]) },
  { name: 'hangzhou', label: 'Hangzhou', photos: makePhotos('hangzhou', 'Hangzhou', Array.from({ length: 19 }, (_, i) => i + 34)) },
  { name: 'suzhou', label: 'Suzhou', photos: makePhotos('suzhou', 'Suzhou', Array.from({ length: 10 }, (_, i) => i + 53)) },
  { name: 'shenzhen', label: 'Shenzhen', photos: makePhotos('shenzhen', 'Shenzhen', Array.from({ length: 10 }, (_, i) => i + 63)) },
  { name: 'soulpower2', label: 'Soul Power II', photos: makePhotos('soulpowerⅡ', 'Soul Power II', Array.from({ length: 8 }, (_, i) => i + 73)) },
]

// Pick 2-3 photos per album for the floating pool
interface FloatingPhoto {
  image: string
  title: string
  albumIdx: number
  photoIdx: number
}

const photos: FloatingPhoto[] = []
albums.forEach((album, aIdx) => {
  const count = Math.min(3, album.photos.length)
  // Randomly pick photos from this album (no duplicates)
  const indices = Array.from({ length: album.photos.length }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  for (let i = 0; i < count; i++) {
    const pIdx = indices[i]
    photos.push({
      image: album.photos[pIdx].thumb,
      title: album.label,
      albumIdx: aIdx,
      photoIdx: pIdx
    })
  }
})

/* ── Floating physics state (NOT reactive) ──────────── */
interface FloatState {
  x: number; y: number
  vx: number; vy: number
  rot: number; vr: number
  w: number; h: number
  grabbed: boolean
  el: HTMLElement | null
}

const poolRef = ref<HTMLElement | null>(null)

const state: FloatState[] = []
let grabbedIdx = -1
let raf = 0
let grabStartX = 0
let grabStartY = 0
let hasDragged = false

function rand(a: number, b: number) { return a + Math.random() * (b - a) }

/* ── collect DOM refs ───────────────────────────────── */
const cardRefs: HTMLElement[] = []
function setCardRef(el: any, idx: number) {
  if (el) cardRefs[idx] = el as HTMLElement
}

/* ── init positions & sizes ─────────────────────────── */
function initState() {
  const pw = poolRef.value?.clientWidth ?? 800
  const ph = poolRef.value?.clientHeight ?? 600
  state.length = 0

  for (let i = 0; i < photos.length; i++) {
    const size = Math.round(rand(110, 150))
    const s: FloatState = {
      x: rand(FRAME_PADDING, pw - size - FRAME_PADDING),
      y: rand(FRAME_PADDING, ph - size - FRAME_PADDING),
      vx: rand(-0.4, 0.4),
      vy: rand(-0.3, 0.3),
      rot: rand(-15, 15),
      vr: rand(-0.06, 0.06),
      w: size,
      h: size,
      grabbed: false,
      el: cardRefs[i] || null,
    }
    state.push(s)

    const el = cardRefs[i]
    if (el) {
      el.style.width = size + 'px'
      el.style.height = size + 'px'
    }
  }

  applyAll()
}

/* ── apply transform directly to DOM ──────────────── */
function applyTransform(s: FloatState) {
  if (!s.el) return
  s.el.style.transform = `translate3d(${s.x}px,${s.y}px,0) rotate(${s.rot}deg)`
}

function applyAll() {
  for (let i = 0; i < state.length; i++) {
    state[i].el = cardRefs[i] || null
    applyTransform(state[i])
  }
}

/* ── animation loop ───────────────────────────────── */
function tick() {
  const pw = poolRef.value?.clientWidth ?? 800
  const ph = poolRef.value?.clientHeight ?? 600

  for (let i = 0; i < state.length; i++) {
    const s = state[i]
    if (s.grabbed) continue

    s.x += s.vx
    s.y += s.vy
    s.rot += s.vr

    if (s.x < FRAME_PADDING)            { s.x = FRAME_PADDING;              s.vx = Math.abs(s.vx) }
    if (s.x > pw - s.w - FRAME_PADDING) { s.x = pw - s.w - FRAME_PADDING;   s.vx = -Math.abs(s.vx) }
    if (s.y < FRAME_PADDING)            { s.y = FRAME_PADDING;              s.vy = Math.abs(s.vy) }
    if (s.y > ph - s.h - FRAME_PADDING) { s.y = ph - s.h - FRAME_PADDING;   s.vy = -Math.abs(s.vy) }

    applyTransform(s)
  }

  raf = requestAnimationFrame(tick)
}

/* ── pointer interaction ────────────────────────────── */
function onGrab(idx: number, e: PointerEvent) {
  grabbedIdx = idx
  state[idx].grabbed = true
  grabStartX = e.clientX
  grabStartY = e.clientY
  hasDragged = false
  const el = cardRefs[idx]
  if (el) {
    el.classList.add('is-grabbed')
    el.style.zIndex = '30'
  }
}

function onRelease() {
  if (grabbedIdx >= 0) {
    // Tap (barely moved) → open lightbox
    if (!hasDragged) {
      openLightbox(grabbedIdx)
    }
    const s = state[grabbedIdx]
    s.grabbed = false
    s.vx = rand(-0.35, 0.35)
    s.vy = rand(-0.25, 0.25)
    const el = cardRefs[grabbedIdx]
    if (el) {
      el.classList.remove('is-grabbed')
      el.style.zIndex = ''
    }
    applyTransform(s)
  }
  grabbedIdx = -1
}

function onPointerMove(e: PointerEvent) {
  if (grabbedIdx < 0) return
  // Track whether this is a drag or a tap
  const dx = e.clientX - grabStartX
  const dy = e.clientY - grabStartY
  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
    hasDragged = true
  }
  const rect = poolRef.value?.getBoundingClientRect()
  if (!rect) return
  const s = state[grabbedIdx]
  s.x = e.clientX - rect.left - s.w / 2
  s.y = e.clientY - rect.top - s.h / 2
  s.rot = 0
  applyTransform(s)
}

/* ── Lightbox with album navigation ─────────────────── */
const lightboxAlbumIdx = ref<number | null>(null)
const lightboxPhotoIdx = ref(0)

const currentAlbum = computed(() =>
  lightboxAlbumIdx.value !== null ? albums[lightboxAlbumIdx.value] : null
)
const currentPhoto = computed(() =>
  currentAlbum.value ? currentAlbum.value.photos[lightboxPhotoIdx.value] : null
)

function openLightbox(floatIdx: number) {
  const p = photos[floatIdx]
  lightboxAlbumIdx.value = p.albumIdx
  lightboxPhotoIdx.value = p.photoIdx
}

function closeLightbox() {
  lightboxAlbumIdx.value = null
  lightboxPhotoIdx.value = 0
}

function prevPhoto() {
  if (!currentAlbum.value) return
  lightboxPhotoIdx.value =
    (lightboxPhotoIdx.value - 1 + currentAlbum.value.photos.length) % currentAlbum.value.photos.length
}

function nextPhoto() {
  if (!currentAlbum.value) return
  lightboxPhotoIdx.value =
    (lightboxPhotoIdx.value + 1) % currentAlbum.value.photos.length
}

function goToThumbnail(idx: number) {
  lightboxPhotoIdx.value = idx
}

function handleKey(e: KeyboardEvent) {
  if (lightboxAlbumIdx.value === null) return
  if (e.key === 'ArrowLeft') prevPhoto()
  else if (e.key === 'ArrowRight') nextPhoto()
  else if (e.key === 'Escape') closeLightbox()
}

/* ── wait for frame image to load before init ────── */
function onFrameLoad() {
  initState()
  raf = requestAnimationFrame(tick)
}

/* ── lifecycle ──────────────────────────────────────── */
onMounted(() => {
  document.addEventListener('keydown', handleKey)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  document.removeEventListener('keydown', handleKey)
})
</script>

<template>
  <div>
    <!-- Banner -->
    <header class="relative h-[45vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black/40"></div>

      <div class="relative text-center text-white z-10">
        <Icon icon="lucide:images" class="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
        <h1 class="text-4xl md:text-5xl font-bold drop-shadow-lg">Gallery</h1>
        <p class="mt-3 text-white/80 text-lg">Time machine, capturing beautiful moments</p>

        <!-- Description Tooltip -->
        <div class="relative inline-flex justify-center mt-4 group/tip">
          <div class="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/40 hover:scale-110">
            <Icon icon="lucide:quote" class="w-4 h-4 text-white" />
          </div>
          <div class="absolute top-12 left-1/2 -translate-x-1/2 w-[400px] max-w-[95vw] px-6 py-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/25 dark:border-gray-700/20 shadow-lg opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible translate-y-2 group-hover/tip:translate-y-0 transition-all duration-300 z-20 pointer-events-none">
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white/60 dark:bg-gray-800/60 border-l border-t border-white/25 dark:border-gray-700/20"></div>
            <p class="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed relative z-10">
              Click a photo to browse the full album of the same collection.
            </p>
          </div>
        </div>
      </div>

      <div class="wave-divider">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C150,100 350,0 600,50 C850,100 1050,0 1200,50 C1350,100 1440,50 1440,50 L1440,100 L0,100 Z" fill="rgba(255,255,255,0.1)"/>
        </svg>
      </div>
    </header>

    <!-- Floating photos area -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="pool-wrapper">
        <!-- Frame image defines the area size -->
        <img :src="frameUrl" alt="" class="pool-frame-img" draggable="false" @load="onFrameLoad" />

        <!-- Floating photos overlay on top -->
        <div
          ref="poolRef"
          class="photo-pool"
          @pointermove="onPointerMove"
          @pointerup="onRelease"
          @pointerleave="onRelease"
        >
          <div
            v-for="(photo, idx) in photos"
            :key="idx"
            :ref="(el) => setCardRef(el, idx)"
            class="float-photo"
            @pointerdown.prevent="onGrab(idx, $event)"
          >
            <img
              :src="photo.image"
              :alt="photo.title"
              class="float-photo-img"
              draggable="false"
            />
            <div class="float-photo-label">{{ photo.title }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox with album navigation -->
    <Teleport to="body">
      <Transition name="lb">
        <div
          v-if="lightboxAlbumIdx !== null && currentAlbum && currentPhoto"
          class="lightbox-overlay"
          @click.self="closeLightbox"
        >
          <div class="lightbox-container">
            <!-- Main image area -->
            <div class="lightbox-main">
              <button class="lightbox-nav lightbox-nav-left" @click.stop="prevPhoto">
                <Icon icon="lucide:chevron-left" class="w-6 h-6" />
              </button>

              <img
                :src="currentPhoto.src"
                :alt="currentPhoto.title"
                class="lightbox-img"
                :key="currentPhoto.src"
              />

              <button class="lightbox-nav lightbox-nav-right" @click.stop="nextPhoto">
                <Icon icon="lucide:chevron-right" class="w-6 h-6" />
              </button>

              <button class="lightbox-close" @click="closeLightbox">&times;</button>

              <!-- Album info -->
              <div class="lightbox-info">
                <span class="text-white font-medium text-sm">{{ currentAlbum.label }}</span>
                <span class="text-white/60 text-xs">{{ lightboxPhotoIdx + 1 }} / {{ currentAlbum.photos.length }}</span>
              </div>
            </div>

            <!-- Thumbnail strip: browse all photos from same album -->
            <div class="lightbox-thumbnails">
              <button
                v-for="(photo, pIdx) in currentAlbum.photos"
                :key="pIdx"
                @click.stop="goToThumbnail(pIdx)"
                class="thumb-item"
                :class="{ active: pIdx === lightboxPhotoIdx }"
              >
                <img :src="photo.thumb" :alt="photo.title" class="thumb-img" />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ── Pool wrapper: sized by the frame image ──── */
.pool-wrapper {
  position: relative;
  width: 100%;
}

.pool-frame-img {
  display: block;
  width: 100%;
  height: auto;
  pointer-events: none;
  user-select: none;
}

/* ── Photo pool: overlay inside the frame border ── */
.photo-pool {
  position: absolute;
  inset: 7.5% 7% 9.25% 6%;
  overflow: hidden;
  cursor: default;
  touch-action: none;
  user-select: none;
}

/* ── Floating photo ──────────────────────────── */
.float-photo {
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px;
  background: #fff;
  border-radius: 6px;
  box-shadow:
    0 2px 10px rgba(0, 0, 0, 0.10),
    0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: grab;
  z-index: 1;
  will-change: transform;
  transition: box-shadow 0.3s ease, filter 0.3s ease;
}

:root.dark .float-photo {
  background: #1e293b;
  box-shadow:
    0 2px 10px rgba(0, 0, 0, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.2);
}

.float-photo:hover {
  z-index: 20;
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.18),
    0 2px 6px rgba(0, 0, 0, 0.08);
  filter: brightness(1.03);
}

:root.dark .float-photo:hover {
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.5),
    0 2px 6px rgba(0, 0, 0, 0.3);
}

.float-photo.is-grabbed {
  cursor: grabbing;
  box-shadow:
    0 14px 40px rgba(0, 0, 0, 0.22),
    0 4px 12px rgba(0, 0, 0, 0.10);
  filter: brightness(1.05) saturate(1.1);
}

:root.dark .float-photo.is-grabbed {
  box-shadow:
    0 14px 40px rgba(0, 0, 0, 0.6),
    0 4px 12px rgba(0, 0, 0, 0.3);
}

.float-photo-img {
  width: 100%;
  height: calc(100% - 24px);
  object-fit: cover;
  border-radius: 4px;
  pointer-events: none;
}

.float-photo-label {
  text-align: center;
  font-size: 0.65rem;
  font-weight: 600;
  line-height: 24px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
}

:root.dark .float-photo-label {
  color: #94a3b8;
}

/* ── Lightbox ────────────────────────────────── */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.lightbox-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90vw;
  max-height: 90vh;
  cursor: default;
}

.lightbox-main {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-img {
  max-width: 80vw;
  max-height: 68vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  user-select: none;
  animation: lbImgFade 0.25s ease;
}

@keyframes lbImgFade {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

.lightbox-nav {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(6px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-nav-left { left: calc(10vw - 52px); }
.lightbox-nav-right { right: calc(10vw - 52px); }

.lightbox-close {
  position: absolute;
  top: -14px;
  right: -14px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  line-height: 1;
  z-index: 10;
}

.lightbox-close:hover {
  background: rgba(0, 0, 0, 0.7);
}

.lightbox-info {
  position: absolute;
  bottom: -36px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

/* ── Thumbnail strip ─────────────────────────── */
.lightbox-thumbnails {
  display: flex;
  gap: 6px;
  margin-top: 48px;
  padding: 8px 4px;
  overflow-x: auto;
  justify-content: center;
  max-width: 80vw;
}

.lightbox-thumbnails::-webkit-scrollbar {
  height: 4px;
}

.lightbox-thumbnails::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.thumb-item {
  width: 56px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  border: 2px solid transparent;
  opacity: 0.5;
  transition: all 0.2s;
  padding: 0;
  background: none;
}

.thumb-item:hover { opacity: 0.8; }

.thumb-item.active {
  border-color: #7CB342;
  opacity: 1;
  box-shadow: 0 0 8px rgba(124, 179, 66, 0.4);
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Lightbox transition */
.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.3s ease;
}
.lb-enter-active .lightbox-container,
.lb-leave-active .lightbox-container {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}
.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}
.lb-enter-from .lightbox-container,
.lb-leave-to .lightbox-container {
  transform: scale(0.85);
  opacity: 0;
}

/* Mobile */
@media (max-width: 768px) {
  .lightbox-nav-left { left: 8px; }
  .lightbox-nav-right { right: 8px; }
  .lightbox-close { top: 8px; right: 8px; }
  .lightbox-img { max-width: 92vw; max-height: 60vh; }
  .lightbox-thumbnails { justify-content: flex-start; max-width: 92vw; }
  .thumb-item { width: 48px; height: 34px; }
}
</style>
