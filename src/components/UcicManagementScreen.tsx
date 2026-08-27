import { useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Badge, Card, EmptyState, IconButton, Tabs, TabsList, TabsTrigger } from '@payglocal_ui/flux-ui'
import StatusBar from './StatusBar'
import ScreenChrome from './ScreenChrome'
import { DetailField, FilterField, SearchFilterRow } from './listKit'
import type { ScreenId } from './navigation'

type RiskCategory = 'Low' | 'Medium'

type UcicRecord = {
  ucicId: string
  legalName: string
  status: 'Active'
  onboardingId: string
  accountManager: string
  aggregators: string[]
  riskCategory: RiskCategory
  creationDate: string
}

const RECORDS: UcicRecord[] = [
  { ucicId: 'mohammed378997', legalName: 'Mohammed Waiz Ismail', status: 'Active', onboardingId: 'a27d254a9d467f62', accountManager: 'arjunpatelup', aggregators: ['Scalifi', 'Payglocal'], riskCategory: 'Low', creationDate: '27/08/2026 11:08:23' },
  { ucicId: 'amandeep149259', legalName: 'Amandeep Singh', status: 'Active', onboardingId: 'a309682f4eded93e', accountManager: 'bhaumik081089', aggregators: ['Payglocal'], riskCategory: 'Low', creationDate: '27/08/2026 10:52:56' },
  { ucicId: 'praveshb871696', legalName: 'Pravesh Bharadwaj', status: 'Active', onboardingId: 'a3118b3c5d0da744', accountManager: 'bhaveshnirmal', aggregators: ['Payglocal'], riskCategory: 'Low', creationDate: '27/08/2026 10:40:29' },
  { ucicId: 'kimijewe756352', legalName: 'Kimi Jewels LLP', status: 'Active', onboardingId: 'a2f0933f7b315cb8', accountManager: 'kaushikbhayani', aggregators: ['Payglocal'], riskCategory: 'Low', creationDate: '27/08/2026 10:05:58' },
  { ucicId: 'omdinesh953992', legalName: 'Om Dineshbhai Patel', status: 'Active', onboardingId: '9f562bd9ec4b7fc1', accountManager: 'arjunpatelup', aggregators: ['Scalifi', 'Payglocal'], riskCategory: 'Medium', creationDate: '26/08/2026 20:04:59' },
  { ucicId: 'krishnak374368', legalName: 'Krishnakala Private Limited', status: 'Active', onboardingId: 'a313408f5ad0ffa7', accountManager: 'kunalsomaiya', aggregators: ['Airpay', 'Payglocal'], riskCategory: 'Low', creationDate: '26/08/2026 19:15:30' },
]

const RISK_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
]

function UcicCard({ record }: { record: UcicRecord }) {
  return (
    <Card className="gap-0 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-[12.5px] font-semibold text-primary">{record.ucicId}</p>
        <Badge variant="success" size="sm" className="shrink-0">
          {record.status}
        </Badge>
      </div>
      <p className="mt-1 text-[14.5px] font-semibold leading-snug text-foreground">{record.legalName}</p>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {record.aggregators.map((a) => (
          <Badge key={a} variant="outline" size="sm">
            {a}
          </Badge>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
        <DetailField label="Account Manager" value={record.accountManager} />
        <DetailField label="Risk Category" value={<Badge variant={record.riskCategory === 'Low' ? 'success' : 'warning'} size="sm">{record.riskCategory}</Badge>} />
        <DetailField label="Onboarding ID" value={record.onboardingId} />
        <DetailField label="Creation Date" value={record.creationDate} />
      </div>
    </Card>
  )
}

export default function UcicManagementScreen({ onNavigate }: { onNavigate: (target: ScreenId) => void }) {
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [riskFilter, setRiskFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return RECORDS.filter((r) => {
      if (q && !r.ucicId.toLowerCase().includes(q) && !r.legalName.toLowerCase().includes(q)) return false
      if (riskFilter !== 'all' && r.riskCategory !== riskFilter) return false
      return true
    })
  }, [query, riskFilter])

  return (
    <ScreenChrome currentScreen="ucic-management" onNavigate={onNavigate}>
      <div className="shrink-0 border-b border-border bg-card px-5 pb-4 pt-2">
        <StatusBar variant="dark" />

        <div className="mt-2 flex min-w-0 items-center gap-2">
          <IconButton aria-label="Back" variant="outline" size="md" rounded="lg" onClick={() => onNavigate('home')} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </IconButton>
          <h1 className="truncate text-[17px] font-bold text-foreground">UCIC Management</h1>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mt-3">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="termination" className="flex-1">
              Termination
            </TabsTrigger>
            <TabsTrigger value="dormancy" className="flex-1">
              Dormancy
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <SearchFilterRow
          value={query}
          onChange={setQuery}
          placeholder="Search by UCIC ID or Legal Name"
          onToggleFilters={() => setFiltersOpen((v) => !v)}
        />

        {filtersOpen && (
          <div className="mt-3 rounded-2xl border border-border bg-muted/40 p-3">
            <FilterField label="Risk Category" placeholder="Select risk category" value={riskFilter} onChange={setRiskFilter} options={RISK_OPTIONS} />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filtered.map((record) => (
              <UcicCard key={record.ucicId} record={record} />
            ))}
          </div>
        ) : (
          <EmptyState title="No records found" description="Try a different UCIC ID or legal name." />
        )}
      </div>
    </ScreenChrome>
  )
}
