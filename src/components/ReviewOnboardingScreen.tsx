import { useMemo, useState } from 'react'
import { ArrowLeft, Search } from 'lucide-react'
import { Badge, Card, EmptyState, IconButton, InputGroup, InputGroupAddon, InputGroupInput, Tabs, TabsList, TabsTrigger } from '@payglocal_ui/flux-ui'
import StatusBar from './StatusBar'
import ScreenChrome from './ScreenChrome'
import { DetailField } from './listKit'
import type { ScreenId } from './navigation'

type Merchant = {
  onboardingId: string
  mid: string
  product: string
  website: string
  entityType: string
  channel: string
  riskApprovedAt: string
}

const MERCHANTS: Merchant[] = [
  { onboardingId: 'a3189e0a1efa7637', mid: 'ptplsahil6262660', product: 'Global Accounts', website: 'linkedin.com/in/...', entityType: 'Individual', channel: 'Partnership', riskApprovedAt: '27/08/2026 11:00' },
  { onboardingId: 'a302e7e22cfa46a4', mid: 'ptplzyroxtec0261', product: 'Global Accounts', website: 'zyrox.tech', entityType: 'Private limited company', channel: 'Partnership', riskApprovedAt: '27/08/2026 10:23' },
  { onboardingId: 'a3148e85cdde0b19', mid: 'ptplagroepic6751', product: 'Global Accounts', website: 'globalsummitplatform.com', entityType: 'Private limited company', channel: 'Inbound', riskApprovedAt: '26/08/2026 23:25' },
  { onboardingId: 'a314530c0a25cd8c', mid: 'ptplshyamram6024', product: 'Global Accounts', website: 'rudrasteelfinishing.com', entityType: 'Proprietor', channel: 'Inbound', riskApprovedAt: '26/08/2026 23:05' },
  { onboardingId: 'a313d628abd73b0a', mid: 'ptplharshhit0184', product: 'Global Accounts', website: 'amazon.com/sp?seller...', entityType: 'Proprietor', channel: 'Sme direct team', riskApprovedAt: '26/08/2026 21:11' },
  { onboardingId: 'a311d35119f03500', mid: 'ptpldevchakr0098', product: 'Global Accounts', website: 'elmorashop.netlify.app', entityType: 'Individual', channel: 'Inbound', riskApprovedAt: '26/08/2026 17:42' },
]

function MerchantCard({ merchant }: { merchant: Merchant }) {
  return (
    <Card className="gap-0 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-[12.5px] font-semibold text-primary">{merchant.onboardingId}</p>
        <Badge variant="outline" size="sm" className="shrink-0">
          {merchant.channel}
        </Badge>
      </div>
      <p className="mt-1 text-[13.5px] font-semibold leading-snug text-foreground">{merchant.mid}</p>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <Badge variant="outline" size="sm">
          {merchant.product}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
        <DetailField label="Entity Type" value={merchant.entityType} />
        <DetailField label="Risk Approved At" value={merchant.riskApprovedAt} />
        <DetailField label="Website" value={<span className="text-primary">{merchant.website}</span>} />
      </div>
    </Card>
  )
}

export default function ReviewOnboardingScreen({ onNavigate }: { onNavigate: (target: ScreenId) => void }) {
  const [reviewType, setReviewType] = useState('risk')
  const [reviewState, setReviewState] = useState('pending')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return MERCHANTS
    return MERCHANTS.filter((m) => m.onboardingId.toLowerCase().includes(q) || m.mid.toLowerCase().includes(q))
  }, [query])

  return (
    <ScreenChrome currentScreen="review-onboarding" onNavigate={onNavigate}>
      <div className="shrink-0 border-b border-border bg-card px-5 pb-4 pt-2">
        <StatusBar variant="dark" />

        <div className="mt-2 flex min-w-0 items-center gap-2">
          <IconButton aria-label="Back" variant="outline" size="md" rounded="lg" onClick={() => onNavigate('home')} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </IconButton>
          <h1 className="truncate text-[17px] font-bold text-foreground">Onboarding Review</h1>
        </div>

        <Tabs value={reviewType} onValueChange={setReviewType} className="mt-3">
          <TabsList className="w-full">
            <TabsTrigger value="risk" className="flex-1">
              Risk
            </TabsTrigger>
            <TabsTrigger value="kyc" className="flex-1">
              KYC
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs value={reviewState} onValueChange={setReviewState} className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="pending" className="flex-1">
              Review Pending
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex-1">
              Reviewed with Issues
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <InputGroup className="mt-3.5">
          <InputGroupAddon>
            <Search className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search by Onboarding ID or MID" value={query} onChange={(e) => setQuery(e.target.value)} />
        </InputGroup>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {reviewState === 'pending' && filtered.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filtered.map((merchant) => (
              <MerchantCard key={merchant.onboardingId} merchant={merchant} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={reviewState === 'pending' ? 'No merchants found' : 'No issues to review'}
            description="Try a different onboarding ID or MID."
          />
        )}
      </div>
    </ScreenChrome>
  )
}
