import { Bot, CalendarCheck, Check, Database, FileText, Mail, Sparkles, Target } from 'lucide-react'

/**
 * Small product "screens" that show what each service does (decorative: hidden from screen readers,
 * the surrounding card already describes it). They animate only while visible (`.live`, set by
 * the page-motion observer) and sit still under reduced motion.
 */
export function ServiceMock({ id, tone = 'light' }: { id: string; tone?: 'light' | 'dark' }) {
  return (
    <div className={`mock mock-${id} mock-${tone}`} aria-hidden="true">
      {id === 'chatbots' && <ChatMock />}
      {id === 'automation' && <FlowMock />}
      {id === 'agents' && <AgentMock />}
      {id === 'growth' && <GrowthMock />}
    </div>
  )
}

function ChatMock() {
  return (
    <div className="m-chat">
      <span className="m-bubble in">Do you have time this week?</span>
      <span className="m-bubble out"><Sparkles />Yes, Thu 3:00 pm works.</span>
      <span className="m-pill"><CalendarCheck />Booked</span>
    </div>
  )
}

function FlowMock() {
  const nodes = [
    { icon: FileText, t: 'Form' },
    { icon: Database, t: 'CRM' },
    { icon: Mail, t: 'Email' },
  ]
  return (
    <div className="m-flow">
      <span className="m-line"><span className="m-signal" /></span>
      {nodes.map(({ icon: Icon, t }, i) => (
        <span key={t} className={`m-node n${i + 1}`}><Icon /><em>{t}</em></span>
      ))}
    </div>
  )
}

function AgentMock() {
  const tasks = ['Follow up a quiet lead', 'Update the deal stage', 'Schedule a reminder']
  return (
    <div className="m-agent">
      <span className="m-agent-head"><Bot />Agent working</span>
      {tasks.map((t, i) => (
        <span key={t} className={`m-task t${i + 1}`}><span className="m-check"><Check /></span>{t}</span>
      ))}
    </div>
  )
}

function GrowthMock() {
  const bars = [34, 48, 41, 62, 70, 88]
  return (
    <div className="m-growth">
      <span className="m-score"><Target />Lead score <b>92</b></span>
      <span className="m-bars">
        {bars.map((h, i) => <span key={i} className={`b${i + 1}`} style={{ height: `${h}%` }} />)}
      </span>
    </div>
  )
}
