import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { ChatIcon, CloseIcon, Mark } from './icons'
import { Btn } from './ui'
import { CALENDLY_URL, EMAIL } from '../data/site'
import { prefersReducedMotion } from '../lib/motion'

// ===== Scripted chat assistant (no server, no API key) =====

type Lead = { biz?: string; vol?: string; chan?: string }
/** [label, next node id, optional lead field to store the label in] */
type Opt = [label: string, next: string, field?: keyof Lead]
type Node = { say: string[] | ((l: Lead) => string[]); opts?: Opt[]; card?: boolean }

const MENU: Opt[] = [['What do you build?', 'build'], ['Which fits my business?', 'q_biz'], ['How long does it take?', 'timeline'], ['What does it cost?', 'pricing'], ['More questions', 'menu'], ['Book a free call', 'book']]
const MORE: Opt[] = [['Does it work with my tools?', 'tools'], ['Is our data safe?', 'data'], ['What if the AI can’t answer?', 'handover'], ['Talk to a person', 'human'], ['What do you build?', 'build'], ['What does it cost?', 'pricing'], ['Book a free call', 'book']]
const AFTER: Opt[] = [['Book a free call', 'book'], ['Other questions', 'menu']]
const mail = `<a href="mailto:${EMAIL}">${EMAIL}</a>`

// Bot lines are HTML we author ourselves; user choices are rendered as plain text.
const FLOW: Record<string, Node> = {
  start: { say: ['Hi, I’m the MarCode assistant 👋', 'I can answer quick questions or help you book a free 30-minute strategy call. Pick an option below.'], opts: MENU },
  menu: { say: ['Sure, what else would you like to know?'], opts: MORE },
  build: {
    say: ['We build four things:',
      '<b>AI chatbots</b> that answer on your website, qualify leads and book meetings 24/7.<br><b>AI agents</b> that act: follow up, update your CRM, send reminders.<br><b>Workflow automation</b> that connects your CRM, inbox, forms and spreadsheets.<br><b>Growth systems</b> for lead scoring, outreach and reporting.',
      'Want me to suggest what would help your business most?'],
    opts: [['Yes, let’s find out', 'q_biz'], ['Book a free call', 'book'], ['Other questions', 'menu']],
  },
  timeline: { say: ['Most projects go live in <b>two to four weeks</b>: an audit in week 1, design in weeks 1–2, then build and testing in weeks 2–4.', 'After launch we tune the agent every month from real conversations.'], opts: AFTER },
  pricing: { say: ['Every project is scoped to your enquiry flow and the tools we connect, so we quote after a free audit call rather than guess.', 'On the call we’ll show you where an agent saves the most time, and you’ll get a clear plan either way.'], opts: [['Book the free audit call', 'book'], ['What do you build?', 'build'], ['Other questions', 'menu']] },
  tools: { say: ['Yes. We deploy on your <b>website, email inbox, CRM and calendars</b>, so your team keeps working the way it does today.', 'We confirm every integration during the audit before anything is built.'], opts: AFTER },
  handover: { say: ['Whenever the AI can’t help, or a customer asks for a person, the conversation goes to the right person on your team with the full history attached. No dead ends.'], opts: AFTER },
  data: { say: ['Your agent only accesses the systems you approve, with the minimum permissions it needs.', 'We agree what it can see and store during design, and you keep full ownership of every conversation.'], opts: AFTER },
  human: { say: [`Happy to connect you with the team. The quickest way is a free call, or you can email ${mail} and a person will reply within one working day.`], opts: [['Book a free call', 'book'], ['Other questions', 'menu']] },

  // Qualifying flow
  q_biz: { say: ['Great. What kind of business are you?'], opts: [['Clinic or salon', 'q_vol', 'biz'], ['Real estate', 'q_vol', 'biz'], ['E-commerce', 'q_vol', 'biz'], ['Agency or B2B', 'q_vol', 'biz'], ['Something else', 'q_vol', 'biz']] },
  q_vol: { say: ['Roughly how many enquiries do you get per week?'], opts: [['Under 20', 'q_chan', 'vol'], ['20 to 100', 'q_chan', 'vol'], ['100+', 'q_chan', 'vol']] },
  q_chan: { say: ['And where do most of them arrive?'], opts: [['Website', 'q_done', 'chan'], ['Email', 'q_done', 'chan'], ['Instagram or social', 'q_done', 'chan'], ['Phone', 'q_done', 'chan']] },
  q_done: {
    say: (l) => {
      const biz = (l.biz || '').toLowerCase()
      let tip = 'an agent that replies to every enquiry in seconds, qualifies it and books the call'
      if (/clinic|salon/.test(biz)) tip = 'an assistant that answers instantly and books straight into your calendar while staff are with clients'
      else if (/real estate/.test(biz)) tip = 'an agent that contacts portal leads within seconds, qualifies budget and area, and hands them over warm'
      else if (/e-commerce/.test(biz)) tip = 'an assistant that handles order and returns questions instantly so only real issues reach your team'
      else if (/agency|b2b/.test(biz)) tip = 'automated follow-ups and a CRM that logs every conversation, so no warm lead goes quiet'
      const chan = ({ Website: 'your website', Email: 'your email inbox', Phone: 'calls and texts', 'Instagram or social': 'Instagram and social' } as Record<string, string>)[l.chan || ''] || l.chan || 'your main channel'
      const urgency = l.vol === '100+' ? ' At that volume, even small reply delays cost real deals.' : l.vol === '20 to 100' ? ' At that volume, instant replies usually pay back quickly.' : ''
      return [`Thanks! For your business, the biggest win is usually <b>${tip}</b>, starting on ${chan}.${urgency}`, 'The next step is a free 30-minute call where we map it out for you.']
    },
    opts: [['Book my free call', 'book'], ['Other questions', 'menu']],
  },
  book: { say: ['Perfect. Pick a time that suits you:'], card: true, opts: [['Other questions', 'menu']] },
  fallback: { say: [`The team can answer that properly on a quick call, or by email at ${mail}.`], opts: MENU },
}

