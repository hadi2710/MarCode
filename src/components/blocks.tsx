import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { Blocks, Bot } from 'lucide-react'
import { ArrowIcon, CheckIcon } from './icons'
import { ServiceMock } from './mocks'
import { Label, SplitText } from './ui'
import { capabilities, processSteps, type Service } from '../data/site'
import { CAPABILITY_ICONS, FLOW_STATIONS, SERVICE_ICONS, STEP_ICONS, type Chip } from '../data/visuals'

export function HeroChips({ chips }: { chips: Chip[] }) {
  return (
    <div className="hero-chips" aria-hidden="true">
      {chips.slice(0, 6).map(({ icon: Icon, text }, i) => (
        <span key={text} className={`chip c${i + 1}`}><span className="chip-ic"><Icon /></span>{text}</span>
      ))}
    </div>
  )
}

/** Channels strip: moves sideways with the scroll. */
export function Ticker() {
  return (
    <section className="ticker" aria-label="Channels and tasks we automate">
      <ul className="ticker-track">
        {[...capabilities, ...capabilities].map((c, i) => {
          const Icon = CAPABILITY_ICONS[i % capabilities.length]
          return (
            <li key={i} className="tile" aria-hidden={i >= capabilities.length || undefined}>
              <Icon /><span>{c}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/**
 * "Follow one enquiry": a signal travels through five stations as you scroll
 * (left to right on desktop, top to bottom on phones). Every station is readable without motion.
 */
export function FlowSection() {
  return (
    <section className="block flow" id="flow" aria-labelledby="flow-title">
      <div className="container flow-pin">
        <div className="section-head center">
          <Label>Follow one enquiry</Label>
          <SplitText id="flow-title" text="From first message to *booked call.*" />
          <p data-anim="up">No one on your team touched this lead until it was already on the calendar.</p>
        </div>
        <div className="flow-track">
          <span className="flow-rail" aria-hidden="true"><span className="flow-fill" /></span>
          <ol className="flow-stations">
            {FLOW_STATIONS.map(({ icon: Icon, title, meta }, i) => (
              <li key={title} className="station" style={{ '--i': i } as CSSProperties}>
                <span className="station-dot" aria-hidden="true"><Icon strokeWidth={1.75} /></span>
                <span className="station-body">
                  <b>{title}</b>
                  <span>{meta}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/** "How we work": three overlapping cards. */
export function ProcessSection({ title = 'From first call to *live agent.*' }: { title?: string }) {
  return (
    <section className="block" id="process" aria-labelledby="process-title">
      <div className="container">
        <div className="section-head center">
          <Label>How we work</Label>
          <SplitText id="process-title" text={title} />
          <p data-anim="up">The harder the work behind the scenes, the more effortless it feels for your customer. Three steps, no surprises.</p>
        </div>
        <ol className="steps">
          {processSteps.map((st, i) => {
            const Icon = STEP_ICONS[st.id] ?? Blocks
            return (
              <li key={st.id} className={`step-card s${i + 1}`} data-anim="up">
                <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="step-icon" aria-hidden="true"><Icon strokeWidth={1.5} /></span>
                <h3>{st.title}</h3>
                <p>{st.text}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/** A "What we build" card linking to the service page. `n` is its 1-based number across all services. */
export function ServiceCard({ s, n, pos }: { s: Service; n: number; pos: number }) {
  const Icon = SERVICE_ICONS[s.id] ?? Bot
  return (
    <li className={`sv sv${pos}`}>
      <Link className="sv-card" to={`/services/${s.id}`} aria-labelledby={`sv-${s.id}`}>
        <ServiceMock id={s.id} />
        <span className="sv-top">
          <span className="sv-icon" aria-hidden="true"><Icon strokeWidth={1.75} /></span>
          <span className="sv-num" aria-hidden="true">{String(n).padStart(2, '0')}</span>
        </span>
        <h3 className="sv-title" id={`sv-${s.id}`}>{s.title}</h3>
        <p className="sv-text">{s.cardText}</p>
        <ul className="sv-points">
          {s.outcomes.slice(0, 3).map((o) => <li key={o}><CheckIcon />{o}</li>)}
        </ul>
        <span className="sv-more">Learn more <span className="sv-arrow"><ArrowIcon /></span></span>
      </Link>
    </li>
  )
}
