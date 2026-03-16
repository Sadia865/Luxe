import { useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import showToast from '../utils/toast'

/* ── Social icons ───────────────────────────────────────── */
const Socials = {
  Instagram: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/></svg>,
  Facebook:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  Twitter:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>,
  Pinterest: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.24-5.24 1.24-5.24s-.32-.63-.32-1.57c0-1.47.85-2.57 1.91-2.57.9 0 1.34.68 1.34 1.49 0 .91-.58 2.27-.88 3.53-.25 1.05.52 1.91 1.56 1.91 1.87 0 3.12-2.4 3.12-5.25 0-2.17-1.47-3.69-3.57-3.69-2.43 0-3.86 1.82-3.86 3.71 0 .73.28 1.52.64 1.95.07.08.08.15.06.24l-.24.97c-.04.15-.13.18-.29.11-1.09-.51-1.77-2.09-1.77-3.37 0-2.74 1.99-5.26 5.74-5.26 3.01 0 5.35 2.15 5.35 5.01 0 2.99-1.88 5.39-4.49 5.39-.88 0-1.7-.46-1.98-1l-.54 2.01c-.19.74-.71 1.67-1.06 2.24.8.25 1.64.38 2.52.38 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>,
  Youtube:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>,
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [done,  setDone]  = useState(false)

  const handleNewsletter = e => {
    e.preventDefault()
    if (!email.trim()) { showToast.error('Email required', 'Please enter your email address'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast.error('Invalid email', 'Please enter a valid email address'); return
    }
    setDone(true)
    setEmail('')
    showToast.success('Subscribed!', 'Your 15% off code is on its way')
  }

  return (
    <footer className="footer">
      {/* Wave top edge */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 C360,72 1080,0 1440,48 L1440,72 L0,72 Z" fill="#ffffff"/>
        </svg>
      </div>

      <div className="footer-body">
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <img src={assets.logo} alt="Forever" className="footer-logo" />
            <p className="footer-desc">
              Curated fashion for every moment — from everyday confidence to statement elegance.
              Quality you can feel, style you trust.
            </p>
            <div className="footer-social">
              {[
                ['Instagram', Socials.Instagram],
                ['Facebook',  Socials.Facebook],
                ['Twitter',   Socials.Twitter],
                ['Pinterest', Socials.Pinterest],
                ['Youtube',   Socials.Youtube],
              ].map(([name, Icon]) => (
                <a key={name} href="#" className="footer-social-btn"
                  title={name} aria-label={name}
                  onClick={e => e.preventDefault()}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="footer-col-head">Quick Links</p>
            {[['/', 'Home'], ['/collection', 'Collection'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([to, label]) => (
              <Link key={to} to={to} className="footer-col-link">{label}</Link>
            ))}
          </div>

          {/* Support */}
          <div>
            <p className="footer-col-head">Customer Support</p>
            {['FAQ', 'Shipping Info', 'Returns & Exchanges', 'Size Guide', 'Track Your Order'].map(label => (
              <a key={label} href="#" className="footer-col-link"
                onClick={e => e.preventDefault()}>{label}</a>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <p className="footer-col-head">Newsletter</p>
            <p className="footer-newsletter-text">
              Subscribe for exclusive deals, early access to new drops, and weekly style inspiration.
            </p>
            {done ? (
              <p style={{ color: 'var(--gold-lt)', fontSize: 14, fontWeight: 500, padding: '14px 0', lineHeight: 1.6 }}>
                🎉 You're subscribed! Your 15% off code is on its way.
              </p>
            ) : (
              <form className="footer-nl-form" onSubmit={handleNewsletter}>
                <input type="email" placeholder="Your email address"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="footer-nl-input" />
                <button type="submit" className="footer-nl-btn">Join</button>
              </form>
            )}

            {/* Payment badges */}
            <div className="footer-payments">
              <img src={assets.stripe_logo} alt="Stripe"
                style={{ height: 20, filter: 'brightness(0) invert(.35)', objectFit: 'contain' }} />
              {['Visa', 'MC', 'PayPal', 'Amex'].map(p => (
                <span key={p} className="footer-pay-badge">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom-wrap">
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} Forever Fashion. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <a key={l} href="#" className="footer-bottom-link"
                onClick={e => e.preventDefault()}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}