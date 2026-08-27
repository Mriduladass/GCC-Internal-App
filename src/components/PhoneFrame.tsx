import { useEffect, useRef, useState, type ReactNode } from 'react'

// iPhone 15 Pro Max logical viewport size (CSS pixels)
const DEVICE_WIDTH = 430
const DEVICE_HEIGHT = 932
const BEZEL = 14
const MOBILE_BREAKPOINT = 500 // px — below this, treat as a real phone

export default function PhoneFrame({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  )

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return // no scaling math needed in mobile mode
    const el = outerRef.current
    if (!el) return

    const fit = () => {
      const padding = 48
      const availableWidth = el.clientWidth - padding
      const availableHeight = el.clientHeight - padding
      const totalWidth = DEVICE_WIDTH + BEZEL * 2
      const totalHeight = DEVICE_HEIGHT + BEZEL * 2
      const next = Math.min(1, availableWidth / totalWidth, availableHeight / totalHeight)
      setScale(next > 0 ? next : 1)
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(el)
    return () => observer.disconnect()
  }, [isMobile])

  // Real phone: full-screen, no mockup chrome at all
  if (isMobile) {
    return <div className="h-screen w-screen overflow-y-auto bg-white">{children}</div>
  }

  // Desktop: scaled mockup frame, same as before
  return (
    <div
      ref={outerRef}
      className="flex h-screen w-screen items-center justify-center overflow-hidden bg-[#0b0b0f]"
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
        <div
          className="relative rounded-[64px] bg-black shadow-2xl"
          style={{
            width: DEVICE_WIDTH + BEZEL * 2,
            height: DEVICE_HEIGHT + BEZEL * 2,
            padding: BEZEL,
          }}
        >
          {/* Side buttons */}
          <div className="absolute -left-[2px] top-[130px] h-8 w-[3px] rounded-l bg-neutral-800" />
          <div className="absolute -left-[2px] top-[180px] h-14 w-[3px] rounded-l bg-neutral-800" />
          <div className="absolute -left-[2px] top-[245px] h-14 w-[3px] rounded-l bg-neutral-800" />
          <div className="absolute -right-[2px] top-[200px] h-20 w-[3px] rounded-r bg-neutral-800" />

          {/* Screen */}
          <div
            className="relative overflow-hidden rounded-[50px] bg-white"
            style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT }}
          >
            {/* Dynamic island */}
            <div className="absolute left-1/2 top-[11px] z-50 h-[34px] w-[125px] -translate-x-1/2 rounded-full bg-black" />

            {/* App content */}
            <div className="h-full w-full overflow-y-auto">{children}</div>

            {/* Home indicator */}
            <div className="pointer-events-none absolute bottom-[8px] left-1/2 z-50 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black/80" />
          </div>
        </div>
      </div>
    </div>
  )
}

export const IPHONE_15_PRO_MAX = {
  width: DEVICE_WIDTH,
  height: DEVICE_HEIGHT,
}