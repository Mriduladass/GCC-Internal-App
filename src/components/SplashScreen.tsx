import { useEffect, useLayoutEffect, useRef, useState, type Ref } from 'react'
import markWhite from '../assets/images/splash-mark-white.png'

/* Ported from the Claude Design "Logo Dispersion" composition
   (disperse-scene.jsx + animations-v3.jsx) — the authoring-only
   scrubber/export engine and DC runtime plumbing are dropped; only the
   pure canvas particle choreography survives, now driven by a local rAF
   clock instead of the design tool's timeline, and played once (instead
   of looping) so it can hand off to the login screen when it settles. */

const Easing = {
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeInOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

// CUES derived from the authored scene durations: Hold 0.6, Disperse 1.8,
// Drift 1.9, Reform 1.7 (running start times below) — scaled to ~68% of
// the originally authored pacing for a snappier splash.
const CUES = { Hold: 0, Disperse: 0.6, Drift: 2.4, Reform: 4.3 }
const AUTHORED_TOTAL = 6.0

const W = 1080
const H = 1920
const SS = 1.5
const LOGO_H = 480
const R = 400 // globe radius — larger than the mark
const TILT = 0.3 // axis tilt toward viewer
const LAND_SHARE = 0.74 // dots that land on continents
const BLUE = '#0045A1'

// Coarse world land mask: one entry per 5° latitude band from 90°N down,
// each a list of [lonFrom, lonTo] land spans.
const LAND: [number, number][][] = [
  [],
  [[-100, -20]],
  [[-125, -18], [8, 28], [55, 115]],
  [[-140, -18], [4, 30], [30, 180]],
  [[-168, -55], [-52, -22], [-22, -14], [4, 30], [30, 180]],
  [[-168, -55], [-52, -38], [-24, -14], [4, 30], [30, 180]],
  [[-166, -55], [-46, -42], [-9, -1], [4, 30], [30, 180]],
  [[-132, -54], [-11, 0], [0, 30], [30, 180]],
  [[-126, -58], [-6, 30], [30, 148]],
  [[-125, -68], [-10, 30], [30, 146]],
  [[-123, -74], [-7, -1], [11, 19], [25, 45], [45, 128], [128, 143]],
  [[-121, -77], [-11, 32], [32, 62], [62, 123], [129, 141]],
  [[-116, -80], [-13, 36], [36, 59], [66, 92], [94, 123]],
  [[-111, -96], [-85, -76], [-18, 36], [37, 59], [67, 92], [94, 117]],
  [[-106, -94], [-18, 42], [42, 56], [72, 89], [94, 110]],
  [[-96, -83], [-18, 47], [73, 81], [96, 109], [119, 126]],
  [[-81, -70], [-13, 49], [79, 82], [98, 106], [119, 127]],
  [[-79, -49], [7, 46], [95, 106], [109, 119]],
  [[-81, -34], [9, 43], [97, 106], [109, 119]],
  [[-79, -34], [11, 41], [104, 116], [131, 151]],
  [[-77, -37], [12, 41], [126, 143], [131, 151]],
  [[-73, -39], [12, 37], [43, 51], [114, 148]],
  [[-71, -41], [13, 35], [43, 50], [112, 153]],
  [[-71, -49], [14, 33], [113, 153]],
  [[-73, -54], [16, 31], [114, 151]],
  [[-74, -56], [144, 149], [171, 177]],
  [[-75, -62], [166, 179]],
  [[-76, -67]],
  [[-75, -66]],
  [],
  [],
  [],
  [[-180, -75], [-30, 180]], // Antarctic coast, Drake passage open
  [[-180, 180]],
  [[-180, 180]],
  [[-180, 180]],
]

function isLand(latDeg: number, lonDeg: number) {
  const band = clamp(Math.floor((90 - latDeg) / 5), 0, LAND.length - 1)
  const spans = LAND[band]
  for (let i = 0; i < spans.length; i++) {
    if (lonDeg >= spans[i][0] && lonDeg <= spans[i][1]) return true
  }
  return false
}

function mulberry32(a: number) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Particle = {
  hx: number
  hy: number
  s1: number
  s2: number
  ph: number
  fq: number
  am: number
  r: number
  rj: number
  th: number
  az: number
  gDim: number
  gR: number
}

type LogoData = { P: Particle[]; sil: HTMLCanvasElement; lw: number; lh: number; ox: number; oy: number }

function buildParticles(img: HTMLImageElement, step: number): LogoData {
  const lh = LOGO_H
  const lw = Math.round(lh * (img.width / img.height))
  const off = document.createElement('canvas')
  off.width = lw
  off.height = lh
  const octx = off.getContext('2d')!
  octx.drawImage(img, 0, 0, lw, lh)
  const data = octx.getImageData(0, 0, lw, lh).data

  const sil = document.createElement('canvas')
  sil.width = lw
  sil.height = lh
  const sctx = sil.getContext('2d')!
  sctx.drawImage(img, 0, 0, lw, lh)
  sctx.globalCompositeOperation = 'source-in'
  sctx.fillStyle = '#ffffff'
  sctx.fillRect(0, 0, lw, lh)

  const rnd = mulberry32(20260827)
  const ox = W / 2 - lw / 2
  const oy = H / 2 - lh / 2
  const cx = W / 2
  const cy = H / 2
  const maxR = Math.hypot(lw, lh) / 2
  const P: Particle[] = []
  for (let y = 0; y < lh; y += step) {
    for (let x = 0; x < lw; x += step) {
      if (data[(y * lw + x) * 4 + 3] < 140) continue
      const hx = ox + x + (rnd() - 0.5) * step * 0.9
      const hy = oy + y + (rnd() - 0.5) * step * 0.9
      const norm = clamp(Math.hypot(hx - cx, hy - cy) / maxR, 0, 1)
      P.push({
        hx,
        hy,
        s1: clamp(0.55 * norm + 0.45 * rnd(), 0, 1),
        s2: clamp(0.6 * (1 - norm) + 0.4 * rnd(), 0, 1),
        ph: rnd() * Math.PI * 2,
        fq: 0.3 + rnd() * 0.5,
        am: 3 + rnd() * 9,
        r: 1.75 + rnd() * 0.9,
        rj: 0.97 + rnd() * 0.06,
        th: 0,
        az: 0,
        gDim: 1,
        gR: 1,
      })
    }
  }

  // geographic placement on the shell
  for (let i = 0; i < P.length; i++) {
    const p = P[i]
    const wantLand = rnd() < LAND_SHARE
    let lat = 0
    let lon = 0
    let land = false
    for (let t = 0; t < 60; t++) {
      const u = rnd() * 2 - 1
      lat = (Math.asin(u) * 180) / Math.PI
      lon = rnd() * 360 - 180
      land = isLand(lat, lon)
      if (!wantLand || land) break
    }
    p.th = Math.acos(-Math.sin((lat * Math.PI) / 180))
    p.az = (lon * Math.PI) / 180
    p.gDim = land ? 1 : 0.34 // ocean dots read as a faint shell
    p.gR = land ? 1 : 0.6
  }
  return { P, sil, lw, lh, ox, oy }
}

function useLogo(src: string, step: number) {
  const [L, setL] = useState<LogoData | null>(null)
  useEffect(() => {
    let dead = false
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (!dead) setL(buildParticles(img, step))
    }
    img.src = src
    return () => {
      dead = true
    }
  }, [src, step])
  return L
}

