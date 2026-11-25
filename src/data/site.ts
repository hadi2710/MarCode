export const CALENDLY_URL = 'https://calendly.com/bd-marcodegrowth/30min'
export const EMAIL = 'bd.marcodegrowth@gmail.com'

export type Service = {
  id: string
  title: string
  /** Short text shown on the expanded card on the home page */
  cardText: string
  summary: string
  description: string
  problem: string
  outcomes: string[]
  relatedFaqIds: string[]
}

export const services: Service[] = [
  {
    id: 'chatbots',
    title: 'AI chatbots',
    cardText:
      'Website assistants that answer every enquiry in seconds, qualify the lead and book the meeting, day or night. Your team only talks to people who are ready to buy.',
    summary: 'Every enquiry answered. Every opportunity captured.',
    description:
      'Website and WhatsApp assistants that answer questions from your approved business knowledge, qualify the lead and book the meeting, day or night.',
    problem:
      'Most enquiries land after hours or sit in a shared inbox. By the time someone replies, the lead has already asked a competitor, or stopped looking.',
    outcomes: ['Instant, on-brand replies', 'Lead qualification and routing', 'Calendar booking and human handover', 'Works on your website and WhatsApp'],
    relatedFaqIds: ['handover', 'transparency', 'noTechTeam'],
  },
  {
    id: 'automation',
    title: 'Workflow automation',
    cardText:
      'We connect your CRM, inbox, forms and spreadsheets so repetitive work runs itself. A new form fill creates the contact, assigns an owner and sends the follow-up automatically.',
    summary: 'The repetitive work, quietly taken care of.',
    description:
      'We connect your CRM, inbox, forms and spreadsheets so information moves without copy-pasting, forgotten follow-ups or manual admin.',
    problem:
      'Leads and customer details live across inboxes, spreadsheets and someone’s memory. Updates get missed, and nobody notices until a customer complains.',
    outcomes: ['CRM and inbox synchronization', 'Automatic ownership and follow-up', 'Documented, editable workflows', 'No new tools to learn'],
    relatedFaqIds: ['fit', 'dataSafety', 'support'],
  },
  {
    id: 'agents',
    title: 'AI agents',
    cardText:
      'Agents that don’t just talk, they act: chasing leads who went quiet, updating your CRM, sending reminders and moving deals forward on their own.',
    summary: 'Not just a conversation. Real work, completed.',
    description:
      'Agents that chase quiet leads, update records, send reminders and move deals forward, with clear permissions and escalation rules.',
    problem:
      'Good leads go cold because nobody has time to follow up a third or fourth time. The work is repetitive, but it still needs doing, every single day.',
    outcomes: ['Multi-step task execution', 'Approved data and tool access', 'Full transcripts and activity logs', 'Escalates to a human when needed'],
    relatedFaqIds: ['dataSafety', 'improvement', 'results'],
  },
  {
    id: 'growth',
    title: 'Growth systems',
    cardText:
      'Lead scoring, personalised outreach and reporting built on your own data, so your sales team always knows which leads to call first.',
    summary: 'Marketing and operations finally working as one.',
    description:
      'Lead scoring, personalised outreach and plain-language reporting built on your own data, so your team knows exactly where to focus next.',
    problem:
      'Marketing brings in leads, sales can’t tell which ones are worth chasing, and nobody can say for certain what actually drove the last closed deal.',
    outcomes: ['Lead scoring and segmentation', 'Personalised nurture sequences', 'Conversion-focused reporting', 'One shared view of the pipeline'],
    relatedFaqIds: ['results', 'pricing', 'improvement'],
  },
]

export type Founder = {
  name: string
  role: string
  initials: string
  /** Optional: the LinkedIn icon is hidden when this is missing */
  linkedin?: string
  quote: string
  /** Path under public/, e.g. '/assets/name.jpeg' */
  photo?: string
  /** CSS object-position for the 4:5 photo frame (keeps the head near the top third) */
  photoFocus?: string
}

export const founders: Founder[] = [
  {
    name: 'Abdullah Iftikhar',
    role: 'Founder & CEO',
    initials: 'AI',
    linkedin: 'https://www.linkedin.com/in/abdullah-iftikhaar/',
    photo: '/assets/abdullah-iftikhar.jpeg',
    photoFocus: '50% 0%',
    quote:
      'We didn’t build MarCode Growth to follow the agency model. We built it to rethink it, bringing strategy, marketing, AI and automation together into one intelligent growth system designed to move businesses forward.',
  },
  {
    name: 'Aisha Yousaf',
    role: 'Founder & CTO',
    initials: 'AY',
    linkedin: 'https://www.linkedin.com/in/aisha-yousaf-ghl/',
    photo: '/assets/aisha-yousaf.jpeg',
    photoFocus: '50% 0%',
    quote:
      'Growth becomes scalable when technology, data and automation work together. At MarCode Growth, we focus on building intelligent systems that eliminate inefficiencies, unlock better decisions and give businesses the infrastructure to grow.',
  },
  {
    name: 'Muhammad Hassaan Bin Rauf',
    role: 'Founder & Director of Business Development',
    initials: 'MH',
    linkedin: 'https://www.linkedin.com/in/mhassaanbinrauf/',
    photo: '/assets/hassaan-bin-rauf.jpeg',
    photoFocus: '50% 0%',
    quote:
      'Real growth begins where ambition meets execution. At MarCode Growth, we turn bold ideas into intelligent strategies, meaningful opportunities and businesses built to move forward.',
  },
]

