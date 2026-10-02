<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import '@/styles/public-cloud.css'
import HomeSiteFooter from '@/components/public/HomeSiteFooter.vue'
import PublicSiteFooter from '@/components/public/PublicSiteFooter.vue'
import PublicSiteHeader from '@/components/public/PublicSiteHeader.vue'

const route = useRoute()

const authRouteNames = new Set(['login', 'register', 'forgot-password'])

const isAuthPage = computed(() => authRouteNames.has(String(route.name || '')))
</script>

<template>
  <div
    :class="{ 'cloud-public-theme': route.name === 'portal' }"
    class="kawaii-public-shell flex min-h-screen flex-col selection:bg-sky-200/50 dark:selection:bg-sky-400/25"
  >
    <div
      v-if="route.name !== 'portal'"
      class="kawaii-public-glow pointer-events-none absolute inset-x-0 top-0 h-[34rem]"
    ></div>

    <PublicSiteHeader />

    <main class="relative flex flex-1 flex-col">
      <div
        v-if="isAuthPage"
        class="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
      >
        <slot />
      </div>
      <slot v-else />
    </main>

    <HomeSiteFooter v-if="route.name === 'portal'" />
    <PublicSiteFooter v-else-if="!isAuthPage" />
  </div>
</template>