const EASE = Easing.easeInOutCubic
const SETTLE = Easing.easeInOutQuart

function LogoDisperse({ T, L, hidden = false, dotScale = 1 }: { T: number; L: LogoData | null; hidden?: boolean; dotScale?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  const dStart = CUES.Disperse
  const drift = CUES.Drift
  const rStart = CUES.Reform
  const D1 = drift - dStart
  const D2 = AUTHORED_TOTAL - rStart

  const draw = (cv: HTMLCanvasElement | null) => {
    if (!cv || !L) return
    const { P, sil, lw, lh, ox, oy } = L
    const ctx = cv.getContext('2d')!
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, cv.width, cv.height)

    const loop = (T / Math.max(AUTHORED_TOTAL, 0.001)) * Math.PI * 2
    const cam = 1 + 0.03 * (1 - Math.cos(loop)) * 0.5
    ctx.setTransform(SS, 0, 0, SS, 0, 0)
    ctx.translate(W / 2, H / 2)
    ctx.scale(cam, cam)
    ctx.translate(-W / 2, -H / 2)

    const settled = rStart + 0.9 * D2
    let solidA = 0
    if (T <= dStart) solidA = 1
    else if (T < drift) solidA = 1 - EASE(clamp((T - dStart) / (D1 * 0.42), 0, 1))
    else if (T >= rStart) solidA = EASE(clamp((T - (settled - 0.85)) / 0.85, 0, 1))
    if (solidA > 0.001) {
      ctx.globalAlpha = solidA
      ctx.drawImage(sil, ox, oy, lw, lh)
      ctx.globalAlpha = 1
    }

    const cx = W / 2
    const cy = H / 2
    const rotY = 0.42 * T
    const ct = Math.cos(TILT)
    const st_ = Math.sin(TILT)
    const buckets = 8
    const paths: number[][] = []
    for (let b = 0; b < buckets; b++) paths.push([])

    for (let i = 0; i < P.length; i++) {
      const p = P[i]
      let d: number
      if (T <= dStart) d = 0
      else if (T < drift) {
        const a = dStart + p.s1 * D1 * 0.45
        d = EASE(clamp((T - a) / (D1 * 0.55), 0, 1))
      } else if (T < rStart) d = 1
      else {
        const a = rStart + p.s2 * D2 * 0.26
        d = 1 - SETTLE(clamp((T - a) / (D2 * 0.66), 0, 1))
      }
      if (d < 0.002 && solidA > 0.999) continue

      const rr3 = R * p.rj
      const sinT = Math.sin(p.th)
      const cosT = Math.cos(p.th)
      const az = p.az + rotY
      const x3 = rr3 * sinT * Math.cos(az)
      const y3 = rr3 * cosT
      const z3 = rr3 * sinT * Math.sin(az)
      const y2 = y3 * ct - z3 * st_
      const z2 = y3 * st_ + z3 * ct
      const depth = (z2 / R + 1) / 2
      const k = 1 + z2 / (R * 4.6)
      const gx = cx + x3 * k
      const gy = cy + y2 * k

      let x = p.hx + (gx - p.hx) * d
      let y = p.hy + (gy - p.hy) * d
      if (d > 0.002) {
        const w = d * d * d
        x += Math.sin(T * p.fq * 1.9 + p.ph) * p.am * w
        y += Math.cos(T * p.fq * 1.5 + p.ph * 1.3) * p.am * 0.8 * w
      }

      const dA = (0.28 + 0.72 * depth) * p.gDim
      const dR = (0.62 + 0.5 * depth) * p.gR
      const alpha = 1 + (dA - 1) * d
      const rad = p.r * (1 + (dR - 1) * d) * dotScale
      const b = Math.min(buckets - 1, Math.max(0, Math.round(((alpha - 0.1) / 0.9) * (buckets - 1))))
      paths[b].push(x, y, rad)
    }

    for (let b = 0; b < buckets; b++) {
      const arr = paths[b]
      if (!arr.length) continue
      ctx.globalAlpha = 0.1 + (b / (buckets - 1)) * 0.9
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      for (let k = 0; k < arr.length; k += 3) {
        const r = arr[k + 2]
        ctx.moveTo(arr[k] + r, arr[k + 1])
        ctx.arc(arr[k], arr[k + 1], r, 0, 6.2832)
      }
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  useLayoutEffect(() => {
    draw(ref.current)
  })

  return (
    <div style={{ position: 'absolute', inset: 0, background: BLUE, overflow: 'hidden' }}>
      <canvas
        ref={ref}
        width={W * SS}
        height={H * SS}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: hidden ? 0 : 1 }}
      />
    </div>
  )
}

