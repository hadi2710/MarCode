import { useEffect, useRef, type CSSProperties } from 'react'
import { Hourglass, Moon, Timer, TrendingUp, type LucideIcon } from 'lucide-react'
import { stats } from '../data/site'
import { prefersReducedMotion } from '../lib/motion'

const REEL = Array.from({ length: 20 }, (_, k) => k % 10)
const STAT_ICONS: LucideIcon[] = [Timer, TrendingUp, Hourglass, Moon]

/** Odometer-style counters that roll each time the panel scrolls into view. */
export default function Stats() {
  const ref = useRef<HTMLElement>(null)
  const rolling = !prefersReducedMotion()

  useEffect(() => {
    const section = ref.current
    if (!section || !rolling) return
    const values = Array.from(section.querySelectorAll<HTMLElement>('[data-count]'))
    const reels = section.querySelectorAll<HTMLElement>('.reel')
    let landTimer = 0
    const reset = () => {
      clearTimeout(landTimer)
      reels.forEach((r) => { r.style.transition = 'none'; r.style.transform = 'translateY(0)' })
      section.classList.remove('landed')
    }
    const roll = () => {
      void section.offsetWidth // flush the reset before animating
      values.forEach((el, i) => {
        el.querySelectorAll<HTMLElement>('.reel').forEach((r, j) => {
          r.style.transition = ''
          r.style.transitionDelay = `${i * 0.15 + j * 0.12}s`
          r.style.transform = `translateY(-${10 + Number(r.dataset.d)}em)`
        })
      })
      landTimer = window.setTimeout(() => section.classList.add('landed'), 2300 + values.length * 150)
    }
    reset()
    const io = new IntersectionObserver(([en]) => (en.isIntersecting ? roll() : reset()), { threshold: 0.35 })
    io.observe(section)
    return () => { io.disconnect(); clearTimeout(landTimer) }
  }, [rolling])

  return (
    <section className="stats" ref={ref} aria-labelledby="stats-title">
      <h2 id="stats-title" className="sr-only">What to expect</h2>
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => {
            const text = `${s.prefix}${s.count}${s.suffix}`
            const Icon = STAT_ICONS[i % STAT_ICONS.length]
            return (
              <div key={s.label} data-anim="up" style={{ '--d': `${i * 0.12}s` } as CSSProperties}>
                <span className="stat-icon" aria-hidden="true"><Icon strokeWidth={1.75} /></span>
                {rolling ? (
                  <p className="stat-value rolling" data-count={s.count} aria-label={text}>
                    {s.prefix && <span className="affix" aria-hidden="true">{s.prefix}</span>}
                    {s.count.split('').map((d, j) => (
                      <span className="dg" aria-hidden="true" key={j}>
                        <span className="reel" data-d={d}>{REEL.map((n, k) => <span key={k}>{n}</span>)}</span>
                      </span>
                    ))}
                    {s.suffix && <span className="affix" aria-hidden="true">{s.suffix}</span>}
                  </p>
                ) : (
                  <p className="stat-value">{text}</p>
                )}
                <p className="stat-label">{s.label}</p>
              </div>
            )
          })}
        </div>
        <p className="stats-note">Typical results we design for. Your numbers depend on enquiry volume and channels, and we agree targets with you during the audit.</p>
      </div>
    </section>
  )
}
