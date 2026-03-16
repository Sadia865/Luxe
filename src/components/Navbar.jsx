import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useShop, getInitials } from '../context/ShopContext'
import { assets } from '../assets/assets'

/* ── Icons ──────────────────────────────────────────────── */
const Ico = {
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  User:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Heart:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Cart:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Chev:   () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Close:  () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Menu:   () => <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="16" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Order:  () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Out:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Arrow:  () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
}

/* ── Mega menu data ─────────────────────────────────────── */
const MEGA = {
  Men: {
    cols: [
      { head: 'Topwear',    items: ['T-Shirts','Casual Shirts','Formal Shirts','Polo Shirts'] },
      { head: 'Bottomwear', items: ['Trousers','Denim Jeans','Chinos','Shorts'] },
      { head: 'Winterwear', items: ['Denim Jackets','Hoodies','Sweaters','Overcoats'] },
    ],
    tag: 'New Season', title: "Men's Edit", desc: 'Refined essentials for the modern man.',
  },
  Women: {
    cols: [
      { head: 'Topwear',    items: ['Blouses','Cotton Tops','Kurtis','Crop Tops'] },
      { head: 'Bottomwear', items: ['Palazzo Pants','Trousers','Skirts','Jeans'] },
      { head: 'Winterwear', items: ['Zip Jackets','Cardigans','Blazers','Long Coats'] },
    ],
    tag: 'Trending Now', title: "Women's Edit", desc: 'Curated styles for every occasion.',
  },
  Kids: {
    cols: [
      { head: 'Boys',    items: ['Round-Neck Tees','Trousers','Jackets','Casual Sets'] },
      { head: 'Girls',   items: ['Cotton Tops','Frocks','Leggings','Coord Sets'] },
      { head: 'Infants', items: ['Onesies','Sleep Sets','Rompers','Gift Sets'] },
    ],
    tag: 'Back to School', title: "Kids' Collection", desc: 'Comfy & cute, every single day.',
  },
}

