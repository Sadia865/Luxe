import { useState } from 'react'
import showToast from '../utils/toast'

/* ── Premium Icons ───────────────────────────────────────── */

/* Thin-line envelope with elegant fold detail */
const EmailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="3" stroke="url(#gi)" strokeWidth="1.4"/>
    <path d="M2 7.5L10.586 13.086a2 2 0 002.828 0L22 7.5" stroke="url(#gi)" strokeWidth="1.4" strokeLinecap="round"/>
    <defs>
      <linearGradient id="gi" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A8843E"/><stop offset="1" stopColor="#E8C99A"/>
      </linearGradient>
    </defs>
  </svg>
)

/* Refined handset with subtle curve */
const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z"
      stroke="url(#gp)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="gp" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A8843E"/><stop offset="1" stopColor="#E8C99A"/>
      </linearGradient>
    </defs>
  </svg>
)

/* Architectural location pin — premium style */
const MapPinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      stroke="url(#gm)" strokeWidth="1.4" strokeLinejoin="round"/>
    <circle cx="12" cy="9" r="2.5" stroke="url(#gm)" strokeWidth="1.4"/>
    <defs>
      <linearGradient id="gm" x1="5" y1="2" x2="19" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A8843E"/><stop offset="1" stopColor="#E8C99A"/>
      </linearGradient>
    </defs>
  </svg>
)

/* Minimal clock — ultra clean */
const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="url(#gc)" strokeWidth="1.4"/>
    <path d="M12 7v5l3.5 2" stroke="url(#gc)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="gc" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A8843E"/><stop offset="1" stopColor="#E8C99A"/>
      </linearGradient>
    </defs>
  </svg>
)

/* Arrow send icon */
const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const DirectionsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/* ── Contact detail cards data ───────────────────────────── */
const CONTACT_DETAILS = [
  {
    icon: <EmailIcon />,
    label: 'Email Us',
    value: 'hello@forever.com',
    sub: 'We reply within 24 hours',
    href: 'mailto:hello@forever.com',
  },
  {
    icon: <PhoneIcon />,
    label: 'Call Us',
    value: '+1 (555) 123-4567',
    sub: 'Mon–Sat, 9am – 8pm EST',
    href: 'tel:+15551234567',
  },
  {
    icon: <MapPinIcon />,
    label: 'Visit Us',
    value: '123 Fashion Ave',
    sub: 'New York, NY 10001',
    href: '#map',
  },
  {
    icon: <ClockIcon />,
    label: 'Store Hours',
    value: 'Mon–Sat: 9am–8pm',
    sub: 'Sunday: 11am–6pm',
    href: null,
  },
]

