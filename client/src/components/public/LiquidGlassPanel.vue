<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue'

// Original edge displacement implementation, following the Canvas → SVG pipeline
// documented in the liquid-glass-frontend skill. No third-party artwork or code.
const panel = ref<HTMLElement | null>(null)
const filterId = `public-glass-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`
const map = ref('')
const size = ref({ width: 0, height: 0 })
const refraction = ref(false)
let observer: ResizeObserver | undefined
let frame = 0
const opticalStyle = computed(() => map.value && refraction.value
  ? { backdropFilter: `url(#${filterId}) blur(.4px)`, WebkitBackdropFilter: `url(#${filterId}) blur(.4px)` }
  : {})

function updateMap() {
  const rect = panel.value?.getBoundingClientRect()
  if (!rect || !rect.width || !rect.height) return
  if (Math.abs(rect.width - size.value.width) < 1 && Math.abs(rect.height - size.value.height) < 1) return
  size.value = { width: rect.width, height: rect.height }
  const ratio = Math.min(1, 640 / rect.width, 640 / rect.height)
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(rect.width * ratio)
  canvas.height = Math.ceil(rect.height * ratio)
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const pixels = ctx.createImageData(canvas.width, canvas.height)
  const radius = Math.min(28, rect.width / 2, rect.height / 2)
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const px = (x + .5) / ratio - rect.width / 2
      const py = (y + .5) / ratio - rect.height / 2
      const qx = Math.abs(px) - rect.width / 2 + radius
      const qy = Math.abs(py) - rect.height / 2 + radius
      const distance = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius
      const edge = Math.max(0, 1 - Math.abs(distance) / 22)
      const nx = qx > 0 || qy > 0 ? Math.max(qx, 0) : Number(qx > qy)
      const ny = qx > 0 || qy > 0 ? Math.max(qy, 0) : Number(qy >= qx)
      const length = Math.hypot(nx, ny) || 1
      const index = (y * canvas.width + x) * 4
      pixels.data[index] = 128 + Math.sign(px) * nx / length * edge * edge * 110
      pixels.data[index + 1] = 128 + Math.sign(py) * ny / length * edge * edge * 110
      pixels.data[index + 2] = 128
      pixels.data[index + 3] = 255
    }
  }
  ctx.putImageData(pixels, 0, 0)
  map.value = canvas.toDataURL()
}

onMounted(() => {
  // SVG backdrop sampling is enabled for Chromium; other engines keep the CSS
  // fallback. CSS.supports alone does not establish working SVG backdrop input.
  refraction.value = /Chrome|Chromium/.test(navigator.userAgent) && CSS.supports('backdrop-filter', 'url(#glass)')
  if (!refraction.value) return
  updateMap()
  observer = new ResizeObserver(() => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(updateMap)
  })
  if (panel.value) observer.observe(panel.value)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
})
</script>

<template>
  <div ref="panel" class="liquid-panel">
    <svg v-if="map && refraction" class="liquid-definitions" aria-hidden="true" width="0" height="0">
      <defs>
        <filter :id="filterId" filterUnits="userSpaceOnUse" x="-40" y="-40" :width="size.width + 80" :height="size.height + 80" color-interpolation-filters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation=".01" result="backdrop" />
          <feImage :href="map" x="0" y="0" :width="size.width" :height="size.height" preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="backdrop" in2="map" scale="32" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
    <div class="liquid-optics" :style="opticalStyle" aria-hidden="true"></div>
    <div class="liquid-content"><slot /></div>
  </div>
</template>

<style scoped>
.liquid-panel { position: relative; border-radius: 28px; box-shadow: 0 20px 80px -36px rgb(0 0 0 / .24), 0 2px 8px rgb(0 0 0 / .03); }
.liquid-definitions { position: absolute; pointer-events: none; }
.liquid-optics { position: absolute; inset: 0; pointer-events: none; border-radius: inherit; background: color-mix(in srgb, var(--kawaii-surface) 62%, transparent); border: 1px solid color-mix(in srgb, var(--kawaii-text) 12%, transparent); box-shadow: inset 0 1px 1px rgb(255 255 255 / .8), inset 0 -1px 1px rgb(255 255 255 / .2); backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px); }
.liquid-content { position: relative; padding: 32px; }
:global(.dark) .liquid-optics { background: rgb(0 0 0 / .58); box-shadow: inset 0 1px 1px rgb(255 255 255 / .2); }
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) { .liquid-optics { background: var(--kawaii-surface); } }
@media (max-width: 480px) { .liquid-content { padding: 24px 20px; } }
</style>
