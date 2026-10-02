<template>
  <div class="cloud-network" aria-hidden="true">
    <svg viewBox="0 0 1200 900" fill="none" preserveAspectRatio="xMidYMid slice">
      <g class="cloud-network-orbit" transform="translate(690 510) rotate(-24)">
        <circle r="345" />
        <ellipse v-for="width in [72, 155, 235, 300]" :key="width" :rx="width" ry="345" />
        <ellipse rx="345" ry="100" />
        <ellipse rx="345" ry="220" />
        <path d="M-345 0h690M0-345v690" />
        <path d="M-289-187 Q0-265 289-187M-289 187Q0 265 289 187M-184-292Q0-322 184-292M-184 292Q0 322 184 292" />
      </g>
      <g class="cloud-network-routes">
        <path d="M126 660C320 325 720 266 1093 417M202 757C563 875 1085 548 1036 220M337 224C275 607 701 816 1108 571" />
        <circle cx="356" cy="426" r="5" /><circle cx="859" cy="342" r="5" />
        <circle cx="1009" cy="503" r="5" /><circle cx="644" cy="746" r="5" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.cloud-network { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.cloud-network svg { width: 100%; height: 100%; }
.cloud-network-orbit { stroke: var(--kawaii-text); stroke-opacity: .12; stroke-width: .8; }
.cloud-network-routes { stroke: var(--kawaii-text); stroke-opacity: .24; stroke-width: 1; }
.cloud-network-routes circle { fill: var(--kawaii-surface); stroke-opacity: .5; }
</style>