type Item =
  | { key: number; kind: 'bot'; html: string }
  | { key: number; kind: 'me'; text: string }
  | { key: number; kind: 'typing' }
  | { key: number; kind: 'card' }
  | { key: number; kind: 'qr'; opts: Opt[] }

type NewItem = Item extends infer T ? (T extends Item ? Omit<T, 'key'> : never) : never

const store = {
  get: (k: string) => { try { return sessionStorage.getItem(k) } catch { return null } },
  set: (k: string, v: string) => { try { sessionStorage.setItem(k, v) } catch { /* storage blocked */ } },
}

export default function ChatBot() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const started = useRef(false)
  const busy = useRef(false)
  const lead = useRef<Lead>({})
  const nextKey = useRef(0)
  const alive = useRef(true)
  const logRef = useRef<HTMLDivElement>(null)
  const launchRef = useRef<HTMLButtonElement>(null)
  const root = document.documentElement

  const push = useCallback((item: NewItem) => setItems((list) => [...list, { ...item, key: nextKey.current++ } as Item]), [])
  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, prefersReducedMotion() ? 0 : ms))

  const go = useCallback(async (id: string) => {
    const node = FLOW[id] || FLOW.fallback
    const lines = typeof node.say === 'function' ? node.say(lead.current) : node.say
    busy.current = true
    setItems((list) => list.filter((it) => it.kind !== 'qr'))
    for (const line of lines) {
      push({ kind: 'typing' })
      await wait(Math.min(450 + line.length * 9, 1300))
      if (!alive.current) return
      setItems((list) => list.filter((it) => it.kind !== 'typing'))
      push({ kind: 'bot', html: line })
      await wait(180)
      if (!alive.current) return
    }
    if (node.card) push({ kind: 'card' })
    if (node.opts) push({ kind: 'qr', opts: node.opts })
    busy.current = false
  }, [push])

  const openBot = useCallback(() => {
    setTeaser(false)
    store.set('bot-teaser', '1')
    store.set('bot-seen', '1')
    root.classList.add('bot-open', 'bot-seen')
    setOpen(true)
    if (!started.current) { started.current = true; go('start') }
    // keyboard users land on the first option once it appears
    setTimeout(() => {
      const q = logRef.current?.querySelector<HTMLButtonElement>('.bot-qr button')
      if (q && document.activeElement === launchRef.current) q.focus({ preventScroll: true })
    }, 2600)
  }, [go, root])

  const closeBot = useCallback(() => {
    root.classList.remove('bot-open')
    setOpen(false)
    launchRef.current?.focus({ preventScroll: true })
  }, [root])

  // Mount: restore "seen" state, schedule the teaser, Escape to close
  useEffect(() => {
    alive.current = true
    if (store.get('bot-seen')) root.classList.add('bot-seen')
    const t = store.get('bot-teaser') ? 0 : window.setTimeout(() => { if (!root.classList.contains('bot-open')) setTeaser(true) }, 6000)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && root.classList.contains('bot-open')) closeBot() }
    document.addEventListener('keydown', onKey)
    return () => {
      alive.current = false
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      root.classList.remove('bot-open', 'over-footer')
    }
  }, [closeBot, root])

  // Swap the launcher to white while a black area is behind it
  useEffect(() => {
    const dark = document.querySelectorAll('.stats, #team, .cta, footer')
    if (!dark.length) return
    const behind = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? behind.add(en.target) : behind.delete(en.target)))
      root.classList.toggle('over-footer', behind.size > 0)
    }, { rootMargin: '-88% 0px -4% 0px' })
    dark.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname, root])

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [items])

  const choose = (o: Opt) => {
    if (busy.current) return
    if (o[2]) lead.current[o[2]] = o[0]
    push({ kind: 'me', text: o[0] })
    go(o[1])
  }

  return (
    <div className="bot-wrap">
      <div
        className={`bot-teaser${teaser ? ' show' : ''}`}
        role="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={openBot}
      >
        Hi! Want to see where an AI agent could save your team time?
        <button type="button" aria-label="Dismiss" tabIndex={-1} onClick={(e) => { e.stopPropagation(); setTeaser(false); store.set('bot-teaser', '1') }}>×</button>
      </div>

      <section className="bot" id="bot" role="dialog" aria-label="MarCode assistant" aria-modal="false">
        <div className="bot-head">
          <Mark className="bot-mark" />
          <div><strong>MarCode assistant</strong><span className="status">Replies instantly</span></div>
          <button className="x" type="button" aria-label="Close chat" onClick={closeBot}><CloseIcon /></button>
        </div>
        <div className="bot-log" ref={logRef} aria-live="polite" data-lenis-prevent="">
          {items.map((it) => {
            switch (it.kind) {
              case 'bot': return <div key={it.key} className="msg in" dangerouslySetInnerHTML={{ __html: it.html }} />
              case 'me': return <div key={it.key} className="msg out">{it.text}</div>
              case 'typing': return <div key={it.key} className="typing"><span /><span /><span /></div>
              case 'card': return (
                <div key={it.key} className="bot-card">
                  <strong>Free 30-minute strategy call</strong>
                  <p>Video call. You’ll get a clear plan for where AI saves your team the most time.</p>
                  <Btn variant="primary" block href={CALENDLY_URL} target="_blank" rel="noopener">Choose a time</Btn>
                </div>
              )
              case 'qr': return (
                <div key={it.key} className="bot-qr">
                  {it.opts.map((o) => <button key={o[0]} type="button" onClick={() => choose(o)}>{o[0]}</button>)}
                </div>
              )
            }
          })}
        </div>
        <p className="bot-note">Pick an option above. For anything detailed, book a call.</p>
      </section>

      <button
        className="bot-launch"
        ref={launchRef}
        type="button"
        aria-controls="bot"
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={() => (open ? closeBot() : openBot())}
      >
        <ChatIcon className="ic-chat" />
        <CloseIcon className="ic-close" strokeWidth={2.2} />
        <span className="bot-dot" aria-hidden="true" />
      </button>
    </div>
  )
}
