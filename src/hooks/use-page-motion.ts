import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)

const HEADER_OFFSET = -90
/** Resting tilt (deg) that cards straighten out of as they scroll in. */
const TILT = [-3, 2.5, -2, 3]
/** Elements that get the tilt-and-settle treatment (everything else just drifts up). */
const CARD = '.founder, .col, .stats-grid > div, .step-card'
/** Rows whose items enter one after another, left to right (in reading order). */
const ROWS = '.steps, .outcome-grid, .founder-grid, .stats-grid, .demo-points, .compare'
/** Where each data-anim value comes from: [x, y] start offset in px. */
const FROM: Record<string, [number, number]> = { left: [-80, 0], right: [80, 0], blur: [-36, 0], up: [0, 50], down: [0, -40] }

/**
 * Site-wide motion:
 * - Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync with it
 * - smooth in-page "#hash" links (and "/#hash" links from other routes)
 * - scroll-linked (scrubbed) motion: content is never hidden and nothing plays on load;
 *   elements only move while the user scrolls, and reverse when they scroll back
 *   - things enter along the direction work flows: rows left to right in sequence, lists top to bottom,
 *     with a fade for anything that starts below the fold
 *   - cards come in tilted and straighten out
 *   - "Follow one enquiry": a signal runs through five stations (pinned on desktop)
 *   - section headings fill in word by word
 *   - "What we build": heading and cards float up and fade in, then the columns drift at different speeds
 *   - desktop: the hero eases back and its status chips drift while the first panel slides over it
 *   - the channel strip slides sideways with the scroll
 * With prefers-reduced-motion, none of the GSAP motion runs.
 */
export function usePageMotion() {
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const lenisRef = useRef<Lenis | null>(null)

  // Smooth scrolling (one clock for Lenis and GSAP)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    const onRefresh = () => lenis.resize()
    ScrollTrigger.addEventListener('refresh', onRefresh)
    return () => {
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // In-page anchor links
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element).closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || a.target === '_blank') return
      const url = new URL(a.href)
      if (url.origin !== location.origin || !url.hash) return
      e.preventDefault()
      if (url.pathname === location.pathname) scrollToHash(url.hash, lenisRef.current, true)
      else navigate(url.pathname + url.hash)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate])

  // New route: jump to the hash target, or to the top
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (hash) scrollToHash(hash, lenisRef.current, false)
      else if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
    })
    return () => cancelAnimationFrame(id)
  }, [pathname, hash])

  // Per-page motion
  useEffect(() => {
    const cleanups: Array<() => void> = []

    // .in marks things that have been seen once; only small decorations use it (stat accent lines)
    const seen = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return
        en.target.classList.add('in')
        seen.unobserve(en.target)
      })
    }, { threshold: 0.15 })
    document.querySelectorAll('[data-anim], .stats-grid > div').forEach((t) => seen.observe(t))
    cleanups.push(() => seen.disconnect())

    // Pause decorative CSS animations while off-screen
    const pauser = new IntersectionObserver((entries) => {
      entries.forEach((en) => en.target.classList.toggle('paused', !en.isIntersecting))
    })
    document.querySelectorAll('.hero, .cta-box').forEach((el) => pauser.observe(el))
    cleanups.push(() => pauser.disconnect())

    // Product mock-ups loop only while on screen
    if (!prefersReducedMotion()) {
      const live = new IntersectionObserver((entries) => {
        entries.forEach((en) => en.target.classList.toggle('live', en.isIntersecting))
      }, { threshold: 0.25 })
      document.querySelectorAll('.mock').forEach((el) => live.observe(el))
      cleanups.push(() => live.disconnect())
    }

    if (!prefersReducedMotion()) {
      const ctx = gsap.context(() => setupScrollMotion())
      cleanups.push(() => ctx.revert())
      // Fonts and lazy images change layout after first paint: re-measure trigger positions
      const refresh = () => ScrollTrigger.refresh()
      document.fonts?.ready.then(refresh)
      window.addEventListener('load', refresh)
      cleanups.push(() => window.removeEventListener('load', refresh))
    }

    return () => cleanups.forEach((fn) => fn())
  }, [pathname])
}

