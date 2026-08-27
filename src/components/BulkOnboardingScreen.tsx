import { useMemo, useState } from 'react'
import { ArrowLeft, Plus, Upload } from 'lucide-react'
import { Badge, Card, EmptyState, IconButton, Separator } from '@payglocal_ui/flux-ui'
import StatusBar from './StatusBar'
import ScreenChrome from './ScreenChrome'
import { DetailField, FilterField, SearchFilterRow } from './listKit'
import type { ScreenId } from './navigation'

type BatchStatus = 'Completed' | 'Not started'

type Batch = {
  id: string
  name: string
  partner: string
  status: BatchStatus
  totalMerchants: number | null
  successRows: number | null
  startTime: string | null
  endTime: string | null
  createdBy: string
}

const BATCHES: Batch[] = [
  { id: 'BTCH000119', name: 'Lot 54', partner: 'Airpay', status: 'Completed', totalMerchants: 37, successRows: 25, startTime: '26/08/2026 19:09:33', endTime: '26/08/2026 19:12:07', createdBy: 'surbhi.singh' },
  { id: 'BTCH000118', name: 'Batch 118', partner: 'Easebuzz', status: 'Completed', totalMerchants: 11, successRows: 8, startTime: '20/08/2026 07:42:43', endTime: '20/08/2026 07:44:02', createdBy: 'divyakalantri' },
  { id: 'BTCH000117', name: 'Cases', partner: 'Airpay', status: 'Completed', totalMerchants: 3, successRows: 3, startTime: '19/08/2026 14:05:59', endTime: '19/08/2026 14:07:05', createdBy: 'divyakalantri' },
  { id: 'BTCH000116', name: 'Remaining cases', partner: 'Airpay', status: 'Completed', totalMerchants: 23, successRows: 9, startTime: '18/08/2026 21:06:29', endTime: '18/08/2026 21:07:38', createdBy: 'divyakalantri' },
  { id: 'BTCH000115', name: 'Lot 49', partner: 'Airpay', status: 'Completed', totalMerchants: 16, successRows: 15, startTime: '18/08/2026 10:02:16', endTime: '18/08/2026 10:03:39', createdBy: 'divyakalantri' },
  { id: 'BTCH000112', name: 'Lot 118', partner: 'Airpay', status: 'Not started', totalMerchants: null, successRows: null, startTime: null, endTime: null, createdBy: 'divyakalantri' },
]

const STATUS_OPTIONS = [
  { value: 'Completed', label: 'Completed' },
  { value: 'Not started', label: 'Not started' },
]

function BatchCard({ batch }: { batch: Batch }) {
  const isCompleted = batch.status === 'Completed'
  return (
    <Card className="gap-0 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-[12.5px] font-semibold text-primary">{batch.id}</p>
        <Badge variant={isCompleted ? 'success' : 'secondary'} size="sm" className="shrink-0">
          {batch.status}
        </Badge>
      </div>
      <p className="mt-1 text-[14.5px] font-semibold leading-snug text-foreground">{batch.name}</p>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
        <DetailField label="Partner" value={batch.partner} />
        <DetailField label="Created By" value={batch.createdBy} />
        <DetailField label="Total Merchants" value={batch.totalMerchants ?? '—'} />
        <DetailField label="Success Rows" value={batch.successRows ?? '—'} />
      </div>

      {isCompleted && (
        <>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
            <DetailField label="Start Time" value={batch.startTime} />
            <DetailField label="End Time" value={batch.endTime} />
          </div>
        </>
      )}

      {!isCompleted && (
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-card py-2 text-[12.5px] font-medium text-foreground shadow-sm hover:bg-muted"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload file
        </button>
      )}
    </Card>
  )
}

export default function BulkOnboardingScreen({ onNavigate }: { onNavigate: (target: ScreenId) => void }) {
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return BATCHES.filter((b) => {
      if (q && !b.id.toLowerCase().includes(q) && !b.name.toLowerCase().includes(q)) return false
      if (statusFilter !== 'all' && b.status !== statusFilter) return false
      return true
    })
  }, [query, statusFilter])

  return (
    <ScreenChrome currentScreen="bulk-onboarding" onNavigate={onNavigate}>
      <div className="shrink-0 border-b border-border bg-card px-5 pb-4 pt-2">
        <StatusBar variant="dark" />

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <IconButton aria-label="Back" variant="outline" size="md" rounded="lg" onClick={() => onNavigate('home')} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </IconButton>
            <h1 className="truncate text-[19px] font-bold text-foreground">Bulk Onboarding</h1>
          </div>

          <button
            type="button"
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 text-[12.5px] font-semibold text-primary-foreground shadow-sm hover:bg-[var(--primary-hover)]"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Batch
          </button>
        </div>

        <SearchFilterRow
          value={query}
          onChange={setQuery}
          placeholder="Search by Batch ID or Name"
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
            {filtered.map((batch) => (
              <BatchCard key={batch.id} batch={batch} />
            ))}
          </div>
        ) : (
          <EmptyState title="No batches found" description="Try a different batch ID or name." />
        )}
      </div>
    </ScreenChrome>
  )
}
