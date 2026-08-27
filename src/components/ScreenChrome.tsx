import { useState, type ReactNode } from 'react'
import BottomNav from './BottomNav'
import NavigationDrawer from './NavigationDrawer'
import type { ScreenId } from './navigation'

export default function ScreenChrome({
  children,
  currentScreen,
  onNavigate,
}: {
  children: ReactNode
  currentScreen: ScreenId
  onNavigate: (target: ScreenId) => void
}) {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="relative flex h-full w-full flex-col bg-background">
      {children}

      <BottomNav current={currentScreen} onOpenMenu={() => setNavOpen(true)} />

      <NavigationDrawer
        open={navOpen}
        onClose={() => setNavOpen(false)}
        currentScreen={currentScreen}
        onNavigate={(target) => {
          setNavOpen(false)
          onNavigate(target)
        }}
      />
    </div>
  )
}
