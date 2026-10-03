import { useConfigStore } from '@/stores/config'

export function useBrand() {
  const configStore = useConfigStore()

  return {
    get brandName() {
      return configStore.brandName?.trim() || 'HoyoVm'
    },
    get brandSubtitle() {
      return configStore.brandSubtitle?.trim() || '全球多节点 NAT VPS 平台'
    },
    get brandLogoUrl() {
      return configStore.brandLogoUrl?.trim() || '/hoyovm_logo.webp'
    }
  }
}
