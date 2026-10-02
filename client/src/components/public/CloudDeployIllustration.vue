<script setup lang="ts">
defineProps<{ kind: 'select' | 'deploy' | 'connect' | 'rack' }>()
</script>

<template>
  <!-- Original monochrome line illustrations; no third-party image assets. -->
  <svg viewBox="0 0 240 160" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <ellipse cx="120" cy="142" rx="83" ry="10" fill="currentColor" fill-opacity=".035" stroke="none" />
    <g v-if="kind === 'select'">
      <rect x="39" y="31" width="147" height="101" rx="7" class="illustration-fill" />
      <path d="M39 49h147" opacity=".3" />
      <path d="M49 40h1m7 0h1m7 0h1" />
      <rect x="54" y="63" width="32" height="52" rx="3" opacity=".3" />
      <rect x="95" y="63" width="32" height="52" rx="3" opacity=".3" />
      <path d="M61 77h18m-18 9h12m29-9h18m-18 9h12" opacity=".4" />
      <rect x="140" y="55" width="48" height="71" rx="5" class="illustration-fill" />
      <path d="M151 69h25m-25 9h16m-16 11h25" opacity=".6" />
      <path d="m154 107 6 6 12-13" stroke-width="2" />
      <path d="m178 117 4 26 7-8 10-2Z" class="illustration-fill" />
    </g>
    <g v-else-if="kind === 'deploy'">
      <path d="m65 45 69-26 47 23-68 28Z" class="illustration-fill" />
      <path d="M65 45v76l48 25V70m0 76 68-27V42" />
      <path d="m65 70 48 25 68-27M65 95l48 25 68-27" opacity=".4" />
      <path d="m77 65 23 12m-23 14 23 12m-23 13 23 12" />
      <path d="m127 77 29-11m-29 37 29-11m-29 36 29-11" opacity=".5" />
      <circle cx="182" cy="112" r="23" class="illustration-fill" />
      <path d="m175 112 6 6 10-13" stroke-width="2" />
      <path d="M43 77V48q0-17 17-23l15-6m-9-2 9 2-5 9" opacity=".4" />
    </g>
    <g v-else-if="kind === 'connect'">
      <rect x="40" y="34" width="160" height="100" rx="7" class="illustration-fill" />
      <path d="M40 54h160" opacity=".3" />
      <path d="M51 44h1m7 0h1m7 0h1" />
      <path d="m63 76 11 9-11 9m22 0h18" stroke-width="2" />
      <path d="M63 111h62" opacity=".25" />
      <rect x="160" y="100" width="35" height="30" rx="5" class="illustration-fill" />
      <path d="M168 100v-8a9.5 9.5 0 0 1 19 0v8m-9 12v6" />
    </g>
    <g v-else>
      <path d="m57 34 76-28 52 25-76 29Z" class="illustration-fill" />
      <path d="M57 34v97l52 26V60m0 97 76-29V31" />
      <path d="m57 58 52 26 76-29M57 82l52 26 76-29m-128 27 52 26 76-29" opacity=".5" />
      <path d="m70 57 24 12M70 81l24 12m-24 12 24 12m-24 12 24 12" />
      <path d="m125 73 37-14m-37 38 37-14m-37 38 37-14m-37 38 37-14" opacity=".5" />
    </g>
  </svg>
</template>

<style scoped>
.illustration-fill { fill: var(--illustration-surface, var(--kawaii-surface)); }
</style>
