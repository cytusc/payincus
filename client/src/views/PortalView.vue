<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import api from '@/api'
import { formatPublicPrice, formatPublicTraffic, getStartingMonthlyPrice, type PublicPackage } from '@/utils/publicCatalog'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePageSeo } from '@/composables/usePageSeo'
import { useAuthStore } from '@/stores/auth'
import { useBrand } from '@/composables/useBrand'
import { dashboardPath, loginPath, marketPath } from '@/utils/app-paths'
import LoginView from '@/views/LoginView.vue'
import LiquidGlassPanel from '@/components/public/LiquidGlassPanel.vue'
import HomeDeployment from '@/components/public/HomeDeployment.vue'
import CloudNetworkBackdrop from '@/components/public/CloudNetworkBackdrop.vue'
import { ArrowUpRight, Box, Cpu, Globe2, Layers3 } from 'lucide-vue-next'
import '@/styles/public-cloud.css'

defineOptions({
  name: 'PortalView'
})

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const brand = useBrand()

const packages = ref<PublicPackage[]>([])
const loading = ref(true)
const spotlightPackages = computed(() => [...packages.value].sort((left, right) => {
  if (left.soldOut !== right.soldOut) return left.soldOut ? 1 : -1
  const leftPrice = getStartingMonthlyPrice(left)
  const rightPrice = getStartingMonthlyPrice(right)
  if (leftPrice !== null && rightPrice !== null && leftPrice !== rightPrice) return leftPrice - rightPrice
  return left.name.localeCompare(right.name, 'zh')
}).slice(0, 4))

function getPriceLabel(pkg: PublicPackage): string {
  const price = getStartingMonthlyPrice(pkg)
  return price === null ? t('publicSite.market.free') : t('publicSite.market.fromMonthly', { price: formatPublicPrice(price) })
}

function browseCatalog(): void {
  void router.push({ path: marketPath() })
}

function openPackage(pkg: PublicPackage): void {
  void router.push({ path: marketPath(), query: { source: pkg.sourceType, package: String(pkg.id) } })
}

