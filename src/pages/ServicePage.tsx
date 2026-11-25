import { Link, Navigate, useParams } from 'react-router'
import { Bot, CircleAlert } from 'lucide-react'
import { HeroChips, ProcessSection, ServiceCard, Ticker } from '../components/blocks'
import { SERVICE_EXTRAS, SERVICE_ICONS } from '../data/visuals'
import { ServiceMock } from '../components/mocks'
import { ContactSection, FaqSection } from '../components/Sections'
import { ArrowLeftIcon, CheckIcon } from '../components/icons'
import { Btn, Label, SplitText } from '../components/ui'
import { faqs, services, type Service } from '../data/site'
import { useDocumentTitle } from '../hooks/use-document-title'

export default function ServicePage() {
  const { id } = useParams<{ id: string }>()
  const index = services.findIndex((item) => item.id === id)
  if (index < 0) return <Navigate to="/" replace />
  // key forces a fresh mount (and fresh scroll motion) when switching between services
  return <ServicePageContent key={services[index].id} service={services[index]} index={index} />
}

/**
 * Split a headline into a bold line and an italic accent line:
 * at the first sentence break, else at the first comma, else before the last four words.
 * "Every enquiry answered. Every opportunity captured." -> ["Every enquiry answered.", "Every opportunity captured."]
 */
function splitHeadline(text: string): [string, string] {
  for (const sep of ['. ', ', ']) {
    const i = text.indexOf(sep)
    if (i > 0) return [text.slice(0, i + 1), text.slice(i + 2)]
  }
  const words = text.split(' ')
  return words.length > 6 ? [words.slice(0, -4).join(' '), words.slice(-4).join(' ')] : [text, '']
}

/** Lowercase for mid-sentence use, but keep acronyms: "Growth systems" -> "growth systems", "AI agents" stays. */
const inSentence = (t: string) => (/^[A-Z]{2,}\b/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1))

function ServicePageContent({ service, index }: { service: Service; index: number }) {
  useDocumentTitle(`${service.title} | MarCode Growth`, service.description)
  const relatedFaqs = faqs.filter((faq) => service.relatedFaqIds.includes(faq.id))
  const others = services.map((s, i) => ({ s, n: i + 1 })).filter(({ s }) => s.id !== service.id)
  const extras = SERVICE_EXTRAS[service.id]
  const Icon = SERVICE_ICONS[service.id] ?? Bot
  const [line1, line2] = splitHeadline(service.summary)
  const num = String(index + 1).padStart(2, '0')

  return (
    <>
      {/* Hero sticks while the overview panel slides up over it (desktop) */}
      <div className="hero-stack">
        <section className="hero hero-home hero-svc" aria-labelledby="service-title">
          {extras && <HeroChips chips={extras.chips} />}
          <div className="container hero-inner">
            <Link className="back-link" to="/#solutions"><ArrowLeftIcon /> All services</Link>
            <span className="svc-badge"><span className="svc-badge-ic" aria-hidden="true"><Icon strokeWidth={1.75} /></span>{service.title}</span>
            <h1 id="service-title" aria-label={service.summary}>
              <span aria-hidden="true">
                <span className="line1">{line1}</span>
                {line2 && <span className="line2 acc">{line2}</span>}
              </span>
            </h1>
            <p className="lead">{service.description}</p>
            <div className="hero-actions">
              <Btn variant="primary" href="#contact">Book a strategy call</Btn>
              <Btn variant="outline" href="#overview">See what you get</Btn>
            </div>
          </div>
        </section>

        {/* Problem + outcomes: first panel over the hero */}
        <section className="panel overview" id="overview" aria-labelledby="overview-title">
          <div className="container">
            <div className="overview-top">
              <div className="section-head">
                <Label>Why it matters</Label>
                <SplitText id="overview-title" text="Built for the outcome, *not just the feature.*" />
                <div className="problem-card" data-anim="up">
                  <span className="problem-ic" aria-hidden="true"><CircleAlert strokeWidth={1.75} /></span>
                  <div>
                    <b>The problem today</b>
                    <p>{service.problem}</p>
                  </div>
                </div>
              </div>
              <div className="svc-hero-card" data-anim="up" aria-hidden="true">
                <ServiceMock id={service.id} tone="dark" />
                <span className="svc-hero-num">{num}</span>
                <span className="svc-hero-name">{service.title}</span>
              </div>
            </div>

            <h3 className="outcomes-title" data-anim="up">What you get</h3>
            <ul className="outcome-grid">
              {service.outcomes.map((o, i) => {
                const OIcon = extras?.outcomeIcons[i]
                return (
                  <li key={o} className="outcome" data-anim="up">
                    <span className="ic-badge" aria-hidden="true">{OIcon ? <OIcon /> : <CheckIcon />}</span>
                    <b>{o}</b>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </div>

      <Ticker />
      <ProcessSection />

      <section className="block services" id="solutions" aria-labelledby="more-title">
        <div className="container">
          <div className="services-head">
            <div className="section-head">
              <Label>Explore more</Label>
              <SplitText id="more-title" text="Works even better *together.*" />
            </div>
            <p className="services-intro">Each service fixes a different part of the gap between enquiry and reply. Most teams start with one and add the rest as they grow.</p>
          </div>
          <ul className="sv-grid three">
            {others.map(({ s, n }, i) => <ServiceCard key={s.id} s={s} n={n} pos={i + 1} />)}
          </ul>
        </div>
      </section>

      {relatedFaqs.length > 0 && (
        <FaqSection faqs={relatedFaqs} id="service-faq" label="Good questions" title={`About *${inSentence(service.title)}*`} />
      )}
      <ContactSection title={`Let’s build your *${inSentence(service.title)}.*`} />
    </>
  )
}
