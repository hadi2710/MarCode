import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const stroke = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const CheckIcon = ({ strokeWidth = 2.4, ...p }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={strokeWidth} aria-hidden="true" {...p}><path d="M20 6 9 17l-5-5" /></svg>
)
export const XIcon = ({ strokeWidth = 3, ...p }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={strokeWidth} aria-hidden="true" {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>
)
export const ArrowIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.2} aria-hidden="true" {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
export const ArrowLeftIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.2} aria-hidden="true" {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
)
export const ReplayIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2} aria-hidden="true" {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
)
export const CalendarIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2} aria-hidden="true" {...p}><rect x="3" y="4" width="18" height="18" rx="3" /><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" /></svg>
)
export const ClockIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2} aria-hidden="true" {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)
export const VideoIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2} aria-hidden="true" {...p}><rect x="2" y="6" width="14" height="12" rx="2" /><path d="m16 10 6-3v10l-6-3" /></svg>
)
export const ChatIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2} aria-hidden="true" {...p}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" /></svg>
)
export const CloseIcon = ({ strokeWidth = 2, ...p }: P) => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={strokeWidth} aria-hidden="true" {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
)
export const LinkedInIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
)
export const VerifiedIcon = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34Z" />
    <path fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m8.5 12.2 2.4 2.4 4.8-5" />
  </svg>
)

/** MG cube mark from public/assets/logo (trimmed, 460x512). Decorative: the brand name is always next to it or in an aria-label. */
export const Mark = ({ className }: { className?: string }) => (
  <img src="/assets/mark.png" alt="" width={460} height={512} className={className} decoding="async" draggable={false} />
)
