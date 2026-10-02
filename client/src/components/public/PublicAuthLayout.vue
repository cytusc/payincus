<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { ArrowLeft, Moon, Sun } from 'lucide-vue-next'
import { useBrand } from '@/composables/useBrand'
import { useThemeStore } from '@/stores/theme'
import { supportedLocales, setLocale, type Locale } from '@/locales'
import CloudNetworkBackdrop from './CloudNetworkBackdrop.vue'
import LiquidGlassPanel from './LiquidGlassPanel.vue'
import '@/styles/public-cloud.css'

defineProps<{ embedded?: boolean; title: string; subtitle: string }>()
const { t, locale } = useI18n()
const brand = useBrand()
const themeStore = useThemeStore()
</script>

<template>
  <div class="cloud-public-theme cloud-auth" :class="{ 'cloud-auth-embedded': embedded }">
    <header v-if="!embedded" class="cloud-auth-topbar">
      <RouterLink to="/" class="cloud-auth-back"><ArrowLeft :size="16" aria-hidden="true" />{{ t('publicSite.cloud.backHome') }}</RouterLink>
      <div class="cloud-auth-tools">
        <select :value="locale" :aria-label="t('nav.toggleLanguage')" @change="setLocale(($event.target as HTMLSelectElement).value as Locale)">
          <option v-for="language in supportedLocales" :key="language.code" :value="language.code">{{ language.name }}</option>
        </select>
        <button type="button" :aria-label="t('nav.toggleTheme')" @click="themeStore.toggleTheme"><component :is="themeStore.isDark ? Moon : Sun" :size="18" aria-hidden="true" /></button>
      </div>
    </header>
    <component :is="embedded ? 'div' : 'main'" class="cloud-auth-main">
      <CloudNetworkBackdrop v-if="!embedded" />
      <div class="cloud-auth-grid">
        <RouterLink v-if="!embedded" to="/" class="cloud-auth-brand"><img :src="brand.brandLogoUrl" alt="" /><span>{{ brand.brandName }}</span></RouterLink>
        <component :is="embedded ? 'div' : LiquidGlassPanel">
          <div class="cloud-auth-heading">
            <component :is="embedded ? 'h2' : 'h1'">{{ title }}</component>
            <p>{{ subtitle }}</p>
          </div>
          <slot />
        </component>
        <div v-if="$slots.after" class="cloud-auth-after"><slot name="after" /></div>
      </div>
    </component>
    <footer v-if="!embedded" class="cloud-auth-footer">
      <span>{{ brand.brandName }} Cloud</span>
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.cloud-auth { min-height: 100svh; display: flex; flex-direction: column; }
.cloud-auth-topbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 22px 36px; }
.cloud-auth-back { display: inline-flex; gap: 8px; align-items: center; font-size: 13px; color: var(--kawaii-muted); }
.cloud-auth-back:hover { color: var(--kawaii-text); }
.cloud-auth-tools { display: flex; gap: 12px; align-items: center; }
.cloud-auth-tools select { background-color: transparent; color: var(--kawaii-muted); border: 0; font-size: 12px; padding-block: 8px; border-radius: 6px; }
.cloud-auth-tools select option { background: var(--kawaii-surface); color: var(--kawaii-text); }
.cloud-auth-tools button { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; }
.cloud-auth-main { flex: 1; position: relative; overflow: clip; display: grid; align-items: center; }
.cloud-auth-main :deep(.cloud-network) { inset: -10% 0 0; opacity: .55; }
.cloud-auth-grid { position: relative; min-width: 0; width: min(420px, calc(100% - 40px)); margin-inline: auto; padding-block: 24px 48px; }
.cloud-auth-brand { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 30px; font-size: 23px; letter-spacing: -.035em; font-weight: 600; }
.cloud-auth-brand img { width: 32px; height: 32px; object-fit: contain; filter: grayscale(1); border-radius: 8px; }
.cloud-auth-heading { margin-bottom: 28px; text-align: center; }
.cloud-auth-heading :is(h1, h2) { font-size: 25px; letter-spacing: -.035em; font-weight: 600; }
.cloud-auth-heading p { margin-top: 8px; color: var(--kawaii-muted); font-size: 13px; line-height: 1.7; }
.cloud-auth :deep(.input) { min-height: 46px; border-radius: 8px; background: color-mix(in srgb, var(--kawaii-surface) 80%, transparent); border: 1px solid var(--kawaii-line-strong); box-shadow: none; font-size: 13px; }
.cloud-auth :deep(.nimbus-submit) { min-height: 48px; border-radius: 8px; font-weight: 600; }
.cloud-auth :deep(.nimbus-submit:disabled) { opacity: .45; }
.cloud-auth :deep(.cloud-auth-secondary) { min-height: 46px; border: 1px solid var(--kawaii-line-strong); border-radius: 8px; color: var(--kawaii-text); background: transparent; font-size: 13px; }
.cloud-auth-after { margin-top: 24px; text-align: center; font-size: 13px; color: var(--kawaii-muted); }
.cloud-auth-footer { width: min(1200px, calc(100% - 64px)); margin-inline: auto; display: flex; align-items: center; justify-content: space-between; min-height: 66px; padding-block: 16px; border-top: 1px solid var(--kawaii-line); font-size: 12px; color: var(--kawaii-muted); }
.cloud-auth-embedded { min-height: 0; background: transparent; }
.cloud-auth-embedded .cloud-auth-main { overflow: visible; }
.cloud-auth-embedded .cloud-auth-grid { width: 100%; padding: 0; }
.cloud-auth-embedded .cloud-auth-heading { text-align: left; }
@media (max-width: 480px) {
  .cloud-auth-topbar { padding: 14px 20px; }.cloud-auth-grid { padding-block: 12px 36px; }
  .cloud-auth-brand { margin-bottom: 24px; }.cloud-auth-footer { width: calc(100% - 40px); }
  .cloud-auth-main :deep(.cloud-network) { right: -100%; left: -100%; }
}
</style>
