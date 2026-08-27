import { useMemo, useState, type ComponentType } from 'react'
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  ChevronDown,
  ConciergeBell,
  Download,
  Filter,
  Plane,
  Plus,
  ShieldCheck,
  Shirt,
  Store,
  TrendingUp,
  User,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyState,
  IconButton,
  Separator,
} from '@payglocal_ui/flux-ui'
import StatusBar from './StatusBar'
import ScreenChrome from './ScreenChrome'
import MerchantAdminDrawer from './MerchantAdminDrawer'
import { FLOATING_CONTENT_CLASS, FLOATING_ITEM_CLASS, FilterField, SearchFilterRow } from './listKit'
import type { ScreenId } from './navigation'

type MerchantStatus = 'Active' | 'Inactive' | 'Pending Approval'
type BlockStatus = 'Not Blocked' | 'Blocked'

type Merchant = {
  id: string
  name: string
  midType: 'TRANSACTING' | 'PORTFOLIO'
  shortname: string
  accountManager: string
  registeredOn: string
  balance: string
  merchantStatus: MerchantStatus
  settlementStatus: BlockStatus
  refundStatus: BlockStatus
  icon: ComponentType<{ className?: string }>
}

const MERCHANTS: Merchant[] = [
  {
    id: 'pgbluepetal',
    name: 'Bluepetal Retail Private Limited',
    midType: 'TRANSACTING',
    shortname: 'Bluepetal Retail',
    accountManager: 'arjunmehta',
    registeredOn: '12/03/2025 10:22:41',
    balance: '0',
    merchantStatus: 'Inactive',
    settlementStatus: 'Blocked',
    refundStatus: 'Not Blocked',
    icon: Store,
  },
  {
    id: 'pgnorthwind',
    name: 'Northwind Traders LLP',
    midType: 'TRANSACTING',
    shortname: 'Northwind Traders',
    accountManager: 'priyadesai',
    registeredOn: '04/02/2025 16:45:02',
    balance: '12,480',
    merchantStatus: 'Active',
    settlementStatus: 'Not Blocked',
    refundStatus: 'Not Blocked',
    icon: Building2,
  },
  {
    id: 'solsticehosp',
    name: 'Solstice Hospitality Private Limited',
    midType: 'PORTFOLIO',
    shortname: 'Solstice Hospitality',
    accountManager: 'rahulverma',
    registeredOn: '28/05/2026 09:14:37',
    balance: '0',
    merchantStatus: 'Active',
    settlementStatus: 'Not Blocked',
    refundStatus: 'Not Blocked',
    icon: ConciergeBell,
  },
  {
    id: 'cedarwoodtex',
    name: 'Cedarwood Textiles Pvt Ltd',
    midType: 'PORTFOLIO',
    shortname: 'Cedarwood Textiles',
    accountManager: '',
    registeredOn: '19/06/2026 13:02:11',
    balance: '0',
    merchantStatus: 'Pending Approval',
    settlementStatus: 'Not Blocked',
    refundStatus: 'Not Blocked',
    icon: Shirt,
  },
  {
    id: 'vortexcommerce',
    name: 'Vortex Commerce Private Limited',
    midType: 'PORTFOLIO',
    shortname: 'Vortex Commerce',
    accountManager: 'swatikolhe',
    registeredOn: '02/07/2026 08:51:29',
    balance: '3,150',
    merchantStatus: 'Active',
    settlementStatus: 'Not Blocked',
    refundStatus: 'Not Blocked',
    icon: TrendingUp,
  },
  {
    id: 'amberlinefoods',
    name: 'Amberline Foods LLP',
    midType: 'TRANSACTING',
    shortname: 'Amberline Foods',
    accountManager: 'kunalsomaiya',
    registeredOn: '30/04/2025 11:37:55',
    balance: '0',
    merchantStatus: 'Inactive',
    settlementStatus: 'Blocked',
    refundStatus: 'Not Blocked',
    icon: UtensilsCrossed,
  },
  {
    id: 'kiteandcompass',
    name: 'Kite & Compass Travel Private Limited',
    midType: 'PORTFOLIO',
    shortname: 'Kite & Compass Travel',
    accountManager: 'anmoljain',
    registeredOn: '',
    balance: '0',
    merchantStatus: 'Pending Approval',
    settlementStatus: 'Not Blocked',
    refundStatus: 'Not Blocked',
    icon: Plane,
  },
  {
    id: 'lumenapparel',
    name: 'Lumen Apparel Private Limited',
    midType: 'PORTFOLIO',
    shortname: 'Lumen Apparel',
    accountManager: 'navnathgunjal',
    registeredOn: '15/07/2026 17:26:08',
    balance: '860',
    merchantStatus: 'Active',
    settlementStatus: 'Not Blocked',
    refundStatus: 'Not Blocked',
    icon: Shirt,
  },
]

