import { useEffect, useRef } from 'react'
import { useInView } from '../hooks/useInView'
import { useMediaQuery } from '../hooks/useMediaQuery'
import './HeroBackdrop.css'

/** Time for one sweep to cross the hero, in ms. Slow on purpose - it should be felt, not watched. */
const SWEEP_MS = 9000
/** How far either side of the scan line a point still reacts, in px. */
const BAND = 160

/** Resting dot colour (slate) and the colour a point takes as the sweep passes (accent). */
const REST_RGB = [100, 116, 139] as const
const LIT_RGB = [29, 78, 216] as const
const REST_ALPHA = 0.12
// Deliberately gentle: the sweep passes behind the name and links, and a brighter
// lit state starts competing with the text rather than sitting behind it.
const LIT_ALPHA = 0.38

/**
 * A point field with a slow scan sweeping across it, like a depth sensor sampling the
 * scene. Purely decorative: it sits behind the hero text, ignores the pointer, and is
 * hidden from assistive tech.
 */
export function HeroBackdrop() {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  // No point burning frames on a hero that has been scrolled past.
  const inView = useInView(wrapRef, 0)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let points: { x: number; y: number; r: number }[] = []
    let width = 0
    let height = 0
    let raf = 0
    const started = performance.now()

    const build = () => {
      const rect = wrap.getBoundingClientRect()
      width = rect.width
      height = rect.height
      if (width === 0 || height === 0) return

      // Cap at 2: beyond that the extra pixels cost real time and buy nothing visible.
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // A jittered grid rather than pure noise - a sampled surface is what a depth
      // sensor actually returns, and it keeps the density even. Sparser on small
      // screens, which is where the frame budget is tightest.
      const spacing = width < 640 ? 52 : 38
      points = []
      for (let gx = spacing / 2; gx < width; gx += spacing) {
        for (let gy = spacing / 2; gy < height; gy += spacing) {
          points.push({
            x: gx + (Math.random() - 0.5) * spacing * 0.6,
            y: gy + (Math.random() - 0.5) * spacing * 0.6,
            r: 0.9 + Math.random() * 0.8,
          })
        }
      }
    }

    /** `scanX` of null paints the resting field with no sweep at all. */
    const paint = (scanX: number | null) => {
      ctx.clearRect(0, 0, width, height)

      for (const p of points) {
        const lit = scanX === null ? 0 : Math.max(0, 1 - Math.abs(p.x - scanX) / BAND)
        // Squared falloff keeps the lit region tight instead of a wide smear.
        const e = lit * lit
        const r = Math.round(REST_RGB[0] + (LIT_RGB[0] - REST_RGB[0]) * e)
        const g = Math.round(REST_RGB[1] + (LIT_RGB[1] - REST_RGB[1]) * e)
        const b = Math.round(REST_RGB[2] + (LIT_RGB[2] - REST_RGB[2]) * e)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * (1 + e * 1.15), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${REST_ALPHA + e * (LIT_ALPHA - REST_ALPHA)})`
        ctx.fill()
      }

      if (scanX !== null) {
        const grad = ctx.createLinearGradient(scanX - BAND, 0, scanX + BAND, 0)
        grad.addColorStop(0, 'rgba(29, 78, 216, 0)')
        grad.addColorStop(0.5, 'rgba(29, 78, 216, 0.035)')
        grad.addColorStop(1, 'rgba(29, 78, 216, 0)')
        ctx.fillStyle = grad
        ctx.fillRect(scanX - BAND, 0, BAND * 2, height)
      }
    }

    const frame = (now: number) => {
      const t = ((now - started) % SWEEP_MS) / SWEEP_MS
      // Start and end beyond the edges so points there get a full pass, not a half one.
      paint(-BAND + t * (width + BAND * 2))
      raf = requestAnimationFrame(frame)
    }

    const still = reducedMotion || !inView

    build()
    if (still) paint(null)
    else raf = requestAnimationFrame(frame)

    const observer = new ResizeObserver(() => {
      build()
      if (still) paint(null)
    })
    observer.observe(wrap)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [reducedMotion, inView])

  return (
    <div ref={wrapRef} className="hero__backdrop" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
