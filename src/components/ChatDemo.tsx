import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckIcon, Mark, ReplayIcon } from './icons'
import { canHover, prefersReducedMotion } from '../lib/motion'

// Pause before each step appears (ms). Index 2 is the typing indicator.
const DELAYS = [300, 700, 900, 1500, 300, 1400, 1200, 900, 1500]
const TYPING_STEP = 2
const SLOTS_STEP = 7
const STEP_COUNT = DELAYS.length

/** "Website assistant" conversation that plays when scrolled into view, and replays each time it comes back. */
export default function ChatDemo() {
  const reduce = prefersReducedMotion()
  const [shown, setShown] = useState(reduce ? STEP_COUNT : 0)
  const [picked, setPicked] = useState(reduce)
  const timers = useRef<number[]>([])
  const chatRef = useRef<HTMLElement>(null)

  const play = useCallback(() => {
    timers.current.forEach(clearTimeout)
    // reset on the next tick (keeps state updates out of the effect body)
    timers.current = [window.setTimeout(() => { setShown(0); setPicked(false) }, 0)]
    let t = 0
    for (let i = 0; i < STEP_COUNT; i++) {
      t += DELAYS[i]
      timers.current.push(window.setTimeout(() => {
        setShown(i + 1)
        if (i === SLOTS_STEP) timers.current.push(window.setTimeout(() => setPicked(true), 850))
      }, t))
    }
  }, [])

  useEffect(() => {
    if (reduce) return
    const chat = chatRef.current!
    // play the first time it's seen, and again each time it comes back into view
    let ready = true
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) { ready = true; return }
      if (ready) { ready = false; play() }
    }, { threshold: 0.3 })
    io.observe(chat)

    // Gentle 3D tilt toward the mouse
    const hover = canHover()
    const move = (e: MouseEvent) => {
      const r = chat.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      chat.classList.add('tilting')
      chat.style.transform = `perspective(1000px) rotateY(${(px * 8).toFixed(2)}deg) rotateX(${(-py * 8).toFixed(2)}deg)`
    }
    const leave = () => { chat.classList.remove('tilting'); chat.style.transform = '' }
    if (hover) { chat.addEventListener('mousemove', move); chat.addEventListener('mouseleave', leave) }

    return () => {
      timers.current.forEach(clearTimeout)
      io.disconnect()
      chat.removeEventListener('mousemove', move)
      chat.removeEventListener('mouseleave', leave)
    }
  }, [play, reduce])

  const finished = shown >= STEP_COUNT && !reduce
  // A step is visible once reached; the typing dots disappear when the next message lands.
  const step = (i: number, cls: string) =>
    `${cls} step${i < shown && !(i === TYPING_STEP && shown > i + 1) && !(reduce && i === TYPING_STEP) ? ' show' : ''}`

  return (
    <figure
      className="chat"
      ref={chatRef}
      data-cursor-text="Replay"
      aria-label="Example conversation with an AI website assistant"
      onClick={() => { if (finished) play() }}
    >
      <figcaption className="sr-only">
        Example: a website visitor asks about a consultation at 11:42 pm. The AI assistant replies in 4 seconds, asks a qualifying
        question, offers time slots and books a call for Thursday at 3 pm, then adds the lead to the CRM.
      </figcaption>
      <div className="chat-head" aria-hidden="true">
        <Mark className="chat-mark" />
        <div><strong>Website assistant</strong><span className="status">Online now</span></div>
      </div>
      <div className="chat-body" aria-hidden="true">
        <span className={step(0, 'meta')}>Today, 11:42 pm</span>
        <div className={step(1, 'msg in')}>Hi, do you do consultations this week? Looking to get started soon.</div>
        <div className={step(2, 'typing')}><span /><span /><span /></div>
        <div className={step(3, 'msg out')}>Yes we do! Quick question so I can match you with the right person: is this for a business with more than 10 staff?</div>
        <span className={step(4, 'meta out')}>Replied in <span className="fast">4 seconds</span></span>
        <div className={step(5, 'msg in')}>Yes, about 25 of us.</div>
        <div className={step(6, 'msg out')}>Perfect. Here’s what’s open this week:</div>
        <div className={step(7, 'slots')}>
          <span className="slot">Wed 10:00 am</span>
          <span className={`slot${picked ? ' picked' : ''}`}>Thu 3:00 pm</span>
          <span className="slot">Fri 11:30 am</span>
        </div>
        <div className={step(8, 'booked')}>
          <CheckIcon strokeWidth={2.2} />
          <span>Call booked for Thu 3:00 pm. Lead added to CRM and your team notified.</span>
        </div>
      </div>
      <button
        className={`replay${finished ? ' visible' : ''}`}
        type="button"
        tabIndex={finished ? 0 : -1}
        aria-label="Replay the example conversation"
        onClick={(e) => { e.stopPropagation(); play() }}
      >
        <ReplayIcon />Replay
      </button>
    </figure>
  )
}
