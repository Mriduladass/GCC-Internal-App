import { useEffect, type ComponentType } from 'react'
import {
  Activity,
  ArrowLeftRight,
  Calendar,
  CalendarCheck,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  FileSearch,
  FileText,
  Gauge,
  IdCard,
  KeyRound,
  Landmark,
  LineChart,
  Link as LinkIcon,
  MessageCircle,
  Paperclip,
  QrCode,
  Settings,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  Target,
  Undo2,
  UserPlus,
  Users,
  Wallet,
  Workflow,
  Wrench,
  X,
} from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Avatar, AvatarFallback, Badge, IconButton, Separator } from '@payglocal_ui/flux-ui'
import { SCREEN_LABELS, type ScreenId } from './navigation'

type NavItem = { label: string; icon: ComponentType<{ className?: string }>; screen?: ScreenId }

const NAV_BEFORE_ONBOARDING: NavItem[] = [
  { label: 'Dashboard', icon: Gauge, screen: 'home' },
  { label: 'Monitor Traffic', icon: Target, screen: 'monitor-traffic' },
  { label: 'Track Transactions', icon: ArrowLeftRight, screen: 'track-transactions' },
  { label: 'Manage Merchants', icon: Store, screen: 'merchants' },
]

const ONBOARDING_CHILDREN: NavItem[] = [
  { label: 'New Onboarding', icon: IdCard, screen: 'new-onboarding' },
  { label: 'Bulk Onboarding', icon: IdCard, screen: 'bulk-onboarding' },
  { label: 'Review Onboarding', icon: IdCard, screen: 'review-onboarding' },
  { label: 'Legacy', icon: IdCard, screen: 'legacy' },
]

const NAV_AFTER_ONBOARDING: NavItem[] = [
  { label: 'Global Partner TSP Onboarding', icon: Landmark },
  { label: 'UCIC Management', icon: Store, screen: 'ucic-management' },
  { label: 'Deals', icon: Store, screen: 'deals' },
  { label: 'MCA Compliance', icon: ShieldCheck, screen: 'mca-compliance' },
  { label: 'Compliance Dashboard', icon: Gauge },
  { label: 'Sanctions Screening', icon: FileSearch },
  { label: 'Transaction Monitoring', icon: FileSearch },
  { label: 'FIU Rules Inventory', icon: SlidersHorizontal },
  { label: 'MCA ITM', icon: SlidersHorizontal },
  { label: 'Amplifier Transactions', icon: Workflow },
  { label: 'Penny Transactions', icon: CircleDollarSign },
  { label: 'Dispute Management', icon: Undo2 },
  { label: 'Blocked Resources', icon: SlidersHorizontal },
  { label: 'Business Analytics', icon: LineChart },
  { label: 'MPR Reports', icon: LineChart },
  { label: 'Risk Underwriting', icon: ShieldCheck },
  { label: 'Acquirer Management', icon: Landmark },
  { label: 'Reports', icon: LineChart },
  { label: 'Glocal Configuration', icon: Settings },
  { label: 'Tools', icon: Wrench },
  { label: 'User Management', icon: UserPlus },
  { label: 'Risk Management', icon: ShieldAlert },
  { label: 'Key Management', icon: KeyRound },
  { label: 'Manage Mandates', icon: CalendarCheck },
  { label: 'Amplifier Mandates', icon: Calendar },
  { label: 'Amplifier Gateways', icon: Workflow },
  { label: 'Payment Link', icon: LinkIcon },
  { label: 'MCA Links', icon: Paperclip },
  { label: 'Invoice', icon: FileText },
  { label: 'WhatsApp Logs', icon: MessageCircle },
  { label: 'AM Hierarchy', icon: Users },
  { label: 'MCA Wallet', icon: Wallet },
  { label: 'WQR', icon: QrCode },
  { label: 'Payment Button', icon: CreditCard },
  { label: 'Activity Monitoring', icon: Activity },
  { label: 'Audit', icon: ClipboardList },
  { label: 'Invoice History', icon: FileText },
]

function NavRow({
  item,
  selected,
  onSelect,
  indent = false,
}: {
  item: NavItem
  selected: boolean
  onSelect: () => void
  indent?: boolean
}) {
  const Icon = item.icon

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
        indent ? 'py-2.5 pl-8' : ''
      } ${selected ? 'bg-primary' : 'hover:bg-muted'}`}
    >
      <Icon className={`h-[18px] w-[18px] shrink-0 ${selected ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
      <span className={`truncate text-[13.5px] font-medium ${selected ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
        {item.label}
      </span>
    </button>
  )
}

export default function NavigationDrawer({
  open,
  onClose,
  currentScreen,
  onNavigate,
}: {
  open: boolean
  onClose: () => void
  currentScreen: ScreenId
  onNavigate: (target: ScreenId) => void
}) {
  const selectedLabel = SCREEN_LABELS[currentScreen]

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const goTo = (item: NavItem) => {
    if (!item.screen) return
    onClose()
    onNavigate(item.screen)
  }

  return (
    <div className={`absolute inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-pg-standard ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`absolute inset-y-0 right-0 flex h-full w-[84%] max-w-[340px] flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ease-pg-standard ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex shrink-0 items-start justify-between gap-2 px-5 pb-4 pt-6">
          <div className="flex items-start gap-3">
            <Avatar className="h-11 w-11 shrink-0">
              <AvatarFallback className="bg-muted text-[13px] font-semibold text-foreground">MD</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[15px] font-semibold text-foreground">Mridula Dass</span>
                <Badge variant="default" size="sm">
                  Glocal Eng Admin
                </Badge>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Last Log: 24/08/2026 18:52:55</p>
            </div>
          </div>
          <IconButton aria-label="Close menu" variant="ghost" size="sm" rounded="full" onClick={onClose} className="shrink-0">
            <X className="h-4 w-4" />
          </IconButton>
        </div>

        <Separator />

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {NAV_BEFORE_ONBOARDING.map((item) => (
            <NavRow key={item.label} item={item} selected={selectedLabel === item.label} onSelect={() => goTo(item)} />
          ))}

          <Accordion type="single" collapsible defaultValue="onboarding">
            <AccordionItem value="onboarding" className="border-b-0">
              <AccordionTrigger className="rounded-xl px-3 py-3 text-[13.5px] font-medium text-muted-foreground hover:bg-muted hover:text-muted-foreground hover:no-underline focus-visible:ring-0">
                <span className="flex items-center gap-3">
                  <IdCard className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                  Onboarding
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="flex flex-col gap-0.5">
                  {ONBOARDING_CHILDREN.map((item) => (
                    <NavRow key={item.label} item={item} selected={selectedLabel === item.label} onSelect={() => goTo(item)} indent />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {NAV_AFTER_ONBOARDING.map((item) => (
            <NavRow key={item.label} item={item} selected={selectedLabel === item.label} onSelect={() => goTo(item)} />
          ))}
        </nav>
      </div>
    </div>
  )
}
