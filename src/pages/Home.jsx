import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { assets, products as ALL } from '../assets/assets'
import ProductCard from '../components/ProductCard'
import showToast from '../utils/toast'

/* ── Arrow icon ─────────────────────────────────────────── */
const Arrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

/* ── Intersection observer hook ─────────────────────────── */
function useInView(threshold = 0.14) {
  const ref = useRef()
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

/* ── Wave divider ───────────────────────────────────────── */
const WaveDown = ({ fill = '#fff' }) => (
  <svg viewBox="0 0 1440 72" preserveAspectRatio="none"
    style={{ display: 'block', width: '100%' }}>
    <path d="M0,36 C480,72 960,0 1440,36 L1440,72 L0,72 Z" fill={fill} />
  </svg>
)

/* ══════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════ */
function Hero() {
  const { navigate } = useShop()
  const bests = ALL.filter(p => p.bestseller)

  return (
    <section className="hero">
      <div className="hero-bg" style={{ backgroundImage: `url(${assets.hero_img})` }} />
      <div className="hero-overlay" />

      <div className="hero-content">
        <div>
          <div className="hero-eyebrow fade-up">
            <span className="hero-eyebrow-line" />
            New Collection 2025
          </div>
          <h1 className="hero-title fade-up d1">
            Fashion<br /><em>redefined</em><br />for you.
          </h1>
          <p className="hero-sub fade-up d2">
            Curated pieces that tell your story — from everyday confidence
            to statement elegance. Quality you can feel.
          </p>
          <div className="hero-actions fade-up d3">
            <button className="btn btn-gold" onClick={() => navigate('/collection')}>
              Shop Collection <Arrow />
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/about')}>
              Our Story
            </button>
          </div>
          <div className="hero-stats fade-up d4">
            {[['10K+','Customers'],['500+','Products'],['50+','Brands'],['4.9★','Rating']].map(([n, l]) => (
              <div key={l}>
                <span className="hero-stat-num">{n}</span>
                <span className="hero-stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating product collage */}
        <div className="hero-collage fade-in d3">
          {bests[0] && (
            <div className="hero-card hero-card--main">
              <img src={bests[0].image[0]} alt={bests[0].name} />
            </div>
          )}
          {bests[1] && (
            <div className="hero-card hero-card--sm">
              <img src={bests[1].image[0]} alt={bests[1].name} />
            </div>
          )}
          <div className="hero-pill">
            <span className="hero-pill-dot" />
            New Arrivals In Store
          </div>
        </div>
      </div>

      <div className="hero-wave"><WaveDown fill="#ffffff" /></div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   MARQUEE
══════════════════════════════════════════════════════════ */
function MarqueeStrip() {
  const ITEMS = [
    'Free Shipping Over $99','New Arrivals Every Week',
    'Premium Quality Fabrics','Easy 30-Day Returns',
    'Members-Only Deals','Sustainable Fashion',
    'Luxury at Every Price','Trusted by 10,000+ Customers',
  ]
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   CATEGORIES
══════════════════════════════════════════════════════════ */
function Categories() {
  const [ref, inView] = useInView()
  const getImg = cat => ALL.find(p => p.category === cat)?.image[0] ?? assets.hero_img
  const cats = [
    { label: 'Women', count: '124 styles', cat: 'Women' },
    { label: 'Men',   count: '98 styles',  cat: 'Men'   },
    { label: 'Kids',  count: '76 styles',  cat: 'Kids'  },
  ]

  return (
    <section className="cats-section section-gap" ref={ref}>
      <div className="wrap">
        <div className="text-center">
          <p className={`eyebrow${inView ? ' fade-up' : ''}`}>Browse</p>
          <h2 className={`display-title${inView ? ' fade-up d1' : ''}`}>
            Shop by <em>Category</em>
          </h2>
        </div>
        <div className="cats-grid">
          {cats.map((cat, i) => (
            <Link to="/collection" key={cat.label}
              className={`cat-card${inView ? ` fade-up d${i + 2}` : ''}`}>
              <div className="cat-card__img-wrap">
                <img src={getImg(cat.cat)} alt={cat.label} />
                <div className="cat-card__overlay" />
              </div>
              <div className="cat-card__info">
                <p className="cat-card__label">{cat.label}</p>
                <p className="cat-card__count">{cat.count}</p>
              </div>
              <div className="cat-card__arrow"><Arrow /></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   BESTSELLERS
══════════════════════════════════════════════════════════ */
function BestSellers() {
  const [ref, inView] = useInView()
  const best = ALL.filter(p => p.bestseller).slice(0, 5)

  return (
    <section className="bestsellers section-gap" ref={ref}>
      <div className="bestsellers-inner">
        <div className="text-center">
          <p className={`eyebrow${inView ? ' fade-up' : ''}`}>Most Loved</p>
          <h2 className={`display-title${inView ? ' fade-up d1' : ''}`}>
            Best <em>Sellers</em>
          </h2>
          <p className={`body-lead${inView ? ' fade-up d2' : ''}`}>
            Our customers keep coming back for these.
          </p>
        </div>
        <div className={`grid-5${inView ? ' fade-up d3' : ''}`} style={{ marginTop: 48 }}>
          {best.map(p => <ProductCard key={p._id} {...p} />)}
        </div>
        <div className="bestsellers-cta">
          <Link to="/collection" className="btn btn-outline">View All Products</Link>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   PROMO BANNER
══════════════════════════════════════════════════════════ */
function PromoBanner() {
  const { navigate } = useShop()
  const [ref, inView] = useInView()

  return (
    <div className="promo-banner" ref={ref}>
      <div className="promo-banner-inner">
        <div className={`promo-content${inView ? ' slide-l' : ''}`}>
          <p className="promo-eyebrow">Limited Time Offer</p>
          <h2 className="promo-title">
            Up to 40% off<br />Winter Essentials
          </h2>
          <p className="promo-sub">
            Stock up on coats, jackets & knitwear before they're gone.
            Premium pieces at genuinely unbeatable prices.
          </p>
          <button className="btn btn-gold" onClick={() => navigate('/collection')}>
            Shop the Sale <Arrow />
          </button>
        </div>
        <div className={`promo-img${inView ? ' slide-r' : ''}`}>
          <img src={assets.about_img} alt="Winter Sale Collection" />
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   NEW ARRIVALS
══════════════════════════════════════════════════════════ */
function NewArrivals() {
  const [ref, inView] = useInView()
  const latest = [...ALL].sort((a, b) => b.date - a.date).slice(0, 4)

  return (
    <section className="arrivals" ref={ref}>
      <div className="arrivals-inner">
        <div className="arrivals-header">
          <div className={inView ? 'slide-l' : ''}>
            <p className="eyebrow eyebrow--left">Just Dropped</p>
            <h2 className="display-title">New <em>Arrivals</em></h2>
          </div>
          <Link to="/collection" className="arrivals-see-all">View All →</Link>
        </div>
        <div className={`grid-4${inView ? ' fade-up d2' : ''}`}>
          {latest.map(p => <ProductCard key={p._id} {...p} />)}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   FEATURES
══════════════════════════════════════════════════════════ */
const FEATS = [
  { icon: 'exchange_icon', title: 'Easy Returns',    desc: '30-day hassle-free returns. No questions asked.' },
  { icon: 'quality_icon',  title: 'Premium Quality', desc: 'Every piece is quality-checked before it ships.' },
  { icon: 'support_img',   title: '24/7 Support',    desc: 'Real humans ready to help whenever you need us.' },
  { icon: 'exchange_icon', title: 'Free Shipping',   desc: 'Free on all orders over $99. Fast delivery.' },
]

function Features() {
  const [ref, inView] = useInView()
  return (
    <section className="features section-gap" ref={ref}>
      <div className="wrap">
        <div className="text-center">
          <p className={`eyebrow${inView ? ' fade-up' : ''}`}>Why Choose Us</p>
          <h2 className={`display-title${inView ? ' fade-up d1' : ''}`}>
            The <em>Forever</em> Promise
          </h2>
        </div>
      </div>
      <div className="features-inner" style={{ marginTop: 52 }}>
        {FEATS.map((f, i) => (
          <div key={f.title} className={`feat-card${inView ? ` fade-up d${i + 1}` : ''}`}>
            <div className="feat-icon">
              <img src={assets[f.icon]} alt={f.title} />
            </div>
            <h4 className="feat-title">{f.title}</h4>
            <p className="feat-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   NEWSLETTER — with proper email validation
══════════════════════════════════════════════════════════ */
function Newsletter() {
  const [email, setEmail] = useState('')
  const [done,  setDone]  = useState(false)
  const [ref, inView] = useInView()

  const submit = e => {
    e.preventDefault()
    if (!email.trim()) {
      showToast.error('Email required', 'Please enter your email address')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast.error('Invalid email', 'Please enter a valid email address')
      return
    }
    setDone(true)
    setEmail('')
    showToast.success('Subscribed!', 'Your 15% off code is on its way')
  }

  return (
    <section className="newsletter section-gap" ref={ref}>
      <div className="newsletter-inner">
        <div className="nl-box">
          <div className={inView ? 'slide-l' : ''}>
            <p className="nl-eyebrow">Stay in the Loop</p>
            <h2 className="nl-title">
              Get 15% off your{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--gold-lt)' }}>first order</em>
            </h2>
            <p className="nl-sub">
              Join 10,000+ subscribers. Exclusive deals, new drops, weekly style guides.
            </p>
            <div className="nl-perks">
              {[
                { icon: 'exchange_icon', text: 'Early access to new collections' },
                { icon: 'quality_icon',  text: 'Members-only discounts & perks'  },
                { icon: 'exchange_icon', text: 'Weekly style tips & inspiration'  },
              ].map(p => (
                <div key={p.text} className="nl-perk">
                  <div className="nl-perk-icon">
                    <img src={assets[p.icon]} alt="" />
                  </div>
                  {p.text}
                </div>
              ))}
            </div>
          </div>

          <div className={inView ? 'slide-r d2' : ''}>
            {done ? (
              <p className="nl-thanks">
                🎉 You're in! Your 15% off code is heading to your inbox right now.
              </p>
            ) : (
              <>
                <form className="nl-form" onSubmit={submit}>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="nl-input"
                  />
                  <button type="submit" className="nl-btn">Subscribe</button>
                </form>
                <p className="nl-note">🔒 No spam, ever. Unsubscribe anytime.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <Categories />
      <BestSellers />
      <PromoBanner />
      <NewArrivals />
      <Features />
      <Newsletter />
    </>
  )
}