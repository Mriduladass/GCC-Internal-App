import { useMemo, useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { Badge, Card, EmptyState, IconButton, Tabs, TabsList, TabsTrigger } from '@payglocal_ui/flux-ui'
import StatusBar from './StatusBar'
import ScreenChrome from './ScreenChrome'
import { DetailField, FilterField, SearchFilterRow } from './listKit'
import type { ScreenId } from './navigation'

type OnboardingStatus = 'In progress' | 'Under review' | 'Archived'

type Merchant = {
  onboardingId: string
  legalName: string
  status: OnboardingStatus
  accountManager: string
  mafSubmissionDate: string | null
  products: string[]
}

const MERCHANTS: Merchant[] = [
  { onboardingId: 'a318be831f10a913', legalName: 'Mahesh Kumar', status: 'In progress', accountManager: 'arjunpatelup', mafSubmissionDate: null, products: [] },
  { onboardingId: 'a318a562dc729be1', legalName: 'Arvind Sahu', status: 'In progress', accountManager: 'chaitali', mafSubmissionDate: null, products: ['Mca', 'Cards (domestic)'] },
  { onboardingId: 'a3189e0a1efa7637', legalName: 'Sahil', status: 'Under review', accountManager: 'arjunpatelup', mafSubmissionDate: '27/08/2026 11:00:17', products: ['Mca'] },
  { onboardingId: 'a318894424bf1693a', legalName: 'Vishal Dharmshi Maheshwari', status: 'In progress', accountManager: 'chaitali', mafSubmissionDate: null, products: ['Mca', 'Cards (international & domestic)'] },
  { onboardingId: 'a3186d9cacde184f', legalName: 'Sini Dalfi Rossario', status: 'Archived', accountManager: 'swatikolhe', mafSubmissionDate: '27/08/2026 10:33:05', products: ['Mca', 'Cards (international & domestic)'] },
  { onboardingId: 'a3184a729a767a06', legalName: 'Sufal Kumar Hembram', status: 'In progress', accountManager: 'tisha.shirsat', mafSubmissionDate: null, products: ['Mca'] },
]

const TABS = ['All', 'Ops Review', 'BD Pendency', 'Integration', 'Post-Onboarding', 'CKYC']

const STATUS_OPTIONS = [
  { value: 'In progress', label: 'In progress' },
  { value: 'Under review', label: 'Under review' },
  { value: 'Archived', label: 'Archived' },
]

function statusVariant(status: OnboardingStatus) {
  if (status === 'Under review') return 'default'
  if (status === 'Archived') return 'secondary'
  return 'outline'
}

function MerchantCard({ merchant }: { merchant: Merchant }) {
  return (
    <Card className="gap-0 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-[12.5px] font-semibold text-primary">{merchant.onboardingId}</p>
        <Badge variant={statusVariant(merchant.status)} size="sm" className="shrink-0">
          {merchant.status}
        </Badge>
      </div>
      <p className="mt-1 text-[14.5px] font-semibold leading-snug text-foreground">{merchant.legalName}</p>

      {merchant.products.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {merchant.products.map((p) => (
            <Badge key={p} variant="outline" size="sm">
              {p}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
        <DetailField label="Account Manager" value={merchant.accountManager} />
        <DetailField label="MAF Submission" value={merchant.mafSubmissionDate ?? '—'} />
      </div>
    </Card>
  )
}

export default function LegacyOnboardingScreen({ onNavigate }: { onNavigate: (target: ScreenId) => void }) {
  const [tab, setTab] = useState('All')
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return MERCHANTS.filter((m) => {
      if (q && !m.onboardingId.toLowerCase().includes(q) && !m.legalName.toLowerCase().includes(q)) return false
      if (statusFilter !== 'all' && m.status !== statusFilter) return false
      return true
    })
  }, [query, statusFilter])

  return (
    <ScreenChrome currentScreen="legacy" onNavigate={onNavigate}>
      <div className="shrink-0 border-b border-border bg-card px-5 pb-4 pt-2">
        <StatusBar variant="dark" />

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <IconButton aria-label="Back" variant="outline" size="md" rounded="lg" onClick={() => onNavigate('home')} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </IconButton>
            <h1 className="truncate text-[19px] font-bold text-foreground">Legacy</h1>
          </div>

          <button
            type="button"
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 text-[12.5px] font-semibold text-primary-foreground shadow-sm hover:bg-[var(--primary-hover)]"
          >
            <Plus className="h-3.5 w-3.5" />
            New Merchant
          </button>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mt-3">
          <TabsList className="w-full justify-start overflow-x-auto">
            {TABS.map((t) => (
              <TabsTrigger key={t} value={t} className="shrink-0">
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <SearchFilterRow
          value={query}
          onChange={setQuery}
          placeholder="Search by Onboarding ID or Legal Name"
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
            {filtered.map((merchant) => (
              <MerchantCard key={merchant.onboardingId} merchant={merchant} />
            ))}
          </div>
        ) : (
          <EmptyState title="No merchants found" description="Try a different onboarding ID or legal name." />
        )}
      </div>
    </ScreenChrome>
  )
}
