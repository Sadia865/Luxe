import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import showToast from '../utils/toast'

/* ── Form validation ────────────────────────────────────── */
const validateForm = (f) => {
  if (!f.firstName.trim())  return 'First name is required'
  if (!f.lastName.trim())   return 'Last name is required'
  if (!f.email.trim())      return 'Email address is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return 'Invalid email address'
  if (!f.phone.trim())      return 'Phone number is required'
  if (!/^\+?[\d\s\-(). ]{7,20}$/.test(f.phone))    return 'Invalid phone number'
  if (!f.address1.trim())   return 'Street address is required'
  if (!f.city.trim())       return 'City is required'
  if (!f.state.trim())      return 'State / region is required'
  if (!f.zip.trim())        return 'ZIP / postal code is required'
  if (!f.country.trim())    return 'Country is required'
  return null
}

export default function PlaceOrder() {
  const {
    cartItems, products, currency,
    getCartAmount, delivery_fee,
    token, backendUrl,
    clearCart, navigate,
  } = useShop()

  const [form, setForm] = useState({
    firstName: '', lastName: '',
    email: '', phone: '',
    address1: '', address2: '',
    city: '', state: '', zip: '',
    country: 'United States',
  })
  const [payment, setPayment] = useState('cod')
  const [loading, setLoading] = useState(false)

  // Build ordered items list
  const cartData = []
  Object.entries(cartItems).forEach(([id, sizes]) => {
    Object.entries(sizes).forEach(([size, qty]) => {
      if (qty > 0) {
        const p = products.find(p => p._id === id)
        if (p) cartData.push({ ...p, size, qty })
      }
    })
  })

  const subtotal = getCartAmount()
  const shipping = subtotal >= 99 ? 0 : delivery_fee
  const total    = subtotal + shipping

  // Redirect to cart if empty
  useEffect(() => {
    if (Object.keys(cartItems).length === 0) navigate('/cart')
  }, [cartItems])

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const placeOrder = async e => {
    e.preventDefault()
    const err = validateForm(form)
    if (err) { showToast.error('Validation error', err); return }

    if (!token) {
      showToast.error('Sign in required', 'Please sign in to place your order')
      navigate('/login', { state: { from: '/place-order' } })
      return
    }

    setLoading(true)
    const orderData = {
      address: form,
      items: cartData.map(({ _id, name, price, image, size, qty }) => ({
        _id, name, price, image, size, quantity: qty,
      })),
      amount: total,
    }

    try {
      if (payment === 'cod') {
        const { data } = await axios.post(
          `${backendUrl}/api/order/place`,
          orderData,
          { headers: { token } }
        )
        if (data.success) {
          clearCart()
          showToast.order()
          navigate('/orders')
        } else {
          showToast.error('Order failed', data.message || 'Please try again')
        }
      } else {
        const { data } = await axios.post(
          `${backendUrl}/api/order/stripe`,
          orderData,
          { headers: { token } }
        )
        if (data.success) {
          window.location.replace(data.session_url)
        } else {
          showToast.error('Payment failed', data.message || 'Please try again')
        }
      }
    } catch (err) {
      showToast.error('Something went wrong', err.response?.data?.message || 'Please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header__inner">
          <h1 className="page-header__title">Checkout</h1>
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <Link to="/cart">Cart</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Checkout</span>
          </nav>
        </div>
      </div>

      <div className="place-order-page">
        <form onSubmit={placeOrder} noValidate>
          <div className="place-order-layout">

            {/* ── Left — forms ──────────────────────── */}
            <div>
              {/* Step 1 — Delivery */}
              <div className="form-section fade-up">
                <h2 className="form-section__title">
                  <span className="form-section__step">1</span>
                  Delivery Information
                </h2>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input name="firstName" type="text" className="form-input"
                      placeholder="Jane" value={form.firstName} onChange={update} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input name="lastName" type="text" className="form-input"
                      placeholder="Doe" value={form.lastName} onChange={update} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input name="email" type="email" className="form-input"
                      placeholder="jane@example.com" value={form.email} onChange={update} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input name="phone" type="tel" className="form-input"
                      placeholder="+1 555 000 0000" value={form.phone} onChange={update} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <input name="address1" type="text" className="form-input"
                    placeholder="123 Main Street" value={form.address1} onChange={update} />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Apartment / Suite
                    <span style={{ fontWeight: 300, opacity: .6, marginLeft: 6, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                  </label>
                  <input name="address2" type="text" className="form-input"
                    placeholder="Apt 4B" value={form.address2} onChange={update} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input name="city" type="text" className="form-input"
                      placeholder="New York" value={form.city} onChange={update} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input name="state" type="text" className="form-input"
                      placeholder="NY" value={form.state} onChange={update} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">ZIP Code *</label>
                    <input name="zip" type="text" className="form-input"
                      placeholder="10001" value={form.zip} onChange={update} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country *</label>
                    <input name="country" type="text" className="form-input"
                      value={form.country} onChange={update} />
                  </div>
                </div>
              </div>

              {/* Step 2 — Payment */}
              <div className="form-section fade-up d2">
                <h2 className="form-section__title">
                  <span className="form-section__step">2</span>
                  Payment Method
                </h2>
                <div className="payment-methods">
                  <label className={`payment-option${payment === 'stripe' ? ' selected' : ''}`}>
                    <input type="radio" name="payment" value="stripe"
                      checked={payment === 'stripe'} onChange={() => setPayment('stripe')} />
                    <span className="payment-option-label">Credit / Debit Card</span>
                    <img src={assets.stripe_logo} alt="Stripe" className="payment-option-logo" />
                    <span className="payment-option-tag">Recommended</span>
                  </label>
                  <label className={`payment-option${payment === 'cod' ? ' selected' : ''}`}>
                    <input type="radio" name="payment" value="cod"
                      checked={payment === 'cod'} onChange={() => setPayment('cod')} />
                    <span className="payment-option-label">Cash on Delivery</span>
                    <span style={{ fontSize: 22 }}>💵</span>
                  </label>
                </div>
                {payment === 'stripe' && (
                  <p style={{
                    fontSize: 12.5, color: 'var(--mid)', marginTop: 14, lineHeight: 1.65,
                    padding: '10px 14px', background: 'var(--snow)', borderRadius: 'var(--r-md)',
                    fontWeight: 300,
                  }}>
                    🔒 You'll be redirected to Stripe's secure page. Your card details are never stored on our servers.
                  </p>
                )}
              </div>
            </div>

            {/* ── Right — summary ───────────────────── */}
            <div className="order-summary fade-up d1">
              <h2 className="order-summary__title">Order Summary</h2>

              {cartData.map(item => (
                <div key={`${item._id}-${item.size}`} className="order-item">
                  <div className="order-item-img">
                    <img src={item.image[0]} alt={item.name}
                      onError={e => e.target.style.display = 'none'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="order-item-name">{item.name}</p>
                    <p className="order-item-meta">Size: {item.size} · Qty: {item.qty}</p>
                  </div>
                  <p className="order-item-price">{currency}{item.price * item.qty}</p>
                </div>
              ))}

              <div style={{ borderTop: '1px solid var(--mist)', marginTop: 16, paddingTop: 16 }}>
                {[
                  ['Subtotal', `${currency}${subtotal}`],
                  ['Shipping', shipping === 0 ? '🎁 Free' : `${currency}${shipping}`],
                ].map(([k, v]) => (
                  <div key={k} style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginBottom: 10, fontSize: 14, color: 'var(--graphite)', fontWeight: 300,
                  }}>
                    <span>{k}</span><span>{v}</span>
                  </div>
                ))}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 20, fontFamily: 'var(--display)', fontWeight: 500, color: 'var(--ink)',
                  marginTop: 14, paddingTop: 14, borderTop: '2px solid var(--mist)',
                }}>
                  <span>Total</span><span>{currency}{total}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-gold"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', marginTop: 24, opacity: loading ? .75 : 1 }}>
                {loading
                  ? <><span className="btn-spinner" /> Processing…</>
                  : `Place Order · ${currency}${total}`
                }
              </button>

              <p style={{ fontSize: 11.5, color: 'var(--mid)', textAlign: 'center', marginTop: 12, fontWeight: 300 }}>
                🔒 SSL encrypted · Safe & secure checkout
              </p>
              <Link to="/cart" style={{
                display: 'block', textAlign: 'center', marginTop: 12,
                fontSize: 12.5, color: 'var(--soft)',
              }}>← Edit Cart</Link>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}