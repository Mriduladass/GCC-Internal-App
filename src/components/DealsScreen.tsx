import { useMemo, useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { Badge, Card, EmptyState, IconButton } from '@payglocal_ui/flux-ui'
import StatusBar from './StatusBar'
import ScreenChrome from './ScreenChrome'
import { DetailField, FilterField, SearchFilterRow } from './listKit'
import type { ScreenId } from './navigation'

type DealStatus = 'Draft' | 'Auto approved'

type Deal = {
  id: string
  status: DealStatus
  dealName: string
  merchantName: string
  onboardingId: string
  accountManager: string
  creationDate: string
}

const DEALS: Deal[] = [
  { id: '3a506e', status: 'Draft', dealName: '—', merchantName: '—', onboardingId: 'a318be831f10a913', accountManager: '—', creationDate: '2026-08-27' },
  { id: 'ca6d20', status: 'Auto approved', dealName: 'RESELLER_MERCHANT_DEAL', merchantName: 'Bluepetal Retail', onboardingId: 'a3189e0a1efa7637', accountManager: 'arjunpatelup', creationDate: '2026-08-27' },
  { id: 'bb4474', status: 'Draft', dealName: '—', merchantName: '—', onboardingId: 'a31894424bf1693a', accountManager: '—', creationDate: '2026-08-27' },
  { id: '507b1e', status: 'Auto approved', dealName: 'Northwind Traders Deal', merchantName: 'Northwind Traders', onboardingId: 'a3186d9cacde184f', accountManager: 'swatikolhe', creationDate: '2026-08-27' },
  { id: '084aff', status: 'Draft', dealName: '—', merchantName: '—', onboardingId: 'a31881d19ebe8a2a', accountManager: '—', creationDate: '2026-08-27' },
  { id: '7cbda9', status: 'Draft', dealName: '—', merchantName: '—', onboardingId: 'a31869bacfd8fbde', accountManager: '—', creationDate: '2026-08-26' },
]

const STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Auto approved', label: 'Auto approved' },
]

function DealCard({ deal }: { deal: Deal }) {
  return (
    <Card className="gap-0 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-[12.5px] font-semibold text-primary">{deal.id}</p>
        <Badge variant={deal.status === 'Auto approved' ? 'success' : 'secondary'} size="sm" className="shrink-0">
          {deal.status}
        </Badge>
      </div>
      <p className="mt-1 text-[14.5px] font-semibold leading-snug text-foreground">{deal.dealName}</p>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
        <DetailField label="Merchant Name" value={deal.merchantName} />
        <DetailField label="Account Manager" value={deal.accountManager} />
        <DetailField label="Onboarding ID" value={deal.onboardingId} />
        <DetailField label="Creation Date" value={deal.creationDate} />
      </div>
    </Card>
  )
}

export default function DealsScreen({ onNavigate }: { onNavigate: (target: ScreenId) => void }) {
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return DEALS.filter((d) => {
      if (q && !d.id.toLowerCase().includes(q) && !d.onboardingId.toLowerCase().includes(q)) return false
      if (statusFilter !== 'all' && d.status !== statusFilter) return false
      return true
    })
  }, [query, statusFilter])

  return (
    <ScreenChrome currentScreen="deals" onNavigate={onNavigate}>
      <div className="shrink-0 border-b border-border bg-card px-5 pb-4 pt-2">
        <StatusBar variant="dark" />

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <IconButton aria-label="Back" variant="outline" size="md" rounded="lg" onClick={() => onNavigate('home')} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </IconButton>
            <h1 className="truncate text-[19px] font-bold text-foreground">Deals</h1>
          </div>

          <button
            type="button"
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 text-[12.5px] font-semibold text-primary-foreground shadow-sm hover:bg-[var(--primary-hover)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Deal
          </button>
        </div>

        <SearchFilterRow
          value={query}
          onChange={setQuery}
          placeholder="Search by Deal ID or Onboarding ID"
          onToggleFilters={() => setFiltersOpen((v) => !v)}
        />

        {filtersOpen && (
          <div className="mt-3 rounded-2xl border border-border bg-muted/40 p-3">
            <FilterField label="Status" placeholder="Select status" value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filtered.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          <EmptyState title="No deals found" description="Try a different deal or onboarding ID." />
        )}
      </div>
    </ScreenChrome>
  )
}
