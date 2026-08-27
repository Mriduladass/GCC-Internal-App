import { useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Card, EmptyState, IconButton, Tabs, TabsList, TabsTrigger } from '@payglocal_ui/flux-ui'
import StatusBar from './StatusBar'
import ScreenChrome from './ScreenChrome'
import { DetailField, FilterField, SearchFilterRow } from './listKit'
import type { ScreenId } from './navigation'

type OnboardingStatus = 'Maf Completed' | 'Maf Requested'

type Merchant = {
  onboardingId: string
  merchantName: string
  status: OnboardingStatus
  createdDate: string
  accountManager: string
  lastUpdatedDate: string
  lastUpdatedUser: string
}

const MERCHANTS: Merchant[] = [
  { onboardingId: 'a1de8cab5f861211', merchantName: 'Bluepetal Retail Private Limited', status: 'Maf Completed', createdDate: '20/07/2026 08:01:26', accountManager: 'kunalsomaiya', lastUpdatedDate: '11/08/2026 15:15:31', lastUpdatedUser: 'EXTERNAL_ENTRY' },
  { onboardingId: 'a1c7f19f18ad47f4', merchantName: 'Lindsay Manor Hospitality', status: 'Maf Completed', createdDate: '17/07/2026 14:11:02', accountManager: 'kunalsomaiya', lastUpdatedDate: '11/08/2026 15:15:35', lastUpdatedUser: 'EXTERNAL_ENTRY' },
  { onboardingId: 'a1c7f1790f3047f4', merchantName: 'Adamo Hospitality LLP', status: 'Maf Completed', createdDate: '17/07/2026 14:10:43', accountManager: 'kunalsomaiya', lastUpdatedDate: '11/08/2026 15:15:35', lastUpdatedUser: 'EXTERNAL_ENTRY' },
  { onboardingId: 'a143bc09691ef399', merchantName: 'Riddhis Digital Ecommerce Pvt Ltd', status: 'Maf Requested', createdDate: '01/07/2026 13:05:40', accountManager: 'arjunpatelup', lastUpdatedDate: '10/07/2026 18:55:41', lastUpdatedUser: 'vishaljames' },
  { onboardingId: 'a1037ae4790c4734', merchantName: 'Monarch Enterprises', status: 'Maf Completed', createdDate: '23/06/2026 17:56:16', accountManager: 'kunalsomaiya', lastUpdatedDate: '11/08/2026 15:15:56', lastUpdatedUser: 'EXTERNAL_ENTRY' },
  { onboardingId: '9fa110a139267f6e', merchantName: 'Instaserv India Private Limited', status: 'Maf Requested', createdDate: '11/05/2026 17:37:54', accountManager: 'arjunpatelup', lastUpdatedDate: '10/07/2026 19:19:23', lastUpdatedUser: 'vishaljames' },
]

const STATE_OPTIONS = [
  { value: 'Maf Completed', label: 'Maf Completed' },
  { value: 'Maf Requested', label: 'Maf Requested' },
]

function MerchantCard({ merchant }: { merchant: Merchant }) {
  const isCompleted = merchant.status === 'Maf Completed'
  return (
    <Card className="gap-0 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-[12.5px] font-semibold text-primary">{merchant.onboardingId}</p>
        <span className={`shrink-0 text-[11.5px] font-semibold ${isCompleted ? 'text-emerald-600' : 'text-foreground'}`}>
          {merchant.status}
        </span>
      </div>
      <p className="mt-1 text-[14.5px] font-semibold leading-snug text-foreground">{merchant.merchantName}</p>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
        <DetailField label="Account Manager" value={merchant.accountManager} />
        <DetailField label="Created Date" value={merchant.createdDate} />
        <DetailField label="Last Updated" value={merchant.lastUpdatedDate} />
        <DetailField label="Last Updated By" value={<span className="italic">{merchant.lastUpdatedUser}</span>} />
      </div>
    </Card>
  )
}

export default function NewOnboardingScreen({ onNavigate }: { onNavigate: (target: ScreenId) => void }) {
  const [mode, setMode] = useState('assisted')
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [stateFilter, setStateFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return MERCHANTS.filter((m) => {
      if (q && !m.onboardingId.toLowerCase().includes(q) && !m.merchantName.toLowerCase().includes(q)) return false
      if (stateFilter !== 'all' && m.status !== stateFilter) return false
      return true
    })
  }, [query, stateFilter])

  return (
    <ScreenChrome currentScreen="new-onboarding" onNavigate={onNavigate}>
      <div className="shrink-0 border-b border-border bg-card px-5 pb-4 pt-2">
        <StatusBar variant="dark" />

        <div className="mt-2 flex min-w-0 items-center gap-2">
          <IconButton aria-label="Back" variant="outline" size="md" rounded="lg" onClick={() => onNavigate('home')} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </IconButton>
          <h1 className="truncate text-[17px] font-bold text-foreground">Merchants Onboarding</h1>
        </div>

        <Tabs value={mode} onValueChange={setMode} className="mt-3">
          <TabsList className="w-full">
            <TabsTrigger value="assisted" className="flex-1">
              Assisted
            </TabsTrigger>
            <TabsTrigger value="automated" className="flex-1">
              Automated
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <SearchFilterRow
          value={query}
          onChange={setQuery}
          placeholder="Search by Onboarding ID or Merchant"
          onToggleFilters={() => setFiltersOpen((v) => !v)}
        />

        {filtersOpen && (
          <div className="mt-3 rounded-2xl border border-border bg-muted/40 p-3">
            <FilterField
              label="Onboarding State"
              placeholder="Select onboarding state"
              value={stateFilter}
              onChange={setStateFilter}
              options={STATE_OPTIONS}
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filtered.map((merchant) => (
              <MerchantCard key={merchant.onboardingId} merchant={merchant} />
            ))}
          </div>
        ) : (
          <EmptyState title="No merchants found" description="Try a different onboarding ID or merchant name." />
        )}
      </div>
    </ScreenChrome>
  )
}