function StatusBadge({ label, value, positive }: { label: string; value: string; positive: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <Badge variant={positive ? 'success' : value === 'Pending Approval' ? 'warning' : 'error'} size="sm">
        {value}
      </Badge>
    </div>
  )
}

function HexIcon({ icon: Icon }: { icon: ComponentType<{ className?: string }> }) {
  return (
    <div
      className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary/10 text-primary"
      style={{ clipPath: 'polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0% 50%)' }}
    >
      <Icon className="h-5 w-5" />
    </div>
  )
}

function MerchantCard({ merchant }: { merchant: Merchant }) {
  return (
    <Card className="gap-0 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start gap-3.5">
        <HexIcon icon={merchant.icon} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-[12.5px] font-semibold text-primary">{merchant.id}</p>
            <Badge variant="default" size="sm" className="shrink-0">
              {merchant.midType}
            </Badge>
          </div>
          <p className="mt-1 text-[14.5px] font-semibold leading-snug text-foreground">{merchant.name}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
        <div>
          <p className="text-muted-foreground">Shortname</p>
          <p className="mt-1 truncate font-medium text-foreground">{merchant.shortname}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Account Manager</p>
          {merchant.accountManager ? (
            <p className="mt-1 flex items-center gap-1 truncate font-medium text-foreground">
              <User className="h-3 w-3 shrink-0 text-primary" />
              {merchant.accountManager}
            </p>
          ) : (
            <p className="mt-1 truncate font-medium text-foreground">—</p>
          )}
        </div>
        <div>
          <p className="text-muted-foreground">Registered</p>
          <p className="mt-1 truncate font-medium text-foreground">
            {merchant.registeredOn ? merchant.registeredOn.replace(' ', ', ') : '—'}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Settlement Balance</p>
          <p className="mt-1 truncate font-medium text-foreground">₹{merchant.balance}</p>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-3.5">
          <StatusBadge label="Merchant" value={merchant.merchantStatus} positive={merchant.merchantStatus === 'Active'} />
          <Separator orientation="vertical" className="h-4" />
          <StatusBadge label="Settlement" value={merchant.settlementStatus} positive={merchant.settlementStatus === 'Not Blocked'} />
        </div>
        <StatusBadge label="Refund" value={merchant.refundStatus} positive={merchant.refundStatus === 'Not Blocked'} />
      </div>
    </Card>
  )
}

const MID_TYPE_OPTIONS = [
  { value: 'TRANSACTING', label: 'Transacting' },
  { value: 'PORTFOLIO', label: 'Portfolio' },
]

const MERCHANT_STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Pending Approval', label: 'Pending Approval' },
]

const DATE_OPTIONS = ['Today', 'Yesterday', 'This week', 'This month', '25 May, 2025']

