import { Fragment, useEffect, useRef, type AnchorHTMLAttributes, type ElementType } from 'react'
import { Link } from 'react-router'
import { ArrowIcon, Mark } from './icons'
import { canHover, prefersReducedMotion } from '../lib/motion'

type BtnProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
  children: string
  variant?: 'primary' | 'accent' | 'outline'
  small?: boolean
  block?: boolean
  /** Internal route (uses react-router Link) */
  to?: string
}

/** Pill button with text-roll label, fill-from-bottom hover and magnetic pull (mouse devices). */
export function Btn({ children, variant = 'primary', small, block, to, className = '', ...rest }: BtnProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const cls = ['btn', `btn-${variant}`, small && 'btn-sm', block && 'btn-block', className].filter(Boolean).join(' ')

  useEffect(() => {
    const el = ref.current
    const inner = innerRef.current
    if (!el || !inner || block || !canHover() || prefersReducedMotion()) return
    const ease = 'transform .5s cubic-bezier(.2,.8,.2,1)'
    const base = getComputedStyle(el).transition
    el.style.transition = (base ? base + ',' : '') + ease
    inner.style.transition = ease
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      el.style.transform = `translate(${dx * 0.3}px,${dy * 0.4}px)`
      inner.style.transform = `translate(${dx * 0.15}px,${dy * 0.2}px)`
    }
    const leave = () => { el.style.transform = ''; inner.style.transform = '' }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
      el.style.transition = ''
      leave()
    }
  }, [block])

  const content = (
    <span className="magnet-inner" ref={innerRef}>
      <span className="btn-label"><span data-t={children}>{children}</span></span>
      {variant !== 'outline' && <ArrowIcon className="arrow" />}
    </span>
  )

  if (to) return <Link ref={ref} to={to} className={cls} {...rest}>{content}</Link>
  return <a ref={ref} className={cls} {...rest}>{content}</a>
}

/**
 * Heading split into words so the scroll motion can fill them in one by one.
 * Wrap words in *asterisks* to set them in the italic serif accent, e.g. "Let’s put AI *to work for you.*"
 */
export function SplitText({ as: Tag = 'h2', text, id, className = '' }: { as?: ElementType; text: string; id?: string; className?: string }) {
  const words: Array<{ w: string; acc: boolean }> = []
  // split on ordinary spaces only (not \s), so a non-breaking space keeps two words together
  text.trim().split(/(\*[^*]+\*)/).filter(Boolean).forEach((part) => {
    const acc = part.startsWith('*') && part.endsWith('*')
    part.replace(/\*/g, '').trim().split(/[ \t\n]+/).filter(Boolean).forEach((w) => words.push({ w, acc }))
  })
  return (
    <Tag id={id} className={`split ${className}`.trim()} data-anim="split" aria-label={text.replace(/\*/g, '')}>
      {words.map(({ w, acc }, i) => (
        <Fragment key={i}>
          <span className={acc ? 'w acc' : 'w'} aria-hidden="true"><span>{w}</span></span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </Tag>
  )
}

/** Logo + wordmark. `href` starting with "#" scrolls on the current page; anything else is a route. */
export function Brand({ href }: { href: string }) {
  const inner = (
    <>
      <span className="mark"><Mark /></span>
      <span className="brand-text" aria-hidden="true">
        <span className="wm">Mar<span>code</span></span>
        <span className="tag">Growth</span>
      </span>
    </>
  )
  return href.startsWith('#')
    ? <a href={href} className="brand" aria-label="MarCode Growth home">{inner}</a>
    : <Link to={href} className="brand" aria-label="MarCode Growth home">{inner}</Link>
}

export function Label({ children }: { children: string }) {
  return <p className="label" data-anim="blur">{children}</p>
}
