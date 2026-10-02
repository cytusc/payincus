<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBrand } from '@/composables/useBrand'
import { useAuthStore } from '@/stores/auth'
import { useConfigStore } from '@/stores/config'
import { dashboardPath, forgotPasswordPath, helpPath, loginPath, marketPath, registerPath } from '@/utils/app-paths'
import TermsOfServiceModal from '@/components/TermsOfServiceModal.vue'
import CloudDeployIllustration from './CloudDeployIllustration.vue'
import HomeAccountAction from './HomeAccountAction.vue'

const { t } = useI18n()
const brand = useBrand()
const auth = useAuthStore()
const config = useConfigStore()
const showTerms = ref(false)
const year = new Date().getFullYear()
</script>

<template>
  <footer class="home-footer">
    <div class="home-footer-start">
      <div class="home-footer-inner home-footer-start-row">
        <p>{{ t('publicSite.cloud.footerInvitation') }}</p>
        <HomeAccountAction class="cloud-button-secondary" />
      </div>
    </div>
    <div class="home-footer-inner home-footer-main">
      <div class="home-footer-brand">
        <RouterLink to="/" class="home-footer-wordmark">{{ brand.brandName }}</RouterLink>
        <p>{{ t('publicSite.cloud.footerDescription') }}</p>
        <CloudDeployIllustration kind="rack" class="home-footer-art" />
      </div>
      <nav class="home-footer-group" :aria-label="t('publicSite.footer.explore')">
        <h2>{{ t('publicSite.footer.explore') }}</h2>
        <RouterLink to="/">{{ t('publicSite.nav.home') }}</RouterLink>
        <RouterLink :to="marketPath()">{{ t('publicSite.nav.products') }}</RouterLink>
      </nav>
      <nav class="home-footer-group" :aria-label="t('publicSite.footer.account')">
        <h2>{{ t('publicSite.footer.account') }}</h2>
        <RouterLink v-if="auth.isAuthenticated" :to="dashboardPath()">{{ t('publicSite.actions.console') }}</RouterLink>
        <template v-else>
          <RouterLink :to="loginPath()">{{ t('auth.login') }}</RouterLink>
          <RouterLink v-if="config.registrationEnabled" :to="registerPath()">{{ t('publicSite.cloud.createAccount') }}</RouterLink>
          <RouterLink :to="forgotPasswordPath()">{{ t('auth.forgotPasswordLink') }}</RouterLink>
        </template>
      </nav>
      <nav class="home-footer-group" :aria-label="t('publicSite.cloud.footerSupport')">
        <h2>{{ t('publicSite.cloud.footerSupport') }}</h2>
        <RouterLink :to="helpPath()">{{ t('publicSite.nav.help') }}</RouterLink>
        <button type="button" @click="showTerms = true">{{ t('auth.tos.title') }}</button>
      </nav>
    </div>
    <div class="home-footer-inner home-footer-bottom">
      <p>© {{ year }} {{ brand.brandName }}. {{ t('publicSite.cloud.copyright') }}</p>
      <p>LXC / KVM · NAT VPS</p>
    </div>
    <TermsOfServiceModal :show="showTerms" @close="showTerms = false" />
  </footer>
</template>

<style scoped>
.home-footer { border-top: 1px solid var(--kawaii-line); }
.home-footer-inner { width: min(1200px, calc(100% - 64px)); margin-inline: auto; }
.home-footer-start { border-bottom: 1px solid var(--kawaii-line); }
.home-footer-start-row { display: flex; justify-content: space-between; align-items: center; gap: 24px; padding-block: 28px; }
.home-footer-start-row p { font-size: 18px; font-weight: 500; letter-spacing: -.02em; text-wrap: balance; }
.home-footer-start-row :deep(a) { flex-shrink: 0; }
.home-footer-main { display: grid; grid-template-columns: 2fr repeat(3, 1fr); gap: 40px; padding-block: 52px 36px; }
.home-footer-wordmark { display: inline-block; font-size: 24px; font-weight: 600; letter-spacing: -.04em; }
.home-footer-brand > p { max-width: 260px; margin-top: 12px; font-size: 13px; line-height: 1.8; color: var(--kawaii-muted); }
.home-footer-art { width: 135px; height: 90px; margin-top: 20px; opacity: .3; }
.home-footer-group { display: flex; align-items: flex-start; flex-direction: column; gap: 14px; font-size: 13px; }
.home-footer-group h2 { font-size: 14px; font-weight: 600; margin-bottom: 6px; }
.home-footer-group a, .home-footer-group button { color: var(--kawaii-muted); text-align: left; line-height: 1.8; }
.home-footer-group a:hover, .home-footer-group button:hover { color: var(--kawaii-text); text-decoration: underline; text-underline-offset: 4px; }
.home-footer-bottom { display: flex; justify-content: space-between; gap: 16px; padding-block: 24px; border-top: 1px solid var(--kawaii-line); color: var(--kawaii-muted); font-size: 12px; line-height: 1.7; }
@media (max-width: 760px) {
  .home-footer-inner { width: calc(100% - 40px); }.home-footer-start-row { align-items: flex-start; flex-direction: column; gap: 20px; }
  .home-footer-main { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px 24px; padding-block: 36px; }
  .home-footer-brand { grid-column: 1 / -1; }.home-footer-art { display: none; }.home-footer-bottom { flex-direction: column; gap: 6px; }
}
</style>