export default function ManageMerchantsScreen({ onNavigate }: { onNavigate: (target: ScreenId) => void }) {
  const [query, setQuery] = useState('')
  const [dateLabel, setDateLabel] = useState('25 May, 2025')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false)
  const [midTypeFilter, setMidTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [managerFilter, setManagerFilter] = useState('all')

  const accountManagerOptions = useMemo(
    () =>
      Array.from(new Set(MERCHANTS.map((m) => m.accountManager).filter(Boolean))).map((name) => ({
        value: name,
        label: name,
      })),
    [],
  )

  const activeFilterCount = [midTypeFilter, statusFilter, managerFilter].filter((v) => v !== 'all').length

  const clearFilters = () => {
    setMidTypeFilter('all')
    setStatusFilter('all')
    setManagerFilter('all')
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = MERCHANTS.filter((m) => {
      if (q && !m.id.toLowerCase().includes(q) && !m.shortname.toLowerCase().includes(q)) return false
      if (midTypeFilter !== 'all' && m.midType !== midTypeFilter) return false
      if (statusFilter !== 'all' && m.merchantStatus !== statusFilter) return false
      if (managerFilter !== 'all' && m.accountManager !== managerFilter) return false
      return true
    })
    return rows
  }, [query, midTypeFilter, statusFilter, managerFilter])

  return (
    <ScreenChrome currentScreen="merchants" onNavigate={onNavigate}>
      <div className="shrink-0 border-b border-border bg-card px-5 pb-4 pt-2">
        <StatusBar variant="dark" />

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <IconButton
              aria-label="Back"
              variant="outline"
              size="md"
              rounded="lg"
              onClick={() => onNavigate('home')}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </IconButton>
            <h1 className="truncate text-[19px] font-bold text-foreground">Manage Merchants</h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-[12.5px] font-medium text-foreground shadow-sm hover:bg-muted"
              >
                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                {dateLabel}
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={FLOATING_CONTENT_CLASS}>
              {DATE_OPTIONS.map((d) => (
                <DropdownMenuItem key={d} onSelect={() => setDateLabel(d)} className={FLOATING_ITEM_CLASS}>
                  {d}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <SearchFilterRow
          value={query}
          onChange={setQuery}
          placeholder="Search by Merchant ID or Shortname"
          onToggleFilters={() => setFiltersOpen((v) => !v)}
        />

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Button
            variant={filtersOpen ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFiltersOpen((v) => !v)}
            leftIcon={<Filter className="h-3.5 w-3.5" />}
            className="relative px-2 text-[11.5px]"
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
                className="px-2 text-[11.5px]"
              >
                Add merchant
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={FLOATING_CONTENT_CLASS}>
              <DropdownMenuItem className={FLOATING_ITEM_CLASS} onSelect={() => setAdminDrawerOpen(true)}>
                Merchant Admin
              </DropdownMenuItem>
              <DropdownMenuItem className={FLOATING_ITEM_CLASS}>Merchant Profile</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download className="h-3.5 w-3.5" />}
            className="px-2 text-[11.5px]"
          >
            Report
          </Button>
        </div>

        {filtersOpen && (
          <div className="mt-3 rounded-2xl border border-border bg-muted/40 p-3">
            <div className="flex flex-col gap-3">
              <FilterField
                label="MidTypes"
                placeholder="Select MidTypes"
                value={midTypeFilter}
                onChange={setMidTypeFilter}
                options={MID_TYPE_OPTIONS}
              />
              <FilterField
                label="Merchant Status"
                placeholder="Select merchant status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={MERCHANT_STATUS_OPTIONS}
              />
              <FilterField
                label="Account Manager"
                placeholder="Select Account Manager"
                value={managerFilter}
                onChange={setManagerFilter}
                options={accountManagerOptions}
              />
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 flex items-center gap-1 text-[12px] font-medium text-primary"
              >
                <X className="h-3 w-3" />
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filtered.map((merchant) => (
              <MerchantCard key={merchant.id} merchant={merchant} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ShieldCheck}
            title="No merchants found"
            description="Try a different merchant ID or shortname."
          />
        )}
      </div>

      <MerchantAdminDrawer open={adminDrawerOpen} onClose={() => setAdminDrawerOpen(false)} />
    </ScreenChrome>
  )
}
