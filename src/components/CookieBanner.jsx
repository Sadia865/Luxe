import { useState, useEffect } from 'react'

// Bump this version string any time you want to force re-show the banner
const CONSENT_VERSION = 'v2'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const stored        = localStorage.getItem('cookie-consent')
    const storedVersion = localStorage.getItem('cookie-consent-version')

    // Show if: never consented OR consent is stale (old version)
    if (!stored || storedVersion !== CONSENT_VERSION) {
      localStorage.removeItem('cookie-consent')
      localStorage.removeItem('cookie-consent-version')
      const t = setTimeout(() => setShow(true), 1500)
      return () => clearTimeout(t)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    localStorage.setItem('cookie-consent-version', CONSENT_VERSION)
    setShow(false)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    localStorage.setItem('cookie-consent-version', CONSENT_VERSION)
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      zIndex: 99999,
      background: 'rgba(14,12,10,.97)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(201,169,110,.2)',
      padding: '20px 48px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 24, flexWrap: 'wrap',
      animation: 'cookieSlideUp .45s cubic-bezier(.34,1.56,.64,1) both',
      boxShadow: '0 -8px 40px rgba(0,0,0,.3)',
    }}>
      <p style={{
        fontSize: 13.5, color: 'rgba(255,255,255,.55)',
        lineHeight: 1.65, maxWidth: 660, fontWeight: 300,
        fontFamily: 'var(--body)', margin: 0,
      }}>
        🍪 We use cookies to enhance your browsing experience, serve personalised
        content and analyse our traffic. By clicking{' '}
        <strong style={{ color: 'rgba(255,255,255,.9)', fontWeight: 600 }}>Accept All</strong>
        , you consent to our use of cookies.{' '}
        <a href="/contact" style={{ color: 'var(--gold-lt)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
          Privacy Policy
        </a>
      </p>

      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <button onClick={accept} style={{
          padding: '11px 26px',
          background: 'linear-gradient(135deg, var(--gold-dk), var(--gold), var(--gold-lt))',
          color: '#fff', border: 'none', borderRadius: 999,
          fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
          cursor: 'pointer', fontFamily: 'var(--body)',
          boxShadow: '0 4px 20px rgba(201,169,110,.35)',
          transition: 'transform .2s', whiteSpace: 'nowrap',
        }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e  => e.currentTarget.style.transform = 'translateY(0)'}
        >
          Accept All
        </button>

        <button onClick={decline} style={{
          padding: '11px 22px',
          background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.5)',
          border: '1px solid rgba(255,255,255,.12)', borderRadius: 999,
          fontSize: 12, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
          cursor: 'pointer', fontFamily: 'var(--body)',
          transition: 'all .2s', whiteSpace: 'nowrap',
        }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,.12)'; e.currentTarget.style.color = 'rgba(255,255,255,.8)' }}
          onMouseOut={e  => { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = 'rgba(255,255,255,.5)' }}
        >
          Decline
        </button>
      </div>
    </div>
  )
}