async function loadCatalog(): Promise<void> {
  loading.value = true
  try {
    const response = await api.packages.listPublic()
    packages.value = (response.packages || []) as unknown as PublicPackage[]
  } catch {
    packages.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => { void loadCatalog() })

const consoleActionLabel = computed(() => (
  authStore.isAuthenticated ? t('publicSite.actions.console') : t('publicSite.actions.signIn')
))

usePageSeo(() => ({
  title: `${brand.brandName} - ${brand.brandSubtitle}`,
  description: brand.brandSubtitle,
  canonical: `${window.location.origin}/`,
  keywords: t('publicSite.seo.keywords').replace(/Incudal/g, brand.brandName)
}))

function goToConsole(): void {
  if (authStore.isAuthenticated) {
    void router.push(dashboardPath())
    return
  }

  void router.push(loginPath())
}
</script>

<template>
  <div class="cloud-public-theme cloud-home">
    <section class="cloud-hero">
      <CloudNetworkBackdrop />
      <div class="cloud-container cloud-hero-grid">
        <div class="cloud-hero-copy">
          <div class="cloud-wordmark"><span></span> {{ brand.brandName }} Cloud</div>
          <h1>{{ t('publicSite.portal.heroTitlePrimary') }}<br />{{ t('publicSite.cloud.heroSecondLine') }}</h1>
          <p class="cloud-intro">{{ t('publicSite.cloud.heroDescription') }}</p>
          <div class="cloud-hero-actions">
            <button type="button" class="cloud-button" @click="browseCatalog()">{{ t('publicSite.actions.viewCatalog') }} <ArrowUpRight :size="17" aria-hidden="true" /></button>
            <button v-if="authStore.isAuthenticated" type="button" class="cloud-button cloud-button-secondary" @click="goToConsole">{{ consoleActionLabel }}</button>
          </div>
          <div class="cloud-hero-specs">
            <span><Cpu :size="16" aria-hidden="true" /> LXC / KVM</span>
            <span><Globe2 :size="16" aria-hidden="true" /> NAT VPS</span>
            <span><Layers3 :size="16" aria-hidden="true" /> {{ t('publicSite.cloud.unifiedConsole') }}</span>
          </div>
        </div>
        <LiquidGlassPanel class="cloud-account-panel">
          <template v-if="authStore.isAuthenticated">
            <Box :size="30" :stroke-width="1.2" aria-hidden="true" />
            <h2>{{ t('publicSite.cloud.welcomeBack') }}</h2>
            <p class="cloud-panel-description">{{ t('publicSite.portal.previewDescription') }}</p>
            <button type="button" class="cloud-button cloud-console-button" @click="goToConsole">{{ consoleActionLabel }}</button>
          </template>
          <LoginView v-else embedded />
        </LiquidGlassPanel>
      </div>
    </section>

    <section class="cloud-capabilities cloud-container" :aria-label="t('publicSite.cloud.capabilities')">
      <div><Cpu :size="23" :stroke-width="1.3" aria-hidden="true" /><p><strong>{{ t('publicSite.cloud.computeTitle') }}</strong><span>{{ t('publicSite.cloud.computeDescription') }}</span></p></div>
      <div><Globe2 :size="23" :stroke-width="1.3" aria-hidden="true" /><p><strong>{{ t('publicSite.cloud.networkTitle') }}</strong><span>{{ t('publicSite.cloud.networkDescription') }}</span></p></div>
      <div><Layers3 :size="23" :stroke-width="1.3" aria-hidden="true" /><p><strong>{{ t('publicSite.cloud.manageTitle') }}</strong><span>{{ t('publicSite.cloud.manageDescription') }}</span></p></div>
    </section>

    <section v-if="!loading && spotlightPackages.length" class="cloud-container cloud-products">
      <div class="cloud-section-heading">
        <div><h2>{{ t('publicSite.portal.browseTitle') }}</h2><p>{{ t('publicSite.portal.browseDescription') }}</p></div>
        <button type="button" class="cloud-text-action" @click="browseCatalog()">{{ t('publicSite.actions.browseProducts') }} <ArrowUpRight :size="17" aria-hidden="true" /></button>
      </div>
      <div class="cloud-plans">
        <button v-for="pkg in spotlightPackages" :key="pkg.id" type="button" class="cloud-plan" @click="openPackage(pkg)">
          <div class="cloud-plan-type"><span>{{ pkg.instance_type === 'vm' ? 'KVM' : 'LXC' }}</span><span>{{ pkg.sourceType === 'official' ? t('publicSite.market.official') : t('publicSite.market.market') }}</span></div>
          <h3>{{ pkg.name }}</h3>
          <p>{{ pkg.description || t('publicSite.portal.packageFallback') }}</p>
          <div class="cloud-plan-price">{{ getPriceLabel(pkg) }}</div>
          <div class="cloud-plan-bottom"><span>{{ formatPublicTraffic(pkg.monthly_traffic_limit, t('common.unlimited')) }} / {{ t('publicSite.market.labels.traffic') }}</span><span>{{ pkg.soldOut ? t('publicSite.market.soldOut') : t('publicSite.actions.viewCatalog') }}</span></div>
        </button>
      </div>
    </section>

    <HomeDeployment />
  </div>
</template>

<style scoped>
.cloud-home { overflow: clip; }
.cloud-container { width: min(1200px, calc(100% - 64px)); margin-inline: auto; }
.cloud-hero { position: relative; border-bottom: 1px solid var(--kawaii-line); }
.cloud-hero :deep(.cloud-network) { left: 16%; top: 6%; opacity: .75; }
.cloud-hero-grid { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 420px; align-items: center; gap: 80px; padding-block: 76px 88px; }
.cloud-hero-copy { padding-block: 24px; }
.cloud-wordmark { display: flex; align-items: center; gap: 9px; font-size: 14px; font-weight: 500; margin-bottom: 27px; }
.cloud-wordmark span { width: 8px; height: 8px; background: var(--kawaii-text); border-radius: 50%; box-shadow: 0 0 0 5px color-mix(in srgb, var(--kawaii-text) 6%, transparent); }
.cloud-hero h1 { font-size: clamp(40px, 4.5vw, 64px); font-weight: 600; letter-spacing: -.045em; line-height: 1.23; text-wrap: balance; }
.cloud-intro { max-width: 450px; font-size: 16px; line-height: 1.95; color: var(--kawaii-muted); margin-top: 26px; text-wrap: pretty; }
.cloud-hero-actions { display: flex; align-items: center; gap: 28px; margin-top: 32px; }
.cloud-hero-specs { display: flex; flex-wrap: wrap; gap: 22px; margin-top: 80px; font-size: 12px; color: var(--kawaii-muted); }
.cloud-hero-specs span { display: flex; gap: 7px; align-items: center; }
.cloud-account-panel { min-width: 0; }
.cloud-account-panel h2 { font-size: 25px; font-weight: 600; letter-spacing: -.035em; }
.cloud-panel-description { margin-top: 9px; color: var(--kawaii-muted); font-size: 13px; line-height: 1.7; }
.cloud-console-button { width: 100%; margin-top: 28px; }
.cloud-capabilities { display: grid; grid-template-columns: repeat(3, 1fr); padding-block: 35px; border-bottom: 1px solid var(--kawaii-line); }
.cloud-capabilities > div { display: flex; gap: 16px; align-items: center; padding-inline: 30px; border-right: 1px solid var(--kawaii-line); }
.cloud-capabilities > div:first-child { padding-left: 0; }.cloud-capabilities > div:last-child { border-right: 0; }
.cloud-capabilities svg { flex-shrink: 0; }
.cloud-capabilities strong { display: block; font-size: 14px; font-weight: 600; }.cloud-capabilities span { display: block; font-size: 12px; color: var(--kawaii-muted); margin-top: 6px; }

@media (max-width: 1050px) { .cloud-hero-grid { gap: 36px; grid-template-columns: minmax(0, 1fr) 380px; }.cloud-capabilities > div { padding-inline: 16px; } }
@media (max-width: 760px) { .cloud-container { width: calc(100% - 40px); }.cloud-hero-grid { grid-template-columns: 1fr; padding-block: 40px 48px; gap: 36px; }.cloud-hero-copy { padding: 0; }.cloud-hero h1 { font-size: clamp(38px, 8vw, 54px); }.cloud-intro { max-width: 500px; font-size: 15px; }.cloud-hero-specs { margin-top: 32px; gap: 16px; }.cloud-account-panel { width: 100%; max-width: 480px; justify-self: center; }.cloud-hero :deep(.cloud-network) { left: -50%; top: 20%; width: 170%; }.cloud-capabilities { grid-template-columns: 1fr; gap: 24px; }.cloud-capabilities > div { border: 0; padding: 0; } }
@media (max-width: 480px) { .cloud-hero-actions { gap: 22px; }.cloud-hero-specs { font-size: 11px; gap: 12px; } }
.cloud-products { padding-block: 64px 80px; }
.cloud-section-heading { display: flex; justify-content: space-between; align-items: end; gap: 24px; margin-bottom: 28px; }
.cloud-section-heading h2 { font-size: 30px; letter-spacing: -.04em; font-weight: 600; }
.cloud-section-heading p { color: var(--kawaii-muted); font-size: 14px; margin-top: 12px; }
.cloud-text-action { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; min-height: 36px; }
.cloud-text-action:hover { text-decoration: underline; text-underline-offset: 4px; }
.cloud-plans { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.cloud-plan { text-align: left; border: 1px solid var(--kawaii-line); border-radius: 14px; padding: 24px 20px; background: var(--kawaii-surface); min-width: 0; }
.cloud-plan:hover { border-color: var(--kawaii-text); }
.cloud-plan-type { display: flex; justify-content: space-between; gap: 8px; color: var(--kawaii-muted); font-size: 11px; }
.cloud-plan-type span:first-child { color: var(--kawaii-text); font-weight: 600; }
.cloud-plan h3 { font-size: 17px; font-weight: 600; margin-top: 24px; overflow-wrap: anywhere; }
.cloud-plan > p { font-size: 12px; color: var(--kawaii-muted); line-height: 1.7; margin-top: 9px; min-height: 42px; overflow-wrap: anywhere; }
.cloud-plan-price { margin-block: 30px 22px; font-size: 22px; letter-spacing: -.04em; font-weight: 600; }
.cloud-plan-bottom { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; padding-top: 16px; border-top: 1px solid var(--kawaii-line); font-size: 11px; color: var(--kawaii-muted); }
@media (max-width: 1050px) { .cloud-plans { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 760px) { .cloud-products { padding-block: 48px; }.cloud-section-heading { align-items: start; flex-direction: column; gap: 12px; }.cloud-section-heading h2 { font-size: 26px; } }
@media (max-width: 480px) { .cloud-plans { grid-template-columns: 1fr; } }
</style>
