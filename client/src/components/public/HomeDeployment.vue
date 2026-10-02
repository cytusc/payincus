<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useBrand } from '@/composables/useBrand'
import CloudDeployIllustration from './CloudDeployIllustration.vue'
import HomeAccountAction from './HomeAccountAction.vue'

const { t } = useI18n()
const brand = useBrand()
const steps = ['select', 'deploy', 'connect'] as const
</script>

<template>
  <section class="home-deploy" aria-labelledby="home-deploy-title">
    <div class="home-section-inner">
      <h2 id="home-deploy-title">{{ t('publicSite.cloud.deployTitle') }}</h2>
      <p class="home-section-intro">{{ t('publicSite.cloud.deployDescription') }}</p>
      <ol class="home-deploy-steps">
        <li v-for="(step, index) in steps" :key="step" class="home-deploy-step">
          <CloudDeployIllustration :kind="step" class="home-deploy-image" />
          <div class="home-step-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</div>
          <h3>{{ t(`publicSite.cloud.steps.${step}.title`) }}</h3>
          <p>{{ t(`publicSite.cloud.steps.${step}.description`) }}</p>
        </li>
      </ol>
    </div>
  </section>

  <section class="home-section-inner home-cta" aria-labelledby="home-cta-title">
    <div class="home-cta-card">
      <CloudDeployIllustration kind="rack" class="home-cta-art home-cta-art-left" />
      <CloudDeployIllustration kind="deploy" class="home-cta-art home-cta-art-right" />
      <div class="home-cta-content">
        <h2 id="home-cta-title">{{ t('publicSite.cloud.ctaTitle', { brand: brand.brandName }) }}</h2>
        <p>{{ t('publicSite.cloud.ctaDescription') }}</p>
        <HomeAccountAction />
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-section-inner { width: min(1200px, calc(100% - 64px)); margin-inline: auto; }
.home-deploy { padding-block: 76px 80px; background: var(--kawaii-surface-soft); text-align: center; }
.home-deploy h2, .home-cta h2 { font-size: clamp(26px, 3vw, 36px); font-weight: 600; letter-spacing: -.04em; line-height: 1.4; text-wrap: balance; }
.home-section-intro { margin-top: 14px; color: var(--kawaii-muted); font-size: 14px; line-height: 1.8; }
.home-deploy-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 64px; margin-top: 40px; list-style: none; padding: 0; }
.home-deploy-step { position: relative; }
.home-deploy-step:not(:last-child)::after { content: ''; position: absolute; top: 79px; left: calc(100% - 22px); width: 108px; border-top: 1px dashed var(--kawaii-line-strong); }
.home-deploy-image { display: block; width: 210px; max-width: 100%; height: 140px; margin-inline: auto; }
.home-step-number { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: 1px solid var(--kawaii-line-strong); border-radius: 50%; font-size: 11px; margin-block: 22px 14px; }
.home-deploy-step h3 { font-size: 19px; font-weight: 600; }
.home-deploy-step p { max-width: 290px; margin: 12px auto 0; font-size: 14px; line-height: 1.9; color: var(--kawaii-muted); text-wrap: pretty; }
.home-cta { padding-block: 72px; }
.home-cta-card { position: relative; isolation: isolate; overflow: hidden; border: 1px solid var(--kawaii-line); border-radius: 22px; padding: 66px 32px; text-align: center; background: var(--kawaii-surface-soft); }
.home-cta-content { position: relative; max-width: 640px; margin-inline: auto; }
.home-cta-content p { max-width: 480px; margin: 18px auto 28px; color: var(--kawaii-muted); font-size: 15px; line-height: 1.85; text-wrap: pretty; }
.home-cta-art { position: absolute; z-index: -1; width: 350px; bottom: -48px; opacity: .18; --illustration-surface: var(--kawaii-surface-soft); pointer-events: none; }
.home-cta-art-left { left: -70px; transform: rotate(-12deg); }.home-cta-art-right { right: -72px; transform: rotate(12deg); }
@media (max-width: 1050px) { .home-deploy-steps { gap: 32px; }.home-deploy-step:not(:last-child)::after { left: 100%; width: 32px; }.home-cta-art { width: 280px; opacity: .12; } }
@media (max-width: 760px) {
  .home-section-inner { width: calc(100% - 40px); }.home-deploy { padding-block: 48px; }
  .home-deploy-steps { grid-template-columns: 1fr; gap: 36px; margin-top: 28px; }
  .home-deploy-step:not(:last-child)::after { display: none; }.home-step-number { margin-top: 10px; }
  .home-cta { padding-block: 40px; }.home-cta-card { padding: 40px 22px; border-radius: 18px; }.home-cta-art { display: none; }
}
</style>
