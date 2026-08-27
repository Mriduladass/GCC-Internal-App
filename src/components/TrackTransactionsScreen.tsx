import { useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, CircleDashed } from 'lucide-react'
import { Card, Checkbox, EmptyState, IconButton, Label } from '@payglocal_ui/flux-ui'
import StatusBar from './StatusBar'
import ScreenChrome from './ScreenChrome'
import { DetailField, FilterField, SearchFilterRow } from './listKit'
import type { ScreenId } from './navigation'

type TxnStatus = 'Inprogress' | 'Sent For Refund'

type Transaction = {
  merchantId: string
  gid: string
  status: TxnStatus
  currency: string
  amount: string
  transactionDate: string
  country: string
  lastPgService: string
}

const TRANSACTIONS: Transaction[] = [
  { merchantId: 'ebpgmyjio', gid: 'gl_o-a318beeb5cb97a8096b0m0oX2', status: 'Inprogress', currency: 'INR', amount: '19.6', transactionDate: '27/08/2026 11:11:11', country: 'US', lastPgService: 'Initiate' },
  { merchantId: 'ebpgmyjio', gid: 'gl_o-a318bee98d1f32a3ewgpc0oX2', status: 'Inprogress', currency: 'INR', amount: '19.6', transactionDate: '27/08/2026 11:11:11', country: 'FR', lastPgService: 'Initiate' },
  { merchantId: 'ptplflipkart', gid: 'gl_a318bee78bf03e4c', status: 'Sent For Refund', currency: 'INR', amount: '59', transactionDate: '27/08/2026 11:11:11', country: 'GB', lastPgService: '—' },
  { merchantId: 'ebpgmyjio', gid: 'gl_o-a318bee4a8203f91db8up0oX2', status: 'Inprogress', currency: 'INR', amount: '19.6', transactionDate: '27/08/2026 11:11:10', country: 'US', lastPgService: 'Initiate' },
  { merchantId: 'plswiggyinstama', gid: 'gl_o-a318bee18a4befd8f8fa0yPX2', status: 'Inprogress', currency: 'INR', amount: '268', transactionDate: '27/08/2026 11:11:10', country: 'IN', lastPgService: 'Initiate' },
  { merchantId: 'ptplflipkart', gid: 'gl_a318bedcea483b04', status: 'Sent For Refund', currency: 'INR', amount: '52', transactionDate: '27/08/2026 11:11:09', country: 'GB', lastPgService: '—' },
]

const STATUS_OPTIONS = [
  { value: 'Inprogress', label: 'Inprogress' },
  { value: 'Sent For Refund', label: 'Sent For Refund' },
]

const COUNTRY_OPTIONS = [
  { value: 'IN', label: 'India' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'FR', label: 'France' },
]

function TransactionCard({ txn }: { txn: Transaction }) {
  const isRefund = txn.status === 'Sent For Refund'
  return (
    <Card className="gap-0 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-[12.5px] font-semibold text-destructive">{txn.merchantId}</p>
        <span className={`flex shrink-0 items-center gap-1 text-[11.5px] font-semibold ${isRefund ? 'text-emerald-600' : 'text-amber-600'}`}>
          {isRefund ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleDashed className="h-3.5 w-3.5" />}
          {txn.status}
        </span>
      </div>
      <p className="mt-1 truncate text-[12px] font-medium text-primary">{txn.gid}</p>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
        <DetailField label="Amount" value={`${txn.currency} ${txn.amount}`} />
        <DetailField label="Country" value={txn.country} />
        <DetailField label="Transaction Date" value={txn.transactionDate} />
        <DetailField label="Last Pg Service" value={txn.lastPgService} />
      </div>
    </Card>
  )
}

export default function TrackTransactionsScreen({ onNavigate }: { onNavigate: (target: ScreenId) => void }) {
  const [cardsAltPays, setCardsAltPays] = useState(true)
  const [globalFundTransfer, setGlobalFundTransfer] = useState(false)
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TRANSACTIONS.filter((t) => {
      if (q && !t.merchantId.toLowerCase().includes(q) && !t.gid.toLowerCase().includes(q)) return false
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      if (countryFilter !== 'all' && t.country !== countryFilter) return false
      return true
    })
  }, [query, statusFilter, countryFilter])

  return (
    <ScreenChrome currentScreen="track-transactions" onNavigate={onNavigate}>
      <div className="shrink-0 border-b border-border bg-card px-5 pb-4 pt-2">
        <StatusBar variant="dark" />

        <div className="mt-2 flex min-w-0 items-center gap-2">
          <IconButton aria-label="Back" variant="outline" size="md" rounded="lg" onClick={() => onNavigate('home')} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </IconButton>
          <h1 className="truncate text-[19px] font-bold text-foreground">Transactions</h1>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2">
            <Checkbox checked={cardsAltPays} onCheckedChange={(v) => setCardsAltPays(v === true)} />
            <Label className="text-[12.5px] font-medium text-foreground">Cards/Alt-Pays</Label>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox checked={globalFundTransfer} onCheckedChange={(v) => setGlobalFundTransfer(v === true)} />
            <Label className="text-[12.5px] font-medium text-foreground">Global Fund Transfer</Label>
          </label>
        </div>

        <SearchFilterRow
          value={query}
          onChange={setQuery}
          placeholder="Search by Merchant ID or GID"
          onToggleFilters={() => setFiltersOpen((v) => !v)}
        />

        {filtersOpen && (
          <div className="mt-3 rounded-2xl border border-border bg-muted/40 p-3">
            <div className="flex flex-col gap-3">
              <FilterField
                label="Transaction Status"
                placeholder="Select transaction status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={STATUS_OPTIONS}
              />
              <FilterField label="Country" placeholder="Select country" value={countryFilter} onChange={setCountryFilter} options={COUNTRY_OPTIONS} />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filtered.map((txn) => (
              <TransactionCard key={txn.gid} txn={txn} />
            ))}
          </div>
        ) : (
          <EmptyState title="No transactions found" description="Try a different merchant ID or GID." />
        )}
      </div>
    </ScreenChrome>
  )
}
