import { useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Badge, Card, Checkbox, EmptyState, IconButton, Label } from '@payglocal_ui/flux-ui'
import StatusBar from './StatusBar'
import ScreenChrome from './ScreenChrome'
import { DetailField, FilterField, SearchFilterRow } from './listKit'
import type { ScreenId } from './navigation'

type Transaction = {
  merchantId: string
  gid: string
  status: string
  internalStatus: string
  processor: string
  currency: string
  amount: string
  transactionDate: string
  country: string
  remitterName: string
}

const TRANSACTIONS: Transaction[] = [
  { merchantId: 'ptplgilpintmipl', gid: 'glmb9595445daba…', status: 'Sent For Review', internalStatus: 'Compliance In Progress', processor: 'Banking Circle', currency: 'AUD', amount: '2068.0', transactionDate: '27/08/2026 08:57:39', country: 'AU', remitterName: 'Jatinder Ghotra' },
  { merchantId: 'ptplshikart12', gid: 'glm01d1977623b3…', status: 'Sent For Review', internalStatus: 'Compliance In Progress', processor: 'Banking Circle', currency: 'GBP', amount: '120.0', transactionDate: '27/08/2026 00:23:38', country: 'GB', remitterName: 'A Farizan' },
  { merchantId: 'pgintershani', gid: 'glm2ab7d9cf0ab87…', status: 'Sent For Review', internalStatus: 'Compliance In Progress', processor: 'Currency Cloud', currency: 'USD', amount: '364.00', transactionDate: '26/08/2026 21:36:21', country: 'US', remitterName: 'Shani Kripa LLC' },
  { merchantId: 'ptpldeepaksh8', gid: 'glm6b99c3f614ce…', status: 'Sent For Review', internalStatus: 'Compliance In Progress', processor: 'Banking Circle', currency: 'GBP', amount: '31.35', transactionDate: '26/08/2026 20:28:42', country: 'GB', remitterName: 'L Loveday' },
  { merchantId: 'ptplencircle31', gid: 'glmc23d025aa1e9…', status: 'Sent For Review', internalStatus: 'Compliance In Progress', processor: 'Banking Circle', currency: 'GBP', amount: '200.0', transactionDate: '26/08/2026 19:55:33', country: 'GB', remitterName: 'Fettle' },
  { merchantId: 'ptplnovotion', gid: 'glmf8ea5bc63530…', status: 'Sent For Review', internalStatus: 'Compliance In Progress', processor: 'Banking Circle', currency: 'GBP', amount: '200.0', transactionDate: '26/08/2026 19:18:11', country: 'GB', remitterName: 'Mooncare Limited' },
]

const STATUS_OPTIONS = [{ value: 'Sent For Review', label: 'Sent For Review' }]
const INTERNAL_STATUS_OPTIONS = [{ value: 'Compliance In Progress', label: 'Compliance In Progress' }]

function TransactionCard({ txn }: { txn: Transaction }) {
  return (
    <Card className="gap-0 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-[12.5px] font-semibold text-destructive">{txn.merchantId}</p>
        <Badge variant="warning" size="sm" className="shrink-0">
          {txn.status}
        </Badge>
      </div>
      <p className="mt-1 truncate text-[12px] font-medium text-primary">{txn.gid}</p>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
        <DetailField label="Internal Status" value={txn.internalStatus} />
        <DetailField label="Processor" value={txn.processor} />
        <DetailField label="Amount" value={`${txn.currency} ${txn.amount}`} />
        <DetailField label="Country" value={txn.country} />
        <DetailField label="Transaction Date" value={txn.transactionDate} />
        <DetailField label="Remitter Name" value={txn.remitterName} />
      </div>
    </Card>
  )
}

export default function McaComplianceScreen({ onNavigate }: { onNavigate: (target: ScreenId) => void }) {
  const [invoicedOnly, setInvoicedOnly] = useState(true)
  const [invoiceWithoutTxn, setInvoiceWithoutTxn] = useState(false)
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [internalStatusFilter, setInternalStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TRANSACTIONS.filter((t) => {
      if (q && !t.merchantId.toLowerCase().includes(q) && !t.gid.toLowerCase().includes(q)) return false
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      if (internalStatusFilter !== 'all' && t.internalStatus !== internalStatusFilter) return false
      return true
    })
  }, [query, statusFilter, internalStatusFilter])

  return (
    <ScreenChrome currentScreen="mca-compliance" onNavigate={onNavigate}>
      <div className="shrink-0 border-b border-border bg-card px-5 pb-4 pt-2">
        <StatusBar variant="dark" />

        <div className="mt-2 flex min-w-0 items-center gap-2">
          <IconButton aria-label="Back" variant="outline" size="md" rounded="lg" onClick={() => onNavigate('home')} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </IconButton>
          <h1 className="truncate text-[19px] font-bold text-foreground">MCA Compliance</h1>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2">
            <Checkbox checked={invoicedOnly} onCheckedChange={(v) => setInvoicedOnly(v === true)} />
            <Label className="text-[12.5px] font-medium text-foreground">Invoiced Transaction</Label>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox checked={invoiceWithoutTxn} onCheckedChange={(v) => setInvoiceWithoutTxn(v === true)} />
            <Label className="text-[12.5px] font-medium text-foreground">Invoice Without Transaction</Label>
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
              <FilterField
                label="Internal Status"
                placeholder="Select internal status"
                value={internalStatusFilter}
                onChange={setInternalStatusFilter}
                options={INTERNAL_STATUS_OPTIONS}
              />
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
