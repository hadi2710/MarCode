import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
import { Brand, Btn } from './ui'

const NAV = [
  { href: '#solutions', label: 'Services' },
  { href: '#process', label: 'How we work' },
  { href: '#team', label: 'Founders' },
  { href: '#faq', label: 'FAQ' },
]

/** Floating pill header: logo, section links (desktop), one CTA, plus the scroll progress bar. */
export default function Header() {
  const isHome = useLocation().pathname === '/'
  const headerRef = useRef<HTMLElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false
    const update = () => {
      ticking = false
      const y = window.scrollY
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (barRef.current) barRef.current.style.transform = `scaleX(${h > 0 ? y / h : 0})`
      headerRef.current?.classList.toggle('scrolled', y > 10)
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="progress" ref={barRef} aria-hidden="true" />
      <header id="top" ref={headerRef}>
        <div className="container">
          <div className="header-inner">
            <Brand href={isHome ? '#top' : '/'} />
            <nav className="nav" aria-label="Main">
              {NAV.map((n) => (
                <a key={n.href} href={isHome ? n.href : `/${n.href}`} className="nav-link">
                  <span data-t={n.label}>{n.label}</span>
                </a>
              ))}
            </nav>
            <Btn variant="accent" small href="#contact">Book a call</Btn>
          </div>
        </div>
      </header>
    </>
  )
}
