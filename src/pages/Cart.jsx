import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import showToast from '../utils/toast'

/* ── Icons ──────────────────────────────────────────────── */
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)
const CartEmptyIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const TagIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)

const COUPONS = {
  FOREVER10: { discount: 10, label: '10% off your order' },
  SAVE20:    { discount: 20, label: '20% off your order' },
  FREESHIP:  { discount: 0,  label: 'Free shipping', freeShip: true },
}

/* ── Mobile cart item card ──────────────────────────────── */
function MobileCartItem({ item, currency, onQty, onRemove }) {
  return (
    <div style={{
      display: 'flex', gap: 14,
      padding: '16px',
      background: 'var(--white)',
      border: '1px solid var(--mist)',
      borderRadius: 'var(--r-xl)',
      marginBottom: 14,
      boxShadow: 'var(--sh-xs)',
      position: 'relative',
    }}>
      {/* Image */}
      <Link to={`/product/${item._id}`} style={{ flexShrink: 0 }}>
        <div style={{ width: 80, height: 96, borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--sand)' }}>
          <img src={item.image[0]} alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => e.target.style.display = 'none'} />
        </div>
      </Link>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Link to={`/product/${item._id}`} style={{ textDecoration: 'none' }}>
          <p style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.4, marginBottom: 4,
            overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {item.name}
          </p>
        </Link>
        <span style={{
          display: 'inline-block', padding: '3px 10px',
          background: 'var(--sand)', borderRadius: 'var(--r-full)',
          fontSize: 10.5, fontWeight: 600, color: 'var(--mid)',
          marginBottom: 10,
        }}>{item.size}</span>

        {/* Price + qty row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div className="qty-control">
            <button className="qty-btn" onClick={() => onQty(-1)}>−</button>
            <span className="qty-num">{item.qty}</span>
            <button className="qty-btn" onClick={() => onQty(+1)}>+</button>
          </div>
          <p style={{ fontFamily: 'var(--display)', fontSize: 16, fontWeight: 500, color: 'var(--ink)' }}>
            {currency}{item.price * item.qty}
          </p>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        style={{
          position: 'absolute', top: 12, right: 12,
          width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 'var(--r-full)', background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--mist)', transition: 'all .15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#fff3f3'; e.currentTarget.style.color = 'var(--error)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--mist)' }}
      >
        <TrashIcon />
      </button>
    </div>
  )
}

export default function Cart() {
  const {
    products, cartItems, currency,
    updateQuantity, removeFromCart, clearCart,
    getCartAmount, delivery_fee, navigate,
  } = useShop()

  const [cartData,    setCartData]    = useState([])
  const [coupon,      setCoupon]      = useState('')
  const [appliedCode, setAppliedCode] = useState(null)
  const [removingId,  setRemovingId]  = useState(null)
  const [isMobile,    setIsMobile]    = useState(window.innerWidth <= 768)

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  useEffect(() => {
    const data = []
    Object.entries(cartItems).forEach(([id, sizes]) => {
      Object.entries(sizes).forEach(([size, qty]) => {
        if (qty > 0) {
          const product = products.find(p => p._id === id)
          if (product) data.push({ ...product, size, qty })
        }
      })
    })
    setCartData(data)
  }, [cartItems, products])

  const subtotal    = getCartAmount()
  const couponData  = appliedCode ? COUPONS[appliedCode] : null
  const discountAmt = couponData ? Math.round(subtotal * (couponData.discount || 0) / 100) : 0
  const freeShip    = couponData?.freeShip
  const shipping    = (subtotal >= 99 || freeShip) ? 0 : delivery_fee
  const total       = subtotal - discountAmt + shipping

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase()
    if (!code) { showToast.error('Invalid coupon', 'Please enter a coupon code'); return }
    if (COUPONS[code]) {
      setAppliedCode(code)
      showToast.coupon(COUPONS[code].label)
      setCoupon('')
    } else {
      showToast.error('Invalid coupon', 'Try FOREVER10, SAVE20 or FREESHIP')
    }
  }

  const removeCoupon = () => {
    setAppliedCode(null)
    showToast.info('Coupon removed', 'Your discount has been removed')
  }

  const handleRemove = async (itemId, size, name) => {
    setRemovingId(`${itemId}-${size}`)
    await new Promise(r => setTimeout(r, 250))
    removeFromCart(itemId, size)
    setRemovingId(null)
    showToast.remove(name.slice(0, 36))
  }

  const handleQty = (itemId, size, delta, currentQty) => {
    const next = currentQty + delta
    if (next < 1) {
      const item = cartData.find(d => d._id === itemId && d.size === size)
      handleRemove(itemId, size, item?.name || 'Item')
      return
    }
    if (next > 99) return
    updateQuantity(itemId, size, next)
  }

  // Empty state
  if (cartData.length === 0) return (
    <>
      <div className="page-header">
        <div className="page-header__inner">
          <h1 className="page-header__title">Your Cart</h1>
          <nav className="breadcrumb">
            <a href="/">Home</a><span className="breadcrumb-sep">/</span><span>Cart</span>
          </nav>
        </div>
      </div>
      <div className="cart-page">
        <div className="cart-empty fade-up">
          <div className="cart-empty-icon"><CartEmptyIcon /></div>
          <p className="cart-empty-title">Your cart is empty</p>
          <p className="cart-empty-sub">
            Looks like you haven't added anything yet.<br />
            Explore our collection and find something you love.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/collection" className="btn btn-dark">Browse Collection</Link>
            <Link to="/wishlist"   className="btn btn-outline">View Wishlist</Link>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <div className="page-header">
        <div className="page-header__inner">
          <h1 className="page-header__title">
            Your Cart
            <span style={{ fontSize: 14, fontFamily: 'var(--body)', fontWeight: 400, color: 'var(--mid)', marginLeft: 10 }}>
              ({cartData.length} {cartData.length === 1 ? 'item' : 'items'})
            </span>
          </h1>
          <nav className="breadcrumb">
            <a href="/">Home</a><span className="breadcrumb-sep">/</span><span>Cart</span>
          </nav>
        </div>
      </div>

      <div className="cart-page">
        <div className="cart-layout">

          {/* ── Items ──────────────────────────────── */}
          <div>
            {isMobile ? (
              /* ── Mobile card layout ── */
              <>
                {cartData.map(item => {
                  const key = `${item._id}-${item.size}`
                  return (
                    <div key={key} style={{ opacity: removingId === key ? 0.4 : 1, transition: 'opacity .25s' }}>
                      <MobileCartItem
                        item={item}
                        currency={currency}
                        onQty={delta => handleQty(item._id, item.size, delta, item.qty)}
                        onRemove={() => handleRemove(item._id, item.size, item.name)}
                      />
                    </div>
                  )
                })}
              </>
            ) : (
              /* ── Desktop table layout ── */
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartData.map(item => {
                    const key = `${item._id}-${item.size}`
                    return (
                      <tr key={key} className="cart-row"
                        style={{ opacity: removingId === key ? 0.4 : 1, transition: 'opacity .25s' }}>
                        <td>
                          <div className="cart-product">
                            <Link to={`/product/${item._id}`} className="cart-product-img">
                              <img src={item.image[0]} alt={item.name}
                                onError={e => e.target.style.display = 'none'} />
                            </Link>
                            <div>
                              <Link to={`/product/${item._id}`} className="cart-product-name"
                                style={{ textDecoration: 'none' }}>{item.name}</Link>
                              <div style={{ marginTop: 6 }}>
                                <span className="cart-product-size">{item.size}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td><p className="cart-price">{currency}{item.price}</p></td>
                        <td>
                          <div className="qty-control">
                            <button className="qty-btn" onClick={() => handleQty(item._id, item.size, -1, item.qty)}>−</button>
                            <span className="qty-num">{item.qty}</span>
                            <button className="qty-btn" onClick={() => handleQty(item._id, item.size, +1, item.qty)}>+</button>
                          </div>
                        </td>
                        <td><p className="cart-price">{currency}{item.price * item.qty}</p></td>
                        <td>
                          <button className="cart-remove"
                            onClick={() => handleRemove(item._id, item.size, item.name)}>
                            <TrashIcon />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}

            {/* Bottom actions */}
            <div style={{
              marginTop: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}>
              <Link to="/collection" className="btn btn-outline btn-sm">← Continue Shopping</Link>
              <button className="btn btn-sm"
                style={{ color: 'var(--error)', border: '1.5px solid rgba(216,92,92,.3)', borderRadius: 'var(--r-full)' }}
                onClick={() => { clearCart(); showToast.remove('All items removed from cart') }}>
                Clear Cart
              </button>
            </div>
          </div>

          {/* ── Summary sidebar ──────────────────────── */}
          <div className="cart-summary fade-up">
            <h2 className="cart-summary__title">Order Summary</h2>

            <div className="cart-summary-row">
              <span>Subtotal ({cartData.reduce((s, i) => s + i.qty, 0)} items)</span>
              <span>{currency}{subtotal}</span>
            </div>

            {discountAmt > 0 && (
              <div className="cart-summary-row" style={{ color: 'var(--success)' }}>
                <span>Discount ({couponData.discount}% off)</span>
                <span>−{currency}{discountAmt}</span>
              </div>
            )}

            <div className="cart-summary-row">
              <span>Shipping</span>
              <span>
                {shipping === 0
                  ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>Free</span>
                  : `${currency}${shipping}`}
              </span>
            </div>

            {subtotal < 99 && !freeShip && (
              <p style={{
                fontSize: 12, color: 'var(--mid)', marginBottom: 8,
                padding: '8px 12px', background: 'var(--snow)',
                borderRadius: 'var(--r-md)', lineHeight: 1.5,
              }}>
                Add <strong style={{ color: 'var(--gold-dk)' }}>{currency}{99 - subtotal}</strong> more for free shipping
              </p>
            )}

            <div className="cart-summary-row total">
              <span>Total</span><span>{currency}{total}</span>
            </div>

            {appliedCode && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', marginTop: 4,
                background: 'rgba(76,175,125,.08)',
                border: '1px solid rgba(76,175,125,.2)',
                borderRadius: 'var(--r-lg)', fontSize: 13,
              }}>
                <span>
                  <TagIcon />{' '}
                  <strong style={{ color: 'var(--success)', marginLeft: 6 }}>{appliedCode}</strong>
                  <span style={{ color: 'var(--mid)', marginLeft: 6 }}>applied</span>
                </span>
                <button onClick={removeCoupon}
                  style={{ fontSize: 11, color: 'var(--error)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--body)' }}>
                  Remove
                </button>
              </div>
            )}

            {!appliedCode && (
              <div className="cart-coupon" style={{ marginTop: 16 }}>
                <input type="text" placeholder="Coupon code"
                  value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && applyCoupon()} />
                <button className="cart-coupon-btn" onClick={applyCoupon}>Apply</button>
              </div>
            )}

            {!appliedCode && (
              <p style={{ fontSize: 11.5, color: 'var(--soft)', marginTop: 8 }}>
                Try <strong>FOREVER10</strong> · <strong>SAVE20</strong> · <strong>FREESHIP</strong>
              </p>
            )}

            <button className="btn btn-dark"
              style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}
              onClick={() => navigate('/place-order')}>
              Proceed to Checkout
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>

            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
              {['🔒 Secure', '↩️ Free Returns', '✅ SSL'].map(t => (
                <span key={t} style={{ fontSize: 11, color: 'var(--mid)', fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}