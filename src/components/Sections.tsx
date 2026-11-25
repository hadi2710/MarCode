import type { CSSProperties } from 'react'
import { CALENDLY_URL, EMAIL, type Faq } from '../data/site'
import { CalendarIcon, CheckIcon, ClockIcon, Mark, VideoIcon } from './icons'
import { Btn, Label, SplitText } from './ui'

export function FaqSection({ faqs, title, label = 'FAQ', id = 'faq' }: { faqs: Faq[]; title: string; label?: string; id?: string }) {
  return (
    <section className="block tight faq-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="container faq-wrap">
        <div className="section-head">
          <Label>{label}</Label>
          <SplitText id={`${id}-title`} text={title} />
          <p data-anim="up">Can’t find what you’re looking for? Ask us directly and a person will reply within one working day.</p>
          <Btn variant="outline" href="#contact" data-anim="up">Ask a question</Btn>
        </div>
        <div className="faq">
          {faqs.map((faq, i) => (
            <details key={faq.id} data-anim="up" style={{ '--d': `${(i * 0.06).toFixed(2)}s` } as CSSProperties}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ContactSection({ title = 'Let’s put AI *to work for you.*' }: { title?: string }) {
  return (
    <section className="cta" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="cta-box" data-anim="up">
          <div className="cta-copy" data-cursor-text="Let’s talk">
            <SplitText id="contact-title" text={title} />
            <p>Book a free 30-minute strategy call. We’ll look at how enquiries reach you today and show you where an agent would save the most time.</p>
            <ul className="cta-points">
              <li><CheckIcon />No commitment, no hard sell</li>
              <li><CheckIcon />A clear plan you can use even if you don’t hire us</li>
              <li><CheckIcon />Instant booking confirmation</li>
            </ul>
            <p className="cta-mail">Prefer email? <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
          </div>

          <div className="book">
            <div className="book-head">
              <span className="cal"><CalendarIcon /></span>
              <div><h3>Free strategy call</h3><p>Pick a time that suits you</p></div>
            </div>
            <ul className="book-meta">
              <li><ClockIcon />30 minutes</li>
              <li><VideoIcon />Video call, link sent on booking</li>
              <li><CheckIcon strokeWidth={2} />Walk away with a clear automation plan</li>
            </ul>
            <Btn variant="primary" href={CALENDLY_URL} target="_blank" rel="noopener">Choose a time</Btn>
            <p className="fine">Opens Calendly in a new tab. No payment, no commitment.</p>
          </div>
          <Mark className="cta-mark" />
        </div>
      </div>
    </section>
  )
}