function setupScrollMotion() {
  const hero = document.querySelector<HTMLElement>('.hero')
  const inHero = (el: Element) => !!hero && hero.contains(el)
  const mm = gsap.matchMedia()
  let tiltIndex = 0

  /** Drift up (and, for cards, untilt) while the element travels through the bottom of the viewport. */
  const vh = window.innerHeight
  // only things that start below the fold fade; nothing visible on load is ever hidden
  const belowFold = (el: Element) => el.getBoundingClientRect().top > vh * 0.92

  const settle = (el: HTMLElement) => {
    const card = el.matches(CARD)
    // items in a row enter left to right: each starts a little later and from the left
    const row = el.parentElement?.closest(ROWS) ?? (el.parentElement?.matches(ROWS) ? el.parentElement : null)
    const seq = row ? Array.prototype.indexOf.call(el.parentElement!.children, el) : 0
    let [x, y] = FROM[el.dataset.anim ?? 'up'] ?? FROM.up
    if (row && el.dataset.anim === 'up') { x = -60; y = 40 }
    if (card && !row) y = Math.max(y, 90)
    // wide elements tilt less, so a full-width card never swings far
    const rot = card ? TILT[tiltIndex++ % TILT.length] * Math.min(1, 520 / (el.offsetWidth || 520)) : 0
    const lag = Math.min(seq, 4) * 5
    if (window.innerWidth < 768) x *= 0.5 // shorter travel on phones
    gsap.fromTo(el,
      { '--sx': x, '--sy': y, '--sr': rot, opacity: belowFold(el) ? 0 : 1 },
      { '--sx': 0, '--sy': 0, '--sr': 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: el, start: `top ${100 - lag}%`, end: `top ${64 - lag}%`, scrub: 0.8 } },
    )
  }

  // 1. Cards and blocks
  gsap.utils.toArray<HTMLElement>('[data-anim]:not(.split)').forEach((el) => {
    if (!inHero(el)) settle(el)
  })

  // 2. Section headings fill in word by word
  gsap.utils.toArray<HTMLElement>('.split').forEach((h) => {
    if (inHero(h)) return
    gsap.fromTo(h.querySelectorAll('.w > span'), { opacity: 0.16 }, {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: h, start: 'top 88%', end: 'bottom 50%', scrub: 0.6 },
    })
  })

  // 2b. Lists fill in from the top down
  gsap.utils.toArray<HTMLElement>('.col li, .faq details, .sv-points li').forEach((el) => {
    if (inHero(el) || !belowFold(el)) return
    gsap.fromTo(el, { y: -14, opacity: 0 }, {
      y: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 78%', scrub: 0.6 },
    })
  })

  // 2c. Follow one enquiry: the signal runs through the stations
  setupFlow(mm)

  // 3. Channel strip slides sideways while it crosses the viewport (all screen sizes)
  const ticker = document.querySelector('.ticker-track')
  if (ticker) {
    gsap.fromTo(ticker, { xPercent: 0 }, {
      xPercent: -38, ease: 'none',
      scrollTrigger: { trigger: '.ticker', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    })
  }

  // 4. Desktop: hero recedes under the first panel (home demo / service overview)
  mm.add('(min-width: 1024px)', () => {
    const panel = document.querySelector('.hero-stack > .panel')
    const inner = document.querySelector('.hero-home .hero-inner')
    if (panel && inner) {
      const under = { trigger: panel, start: 'top bottom', end: 'top top', scrub: true }
      gsap.to(inner, { scale: 0.9, opacity: 0.25, y: -40, ease: 'none', scrollTrigger: under })
      // chips drift upward at different speeds (depth)
      gsap.utils.toArray<HTMLElement>('.hero-chips .chip').forEach((chip, i) => {
        gsap.to(chip, { y: -(90 + (i % 3) * 70), opacity: 0, ease: 'none', scrollTrigger: under })
      })
    }

  })

  // 5. "What we build": heading and cards float up and fade in on the way down
  mm.add({ wide: '(min-width: 820px)', narrow: '(max-width: 819px)' }, (ctx) => {
    const wide = ctx.conditions?.wide
    const head = gsap.utils.toArray<HTMLElement>('.services-head > *')
    head.forEach((el, i) => {
      gsap.fromTo(el, { y: 70 + i * 40, opacity: 0 }, {
        y: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: '.services-head', start: 'top 98%', end: 'top 55%', scrub: 1 },
      })
    })
    gsap.utils.toArray<HTMLElement>('.sv').forEach((card, i) => {
      const right = wide && i % 2 === 1
      const lag = right ? 6 : 0
      gsap.fromTo(card,
        { x: wide ? -90 : -40, y: wide ? 120 : 70, opacity: 0, scale: 0.95, rotation: wide ? -2 : 0 },
        { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, ease: 'none',
          scrollTrigger: { trigger: card, start: `top ${100 - lag}%`, end: wide ? `top ${55 - lag}%` : 'top 70%', scrub: 1.2 } },
      )
      // keep floating after they land: the two columns drift at different speeds
      if (wide) {
        gsap.fromTo(card, { yPercent: right ? 14 : 0 }, {
          yPercent: right ? -6 : 0, ease: 'none',
          scrollTrigger: { trigger: card.closest('.sv-grid') ?? card, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
        })
      }
    })
  })
}

