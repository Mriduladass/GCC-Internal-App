import { useEffect, useRef, useState } from 'react'
import PhoneFrame from './components/PhoneFrame'
import SplashScreen from './components/SplashScreen'
import LoginScreen from './components/LoginScreen'
import HomeScreen from './components/HomeScreen'
import ManageMerchantsScreen from './components/ManageMerchantsScreen'
import MonitorTrafficScreen from './components/MonitorTrafficScreen'
import TrackTransactionsScreen from './components/TrackTransactionsScreen'
import NewOnboardingScreen from './components/NewOnboardingScreen'
import BulkOnboardingScreen from './components/BulkOnboardingScreen'
import ReviewOnboardingScreen from './components/ReviewOnboardingScreen'
import LegacyOnboardingScreen from './components/LegacyOnboardingScreen'
import DealsScreen from './components/DealsScreen'
import McaComplianceScreen from './components/McaComplianceScreen'
import UcicManagementScreen from './components/UcicManagementScreen'
import markWhite from './assets/images/splash-mark-white.png'
import type { ScreenId } from './components/navigation'

type Screen = 'splash' | 'login' | ScreenId

const FLIGHT_MS = 500

type Rect = { left: number; top: number; width: number; height: number }

// Convert a getBoundingClientRect() (real, post-transform viewport pixels)
// into the local CSS-pixel space of `wrapperEl` — the ancestor the flying
// clone is absolutely positioned inside. Needed because PhoneFrame scales
// its whole screen down to fit the viewport via a CSS transform, so raw
// viewport-pixel deltas don't match the wrapper's own untransformed pixels.
function toLocalRect(rect: DOMRect, wrapperEl: HTMLElement): Rect {
  const wRect = wrapperEl.getBoundingClientRect()
  const ratio = wRect.width / wrapperEl.offsetWidth || 1
  return {
    left: (rect.left - wRect.left) / ratio,
    top: (rect.top - wRect.top) / ratio,
    width: rect.width / ratio,
    height: rect.height / ratio,
  }
}

function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [splashFadingOut, setSplashFadingOut] = useState(false)
  const [flightActive, setFlightActive] = useState(false)
  const [flightRect, setFlightRect] = useState<{ from: Rect; to: Rect } | null>(null)
  const [flightArrived, setFlightArrived] = useState(false)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const splashLogoRef = useRef<HTMLDivElement>(null)
  const loginLogoRef = useRef<HTMLDivElement>(null)

  const onNavigate = (target: ScreenId) => setScreen(target)

  const handleSplashComplete = () => {
    setScreen('login')
    setSplashFadingOut(true)
    setFlightArrived(false)
    setFlightRect(null)
    setFlightActive(true)
  }

  // Measure the splash mark's resting rect and the login badge's rect (both
  // now mounted) and kick off the flight, once refs are attached.
  useEffect(() => {
    if (!flightActive) return
    const wrapper = wrapperRef.current
    const from = splashLogoRef.current
    const to = loginLogoRef.current
    if (!wrapper || !from || !to) {
      setFlightActive(false)
      return
    }
    setFlightRect({
      from: toLocalRect(from.getBoundingClientRect(), wrapper),
      to: toLocalRect(to.getBoundingClientRect(), wrapper),
    })
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setFlightArrived(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [flightActive])

  // Once the clone has visibly landed, hand off to the real login badge.
  useEffect(() => {
    if (!flightActive || !flightArrived) return
    const timeout = setTimeout(() => {
      setFlightActive(false)
      setFlightRect(null)
      setFlightArrived(false)
    }, FLIGHT_MS)
    return () => clearTimeout(timeout)
  }, [flightActive, flightArrived])

  return (
    <PhoneFrame>
      <div ref={wrapperRef} className="relative h-full w-full">
        {screen === 'login' && (
          <LoginScreen onSubmit={() => setScreen('home')} logoRef={loginLogoRef} hideLogo={flightActive} />
        )}
        {(screen === 'splash' || splashFadingOut) && (
          <div
            className={`absolute inset-0 transition-opacity duration-500 ease-out ${splashFadingOut ? 'opacity-0' : 'opacity-100'}`}
            onTransitionEnd={() => splashFadingOut && setSplashFadingOut(false)}
          >
            <SplashScreen onComplete={handleSplashComplete} hideMark={!!flightRect} logoRestRef={splashLogoRef} />
          </div>
        )}
        {flightActive && flightRect && (
          <img
            src={markWhite}
            alt=""
            style={{
              position: 'absolute',
              zIndex: 50,
              pointerEvents: 'none',
              ...(flightArrived ? flightRect.to : flightRect.from),
              transition: `left ${FLIGHT_MS}ms ease, top ${FLIGHT_MS}ms ease, width ${FLIGHT_MS}ms ease, height ${FLIGHT_MS}ms ease`,
            }}
          />
        )}
        {screen === 'home' && <HomeScreen onNavigate={onNavigate} />}
        {screen === 'merchants' && <ManageMerchantsScreen onNavigate={onNavigate} />}
        {screen === 'monitor-traffic' && <MonitorTrafficScreen onNavigate={onNavigate} />}
        {screen === 'track-transactions' && <TrackTransactionsScreen onNavigate={onNavigate} />}
        {screen === 'new-onboarding' && <NewOnboardingScreen onNavigate={onNavigate} />}
        {screen === 'bulk-onboarding' && <BulkOnboardingScreen onNavigate={onNavigate} />}
        {screen === 'review-onboarding' && <ReviewOnboardingScreen onNavigate={onNavigate} />}
        {screen === 'legacy' && <LegacyOnboardingScreen onNavigate={onNavigate} />}
        {screen === 'deals' && <DealsScreen onNavigate={onNavigate} />}
        {screen === 'mca-compliance' && <McaComplianceScreen onNavigate={onNavigate} />}
        {screen === 'ucic-management' && <UcicManagementScreen onNavigate={onNavigate} />}
      </div>
    </PhoneFrame>
  )
}

export default App
