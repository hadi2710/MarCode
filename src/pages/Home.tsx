import type { CSSProperties } from 'react'
import { CalendarCheck, Filter, Zap } from 'lucide-react'
import ChatDemo from '../components/ChatDemo'
import Stats from '../components/Stats'
import { FlowSection, HeroChips, ProcessSection, ServiceCard, Ticker } from '../components/blocks'
import { HOME_CHIPS } from '../data/visuals'
import { ContactSection, FaqSection } from '../components/Sections'
import { CheckIcon, LinkedInIcon, VerifiedIcon, XIcon } from '../components/icons'
import { Btn, Label, SplitText } from '../components/ui'
import { faqs, founders, gains, homeFaqIds, painPoints, services } from '../data/site'
import { useDocumentTitle } from '../hooks/use-document-title'

const d = (s: number | string) => ({ '--d': typeof s === 'number' ? `${s.toFixed(2)}s` : s }) as CSSProperties

export default function Home() {
  useDocumentTitle(
    'MarCode Growth | AI chatbots, AI agents and automation',
    'MarCode Growth builds AI chatbots, AI agents and workflow automations that reply to every enquiry in seconds, qualify leads and book meetings for you.',
  )
  const homeFaqs = homeFaqIds.map((id) => faqs.find((f) => f.id === id)!).filter(Boolean)

  return (
    <>
      {/* Hero sticks while the demo panel slides up over it (desktop) */}
      <div className="hero-stack">
      <section className="hero hero-home" aria-labelledby="hero-title">
        <HeroChips chips={HOME_CHIPS} />
        <div className="container hero-inner">
          <Label>AI chatbots, AI agents and automation</Label>
          <h1 id="hero-title" aria-label="Your next hire isn’t a person.">
            <span aria-hidden="true">
              <span className="line1">Your next hire</span>
              <span className="line2 acc">isn’t a person.</span>
            </span>
          </h1>
          <p className="lead">
            We build AI agents that reply to every enquiry in seconds, qualify the lead and book the meeting, day or night, so your team only talks to people ready to buy.
          </p>
          <div className="hero-actions">
            <Btn variant="primary" href="#contact">Book a strategy call</Btn>
            <Btn variant="outline" href="#solutions">See what we build</Btn>
          </div>
          <ul className="hero-proof">
            <li><CheckIcon />Live in two to four weeks</li>
            <li><CheckIcon />Works with your existing tools</li>
            <li><CheckIcon />Human handover built in</li>
          </ul>
        </div>
      </section>

      {/* Product demo: first panel over the hero */}
      <section className="panel demo" id="demo" aria-labelledby="demo-title">
        <div className="container demo-inner">
          <div className="section-head">
            <Label>See it in action</Label>
            <SplitText id="demo-title" text={'A lead at 11:42\u00a0pm. *Booked before midnight.*'} />
            <ul className="demo-points">
              <li data-anim="up"><span className="ic-badge"><Zap /></span><div><b>Replies in seconds</b><span>Answers from your approved business knowledge, on your website and WhatsApp.</span></div></li>
              <li data-anim="up"><span className="ic-badge"><Filter /></span><div><b>Qualifies the lead</b><span>Asks the questions your sales team would, and routes the good ones.</span></div></li>
              <li data-anim="up"><span className="ic-badge"><CalendarCheck /></span><div><b>Books the meeting</b><span>Offers real times from your calendar and updates the CRM.</span></div></li>
            </ul>
          </div>
          <div className="demo-visual"><ChatDemo /></div>
        </div>
      </section>
      </div>

      {/* What we build: cards float up and fade in as the section scrolls into view */}
      <section className="block services" id="solutions" aria-labelledby="solutions-title">
        <div className="container">
          <div className="services-head">
            <div className="section-head">
              <Label>What we build</Label>
              <SplitText id="solutions-title" text="Four ways we *close the gap.*" />
            </div>
            <p className="services-intro">Most teams lose deals between the enquiry and the reply. Each of these fixes a different part of that gap, and they work together.</p>
          </div>
          <ul className="sv-grid">
            {services.map((s, i) => <ServiceCard key={s.id} s={s} n={i + 1} pos={i + 1} />)}
          </ul>
        </div>
      </section>

      <FlowSection />
      <Ticker />

      <ProcessSection />

      <section className="block tight" id="why" aria-labelledby="why-title">
        <div className="container">
          <div className="section-head">
            <Label>Sound familiar?</Label>
            <SplitText id="why-title" text="You’re not short on leads. *You’re losing them after they arrive.*" />
          </div>
          <div className="compare">
            <div className="col cons" data-anim="left">
              <h3>Without an AI agent</h3>
              <p className="sub">Where most growing teams are today</p>
              <ul>
                {painPoints.map((p, i) => (
                  <li key={p.title} style={d(0.27 + i * 0.12)}>
                    <span className="ic" aria-hidden="true"><XIcon /></span>
                    <div><b>{p.title}</b><span className="t">{p.text}</span></div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col pros" data-anim="right">
              <h3>With MarCode Growth</h3>
              <p className="sub">What changes once your agent is live</p>
              <ul>
                {gains.map((g, i) => (
                  <li key={g.title} style={d(0.27 + i * 0.12)}>
                    <span className="ic" aria-hidden="true"><CheckIcon strokeWidth={3} /></span>
                    <div><b>{g.title}</b><span className="t">{g.text}</span></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Stats />

      <section className="block" id="team" aria-labelledby="team-title">
        <div className="container">
          <div className="section-head">
            <Label>Meet the founders</Label>
            <SplitText id="team-title" text="The people *behind your agents.*" />
          </div>
          <div className="founder-grid">
            {founders.map((f) => (
              <article className="founder" key={f.name} data-anim="up">
                <div className="photo">
                  {f.photo
                    ? <img src={f.photo} style={f.photoFocus ? { objectPosition: f.photoFocus } : undefined} alt={`${f.name}, ${f.role} of MarCode Growth`} width={880} height={1100} loading="lazy" />
                    : <span className="initials" aria-hidden="true">{f.initials}</span>}
                </div>
                <div className="body">
                  <blockquote>{f.quote}</blockquote>
                  <div className="who">
                    <p>
                      <strong>{f.name}<VerifiedIcon className="verified" /><span className="sr-only">(verified)</span></strong>
                      <span>{f.role}</span>
                    </p>
                    {f.linkedin && <a className="li" href={f.linkedin} target="_blank" rel="noopener" aria-label={`${f.name} on LinkedIn`}><LinkedInIcon /></a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FaqSection faqs={homeFaqs} title="Questions we *hear a lot*" />
      <ContactSection />
    </>
  )
}
