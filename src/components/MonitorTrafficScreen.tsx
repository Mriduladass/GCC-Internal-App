import { useMemo, useState } from 'react'
import { ArrowLeft, Download, Radio } from 'lucide-react'
import { Badge, Button, Card, EmptyState, IconButton, Separator } from '@payglocal_ui/flux-ui'
import StatusBar from './StatusBar'
import ScreenChrome from './ScreenChrome'
import { DetailField, FilterField, SearchFilterRow } from './listKit'
import type { ScreenId } from './navigation'

type TrafficLog = {
  id: string
  statusCode: number
  statusText: string
  method: string
  url: string
  mid: string
  txnGid: string
  timestamp: string
  ipAddress: string
  country: string
}

const LOGS: TrafficLog[] = [
  { id: '1', statusCode: 200, statusText: 'OK', method: 'GET', url: '/gl/v1/ind/gl_a318b673.../status', mid: 'ptplamantravels', txnGid: 'gl_a318b673af59ff9d193z0Y3TX2', timestamp: '27/08/2026 11:10:37', ipAddress: '2401:4900:1cd6:2634', country: 'IN' },
  { id: '2', statusCode: 200, statusText: 'OK', method: 'POST', url: '/gl/v1/payments/initiate', mid: 'plswiggyinstama', txnGid: 'gl_a318be155f3846ec', timestamp: '27/08/2026 11:10:37', ipAddress: '13.126.232.13', country: 'IN' },
  { id: '3', statusCode: 401, statusText: 'Unauthorized', method: 'GET', url: '/gl/v1/payments/moz3M.../status', mid: 'plswiggymoney', txnGid: 'gl_a318be14cd1a3bda', timestamp: '27/08/2026 11:10:37', ipAddress: '35.154.93.248', country: 'IN' },
  { id: '4', statusCode: 200, statusText: 'OK', method: 'POST', url: '/gl/v2/ind/gl_a318bd9b.../returnUrl', mid: 'plswiggy', txnGid: 'gl_a318bd9b4c9e11ee2dbd150L5X2', timestamp: '27/08/2026 11:10:37', ipAddress: '65.2.117.44', country: 'IN' },
  { id: '5', statusCode: 200, statusText: 'OK', method: 'GET', url: '/gl/v1/payments/payflow/data/dccCurrencies', mid: 'plswiggy', txnGid: 'gl_a318be0d5e81445438r70ONX2', timestamp: '27/08/2026 11:10:37', ipAddress: '124.123.152.114', country: 'IN' },
  { id: '6', statusCode: 200, statusText: 'OK', method: 'POST', url: '/gl/v1/payments/initiate/paycollect', mid: 'pg_balic', txnGid: 'gl_a318be13383574f4', timestamp: '27/08/2026 11:10:37', ipAddress: '155.190.5.33', country: 'IN' },
]

const METHOD_OPTIONS = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
]

const COUNTRY_OPTIONS = [{ value: 'IN', label: 'India' }]

function LogCard({ log }: { log: TrafficLog }) {
  const isOk = log.statusCode === 200
  return (
    <Card className="gap-0 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <Badge variant={isOk ? 'success' : 'error'} size="sm">
          {log.statusCode} : {log.statusText}
        </Badge>
        <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10.5px] font-semibold text-muted-foreground">{log.method}</span>
      </div>
      <p className="mt-2 truncate text-[12.5px] font-medium text-foreground">{log.url}</p>

      <Separator className="my-4" />

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
        <DetailField label="MID" value={log.mid} />
        <DetailField label="Country" value={log.country} />
        <DetailField label="Txn GID" value={log.txnGid} />
        <DetailField label="IP Address" value={log.ipAddress} />
        <DetailField label="Timestamp" value={log.timestamp} />
      </div>
    </Card>
  )
}

export default function MonitorTrafficScreen({ onNavigate }: { onNavigate: (target: ScreenId) => void }) {
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [methodFilter, setMethodFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LOGS.filter((l) => {
      if (q && !l.mid.toLowerCase().includes(q) && !l.url.toLowerCase().includes(q)) return false
      if (methodFilter !== 'all' && l.method !== methodFilter) return false
      if (countryFilter !== 'all' && l.country !== countryFilter) return false
      return true
    })
  }, [query, methodFilter, countryFilter])

  return (
    <ScreenChrome currentScreen="monitor-traffic" onNavigate={onNavigate}>
      <div className="shrink-0 border-b border-border bg-card px-5 pb-4 pt-2">
        <StatusBar variant="dark" />

        <div className="mt-2 flex min-w-0 items-center gap-2">
          <IconButton aria-label="Back" variant="outline" size="md" rounded="lg" onClick={() => onNavigate('home')} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </IconButton>
          <h1 className="truncate text-[19px] font-bold text-foreground">Monitor Traffic</h1>
        </div>

        <SearchFilterRow
          value={query}
          onChange={setQuery}
          placeholder="Search by MID or URL"
          onToggleFilters={() => setFiltersOpen((v) => !v)}
        />

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" leftIcon={<Radio className="h-3.5 w-3.5" />} className="px-2 text-[11.5px]">
            Go Live
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />} className="px-2 text-[11.5px]">
            Report
          </Button>
        </div>

        {filtersOpen && (
          <div className="mt-3 rounded-2xl border border-border bg-muted/40 p-3">
            <div className="flex flex-col gap-3">
              <FilterField
                label="Request Method"
                placeholder="Select request method"
                value={methodFilter}
                onChange={setMethodFilter}
                options={METHOD_OPTIONS}
              />
              <FilterField label="Country" placeholder="Select country" value={countryFilter} onChange={setCountryFilter} options={COUNTRY_OPTIONS} />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filtered.map((log) => (
              <LogCard key={log.id} log={log} />
            ))}
          </div>
        ) : (
          <EmptyState title="No traffic found" description="Try a different MID or URL." />
        )}
      </div>
    </ScreenChrome>
  )
}
