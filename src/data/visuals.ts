import {
  BarChart3, BellRing, Blocks, Bot, CalendarCheck, ChartColumn, ChartLine, ClipboardList, Database, FileText, Filter,
  Gauge, GitBranch, Handshake, Layers, Mail, MessageCircle, MessagesSquare, MessageSquareText, Repeat, ScanSearch,
  ScrollText, Send, ShieldCheck, Target, TrendingUp, UserCheck, Users, Workflow, Zap,
  type LucideIcon,
} from 'lucide-react'

/** "Follow one enquiry": the stations a lead passes through, left to right. */
export const FLOW_STATIONS: Array<{ icon: LucideIcon; title: string; meta: string }> = [
  { icon: MessageSquareText, title: 'Enquiry arrives', meta: '11:42 pm, website chat' },
  { icon: Zap, title: 'AI replies', meta: '4 seconds, from approved answers' },
  { icon: Filter, title: 'Lead qualified', meta: '25 staff, wants to start this week' },
  { icon: CalendarCheck, title: 'Call booked', meta: 'Thursday 3:00 pm, invite sent' },
  { icon: Database, title: 'CRM updated', meta: 'Owner assigned, team notified' },
]

/** Icons and decorative chips used across pages (kept out of component files for fast refresh). */
export const SERVICE_ICONS: Record<string, LucideIcon> = { chatbots: MessagesSquare, automation: Workflow, agents: Bot, growth: TrendingUp }
export const STEP_ICONS: Record<string, LucideIcon> = { audit: ScanSearch, build: Blocks, improve: ChartLine }
export const CAPABILITY_ICONS: LucideIcon[] = [MessageCircle, MessagesSquare, Mail, Database, CalendarCheck, Gauge, BellRing, ChartColumn, Users]

export type Chip = { icon: LucideIcon; text: string }

/** Decorative status chips per page (positions c1..c6 are set in CSS). */
export const HOME_CHIPS: Chip[] = [
  { icon: MessageSquareText, text: 'New enquiry · 11:42 pm' },
  { icon: Zap, text: 'Replied in 4 seconds' },
  { icon: UserCheck, text: 'Lead qualified' },
  { icon: CalendarCheck, text: 'Call booked · Thu 3 pm' },
  { icon: Database, text: 'CRM updated' },
  { icon: BellRing, text: 'Follow-up sent' },
]

/** Per-service visuals: hero chips and one icon per outcome (same order as `service.outcomes`). */
export const SERVICE_EXTRAS: Record<string, { chips: Chip[]; outcomeIcons: LucideIcon[] }> = {
  chatbots: {
    chips: [
      { icon: MessageSquareText, text: 'New enquiry · 11:42 pm' },
      { icon: Zap, text: 'Replied in 4 seconds' },
      { icon: MessageCircle, text: 'WhatsApp message' },
      { icon: UserCheck, text: 'Lead qualified' },
      { icon: CalendarCheck, text: 'Call booked · Thu 3 pm' },
      { icon: Handshake, text: 'Handed to your team' },
    ],
    outcomeIcons: [Zap, Filter, CalendarCheck, MessageCircle],
  },
  automation: {
    chips: [
      { icon: FileText, text: 'Form submitted' },
      { icon: Database, text: 'Contact created' },
      { icon: UserCheck, text: 'Owner assigned' },
      { icon: Mail, text: 'Welcome email sent' },
      { icon: Repeat, text: 'Sheet synced' },
      { icon: BellRing, text: 'Team notified' },
    ],
    outcomeIcons: [Repeat, UserCheck, ClipboardList, Layers],
  },
  agents: {
    chips: [
      { icon: Send, text: 'Follow-up #3 sent' },
      { icon: Database, text: 'Deal stage updated' },
      { icon: BellRing, text: 'Reminder scheduled' },
      { icon: ShieldCheck, text: 'Within approved access' },
      { icon: ScrollText, text: 'Activity logged' },
      { icon: Handshake, text: 'Escalated to a human' },
    ],
    outcomeIcons: [GitBranch, ShieldCheck, ScrollText, Handshake],
  },
  growth: {
    chips: [
      { icon: Target, text: 'Lead score · 92' },
      { icon: Send, text: 'Nurture email opened' },
      { icon: Filter, text: 'Segment: ready to buy' },
      { icon: BarChart3, text: 'Weekly report ready' },
      { icon: TrendingUp, text: 'Conversion up' },
      { icon: Users, text: 'Pipeline shared' },
    ],
    outcomeIcons: [Target, Send, BarChart3, Users],
  },
}
