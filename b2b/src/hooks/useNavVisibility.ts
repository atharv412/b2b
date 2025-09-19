import { useNav } from '@/context/NavContext'
import { navigationItems, getVisibleItems } from '@/lib/navigation'

export function useNavVisibility() {
  const { user } = useNav()
  
  const visibleItems = getVisibleItems(user, navigationItems)
  const primaryItems = visibleItems.filter(item => !item.isPrimary && !item.href.startsWith('#'))
  const actionItems = visibleItems.filter(item => item.href.startsWith('#'))
  const sellerItems = visibleItems.filter(item => 
    item.id === 'manage-products' || item.id === 'analytics'
  )

  return {
    visibleItems,
    primaryItems,
    actionItems,
    sellerItems,
    hasSellerAccess: sellerItems.length > 0
  }
}
