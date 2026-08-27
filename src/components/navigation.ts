export type ScreenId =
  | 'home'
  | 'monitor-traffic'
  | 'track-transactions'
  | 'merchants'
  | 'new-onboarding'
  | 'bulk-onboarding'
  | 'review-onboarding'
  | 'legacy'
  | 'deals'
  | 'mca-compliance'
  | 'ucic-management'

export const SCREEN_LABELS: Record<ScreenId, string> = {
  home: 'Dashboard',
  'monitor-traffic': 'Monitor Traffic',
  'track-transactions': 'Track Transactions',
  merchants: 'Manage Merchants',
  'new-onboarding': 'New Onboarding',
  'bulk-onboarding': 'Bulk Onboarding',
  'review-onboarding': 'Review Onboarding',
  legacy: 'Legacy',
  deals: 'Deals',
  'mca-compliance': 'MCA Compliance',
  'ucic-management': 'UCIC Management',
}
