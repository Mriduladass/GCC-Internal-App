import { Gift, Home, LayoutGrid, ShoppingCart } from 'lucide-react'
import type { ScreenId } from './navigation'

export default function BottomNav({ current, onOpenMenu }: { current: ScreenId; onOpenMenu: () => void }) {
  return (
    <div className="relative flex shrink-0 items-center justify-around rounded-t-[28px] border-t border-border bg-card py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <Home className={`h-6 w-6 ${current === 'home' ? 'text-primary' : 'text-muted-foreground'}`} />
      <ShoppingCart className="h-6 w-6 text-muted-foreground" />
      <Gift className="h-6 w-6 text-muted-foreground" />
      <button type="button" aria-label="Open menu" onClick={onOpenMenu}>
        <LayoutGrid className="h-6 w-6 text-muted-foreground" />
      </button>
    </div>
  )
}
