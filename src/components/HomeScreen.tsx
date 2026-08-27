import { useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Bell, User } from 'lucide-react'
import { Avatar, AvatarFallback, Card, DashboardAreaChartTemplate, RankedBarListTemplate } from '@payglocal_ui/flux-ui'
import StatusBar from './StatusBar'
import ScreenChrome from './ScreenChrome'
import type { ScreenId } from './navigation'

const CHART_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

function formatCrore(v: number) {
  if (v >= 1e7) return `${(v / 1e7).toFixed(1)}C`
  if (v >= 1e5) return `${(v / 1e5).toFixed(1)}L`
  if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`
  return `${v}`
}

function Delta({ direction, label }: { direction: 'up' | 'down'; label: string }) {
  const Icon = direction === 'up' ? ArrowUpRight : ArrowDownRight
  const cls = direction === 'up' ? 'text-emerald-600' : 'text-red-600'
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}

type StatCard = {
  label: string
  primaryValue: string
  primaryCaption: string
  primaryDelta: { direction: 'up' | 'down'; label: string }
  secondaryValue: string
  secondaryCaption: string
  secondaryDelta: { direction: 'up' | 'down'; label: string }
}

function StatSummaryCard({ label, primaryValue, primaryCaption, primaryDelta, secondaryValue, secondaryCaption, secondaryDelta }: StatCard) {
  return (
    <Card className="w-full shrink-0 snap-start gap-0 rounded-2xl p-5 shadow-sm">
      <p className="text-[13px] font-medium text-muted-foreground">{label}</p>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold leading-none text-foreground">{primaryValue}</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Delta direction={primaryDelta.direction} label={primaryDelta.label} />
            <span className="text-[11px] text-muted-foreground">{primaryCaption}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-semibold leading-none text-foreground">{secondaryValue}</p>
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <Delta direction={secondaryDelta.direction} label={secondaryDelta.label} />
            <span className="text-[11px] text-muted-foreground">{secondaryCaption}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

function StatCarousel({ cards }: { cards: StatCard[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const handleScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    setActive(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <div>
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <StatSummaryCard key={card.label} {...card} />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {cards.map((card, i) => (
          <span
            key={card.label}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              active === i ? 'w-4 bg-primary' : 'w-1.5 bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

type DonutSegment = { label: string; value: number; color: string }

function DonutBreakdown({ title, segments }: { title: string; segments: DonutSegment[] }) {
  const size = 140
  const stroke = 22
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  let cumulative = 0

  return (
    <Card className="gap-0 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">Volume</span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <svg width={size} height={size} className="-rotate-90 shrink-0">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--muted)" strokeWidth={stroke} fill="none" />
          {segments.map((s, i) => {
            const frac = s.value / 100
            const dash = frac * c
            const offset = -cumulative * c
            cumulative += frac
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={s.color}
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={offset}
              />
            )
          })}
        </svg>

        <ul className="min-w-0 flex-1 space-y-1.5">
          {segments.map((s, i) => (
            <li key={i} className="flex items-center gap-1.5 text-[11px]">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
              <span className="truncate text-muted-foreground">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

const paymentIntegration: DonutSegment[] = [
  { label: 'API', value: 87, color: CHART_COLORS[3] },
  { label: 'PAYMENT_LINK', value: 5, color: CHART_COLORS[4] },
  { label: 'CAPTURE_FULL', value: 3, color: '#d4ab3a' },
  { label: 'REFUND_PARTIAL', value: 2, color: CHART_COLORS[0] },
  { label: 'SI_SALE', value: 1.5, color: '#c2b280' },
  { label: 'REFUND_FULL', value: 0.6, color: '#7fd1c1' },
  { label: 'PAYMENT_BUTTON', value: 0.5, color: CHART_COLORS[2] },
  { label: 'AUTH_REVERSAL', value: 0.4, color: '#6fae4e' },
]

const paymentInstruments: DonutSegment[] = [
  { label: 'CREDIT', value: 55, color: '#ec6fa8' },
  { label: 'Standing Instruction DEBIT Card', value: 24, color: '#7ea8f0' },
  { label: 'Payment-Account: Google-Pay PREPAID Card', value: 10, color: CHART_COLORS[1] },
  { label: 'Payment-Account: Apple-Pay CREDIT Card', value: 3.5, color: '#5b6fd6' },
  { label: 'Standing Instruction PREPAID Card', value: 3, color: '#c58bef' },
  { label: 'Payment-Account: Google-Pay CREDIT Card', value: 2.5, color: '#f0937a' },
  { label: 'AltId DEBIT Card', value: 1.5, color: '#f0cf8a' },
]

const transactionStatus = [
  { id: 'sent-for-capture', label: 'Sent For Capture', value: 11.3 },
  { id: 'abandoned', label: 'Abandoned', value: 8.6 },
  { id: 'inprogress', label: 'Inprogress', value: 2.0 },
  { id: 'issuer-decline', label: 'Issuer Decline', value: 1.9 },
  { id: 'authorized', label: 'Authorized', value: 1.5 },
  { id: 'customer-cancelled', label: 'Customer Cancelled', value: 1.0 },
  { id: 'authentication-timeout', label: 'Authentication Timeout', value: 0.3 },
  { id: 'sent-for-refund', label: 'Sent For Refund', value: 0.3 },
  { id: 'success', label: 'Success', value: 0.2 },
  { id: 'general-decline', label: 'General Decline', value: 0.2 },
  { id: 'rule-config-error', label: 'Rule Config Error', value: 0.05 },
  { id: 'system-error', label: 'System Error', value: 0.05 },
  { id: 'request-error', label: 'Request Error', value: 0.05 },
  { id: 'reversed', label: 'Reversed', value: 0.05 },
  { id: 'refund-started', label: 'Refund Started', value: 0 },
]
const maxStatus = Math.max(...transactionStatus.map((s) => s.value))

const topMerchants = [
  { id: 'plmakemytrip', label: 'plmakemytrip', value: 2.6 },
  { id: 'plairindia', label: 'plairindia', value: 2.5 },
  { id: 'ptplchangebydes', label: 'ptplchangebydes', value: 2.0 },
]
const maxMerchant = Math.max(...topMerchants.map((m) => m.value))

const statCards: StatCard[] = [
  {
    label: 'Total Volume',
    primaryValue: '₹17.26C',
    primaryCaption: 'Processed',
    primaryDelta: { direction: 'up', label: '18%' },
    secondaryValue: '₹12.92C',
    secondaryCaption: 'Approved',
    secondaryDelta: { direction: 'up', label: '22%' },
  },
  {
    label: 'Payment Success Ratio',
    primaryValue: '77%',
    primaryCaption: 'Total Count',
    primaryDelta: { direction: 'down', label: '2%' },
    secondaryValue: '74.81%',
    secondaryCaption: 'Total Volume',
    secondaryDelta: { direction: 'down', label: '3%' },
  },
  {
    label: 'Total Transactions',
    primaryValue: '41.20K',
    primaryCaption: 'Processed',
    primaryDelta: { direction: 'up', label: '0%' },
    secondaryValue: '32.05K',
    secondaryCaption: 'Approved',
    secondaryDelta: { direction: 'down', label: '2%' },
  },
  {
    label: 'Successful Refunds',
    primaryValue: '₹49.70L',
    primaryCaption: 'Total Amount',
    primaryDelta: { direction: 'up', label: '15%' },
    secondaryValue: '2.31K',
    secondaryCaption: 'Total Count',
    secondaryDelta: { direction: 'down', label: '1%' },
  },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return { text: 'Good morning', emoji: '☀️' }
  if (hour < 17) return { text: 'Good afternoon', emoji: '🌤️' }
  return { text: 'Good evening', emoji: '🌙' }
}

const trendData = [
  { t: '19:00', processed: 1000000, approved: 500000 },
  { t: '20:00', processed: 11200000, approved: 6200000 },
  { t: '21:00', processed: 22100000, approved: 8700000 },
  { t: '22:00', processed: 12800000, approved: 7100000 },
  { t: '23:00', processed: 22700000, approved: 6000000 },
  { t: '00:00', processed: 11600000, approved: 5500000 },
  { t: '01:00', processed: 10700000, approved: 3500000 },
  { t: '02:00', processed: 6200000, approved: 3200000 },
  { t: '03:00', processed: 6000000, approved: 3300000 },
  { t: '04:00', processed: 4000000, approved: 2000000 },
  { t: '05:00', processed: 6200000, approved: 2000000 },
  { t: '06:00', processed: 14500000, approved: 11300000 },
  { t: '07:00', processed: 4500000, approved: 2400000 },
  { t: '08:00', processed: 4800000, approved: 3500000 },
  { t: '09:00', processed: 5200000, approved: 3100000 },
  { t: '10:00', processed: 7700000, approved: 4500000 },
  { t: '11:00', processed: 9400000, approved: 5700000 },
  { t: '12:00', processed: 12600000, approved: 8200000 },
  { t: '13:00', processed: 12300000, approved: 6500000 },
  { t: '14:00', processed: 12900000, approved: 6000000 },
  { t: '15:00', processed: 12200000, approved: 6200000 },
  { t: '16:00', processed: 13400000, approved: 6500000 },
  { t: '17:00', processed: 15700000, approved: 7700000 },
  { t: '18:00', processed: 24900000, approved: 8000000 },
]

export default function HomeScreen({ onNavigate }: { onNavigate: (target: ScreenId) => void }) {
  const [trendTab, setTrendTab] = useState('volume')
  const greeting = getGreeting()

  return (
    <ScreenChrome currentScreen="home" onNavigate={onNavigate}>
      <div className="relative shrink-0 overflow-hidden rounded-b-[32px] bg-gradient-to-br from-primary to-primary-hover px-5 pb-10 pt-2">
        <StatusBar variant="light" />

        <div className="mt-2 flex items-center justify-end">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-400" />
            </button>
            <Avatar className="h-9 w-9 border-2 border-white/40 bg-white/15">
              <AvatarFallback className="bg-transparent text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-2xl font-semibold text-white">
            {greeting.text}, <span className="font-normal italic">Mridula</span> {greeting.emoji}
          </p>
          <p className="mt-1 text-[13px] text-white/70">Here's today's update for you</p>
        </div>
      </div>

      <div className="relative -mt-4 flex-1 overflow-y-auto px-5 pb-6">
        <StatCarousel cards={statCards} />

        <div className="mt-4">
          <DonutBreakdown title="Payment Integration" segments={paymentIntegration} />
        </div>
        <div className="mt-4">
          <DonutBreakdown title="Payment Instruments" segments={paymentInstruments} />
        </div>

        <div className="mt-4">
          <RankedBarListTemplate
            title="Transaction Status"
            subtitle="Status on scale are clickable"
            items={transactionStatus.map((s) => ({
              id: s.id,
              label: s.label,
              value: `${s.value}C`,
              percent: (s.value / maxStatus) * 100,
            }))}
          />
        </div>

        <div className="mt-4">
          <DashboardAreaChartTemplate
            title="Transaction Trend"
            tabs={[
              { id: 'volume', label: 'Volume' },
              { id: 'count', label: 'Count' },
            ]}
            activeTabId={trendTab}
            onTabChange={setTrendTab}
            headline="₹17.26C"
            delta={<Delta direction="up" label="18% vs previous 24h" />}
            data={trendData}
            xKey="t"
            areaKey="processed"
            compareLineKey="approved"
            formatYAxis={formatCrore}
          />
        </div>

        <div className="mt-4">
          <RankedBarListTemplate
            title="Transactions from Top Merchants"
            items={topMerchants.map((m) => ({
              id: m.id,
              label: m.label,
              value: `${m.value}C`,
              percent: (m.value / maxMerchant) * 100,
            }))}
          />
        </div>
      </div>
    </ScreenChrome>
  )
}
