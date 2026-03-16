import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const values = [
  { num:'01', title:'Quality First',    desc:'Every piece is sourced from premium manufacturers. We inspect before it reaches you.' },
  { num:'02', title:'Sustainability',   desc:'Committed to ethical fashion. We work only with responsible suppliers.' },
  { num:'03', title:'Customer Love',    desc:'10,000+ happy customers. Our 4.9★ rating speaks for itself.' },
  { num:'04', title:'Accessible Luxury',desc:'Premium quality at honest prices. Fashion shouldn\'t cost a fortune.' },
  { num:'05', title:'Fast Delivery',    desc:'Orders dispatched within 24 hours. Free shipping on orders over $99.' },
  { num:'06', title:'Easy Returns',     desc:'Not happy? Return within 30 days, no questions asked.' },
]

const team = [
  { name:'Sophia Reed',   role:'Founder & CEO',        img: null },
  { name:'Marcus Cole',   role:'Head of Design',        img: null },
  { name:'Aisha Patel',   role:'Curation Director',     img: null },
  { name:'Leo Fontaine',  role:'Customer Experience',   img: null },
]

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero__inner">
          <p className="about-hero__eyebrow">Our Story</p>
          <h1 className="about-hero__title fade-up">
            Fashion is more than<br />
            <em>what you wear.</em>
          </h1>
          <p style={{ fontSize:17, color:'rgba(255,255,255,.5)', maxWidth:560, marginTop:24, lineHeight:1.75 }} className="fade-up d2">
            Forever was born from a simple belief: everyone deserves access to beautiful,
            quality fashion without compromise. We curate pieces that empower you to express who you are.
          </p>
          <div style={{ marginTop:40, display:'flex', gap:16, flexWrap:'wrap' }} className="fade-up d3">
            <Link to="/collection" className="btn btn-gold">Shop Collection</Link>
            <Link to="/contact" className="btn btn-ghost">Get in Touch</Link>
          </div>
        </div>
      </section>

      {/* Story section */}
      <section className="about-story">
        <div className="about-story__inner">
          <div className="about-story__img slide-l">
            <img src={assets.about_img} alt="Our story" />
          </div>
          <div className="slide-r">
            <p className="eyebrow eyebrow--left">Who We Are</p>
            <h2 className="display-title">Built on passion,<br /><em>driven by style.</em></h2>
            <p className="body-lead">
              Founded in 2019, Forever started as a small online boutique with a curated selection
              of 50 pieces. Today we serve over 10,000 customers across the country with 500+
              styles for Men, Women, and Kids.
            </p>
            <p style={{ fontSize:15, color:'var(--mid)', lineHeight:1.75, marginTop:16, maxWidth:480 }}>
              We believe in the power of fashion to transform how you feel. Every piece in our
              collection is hand-selected by our design team for quality, fit, and timeless style.
            </p>
            <div style={{ display:'flex', gap:36, marginTop:40 }}>
              {[['10K+','Customers'], ['500+','Styles'], ['4.9★','Rating'], ['2019','Founded']].map(([n,l]) => (
                <div key={l}>
                  <p style={{ fontFamily:'var(--display)', fontSize:28, fontWeight:500, color:'var(--ink)' }}>{n}</p>
                  <p style={{ fontSize:11.5, color:'var(--mid)', textTransform:'uppercase', letterSpacing:'.1em', marginTop:2 }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="about-values__inner">
          <div className="text-center fade-up">
            <p className="eyebrow">What We Stand For</p>
            <h2 className="display-title">Our <em>Values</em></h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={v.num} className={`value-card fade-up d${(i % 3) + 1}`}>
                <p className="value-card__num">{v.num}</p>
                <h3 className="value-card__title">{v.title}</h3>
                <p className="value-card__desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team">
        <div className="about-team__inner">
          <div className="text-center fade-up">
            <p className="eyebrow">Meet the Team</p>
            <h2 className="display-title">The People Behind <em>Forever</em></h2>
          </div>
          <div className="team-grid">
            {team.map((member, i) => (
              <div key={member.name} className={`team-card fade-up d${i + 1}`}>
                <div className="team-card__img">
                  {/* Use your product images as placeholder team photos */}
                  <img src={assets.about_img} alt={member.name}
                    style={{ filter:'grayscale(20%)' }} />
                </div>
                <p className="team-card__name">{member.name}</p>
                <p className="team-card__role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding:'var(--s8) 40px' }}>
        <div className="promo-banner-inner" style={{ borderRadius:'var(--r-2xl)' }}>
          <div className="promo-content">
            <p className="promo-eyebrow">Join the Family</p>
            <h2 className="promo-title">Start your style<br />journey today.</h2>
            <p className="promo-sub">Thousands of people trust Forever for their fashion needs. Be one of them.</p>
            <Link to="/collection" className="btn btn-gold">Shop Now</Link>
          </div>
          <div className="promo-img">
            <img src={assets.hero_img} alt="Shop Forever" />
          </div>
        </div>
      </section>
    </>
  )
}