function useClock(duration: number, onDone?: () => void) {
  const [t, setT] = useState(0)
  const doneRef = useRef(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    let raf = 0
    let last: number | null = null
    const tick = (ts: number) => {
      if (last == null) last = ts
      const dt = (ts - last) / 1000
      last = ts
      setT((prev) => Math.min(prev + dt, duration))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration])

  useEffect(() => {
    if (t >= duration && !doneRef.current) {
      doneRef.current = true
      onDoneRef.current?.()
    }
  }, [t, duration])

  return t
}

function useLoopClock(duration: number) {
  const [t, setT] = useState(0)

  useEffect(() => {
    let raf = 0
    let last: number | null = null
    const tick = (ts: number) => {
      if (last == null) last = ts
      const dt = (ts - last) / 1000
      last = ts
      setT((prev) => (prev + dt) % duration)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration])

  return t
}

// Square crop (in design-space px) around the mark/globe, used to reserve a
// compact footprint for the embedded version instead of the full portrait
// splash canvas.
const EMBED_CROP = 1080
const EMBED_CROP_OFFSET_Y = (H - EMBED_CROP) / 2

/** A small, continuously looping instance of the same dispersion animation, for embedding above the login form. */
export function LogoDispersionEmbed({ size = 220 }: { size?: number }) {
  const T = useLoopClock(AUTHORED_TOTAL)
  const L = useLogo(markWhite, 4)
  const scale = size / EMBED_CROP

  return (
    <div style={{ width: size, height: size, overflow: 'hidden' }}>
      <div
        style={{
          width: EMBED_CROP,
          height: EMBED_CROP,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: -EMBED_CROP_OFFSET_Y, width: W, height: H }}>
          <LogoDisperse T={T} L={L} />
        </div>
      </div>
    </div>
  )
}

function useContainerScale(designWidth: number, designHeight: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      setScale(Math.min(el.clientWidth / designWidth, el.clientHeight / designHeight))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [designWidth, designHeight])

  return [ref, scale] as const
}

export default function SplashScreen({
  onComplete,
  hideMark = false,
  logoRestRef,
}: {
  onComplete?: () => void
  /** Hide the canvas-drawn settled mark once a flying clone takes over for the handoff. */
  hideMark?: boolean
  /** Ref to an invisible placeholder sitting exactly where the settled mark rests, for measuring the handoff's start rect. */
  logoRestRef?: Ref<HTMLDivElement>
}) {
  const [containerRef, scale] = useContainerScale(W, H)
  const T = useClock(AUTHORED_TOTAL, onComplete)
  const L = useLogo(markWhite, 3)

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center overflow-hidden"
      style={{ background: BLUE }}
    >
      <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'center', flexShrink: 0 }}>
        <LogoDisperse T={T} L={L} hidden={hideMark} />
        {L && (
          <div
            ref={logoRestRef}
            style={{ position: 'absolute', left: L.ox, top: L.oy, width: L.lw, height: L.lh }}
          />
        )}
      </div>
    </div>
  )
}
