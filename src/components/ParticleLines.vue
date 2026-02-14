<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

/* ── Configuration ────────────────────────────── */
const PARTICLE_COUNT = 88
const LINE_DIST = 150            // max distance to draw a line between particles
const MOUSE_DIST = 240           // mouse interaction radius (larger = stickier)
const REPEL_DIST = 100           // inner zone: push particles away from mouse center
const ATTRACT_FORCE = 0.008      // pull in outer ring (100–240px)
const REPEL_FORCE = 0.06         // push away from mouse center (<100px)
const INTER_REPEL_DIST = 60      // min distance between particles near mouse
const INTER_REPEL_FORCE = 0.03   // particle-to-particle push strength
const SCATTER_BURST = 7          // velocity burst when mouse leaves
const BASE_SPEED = 0.25          // base drift speed
const MIN_SPEED = 0.12           // particles never drift slower than this
const PARTICLE_R_MIN = 1
const PARTICLE_R_MAX = 3
const LINE_WIDTH = 0.6
const LINE_COLOR = '255,255,255'       // white
const MOUSE_LINE_COLOR = '255,255,255' // white

/* ── Precomputed squared distances (avoid sqrt in hot loops) ── */
const LINE_DIST_SQ = LINE_DIST * LINE_DIST
const MOUSE_DIST_SQ = MOUSE_DIST * MOUSE_DIST
const REPEL_DIST_SQ = REPEL_DIST * REPEL_DIST
const INTER_REPEL_DIST_SQ = INTER_REPEL_DIST * INTER_REPEL_DIST

/* ── State ────────────────────────────────────── */
const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let width = 0
let height = 0
let dpr = 1
let paused = false   // pause when tab is hidden

let mouse = { x: -9999, y: -9999, active: false }
let lastMouse = { x: -9999, y: -9999 }   // remember position for scatter
let mouseIdle = 0                          // frames since mouse last moved
const IDLE_THRESHOLD = 60                  // start scattering after ~1s idle (60 frames)
const IDLE_REPEL = 0.015                   // gentle push when idle

interface Particle {
  x: number; y: number
  vx: number; vy: number
  baseVx: number; baseVy: number   // original drift direction
  r: number
}

let particles: Particle[] = []

/* ── Helpers ──────────────────────────────────── */
function rand(a: number, b: number) {
  return a + Math.random() * (b - a)
}

function initParticles() {
  particles = []
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const vx = rand(-BASE_SPEED, BASE_SPEED) || 0.2
    const vy = rand(-BASE_SPEED, BASE_SPEED) || 0.2
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx, vy,
      baseVx: vx, baseVy: vy,
      r: rand(PARTICLE_R_MIN, PARTICLE_R_MAX),
    })
  }
}

/* ── Scatter: burst particles away in random directions ── */
function scatterFromMouse() {
  const mx = lastMouse.x
  const my = lastMouse.y
  for (const p of particles) {
    const dx = p.x - mx
    const dy = p.y - my
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < MOUSE_DIST * 1.3) {
      // Fully random direction — ensures nearby particles fly APART
      const angle = Math.random() * Math.PI * 2
      const strength = (1 - dist / (MOUSE_DIST * 1.3)) * SCATTER_BURST + 1
      p.vx = Math.cos(angle) * strength
      p.vy = Math.sin(angle) * strength
      // New random base drift so they keep separating
      p.baseVx = rand(-BASE_SPEED, BASE_SPEED) || 0.15
      p.baseVy = rand(-BASE_SPEED, BASE_SPEED) || 0.15
    }
  }
}

/* ── Resize handler ──────────────────────────── */
function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  dpr = window.devicePixelRatio || 1
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  ctx = canvas.getContext('2d')
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