/** "How we work": three steps, drawn from the timeline and support answers in the FAQ */
export const processSteps = [
  {
    id: 'audit',
    title: 'Audit',
    text: 'We map how enquiries reach you today, where leads slip through and which tasks eat your team’s week.',
  },
  {
    id: 'build',
    title: 'Build & connect',
    text: 'We design your agent on your approved business knowledge and connect it to your website, inbox and CRM.',
  },
  {
    id: 'improve',
    title: 'Launch & improve',
    text: 'You go live in two to four weeks. Every month we review real conversations, tune the answers and report back in plain language.',
  },
]

/** Channels and jobs an agent covers (moving strip on the home page) */
export const capabilities = [
  'Website chat', 'WhatsApp', 'Email inbox', 'CRM sync', 'Calendar booking',
  'Lead scoring', 'Follow-ups', 'Reporting', 'Human handover',
]

export type Faq = { id: string; question: string; answer: string }

export const faqs: Faq[] = [
  {
    id: 'timeline',
    question: 'How long does it take to go live?',
    answer: 'Most projects take two to four weeks from the audit to a live agent, depending on how many channels and tools we connect.',
  },
  {
    id: 'fit',
    question: 'Will it work with the tools we already use?',
    answer: 'That is the point. We deploy on your website, inbox and CRM, so your team keeps working the way it does today. We confirm every integration during the audit.',
  },
  {
    id: 'handover',
    question: 'What happens when the AI can’t answer something?',
    answer: 'We design a handover so the conversation goes to the right person on your team, with the full history attached, instead of the customer getting a dead end.',
  },
  {
    id: 'dataSafety',
    question: 'Is our customer data safe?',
    answer: 'Your agent only accesses the systems you approve, with the minimum permissions it needs. We agree what data it can see and store during the design phase, and you keep full ownership of every conversation.',
  },
  {
    id: 'transparency',
    question: 'Will customers know they’re talking to AI?',
    answer: 'We recommend being upfront about it. The agent introduces itself as an assistant and offers a person whenever the customer asks for one.',
  },
  {
    id: 'improvement',
    question: 'Does it keep improving after launch?',
    answer: 'Yes. Each month we review real conversations, tune the answers and automations, and send you a report in plain language.',
  },
  {
    id: 'pricing',
    question: 'What does this cost?',
    answer: 'It depends on how many channels and tools we connect. We scope a fixed build price and a monthly care plan during the free strategy call, so you have a clear number before committing to anything.',
  },
  {
    id: 'support',
    question: 'What support do we get after launch?',
    answer: 'Every build includes a documented handover and a support window to fix issues and tune responses. Ongoing care plans are available if you want us to keep monitoring and improving the system.',
  },
  {
    id: 'noTechTeam',
    question: 'We don’t have an in-house tech team. Can we still do this?',
    answer: 'Yes. Most clients don’t. We handle the technical build, explain decisions in plain language, and document everything so your team can run day-to-day without needing a developer.',
  },
  {
    id: 'results',
    question: 'How do you measure whether it is working?',
    answer: 'We agree the metrics that matter before launch (response time, leads qualified, meetings booked) and report on them in plain language so you can see the impact, not just activity.',
  },
]

/** The six questions shown on the home page, in order */
export const homeFaqIds = ['timeline', 'fit', 'handover', 'dataSafety', 'transparency', 'improvement']

export const painPoints = [
  { title: 'Leads wait hours for a reply', text: 'By the time someone gets back to them, they’ve already booked with a competitor.' },
  { title: 'Evenings and weekends go dark', text: 'Enquiries that arrive after hours sit untouched until Monday morning.' },
  { title: 'Your team answers the same questions all day', text: 'Pricing, availability and “are you open?” eat hours that should go to selling.' },
  { title: 'Follow-ups slip through the cracks', text: 'Nobody chases the lead who went quiet, so warm prospects quietly disappear.' },
  { title: 'The CRM is always out of date', text: 'Details live in inboxes and heads, so you never know what’s really in the pipeline.' },
]

export const gains = [
  { title: 'Every lead gets a reply in seconds', text: 'Your agent answers the moment an enquiry lands, while interest is at its highest.' },
  { title: 'Open 24/7, without extra staff', text: 'Nights, weekends and holidays are covered, and bookings keep coming in.' },
  { title: 'Your team only talks to qualified buyers', text: 'The agent handles the repeat questions and passes over leads that are ready.' },
  { title: 'Follow-ups run on autopilot', text: 'Quiet leads get timely nudges until they book or say no.' },
  { title: 'A CRM that updates itself', text: 'Every conversation, booking and detail is logged automatically.' },
]

export const stats = [
  { count: '30', prefix: '<', suffix: 's', label: 'Average reply time' },
  { count: '3', prefix: '', suffix: 'x', label: 'More qualified leads' },
  { count: '20', prefix: '', suffix: ' hrs', label: 'Saved per week, per team' },
  { count: '24', prefix: '', suffix: '/7', label: 'Always answering' },
]
