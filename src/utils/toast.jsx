/**
 * Premium Toast System
 * Usage: showToast.success('Title', 'Optional subtitle')
 *        showToast.error('Title', 'Optional subtitle')
 *        showToast.warning('Title', 'Optional subtitle')
 *        showToast.info('Title', 'Optional subtitle')
 *        showToast.cart('Product name added') — special cart toast
 *        showToast.wish(true/false)           — wishlist toggle toast
 */
import { toast } from 'react-toastify'

/* ── Refined SVG Icons ───────────────────────────────────── */
const Icons = {
  success: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  error: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
  warning: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  info: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  cart: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  heart: (filled = false) => (
    <svg width="17" height="17" viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  check: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  copy: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  remove: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
  tag: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  size: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
}

/* ── Toast builder ───────────────────────────────────────── */
const buildContent = (type, title, msg) => (
  <div className="toast-inner">
    <div className={`toast-icon-wrap toast-icon-wrap--${type}`}>
      {Icons[type] || Icons.info}
    </div>
    <div className="toast-content">
      <p className="toast-title">{title}</p>
      {msg && <p className="toast-msg">{msg}</p>}
    </div>
  </div>
)

const opts = (extra = {}) => ({
  autoClose: 2400,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  ...extra,
})

/* ── Public API ──────────────────────────────────────────── */
export const showToast = {
  success: (title, msg, extra) =>
    toast.success(buildContent('success', title, msg), opts(extra)),

  error: (title, msg, extra) =>
    toast.error(buildContent('error', title, msg), opts({ autoClose: 3200, ...extra })),

  warning: (title, msg, extra) =>
    toast.warning(buildContent('warning', title, msg), opts(extra)),

  info: (title, msg, extra) =>
    toast.info(buildContent('info', title, msg), opts(extra)),

  // Cart add — shows product name + size
  cart: (productName, size, extra) =>
    toast.success(
      <div className="toast-inner">
        <div className="toast-icon-wrap toast-icon-wrap--success">
          {Icons.cart}
        </div>
        <div className="toast-content">
          <p className="toast-title">Added to cart</p>
          <p className="toast-msg">{productName}{size ? ` · Size ${size}` : ''}</p>
        </div>
      </div>,
      opts({ autoClose: 2000, ...extra })
    ),

  // Wishlist toggle
  wish: (added, productName, extra) =>
    toast(
      <div className="toast-inner">
        <div className={`toast-icon-wrap toast-icon-wrap--${added ? 'error' : 'default'}`}
          style={added ? { color: '#C43333' } : {}}>
          {Icons.heart(added)}
        </div>
        <div className="toast-content">
          <p className="toast-title">{added ? 'Saved to wishlist' : 'Removed from wishlist'}</p>
          {productName && <p className="toast-msg">{productName}</p>}
        </div>
      </div>,
      opts({ autoClose: 1600, ...extra })
    ),

  // Remove item
  remove: (name, extra) =>
    toast(
      <div className="toast-inner">
        <div className="toast-icon-wrap toast-icon-wrap--default">{Icons.remove}</div>
        <div className="toast-content">
          <p className="toast-title">Item removed</p>
          {name && <p className="toast-msg">{name}</p>}
        </div>
      </div>,
      opts({ autoClose: 1800, ...extra })
    ),

  // Coupon applied
  coupon: (label, extra) =>
    toast.success(
      <div className="toast-inner">
        <div className="toast-icon-wrap toast-icon-wrap--success">{Icons.tag}</div>
        <div className="toast-content">
          <p className="toast-title">Coupon applied</p>
          <p className="toast-msg">{label}</p>
        </div>
      </div>,
      opts(extra)
    ),

  // Size error
  sizeRequired: (extra) =>
    toast.error(
      <div className="toast-inner">
        <div className="toast-icon-wrap toast-icon-wrap--warning">{Icons.size}</div>
        <div className="toast-content">
          <p className="toast-title">Select a size first</p>
          <p className="toast-msg">Choose your size before adding to cart</p>
        </div>
      </div>,
      opts({ autoClose: 2600, ...extra })
    ),

  // Copied to clipboard
  copied: (extra) =>
    toast(
      <div className="toast-inner">
        <div className="toast-icon-wrap toast-icon-wrap--info">{Icons.copy}</div>
        <div className="toast-content">
          <p className="toast-title">Link copied</p>
          <p className="toast-msg">Share this product with friends</p>
        </div>
      </div>,
      opts({ autoClose: 1800, ...extra })
    ),

  // Order placed
  order: (extra) =>
    toast.success(
      <div className="toast-inner">
        <div className="toast-icon-wrap toast-icon-wrap--success">{Icons.check}</div>
        <div className="toast-content">
          <p className="toast-title">Order placed!</p>
          <p className="toast-msg">We'll send you a confirmation shortly</p>
        </div>
      </div>,
      opts({ autoClose: 3500, ...extra })
    ),
}

export default showToast