/* ── Animation loop ──────────────────────────── */
function tick() {
  if (paused) return    // skip entirely when tab is hidden
  if (!ctx) { raf = requestAnimationFrame(tick); return }

  ctx.clearRect(0, 0, width, height)

  // Track mouse idle time
  if (mouse.active) mouseIdle++

  /* ── Inter-particle repulsion near mouse (spread them out) ── */
  if (mouse.active) {
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i]
      const adx = mouse.x - a.x
      const ady = mouse.y - a.y
      if (adx * adx + ady * ady > MOUSE_DIST_SQ) continue

      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j]
        const bdx = mouse.x - b.x
        const bdy = mouse.y - b.y
        if (bdx * bdx + bdy * bdy > MOUSE_DIST_SQ) continue

        const dx = a.x - b.x
        const dy = a.y - b.y
        const distSq = dx * dx + dy * dy
        if (distSq < INTER_REPEL_DIST_SQ && distSq > 0.01) {
          const dist = Math.sqrt(distSq)
          const force = (1 - dist / INTER_REPEL_DIST) * INTER_REPEL_FORCE
          const fx = (dx / dist) * force
          const fy = (dy / dist) * force
          a.vx += fx; a.vy += fy
          b.vx -= fx; b.vy -= fy
        }
      }
    }
  }

  /* ── Update particles ─────────────────────── */
  const MAX_SPEED = BASE_SPEED * 14
  for (const p of particles) {
    if (mouse.active) {
      const dx = mouse.x - p.x
      const dy = mouse.y - p.y
      const distSq = dx * dx + dy * dy

      if (mouseIdle < IDLE_THRESHOLD) {
        if (distSq < REPEL_DIST_SQ && distSq > 0.01) {
          const dist = Math.sqrt(distSq)
          const force = (1 - dist / REPEL_DIST) * REPEL_FORCE
          p.vx -= (dx / dist) * force
          p.vy -= (dy / dist) * force
        } else if (distSq < MOUSE_DIST_SQ) {
          const force = (1 - Math.sqrt(distSq) / MOUSE_DIST) * ATTRACT_FORCE
          p.vx += dx * force
          p.vy += dy * force
        }
      } else if (distSq < MOUSE_DIST_SQ && distSq > 0.01) {
        const dist = Math.sqrt(distSq)
        const idleRamp = Math.min((mouseIdle - IDLE_THRESHOLD) / 120, 1)
        const force = (1 - dist / MOUSE_DIST) * IDLE_REPEL * idleRamp
        p.vx -= (dx / dist) * force
        p.vy -= (dy / dist) * force
      }
    }

    p.vx += (p.baseVx - p.vx) * 0.005
    p.vy += (p.baseVy - p.vy) * 0.005

    let damping = 0.995
    if (mouse.active) {
      const mdx = mouse.x - p.x
      const mdy = mouse.y - p.y
      const mdistSq = mdx * mdx + mdy * mdy
      if (mdistSq < MOUSE_DIST_SQ) {
        damping = 0.96 + (Math.sqrt(mdistSq) / MOUSE_DIST) * 0.035
      }
    }
    p.vx *= damping
    p.vy *= damping

    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
    if (speed < MIN_SPEED) {
      const scale = MIN_SPEED / (speed || 0.01)
      p.vx *= scale
      p.vy *= scale
    } else if (speed > MAX_SPEED) {
      const scale = MAX_SPEED / speed
      p.vx *= scale
      p.vy *= scale
    }

    p.x += p.vx
    p.y += p.vy

    if (p.x < -10) p.x = width + 10
    if (p.x > width + 10) p.x = -10
    if (p.y < -10) p.y = height + 10
    if (p.y > height + 10) p.y = -10
  }

  /* ── Draw lines between nearby particles (batched by alpha band) ── */
  ctx.lineWidth = LINE_WIDTH
  // Group into 4 alpha bands to reduce strokeStyle changes
  const bands: [number, number, number, number][][] = [[], [], [], []]
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i]
    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const distSq = dx * dx + dy * dy
      if (distSq < LINE_DIST_SQ) {
        const ratio = 1 - Math.sqrt(distSq) / LINE_DIST
        const band = Math.min((ratio * 4) | 0, 3)
        bands[band].push([a.x, a.y, b.x, b.y])
      }
    }
  }
  for (let b = 0; b < 4; b++) {
    const lines = bands[b]
    if (lines.length === 0) continue
    const alpha = ((b + 0.5) / 4) * 0.35
    ctx.strokeStyle = `rgba(${LINE_COLOR},${alpha.toFixed(3)})`
    ctx.beginPath()
    for (let k = 0; k < lines.length; k++) {
      ctx.moveTo(lines[k][0], lines[k][1])
      ctx.lineTo(lines[k][2], lines[k][3])
    }
    ctx.stroke()
  }

  /* ── Draw lines from mouse to nearby particles ── */
  if (mouse.active) {
    ctx.lineWidth = LINE_WIDTH * 1.2
    for (const p of particles) {
      const dx = mouse.x - p.x
      const dy = mouse.y - p.y
      const distSq = dx * dx + dy * dy
      if (distSq < MOUSE_DIST_SQ) {
        const alpha = (1 - Math.sqrt(distSq) / MOUSE_DIST) * 0.6
        ctx.strokeStyle = `rgba(${MOUSE_LINE_COLOR},${alpha.toFixed(3)})`
        ctx.beginPath()
        ctx.moveTo(mouse.x, mouse.y)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
      }
    }
  }

  raf = requestAnimationFrame(tick)
}

/* ── Event handlers ──────────────────────────── */
function onMouseMove(e: MouseEvent) {
  mouse.x = e.clientX
  mouse.y = e.clientY
  lastMouse.x = e.clientX
  lastMouse.y = e.clientY
  mouse.active = true
  mouseIdle = 0   // reset idle counter on move
}

function onMouseLeave() {
  scatterFromMouse()          // burst particles outward
  mouse.active = false
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length > 0) {
    mouse.x = e.touches[0].clientX
    mouse.y = e.touches[0].clientY
    lastMouse.x = mouse.x
    lastMouse.y = mouse.y
    mouse.active = true
  }
}

function onTouchEnd() {
  scatterFromMouse()
  mouse.active = false
}

/* ── Pause/resume when tab visibility changes ──── */
function onVisibilityChange() {
  if (document.hidden) {
    paused = true
    cancelAnimationFrame(raf)
  } else {
    paused = false
    raf = requestAnimationFrame(tick)
  }
}

/* ── Lifecycle ───────────────────────────────── */
onMounted(() => {
  resize()
  initParticles()
  raf = requestAnimationFrame(tick)

  window.addEventListener('resize', resize, { passive: true })
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  document.addEventListener('mouseleave', onMouseLeave)
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('touchend', onTouchEnd)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseleave', onMouseLeave)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onTouchEnd)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="particle-canvas"
  />
</template>

<style scoped>
.particle-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.8;
}
</style>