/* ── User avatar — initials or icon ────────────────────── */
function UserAvatar({ user, size = 32 }) {
  if (!user?.name) return <Ico.User />
  const initials = getInitials(user.name)
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--gold-dk), var(--gold), var(--gold-lt))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff',
      fontSize: size * 0.38,
      fontWeight: 700,
      fontFamily: 'var(--body)',
      letterSpacing: '.03em',
      flexShrink: 0,
      boxShadow: '0 2px 10px rgba(201,169,110,.4)',
    }}>
      {initials}
    </div>
  )
}

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [drawer,       setDrawer]       = useState(false)
  const [megaOpen,     setMegaOpen]     = useState(null)
  const [profileOpen,  setProfileOpen]  = useState(false)
  const [mobileExpand, setMobileExpand] = useState(null)
  const megaTimer = useRef(null)

  const {
    setShowSearch, setSearch, showSearch,
    getCartCount, getWishlistCount,
    token, user, logout, navigate,
  } = useShop()

  const location = useLocation()
  const cartCount     = getCartCount()
  const wishlistCount = getWishlistCount()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = e => { if (!e.target.closest('.nb-profile')) setProfileOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  useEffect(() => {
    setMegaOpen(null); setDrawer(false); setProfileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawer])

  const openMega  = k => { clearTimeout(megaTimer.current); setMegaOpen(k) }
  const closeMega = ()  => { megaTimer.current = setTimeout(() => setMegaOpen(null), 160) }

  const toggleSearch = () => {
    if (showSearch) { setShowSearch(false); setSearch('') }
    else { setShowSearch(true); if (location.pathname !== '/collection') navigate('/collection') }
  }

  return (
    <>
      {/* ── Announcement bar ─────────────────────── */}
      <div className="nb-announce">
        <span className="nb-dot" />
        Free shipping over $99 &nbsp;·&nbsp; New drops every week &nbsp;·&nbsp;
        Use <strong>FOREVER10</strong> for 10% off
        <span className="nb-dot" />
      </div>

      {/* ── Header ───────────────────────────────── */}
      <header className={`nb-header${scrolled ? ' nb-header--scrolled' : ''}`}>
        <div className="nb-inner">

          <Link to="/" className="nb-logo">
            <img src={assets.logo} alt="Forever" />
          </Link>

          {/* Desktop nav */}
          <nav className="nb-nav">
            <NavLink to="/" end className={({ isActive }) => `nb-link${isActive ? ' active' : ''}`}>Home</NavLink>
            <NavLink to="/collection" className={({ isActive }) => `nb-link${isActive ? ' active' : ''}`}>Collection</NavLink>

            {['Men','Women','Kids'].map(cat => (
              <div key={cat} className="nb-mega-wrap"
                onMouseEnter={() => openMega(cat)} onMouseLeave={closeMega}>
                <button className={`nb-trigger${megaOpen === cat ? ' active' : ''}`}>
                  {cat}
                  <span className={`nb-chev${megaOpen === cat ? ' open' : ''}`}><Ico.Chev /></span>
                </button>
                <div className={`nb-mega${megaOpen === cat ? ' open' : ''}`}
                  onMouseEnter={() => openMega(cat)} onMouseLeave={closeMega}>
                  <div className="nb-mega__grid">
                    {MEGA[cat].cols.map(col => (
                      <div key={col.head} className="nb-mega__col">
                        <p className="nb-mega__col-head">{col.head}</p>
                        <ul>
                          {col.items.map(item => (
                            <li key={item}>
                              <Link to="/collection" className="nb-mega__item"
                                onClick={() => setMegaOpen(null)}>{item}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="nb-mega__feat">
                      <p className="nb-mega__feat-eye">{MEGA[cat].tag}</p>
                      <p className="nb-mega__feat-title">{MEGA[cat].title}</p>
                      <p className="nb-mega__feat-desc">{MEGA[cat].desc}</p>
                      <Link to="/collection" className="nb-mega__feat-btn"
                        onClick={() => setMegaOpen(null)}>
                        Shop Now <Ico.Arrow />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <NavLink to="/about"   className={({ isActive }) => `nb-link${isActive ? ' active' : ''}`}>About</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nb-link${isActive ? ' active' : ''}`}>Contact</NavLink>
          </nav>

          {/* Right actions */}
          <div className="nb-actions">

            {/* Search */}
            <button className="nb-btn" onClick={toggleSearch} title="Search"><Ico.Search /></button>

            {/* Wishlist */}
            <button className="nb-btn" title="Wishlist"
              onClick={() => navigate('/wishlist')} style={{ position: 'relative' }}>
              <Ico.Heart />
              {wishlistCount > 0 && (
                <span className="nb-cart-badge" key={wishlistCount}>{wishlistCount}</span>
              )}
            </button>

            {/* Profile / avatar */}
            <div className="nb-profile">
              <button
                className="nb-btn"
                title="Account"
                onClick={() => token ? setProfileOpen(o => !o) : navigate('/login')}
                style={token && user ? { padding: 0, width: 44, height: 44 } : {}}
              >
                {token && user
                  ? <UserAvatar user={user} size={30} />
                  : <Ico.User />
                }
              </button>

              {profileOpen && token && (
                <div className="nb-profile-panel">
                  <div className="nb-profile-top">
                    <UserAvatar user={user} size={38} />
                    <div style={{ minWidth: 0 }}>
                      <p className="nb-profile-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.name || 'My Account'}
                      </p>
                      <p className="nb-profile-sub" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.email || 'Manage profile'}
                      </p>
                    </div>
                  </div>
                  <div className="nb-profile-sep" />
                  <button className="nb-profile-item"
                    onClick={() => { navigate('/orders'); setProfileOpen(false) }}>
                    <Ico.Order /> My Orders
                  </button>
                  <button className="nb-profile-item"
                    onClick={() => { navigate('/wishlist'); setProfileOpen(false) }}>
                    <Ico.Heart /> Wishlist{wishlistCount > 0 && ` (${wishlistCount})`}
                  </button>
                  <div className="nb-profile-sep" />
                  <button className="nb-profile-item danger"
                    onClick={() => { logout(); setProfileOpen(false) }}>
                    <Ico.Out /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="nb-btn" style={{ position: 'relative' }} title="Cart">
              <Ico.Cart />
              {cartCount > 0 && (
                <span className="nb-cart-badge" key={cartCount}>{cartCount}</span>
              )}
            </Link>

            {/* Hamburger */}
            <button className="nb-btn nb-ham" onClick={() => setDrawer(true)} title="Menu">
              <Ico.Menu />
            </button>
          </div>
        </div>
        <div className="nb-progress" />
      </header>

      {/* ── Overlay ──────────────────────────────── */}
      <div className={`nb-overlay${drawer ? ' open' : ''}`} onClick={() => setDrawer(false)} />

      {/* ── Mobile drawer ────────────────────────── */}
      <aside className={`nb-drawer${drawer ? ' open' : ''}`}>
        <div className="nb-drawer-head">
          <img src={assets.logo} alt="Forever" />
          <button className="nb-drawer-close" onClick={() => setDrawer(false)}><Ico.Close /></button>
        </div>

        {/* User greeting in drawer */}
        {token && user && (
          <div style={{
            padding: '16px 28px',
            background: 'linear-gradient(135deg, rgba(201,169,110,.08), transparent)',
            borderBottom: '1px solid var(--mist)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <UserAvatar user={user} size={40} />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                {user.name?.split(' ')[0] || 'Hello'}
              </p>
              <p style={{ fontSize: 12, color: 'var(--mid)', fontWeight: 300 }}>{user.email}</p>
            </div>
          </div>
        )}

        <div className="nb-drawer-body">
          <NavLink to="/" end className="nb-drawer-link" onClick={() => setDrawer(false)}>Home</NavLink>
          <NavLink to="/collection" className="nb-drawer-link" onClick={() => setDrawer(false)}>Collection</NavLink>

          {['Men','Women','Kids'].map(cat => (
            <div key={cat}>
              <button
                className={`nb-drawer-link${mobileExpand === cat ? ' expanded' : ''}`}
                onClick={() => setMobileExpand(mobileExpand === cat ? null : cat)}>
                {cat}
                <span className={`nb-chev${mobileExpand === cat ? ' open' : ''}`}><Ico.Chev /></span>
              </button>
              <div className={`nb-drawer-sub${mobileExpand === cat ? ' open' : ''}`}>
                {MEGA[cat].cols.map(col => (
                  <div key={col.head} className="nb-drawer-sub-section">
                    <p className="nb-drawer-sub-head">{col.head}</p>
                    {col.items.map(item => (
                      <Link key={item} to="/collection" className="nb-drawer-sub-item"
                        onClick={() => setDrawer(false)}>{item}</Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <NavLink to="/about"   className="nb-drawer-link" onClick={() => setDrawer(false)}>About</NavLink>
          <NavLink to="/contact" className="nb-drawer-link" onClick={() => setDrawer(false)}>Contact</NavLink>
          <NavLink to="/wishlist" className="nb-drawer-link" onClick={() => setDrawer(false)}>
            Wishlist
            {wishlistCount > 0 && (
              <span style={{
                marginLeft: 'auto', background: 'var(--gold)', color: '#fff',
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--r-full)',
              }}>
                {wishlistCount}
              </span>
            )}
          </NavLink>
        </div>

        <div className="nb-drawer-foot">
          {token ? (
            <>
              <button className="nb-drawer-cta" onClick={() => { navigate('/orders'); setDrawer(false) }}>
                My Orders
              </button>
              <button className="nb-drawer-cta ghost" onClick={() => { logout(); setDrawer(false) }}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button className="nb-drawer-cta" onClick={() => { navigate('/login'); setDrawer(false) }}>
                Sign In
              </button>
              <button className="nb-drawer-cta ghost" onClick={() => { navigate('/login'); setDrawer(false) }}>
                Create Account
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  )
}