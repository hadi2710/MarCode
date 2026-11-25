import { useEffect, useRef } from 'react'
import { canHover, prefersReducedMotion } from '../lib/motion'

/**
 * Blend-mode cursor dot (mouse devices only). Grows over cards, shrinks over
 * links/buttons and shows a label over elements with data-cursor-text.
 * Uses event delegation so it also works for content rendered later.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const enabled = canHover() && !prefersReducedMotion()

  useEffect(() => {
    const cur = ref.current
    if (!cur || !enabled) return
    const txt = cur.querySelector<HTMLSpanElement>('.c-text')!
    const root = document.documentElement
    root.classList.add('has-cursor')

    let mx = -100, my = -100, cx = -100, cy = -100, raf = 0
    const follow = () => {
      cx += (mx - cx) * 0.18
      cy += (my - cy) * 0.18
      cur.style.transform = `translate3d(${cx}px,${cy}px,0)`
      raf = requestAnimationFrame(follow)
    }
    raf = requestAnimationFrame(follow)

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; cur.classList.remove('hide') }
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element
      const interactive = t.closest('a, button, summary')
      const labelled = t.closest<HTMLElement>('[data-cursor-text]')
      cur.classList.toggle('card', !!t.closest('.founder, .col'))
      cur.classList.toggle('pointer', !!interactive)
      cur.classList.toggle('text', !!labelled && !(interactive && labelled.contains(interactive)))
      if (labelled) txt.textContent = labelled.dataset.cursorText ?? ''
    }
    const onLeave = () => cur.classList.add('hide')
    const onDown = () => cur.classList.add('down')
    const onUp = () => cur.classList.remove('down')

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.documentElement.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('has-cursor')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div className="cursor hide" ref={ref} aria-hidden="true">
      <span className="c-dot" />
      <span className="c-text" />
    </div>
  )
}
