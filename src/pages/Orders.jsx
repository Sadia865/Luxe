import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import showToast from '../utils/toast'

const STATUS = {
  'Order Placed':     { cls: 'order-status--pending',    label: 'Order Placed'    },
  'Packing':          { cls: 'order-status--processing', label: 'Packing'         },
  'Shipped':          { cls: 'order-status--shipped',    label: 'Shipped'         },
  'Out for delivery': { cls: 'order-status--shipped',    label: 'Out for Delivery' },
  'Delivered':        { cls: 'order-status--delivered',  label: 'Delivered'       },
  'Cancelled':        { cls: 'order-status--cancelled',  label: 'Cancelled'       },
}

const formatDate = (ts) => {
  if (!ts) return '—'
  try {
    return new Date(ts).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    })
  } catch { return '—' }
}

const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
  </svg>
)

export default function Orders() {
  const { token, backendUrl, currency, navigate } = useShop()
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)

  const loadOrders = async () => {
    if (!token) { navigate('/login'); return }
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      )
      if (data.success) {
        setOrders([...data.orders].reverse())
      } else {
        showToast.error('Could not load orders', data.message || 'Please try again')
      }
    } catch (err) {
      showToast.error('Network error', err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [token])

  // Loading spinner
  if (loading) return (
    <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--mid)' }}>
      <div style={{
        width: 44, height: 44,
        border: '3px solid var(--mist)',
        borderTopColor: 'var(--gold)',
        borderRadius: '50%',
        animation: 'spin .8s linear infinite',
        margin: '0 auto 20px',
      }} />
      <p style={{ fontFamily: 'var(--display)', fontSize: 18, color: 'var(--ink)' }}>
        Loading your orders…
      </p>
    </div>
  )

  // Empty state
  if (orders.length === 0) return (
    <>
      <div className="page-header">
        <div className="page-header__inner">
          <h1 className="page-header__title">My Orders</h1>
          <nav className="breadcrumb">
            <a href="/">Home</a><span className="breadcrumb-sep">/</span><span>Orders</span>
          </nav>
        </div>
      </div>
      <div className="orders-page">
        <div className="cart-empty fade-up">
          <div className="cart-empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <p className="cart-empty-title">No orders yet</p>
          <p className="cart-empty-sub">
            Your order history will appear here once you make your first purchase.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/collection" className="btn btn-dark">Start Shopping</Link>
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
            My Orders
            <span style={{ fontSize: 14, fontFamily: 'var(--body)', fontWeight: 400, color: 'var(--mid)', marginLeft: 10 }}>
              ({orders.length})
            </span>
          </h1>
          <nav className="breadcrumb">
            <a href="/">Home</a><span className="breadcrumb-sep">/</span><span>Orders</span>
          </nav>
        </div>
      </div>

      <div className="orders-page">
        {/* Refresh button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={loadOrders}
          >
            <RefreshIcon /> Refresh
          </button>
        </div>

        <div className="fade-up">
          {orders.map((order, idx) => {
            const status = STATUS[order.status] || STATUS['Order Placed']
            const orderId = order._id
              ? `#${order._id.slice(-8).toUpperCase()}`
              : `#ORDER${idx + 1}`

            return (
              <div key={order._id || idx} className="order-card">
                {/* Header */}
                <div className="order-card__head">
                  <div>
                    <p className="order-card__id">{orderId}</p>
                    <p className="order-card__date">{formatDate(order.date)}</p>
                  </div>
                  <div className={`order-status ${status.cls}`}>
                    <span className="order-status-dot" />
                    {status.label}
                  </div>
                  <p className="order-card__total">
                    {currency}{order.amount}
                  </p>
                </div>

                {/* Items */}
                <div className="order-card__body">
                  <div className="order-products">
                    {(order.items || []).slice(0, 3).map((item, i) => (
                      <div key={i} className="order-product-row">
                        {item.image?.[0] && (
                          <div className="order-product-img">
                            <img
                              src={item.image[0]}
                              alt={item.name}
                              onError={e => e.target.style.display = 'none'}
                            />
                          </div>
                        )}
                        <div>
                          <p className="order-product-name">{item.name}</p>
                          <p className="order-product-meta">
                            Size: {item.size} · Qty: {item.quantity} · {currency}{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(order.items || []).length > 3 && (
                      <p style={{ fontSize: 13, color: 'var(--mid)', paddingTop: 8 }}>
                        +{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* Footer row */}
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', marginTop: 20,
                    flexWrap: 'wrap', gap: 12,
                  }}>
                    <div style={{ fontSize: 13, color: 'var(--mid)', fontWeight: 300 }}>
                      Payment: <strong style={{ color: 'var(--ink)', fontWeight: 500, textTransform: 'capitalize' }}>
                        {order.paymentMethod || 'COD'}
                      </strong>
                      {' · '}
                      <span style={{ color: order.payment ? 'var(--success)' : 'var(--mid)' }}>
                        {order.payment ? '✓ Paid' : 'Pending'}
                      </span>
                    </div>
                    <button className="order-track-btn" onClick={loadOrders}>
                      <RefreshIcon /> Track Order
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}