/** "Follow one enquiry": fill the rail with the scroll and light each station as the signal reaches it. */
function setupFlow(mm: gsap.MatchMedia) {
  const section = document.querySelector<HTMLElement>('.flow')
  if (!section) return
  const fill = section.querySelector<HTMLElement>('.flow-fill')
  const stations = gsap.utils.toArray<HTMLElement>('.flow .station')
  if (!fill || !stations.length) return
  const light = (p: number) => {
    stations.forEach((st, i) => st.classList.toggle('on', p >= (i / (stations.length - 1)) * 0.96 - 0.001 && p > 0.01))
  }

  mm.add({ wide: '(min-width: 1024px)', narrow: '(max-width: 1023px)' }, (ctx) => {
    section.classList.add('flow-live')
    light(0)
    if (ctx.conditions?.wide) {
      // pinned: the scroll drives the signal left to right
      gsap.fromTo(fill, { scaleX: 0, scaleY: 1 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: '.flow-pin', start: 'top top', end: '+=140%', pin: true, scrub: 0.6, onUpdate: (st) => light(st.progress) },
      })
    } else {
      // phones: the rail fills top to bottom as the list scrolls past
      gsap.fromTo(fill, { scaleY: 0, scaleX: 1 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.flow-track', start: 'top 70%', end: 'bottom 55%', scrub: 0.6, onUpdate: (st) => light(st.progress) },
      })
    }
    return () => { section.classList.remove('flow-live'); light(1) }
  })
}

function scrollToHash(hash: string, lenis: Lenis | null, smooth: boolean) {
  if (hash === '#top') {
    if (lenis) lenis.scrollTo(0, { duration: 1.4, immediate: !smooth })
    else window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
    return
  }
  let el: HTMLElement | null = null
  try { el = document.querySelector<HTMLElement>(hash) } catch { return }
  if (!el) return
  if (lenis) {
    // Sections can grow while we scroll past them (service cards expand), which leaves
    // Lenis with a stale scroll limit. Re-measure and correct once the scroll finishes.
    const target = el
    const settle = () => {
      lenis.resize()
      if (Math.abs(target.getBoundingClientRect().top + HEADER_OFFSET) > 4) {
        lenis.scrollTo(target, { offset: HEADER_OFFSET, duration: 0.6 })
      }
    }
    lenis.resize()
    lenis.scrollTo(el, { offset: HEADER_OFFSET, duration: smooth ? 1.4 : 0, immediate: !smooth, onComplete: settle })
    if (!smooth) requestAnimationFrame(settle)
  } else el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
  el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}
