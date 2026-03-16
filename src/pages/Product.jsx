import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { assets } from '../assets/assets'
import ProductCard from '../components/ProductCard'
import { toast } from 'react-toastify'
import showToast from '../utils/toast'

const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)
const ShareIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function Product() {
  const { productId } = useParams()

  // Single useShop call — fixed
  const {
    products, currency, addToCart,
    isWished, toggleWishlist, navigate,
  } = useShop()

  const [product,   setProduct]   = useState(null)
  const [mainImg,   setMainImg]   = useState('')
  const [size,      setSize]      = useState('')
  const [qty,       setQty]       = useState(1)
  const [related,   setRelated]   = useState([])
  const [activeTab, setActiveTab] = useState('desc')
  const [added,     setAdded]     = useState(false)

  const wished = product ? isWished(product._id) : false

  useEffect(() => {
    const p = products.find(p => p._id === productId)
    if (p) {
      setProduct(p)
      setMainImg(p.image[0])
      setSize('')
      setQty(1)
      setAdded(false)
      setRelated(
        products
          .filter(r => r.category === p.category && r._id !== p._id)
          .slice(0, 4)
      )
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [productId, products])

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--mid)' }}>
      <p style={{ fontFamily: 'var(--display)', fontSize: 26, color: 'var(--ink)', marginBottom: 12 }}>
        Product not found
      </p>
      <Link to="/collection" className="btn btn-outline" style={{ marginTop: 16 }}>
        Back to Collection
      </Link>
    </div>
  )

  const handleAddToCart = () => {
    if (!size) { showToast.sizeRequired(); return }
    for (let i = 0; i < qty; i++) addToCart(product._id, size)
    showToast.cart(product.name, size)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    if (!size) { showToast.sizeRequired(); return }
    for (let i = 0; i < qty; i++) addToCart(product._id, size)
    navigate('/place-order')
  }

  const handleWishlist = () => {
    toggleWishlist(product._id)
    showToast.wish(!wished, product.name)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href })
    } else {
      navigator.clipboard?.writeText(window.location.href)
      showToast.copied()
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header__inner">
          <h1 className="page-header__title" style={{ fontSize: '1.2rem' }}>
            {product.name}
          </h1>
          <nav className="breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">/</span>
            <a href="/collection">Collection</a>
            <span className="breadcrumb-sep">/</span>
            <span>{product.category}</span>
          </nav>
        </div>
      </div>

      <div className="product-page">
        <div className="product-layout">

          {/* ── Image Gallery ──────────────────────── */}
          <div className="product-gallery">
            {/* Thumbnails */}
            <div className="product-thumbs">
              {product.image.map((img, i) => (
                <div
                  key={i}
                  className={`product-thumb${mainImg === img ? ' active' : ''}`}
                  onClick={() => setMainImg(img)}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`}
                    onError={e => e.target.style.display = 'none'} />
                </div>
              ))}
            </div>
            {/* Main image */}
            <div className="product-main-img">
              <img
                src={mainImg}
                alt={product.name}
                onError={e => e.target.style.display = 'none'}
              />
            </div>
          </div>

          {/* ── Product Info ───────────────────────── */}
          <div className="product-info fade-up">

            {product.bestseller && (
              <p className="product-info__badge">
                <img src={assets.star_icon} alt="" style={{ width: 13 }} />
                Best Seller
              </p>
            )}

            <h1 className="product-info__name">{product.name}</h1>

            {/* Stars + reviews */}
            <div className="product-info__stars">
              {[1,2,3,4,5].map(i => (
                <img
                  key={i}
                  src={i <= 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="" className="product-info__star"
                />
              ))}
              <span className="product-info__review-count">(122 reviews)</span>
            </div>

            <p className="product-info__price">{currency}{product.price}</p>

            <p className="product-info__desc">{product.description}</p>

            {/* Size selector */}
            <p className="product-info__label">
              Select Size
              {size && <span style={{ color: 'var(--gold-dk)', marginLeft: 10, fontSize: 13, fontFamily: 'var(--body)' }}>— {size}</span>}
            </p>
            <div className="size-grid">
              {product.sizes.map(s => (
                <button
                  key={s}
                  className={`size-btn${size === s ? ' selected' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Quantity selector */}
            <p className="product-info__label" style={{ marginBottom: 10 }}>Quantity</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-num">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => Math.min(10, q + 1))}>+</button>
              </div>
              <span style={{ fontSize: 12, color: 'var(--soft)', marginLeft: 12, fontWeight: 300 }}>
                Max 10 per order
              </span>
            </div>

            {/* Actions */}
            <div className="product-add-row">
              <button
                className={`btn product-add-btn${added ? '' : ' btn-dark'}`}
                onClick={handleAddToCart}
                style={added
                  ? { background: 'var(--success)', color: 'var(--white)', flex: 1, justifyContent: 'center', borderRadius: 'var(--r-full)' }
                  : { justifyContent: 'center' }
                }
              >
                {added
                  ? <><CheckIcon /> Added to Cart!</>
                  : <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                      </svg>
                      Add to Cart
                    </>
                }
              </button>

              <button
                className={`product-wish-btn${wished ? ' active' : ''}`}
                onClick={handleWishlist}
                title={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <HeartIcon filled={wished} />
              </button>

              <button
                className="product-wish-btn"
                onClick={handleShare}
                title="Share product"
              >
                <ShareIcon />
              </button>
            </div>

            {/* Buy Now */}
            <button
              className="btn btn-gold"
              style={{ width: '100%', justifyContent: 'center', marginBottom: 28 }}
              onClick={handleBuyNow}
            >
              Buy Now — {currency}{product.price * qty}
            </button>

            {/* Guarantee strip */}
            <div style={{
              display: 'flex', gap: 0,
              borderTop: '1px solid var(--mist)',
              borderBottom: '1px solid var(--mist)',
              marginBottom: 24,
            }}>
              {[
                { icon: 'exchange_icon', text: 'Free Returns' },
                { icon: 'quality_icon',  text: 'Genuine' },
                { icon: 'support_img',   text: '24/7 Support' },
              ].map((g, i) => (
                <div key={g.text} style={{
                  flex: 1, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 7, padding: '14px 8px',
                  borderRight: i < 2 ? '1px solid var(--mist)' : 'none',
                }}>
                  <img src={assets[g.icon]} alt="" style={{ width: 18, opacity: .55 }} />
                  <span style={{ fontSize: 11.5, color: 'var(--mid)', fontWeight: 500 }}>{g.text}</span>
                </div>
              ))}
            </div>

            {/* Product meta */}
            <div className="product-meta">
              <p className="product-meta-row">Category: <span>{product.category}</span></p>
              <p className="product-meta-row">Type: <span>{product.subCategory}</span></p>
              <p className="product-meta-row">SKU: <span>{product._id.toUpperCase()}</span></p>
              <p className="product-meta-row">
                Availability:{' '}
                <span style={{ color: 'var(--success)' }}>✓ In Stock</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────── */}
        <div style={{ marginTop: 56, borderTop: '1px solid var(--mist)', paddingTop: 40 }}>
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--mist)', marginBottom: 32 }}>
            {[['desc','Description'], ['care','Care & Material'], ['reviews','Reviews (122)'], ['shipping','Shipping']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: '12px 28px', fontSize: 12.5, fontWeight: 600,
                  letterSpacing: '.08em', textTransform: 'uppercase',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: activeTab === key ? 'var(--ink)' : 'var(--mid)',
                  borderBottom: activeTab === key ? '2px solid var(--gold)' : '2px solid transparent',
                  marginBottom: -1, fontFamily: 'var(--body)', transition: 'all .2s',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="fade-in" style={{ maxWidth: 680 }}>
            {activeTab === 'desc' && (
              <div style={{ color: 'var(--mid)', fontSize: 15, lineHeight: 1.8, fontWeight: 300 }}>
                <p style={{ marginBottom: 16 }}>{product.description}</p>
                <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['100% premium quality fabric','Machine washable at 30°C',
                    `Available in ${product.sizes.join(', ')} sizes`,
                    'Lightweight and breathable','Perfect for everyday wear',
                    'Sustainably sourced materials'].map(item => (
                    <li key={item} style={{ color: 'var(--graphite)', fontSize: 14 }}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'care' && (
              <div style={{ color: 'var(--mid)', fontSize: 14.5, lineHeight: 1.8, fontWeight: 300 }}>
                {[
                  ['🫧', 'Machine wash cold (30°C max)'],
                  ['🚫', 'Do not bleach'],
                  ['♨️', 'Tumble dry low heat'],
                  ['👕', 'Iron on low heat'],
                  ['🧴', 'Do not dry clean'],
                  ['📦', 'Material: 100% Cotton'],
                ].map(([icon, text]) => (
                  <div key={text} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <span>{icon}</span><span>{text}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div style={{ fontSize: 14.5 }}>
                {/* Rating summary */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 28 }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--display)', fontSize: 52, fontWeight: 400, color: 'var(--ink)', lineHeight: 1 }}>4.0</p>
                    <div style={{ display: 'flex', gap: 3, justifyContent: 'center', margin: '8px 0' }}>
                      {[1,2,3,4,5].map(i => (
                        <img key={i} src={i <= 4 ? assets.star_icon : assets.star_dull_icon} alt="" style={{ width: 16 }} />
                      ))}
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--mid)' }}>Based on 122 reviews</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    {[5,4,3,2,1].map((star, i) => {
                      const pct = [30,45,15,6,4][i]
                      return (
                        <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <span style={{ fontSize: 12, width: 8, color: 'var(--mid)' }}>{star}</span>
                          <img src={assets.star_icon} alt="" style={{ width: 12 }} />
                          <div style={{ flex: 1, height: 6, background: 'var(--mist)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: 'linear-gradient(90deg,var(--gold-dk),var(--gold))', width: `${pct}%`, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--soft)', width: 28 }}>{pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                {/* Sample reviews */}
                {[
                  { name: 'Sarah M.', rating: 5, text: 'Absolutely love this! The quality is incredible and the fit is perfect.', date: '2 days ago' },
                  { name: 'James K.', rating: 4, text: 'Great product, fast shipping. Would definitely buy again.', date: '1 week ago' },
                  { name: 'Emma L.', rating: 5, text: 'Exactly as described. Beautiful fabric and true to size.', date: '2 weeks ago' },
                ].map(r => (
                  <div key={r.name} style={{ padding: '18px 0', borderTop: '1px solid var(--mist)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{r.name}</span>
                        <div style={{ display: 'flex', gap: 2, marginTop: 3 }}>
                          {[1,2,3,4,5].map(i => <img key={i} src={i <= r.rating ? assets.star_icon : assets.star_dull_icon} alt="" style={{ width: 12 }} />)}
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--soft)' }}>{r.date}</span>
                    </div>
                    <p style={{ fontSize: 13.5, color: 'var(--mid)', lineHeight: 1.65, fontWeight: 300 }}>{r.text}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div style={{ fontSize: 14, color: 'var(--mid)', lineHeight: 1.8, fontWeight: 300 }}>
                {[
                  ['🚚', 'Standard Shipping', '5–7 business days', 'Free on orders over $99'],
                  ['⚡', 'Express Shipping', '2–3 business days', '$12.99'],
                  ['🌍', 'International',    '10–14 business days', 'Contact us for rates'],
                  ['↩️', 'Returns',          '30-day free returns', 'No questions asked'],
                ].map(([icon, title, time, cost]) => (
                  <div key={title} style={{
                    display: 'flex', gap: 16, padding: '14px 0',
                    borderBottom: '1px solid var(--mist)',
                  }}>
                    <span style={{ fontSize: 22 }}>{icon}</span>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{title}</p>
                      <p>{time} · {cost}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Related Products ───────────────────────── */}
      {related.length > 0 && (
        <div className="related-section">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p className="eyebrow">You May Also Like</p>
            <h2 className="display-title">Related <em>Products</em></h2>
          </div>
          <div className="grid-4 fade-up">
            {related.map(p => <ProductCard key={p._id} {...p} />)}
          </div>
        </div>
      )}
    </>
  )
}