/* ═══════════════════════════════════════════════════════════
   BEAUTIFUL SVG MAP
═══════════════════════════════════════════════════════════ */
const MapSection = () => {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="cmap-wrap">
      {/* Map SVG */}
      <div className="cmap-canvas">
        <svg
          viewBox="0 0 600 340"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          {/* ── Background ── */}
          <defs>
            <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8F5EF"/>
              <stop offset="100%" stopColor="#EDE8DF"/>
            </linearGradient>
            <linearGradient id="parkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C8DDB8"/>
              <stop offset="100%" stopColor="#B5CE9E"/>
            </linearGradient>
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9DC5D8"/>
              <stop offset="100%" stopColor="#7BAFC5"/>
            </linearGradient>
            <linearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A8843E"/>
              <stop offset="50%" stopColor="#C9A96E"/>
              <stop offset="100%" stopColor="#E8C99A"/>
            </linearGradient>
            <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(168,132,62,.4)"/>
            </filter>
            <filter id="glowPulse">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <radialGradient id="pulseGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#C9A96E" stopOpacity="0"/>
            </radialGradient>
          </defs>

          {/* Base background */}
          <rect width="600" height="340" fill="url(#mapBg)"/>

          {/* ── City blocks (background buildings) ── */}
          {[
            [20,20,80,60],[120,20,70,45],[210,20,90,55],[320,20,60,50],[400,20,80,45],[500,20,80,60],
            [20,110,55,65],[100,130,70,50],[190,110,80,60],[290,120,65,55],[375,110,75,60],[470,120,80,55],
            [20,220,60,70],[110,230,75,55],[210,215,85,65],[320,225,60,60],[400,220,80,70],[500,215,80,75],
          ].map(([x,y,w,h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h}
              fill={i % 3 === 0 ? '#E2DBD0' : i % 3 === 1 ? '#D8D0C4' : '#CFCABB'}
              rx="3"
              opacity="0.7"
            />
          ))}

          {/* ── Parks / green spaces ── */}
          <rect x="380" y="120" width="110" height="80" fill="url(#parkGrad)" rx="8" opacity="0.8"/>
          <rect x="60" y="165" width="50" height="40" fill="url(#parkGrad)" rx="6" opacity="0.7"/>
          {/* Park trees dots */}
          {[[395,135],[410,150],[425,140],[440,155],[455,145],[470,138],[395,165],[415,168],[440,162],[465,170]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="5" fill="#9CBE85" opacity="0.6"/>
          ))}

          {/* ── Water feature ── */}
          <ellipse cx="70" cy="290" rx="55" ry="25" fill="url(#waterGrad)" opacity="0.6"/>
          <ellipse cx="540" cy="80" rx="45" ry="20" fill="url(#waterGrad)" opacity="0.5"/>

          {/* ── Main roads (thick) ── */}
          {/* Horizontal major roads */}
          <rect x="0" y="98" width="600" height="10" fill="#E8E0D0" rx="0"/>
          <rect x="0" y="204" width="600" height="10" fill="#E8E0D0"/>
          {/* Vertical major roads */}
          <rect x="175" y="0" width="10" height="340" fill="#E8E0D0"/>
          <rect x="363" y="0" width="10" height="340" fill="#E8E0D0"/>

          {/* Road center lines */}
          {[98,204].map(y => (
            <line key={y} x1="0" y1={y+5} x2="600" y2={y+5}
              stroke="#D4C9B5" strokeWidth="1" strokeDasharray="20 12" opacity="0.6"/>
          ))}
          {[175,363].map(x => (
            <line key={x} x1={x+5} y1="0" x2={x+5} y2="340"
              stroke="#D4C9B5" strokeWidth="1" strokeDasharray="20 12" opacity="0.6"/>
          ))}

          {/* ── Secondary streets ── */}
          {[50, 150, 310, 450, 550].map(x => (
            <rect key={x} x={x} y="0" width="5" height="340" fill="#DDD5C5" opacity="0.5"/>
          ))}
          {[60, 160, 250, 300].map(y => (
            <rect key={y} x="0" y={y} width="600" height="5" fill="#DDD5C5" opacity="0.5"/>
          ))}

          {/* ── Road labels ── */}
          <text x="88" y="94" fontSize="7" fill="#A89880" fontFamily="Jost, sans-serif" fontWeight="600" letterSpacing="0.5">5TH AVE</text>
          <text x="88" y="200" fontSize="7" fill="#A89880" fontFamily="Jost, sans-serif" fontWeight="600" letterSpacing="0.5">FASHION AVE</text>
          <text x="178" y="85" fontSize="6.5" fill="#A89880" fontFamily="Jost, sans-serif" fontWeight="600" transform="rotate(90, 178, 85)" letterSpacing="0.5">W 34TH ST</text>
          <text x="366" y="85" fontSize="6.5" fill="#A89880" fontFamily="Jost, sans-serif" fontWeight="600" transform="rotate(90, 366, 85)" letterSpacing="0.5">MADISON AVE</text>

          {/* ── Nearby landmarks ── */}
          {/* Central Park indicator */}
          <rect x="382" y="122" width="106" height="76" fill="none" stroke="#9CBE85" strokeWidth="1.5" rx="6" strokeDasharray="4 3"/>
          <text x="435" y="180" fontSize="8" fill="#6A9A5A" fontFamily="Jost, sans-serif" fontWeight="700" textAnchor="middle" letterSpacing="0.5">CENTRAL PARK</text>

          {/* Building labels */}
          <text x="130" y="150" fontSize="6.5" fill="#B8A890" fontFamily="Jost, sans-serif" textAnchor="middle">Empire State</text>
          <text x="130" y="158" fontSize="6" fill="#B8A890" fontFamily="Jost, sans-serif" textAnchor="middle">Building</text>
          <rect x="100" y="130" width="60" height="38" fill="#CFC8BE" rx="3" opacity="0.5"/>
          <rect x="125" y="118" width="10" height="12" fill="#C0B8AC" rx="1"/>

          {/* ── Location PIN — Forever Store ── */}
          {/* Pulse rings */}
          <circle cx="270" cy="155" r="35" fill="url(#pulseGrad)" opacity="0.5">
            <animate attributeName="r" values="20;45;20" dur="2.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="270" cy="155" r="20" fill="url(#pulseGrad)" opacity="0.4">
            <animate attributeName="r" values="12;28;12" dur="2.5s" begin="0.4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" begin="0.4s" repeatCount="indefinite"/>
          </circle>

          {/* Pin shadow */}
          <ellipse cx="270" cy="182" rx="10" ry="4" fill="rgba(0,0,0,0.15)"/>

          {/* Pin body */}
          <g filter="url(#pinShadow)">
            <path
              d="M270 115 C255 115 243 127 243 142 C243 162 270 182 270 182 C270 182 297 162 297 142 C297 127 285 115 270 115 Z"
              fill="url(#pinGrad)"
            />
            <circle cx="270" cy="142" r="10" fill="white" opacity="0.9"/>
            {/* Store icon inside pin */}
            <path d="M263 139 L277 139 L275 147 L265 147 Z" fill="#C9A96E" strokeWidth="0"/>
            <rect x="266" y="143" width="4" height="4" fill="white"/>
            <rect x="271" y="143" width="3" height="2" fill="white"/>
          </g>

          {/* ── Store info popup ── */}
          <g>
            {/* Popup card */}
            <rect x="288" y="110" width="130" height="62" rx="10" fill="white"
              style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.12))' }}/>
            {/* Gold top bar */}
            <rect x="288" y="110" width="130" height="4" rx="2" fill="url(#pinGrad)"/>
            {/* Popup tail */}
            <path d="M296 172 L288 172 L292 164 Z" fill="white"/>
            {/* Store name */}
            <text x="298" y="130" fontSize="9.5" fill="#0A0A0A" fontFamily="Playfair Display, serif" fontWeight="500">FOREVER</text>
            <text x="298" y="141" fontSize="7" fill="#C9A96E" fontFamily="Jost, sans-serif" fontWeight="700" letterSpacing="1">FASHION STORE</text>
            {/* Address */}
            <text x="298" y="153" fontSize="6.5" fill="#6B6560" fontFamily="Jost, sans-serif">123 Fashion Avenue</text>
            <text x="298" y="162" fontSize="6.5" fill="#6B6560" fontFamily="Jost, sans-serif">New York, NY 10001</text>
            {/* Rating stars */}
            {[0,8,16,24,32].map((x, i) => (
              <text key={i} x={380+x} y={130} fontSize="7" fill={i < 4 ? '#C9A96E' : '#DDDDD'}>★</text>
            ))}
            <text x="413" y="130" fontSize="6.5" fill="#B0A89E" fontFamily="Jost, sans-serif"> 4.9</text>
          </g>

          {/* ── Nearby POI dots ── */}
          {[
            [155, 108, '#8BA5C8', 'Metro'],
            [363, 210, '#8BA5C8', 'Metro'],
            [175, 204, '#E8956E', 'Cafe'],
            [363, 98,  '#9CBE85', 'Park'],
          ].map(([x, y, color, label]) => (
            <g key={label+x}>
              <circle cx={x} cy={y} r="5" fill={color} opacity="0.85"/>
              <circle cx={x} cy={y} r="3" fill="white" opacity="0.7"/>
              <text x={x+7} y={y+3} fontSize="6" fill={color} fontFamily="Jost, sans-serif" fontWeight="600">{label}</text>
            </g>
          ))}

          {/* ── Scale indicator ── */}
          <g opacity="0.6">
            <line x1="510" y1="318" x2="570" y2="318" stroke="#A89880" strokeWidth="1.5"/>
            <line x1="510" y1="314" x2="510" y2="322" stroke="#A89880" strokeWidth="1.5"/>
            <line x1="570" y1="314" x2="570" y2="322" stroke="#A89880" strokeWidth="1.5"/>
            <text x="540" y="312" fontSize="6.5" fill="#A89880" fontFamily="Jost, sans-serif" textAnchor="middle">500m</text>
          </g>

          {/* ── Compass rose ── */}
          <g transform="translate(555, 270)">
            <circle cx="0" cy="0" r="14" fill="white" opacity="0.8"/>
            <circle cx="0" cy="0" r="13" fill="none" stroke="#E8E0D0" strokeWidth="1"/>
            <path d="M0 -10 L3 -2 L0 0 L-3 -2 Z" fill="#C9A96E"/>
            <path d="M0 10 L3 2 L0 0 L-3 2 Z" fill="#B0A89E"/>
            <path d="M-10 0 L-2 -3 L0 0 L-2 3 Z" fill="#B0A89E"/>
            <path d="M10 0 L2 -3 L0 0 L2 3 Z" fill="#B0A89E"/>
            <text x="0" y="-12" fontSize="6" fill="#C9A96E" fontFamily="Jost, sans-serif" fontWeight="700" textAnchor="middle">N</text>
          </g>

          {/* Map overlay gradient edges */}
          <defs>
            <linearGradient id="edgeFadeL" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F8F5EF" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#F8F5EF" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="edgeFadeR" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F8F5EF" stopOpacity="0"/>
              <stop offset="100%" stopColor="#F8F5EF" stopOpacity="0.7"/>
            </linearGradient>
            <linearGradient id="edgeFadeT" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F8F5EF" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#F8F5EF" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="edgeFadeB" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F8F5EF" stopOpacity="0"/>
              <stop offset="100%" stopColor="#F8F5EF" stopOpacity="0.6"/>
            </linearGradient>
          </defs>
          <rect width="60" height="340" fill="url(#edgeFadeL)"/>
          <rect x="540" width="60" height="340" fill="url(#edgeFadeR)"/>
          <rect width="600" height="40" fill="url(#edgeFadeT)"/>
          <rect y="300" width="600" height="40" fill="url(#edgeFadeB)"/>
        </svg>

        {/* ── Map controls overlay ── */}
        <div className="cmap-controls">
          <button className="cmap-ctrl-btn" title="Zoom in">+</button>
          <button className="cmap-ctrl-btn" title="Zoom out">−</button>
        </div>

        {/* ── Bottom info bar ── */}
        <div className="cmap-bar">
          <div className="cmap-bar__left">
            <div className="cmap-bar__pin">
              <MapPinIcon />
            </div>
            <div>
              <p className="cmap-bar__name">Forever Fashion Store</p>
              <p className="cmap-bar__addr">123 Fashion Avenue, New York, NY 10001</p>
            </div>
          </div>
          <a
            href="https://maps.google.com/?q=123+Fashion+Avenue+New+York+NY"
            target="_blank"
            rel="noopener noreferrer"
            className="cmap-bar__directions"
          >
            <DirectionsIcon />
            Get Directions
          </a>
        </div>
      </div>

      {/* ── Transport strip ── */}
      <div className="cmap-transport">
        {[
          { icon: '🚇', label: 'Subway', detail: '2 min walk · N/Q/R/W at 34th' },
          { icon: '🚗', label: 'Parking', detail: '4-min walk · W 32nd St Garage' },
          { icon: '🚶', label: 'Walk',   detail: '8 min from Penn Station' },
          { icon: '🚌', label: 'Bus',    detail: 'M34 stops directly outside' },
        ].map(t => (
          <div key={t.label} className="cmap-transport__item">
            <span className="cmap-transport__icon">{t.icon}</span>
            <div>
              <p className="cmap-transport__label">{t.label}</p>
              <p className="cmap-transport__detail">{t.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   CONTACT PAGE
═══════════════════════════════════════════════════════════ */
export default function Contact() {
  const [form,    setForm]    = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setSent(true)
    setLoading(false)
    showToast.success('Message sent!', "We'll get back to you within 24 hours")
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header__inner">
          <h1 className="page-header__title">Contact Us</h1>
          <nav className="breadcrumb">
            <a href="/">Home</a><span className="breadcrumb-sep">/</span><span>Contact</span>
          </nav>
        </div>
      </div>

      <div className="contact-page">

        {/* ── Top: Info + Form ─────────────────────────────── */}
        <div className="contact-layout">
          {/* Left — contact info */}
          <div className="slide-l">
            <p className="eyebrow eyebrow--left">Get in Touch</p>
            <h2 className="contact-info__title">
              We'd love to<br /><em>hear from you.</em>
            </h2>
            <p className="contact-info__desc">
              Have a question about your order, need styling advice, or just want to say hello?
              Our team is here and ready to help. We respond within 24 hours.
            </p>

            <div className="contact-details">
              {CONTACT_DETAILS.map(d => (
                <div key={d.label} className="contact-detail">
                  <div className="contact-detail__icon">{d.icon}</div>
                  <div>
                    <p className="contact-detail__label">{d.label}</p>
                    {d.href ? (
                      <a href={d.href} className="contact-detail__value"
                        style={{ textDecoration: 'none' }}
                        onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'}
                        onMouseOut={e => e.currentTarget.style.color = 'var(--ink)'}
                      >{d.value}</a>
                    ) : (
                      <p className="contact-detail__value">{d.value}</p>
                    )}
                    {d.sub && <p className="contact-detail__sub">{d.sub}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — contact form */}
          <div className="contact-form-card slide-r">
            <h3 className="contact-form-title">Send us a Message</h3>

            {sent ? (
              <div style={{
                textAlign: 'center', padding: '48px 24px',
                background: 'rgba(201,169,110,.06)', borderRadius: 'var(--r-lg)',
                border: '1px solid rgba(201,169,110,.2)',
              }}>
                <div style={{ fontSize: 52, marginBottom: 18 }}>✉️</div>
                <p style={{ fontFamily: 'var(--display)', fontSize: 22, color: 'var(--ink)', marginBottom: 10 }}>
                  Message Sent!
                </p>
                <p style={{ fontSize: 14, color: 'var(--mid)', lineHeight: 1.65, marginBottom: 28 }}>
                  Thank you for reaching out.<br />We'll get back to you within 24 hours.
                </p>
                <button className="btn btn-outline" onClick={() => setSent(false)}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input name="name" type="text" className="form-input"
                      placeholder="John Doe" value={form.name} onChange={update} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input name="email" type="email" className="form-input"
                      placeholder="john@example.com" value={form.email} onChange={update} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input name="subject" type="text" className="form-input"
                    placeholder="How can we help?" value={form.subject} onChange={update} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea name="message" className="contact-textarea"
                    placeholder="Tell us everything…"
                    value={form.message} onChange={update} required />
                </div>
                <button type="submit" className="btn btn-dark form-submit"
                  disabled={loading}
                  style={{ justifyContent: 'center', opacity: loading ? .7 : 1 }}>
                  {loading ? 'Sending…' : <><SendIcon /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Map Section ─────────────────────────────────── */}
        <div className="cmap-section">
          <div className="text-center" style={{ marginBottom: 40 }}>
            <p className="eyebrow">Find Us</p>
            <h2 className="display-title">Visit Our <em>Store</em></h2>
            <p className="body-lead" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              Located in the heart of New York's Fashion District.
              Come see our full collection in person.
            </p>
          </div>
          <MapSection />
        </div>

        {/* ── FAQ ─────────────────────────────────────────── */}
        <div className="contact-faq">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p className="eyebrow">Quick Answers</p>
            <h2 className="display-title">Frequently Asked <em>Questions</em></h2>
          </div>
          <div className="contact-faq__grid">
            {[
              ['How long does shipping take?',  'Standard shipping takes 5–7 business days. Express is 2–3 days.'],
              ['Can I return an item?',         'Yes! We offer free 30-day returns on all items, no questions asked.'],
              ['Do you ship internationally?',  'We currently ship within the US. International shipping coming soon.'],
              ['How do I track my order?',      "You'll receive a tracking link via email as soon as your order ships."],
              ['What sizes do you carry?',      'We stock XS through XXL. Check individual product pages for size guides.'],
              ['Is my payment secure?',         'Yes, all payments are processed through Stripe with SSL encryption.'],
            ].map(([q, a]) => (
              <div key={q} className="contact-faq__item">
                <p className="contact-faq__q">{q}</p>
                <p className="contact-faq__a">{a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}