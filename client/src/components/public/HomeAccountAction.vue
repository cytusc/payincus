<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useConfigStore } from '@/stores/config'
import { dashboardPath, loginPath, registerPath } from '@/utils/app-paths'

const { t } = useI18n()
const auth = useAuthStore()
const config = useConfigStore()
const action = computed(() => {
  if (auth.isAuthenticated) return { to: dashboardPath(), label: t('publicSite.actions.console') }
  if (config.registrationEnabled) return { to: registerPath(), label: t('publicSite.cloud.createAccount') }
  return { to: loginPath(), label: t('publicSite.actions.signIn') }
})
void config.loadPublicConfig()
</script>

<template>
  <RouterLink :to="action.to" class="cloud-button cloud-account-action">{{ action.label }}</RouterLink>
</template>
