import { useLocation } from 'react-router'
import { Brand } from './ui'

export default function Footer() {
  const isHome = useLocation().pathname === '/'
  return (
    <footer>
      <div className="container footer-inner">
        <Brand href={isHome ? '#top' : '/'} />
        <div className="footer-end">
          <p className="copyright">© {new Date().getFullYear()} MarCode Growth. All rights reserved.</p>
          {/* TODO: company LinkedIn icon is hidden until the real company page URL is known.
              Add: <a className="footer-li" href="https://www.linkedin.com/company/…" target="_blank" rel="noopener" aria-label="MarCode Growth on LinkedIn"><LinkedInIcon /></a> */}
        </div>
      </div>
    </footer>
  )
}
