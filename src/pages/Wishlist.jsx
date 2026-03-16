import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { assets } from '../assets/assets'
import showToast from '../utils/toast'

/* ── Icons ──────────────────────────────────────────────── */
const HeartFilledIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)
const CartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)

/* ── Single wishlist card ───────────────────────────────── */
function WishCard({ product, onRemove }) {
  const { currency, addToCart } = useShop()
  const [size,     setSize]     = useState('')
  const [imgError, setImgError] = useState(false)
  const [added,    setAdded]    = useState(false)

  const handleMoveToCart = () => {
    const chosenSize = size || product.sizes?.[0]
    if (!chosenSize) { showToast.error('No sizes available', 'This product has no available sizes'); return }
    addToCart(product._id, chosenSize)
    showToast.cart(product.name, chosenSize)
    setAdded(true)
    setTimeout(() => { onRemove(product._id); setAdded(false) }, 900)
  }

  return (
    <div className="wish-card fade-up">
      <Link to={`/product/${product._id}`} className="wish-card__img-wrap">
        {imgError
          ? <div className="img-fallback">🖼</div>
          : <img src={product.image[0]} alt={product.name}
              onError={() => setImgError(true)} />
        }
        {product.bestseller && (
          <span className="p-card__badge p-card__badge--gold"
            style={{ top: 10, left: 10, fontSize: 8.5 }}>
            Best Seller
          </span>
        )}
      </Link>

      <div className="wish-card__body">
        <div className="wish-card__top">
          <Link to={`/product/${product._id}`} className="wish-card__name">
            {product.name}
          </Link>
          <button className="wish-card__remove"
            onClick={() => onRemove(product._id)} title="Remove">
            <TrashIcon />
          </button>
        </div>

        {/* Stars */}
        <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
          {[1,2,3,4,5].map(i => (
            <img key={i}
              src={i <= 4 ? assets.star_icon : assets.star_dull_icon}
              alt="" style={{ width: 12, height: 12 }} />
          ))}
        </div>

        <p className="wish-card__price">{currency}{product.price}</p>
        <p className="wish-card__category">{product.category} · {product.subCategory}</p>

        {/* Size selector */}
        {product.sizes?.length > 0 && (
          <div className="wish-card__sizes">
            {product.sizes.map(s => (
              <button key={s}
                className={`wish-size-btn${size === s ? ' selected' : ''}`}
                onClick={() => setSize(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="wish-card__actions">
          <button
            className="btn btn-dark btn-sm wish-card__cart-btn"
            onClick={handleMoveToCart}
            style={added ? { background: 'var(--success)' } : {}}
          >
            <CartIcon />
            {added ? 'Added!' : size ? `Add ${size} to Cart` : 'Add to Cart'}
          </button>
          <button className="wish-card__heart" onClick={() => onRemove(product._id)}>
            <HeartFilledIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Wishlist page ──────────────────────────────────────── */
export default function Wishlist() {
  const {
    wishlist, removeFromWishlist, addToCart,
    products, currency,
  } = useShop()

  const wishedProducts = wishlist
    .map(id => products.find(p => p._id === id))
    .filter(Boolean)

  const handleRemove = (id) => {
    removeFromWishlist(id)
    showToast.wish(false)
  }

  const handleAddAll = () => {
    if (wishedProducts.length === 0) return
    let added = 0
    wishedProducts.forEach(p => {
      const defaultSize = p.sizes?.[0]
      if (defaultSize) {
        addToCart(p._id, defaultSize)
        added++
      }
    })
    if (added > 0) {
      showToast.success(`${added} item${added > 1 ? 's' : ''} added`, 'All items moved to your cart')
    } else {
      showToast.error('Could not add items', 'No items have available sizes')
    }
  }

  const handleClearAll = () => {
    wishlist.forEach(id => removeFromWishlist(id))
    showToast.remove('Wishlist cleared')
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header__inner">
          <h1 className="page-header__title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#D05C5C' }}><HeartFilledIcon /></span>
            My Wishlist
            {wishedProducts.length > 0 && (
              <span style={{ fontSize: 14, fontFamily: 'var(--body)', fontWeight: 400, color: 'var(--mid)', marginLeft: 4 }}>
                ({wishedProducts.length} {wishedProducts.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </h1>
          <nav className="breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">/</span>
            <span>Wishlist</span>
          </nav>
        </div>
      </div>

      <div className="wishlist-page">
        {wishedProducts.length === 0 ? (
          /* Empty state */
          <div className="wish-empty fade-up">
            <div className="wish-empty__icon">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2 className="wish-empty__title">Your wishlist is empty</h2>
            <p className="wish-empty__sub">
              Save your favourite pieces by tapping the ❤️ heart on any product.
              They'll all appear here so you never lose track of what you love.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/collection" className="btn btn-dark">Browse Collection</Link>
              <Link to="/" className="btn btn-outline">Back to Home</Link>
            </div>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="wish-toolbar">
              <p style={{ fontSize: 13, color: 'var(--mid)', fontWeight: 300 }}>
                {wishedProducts.length} saved {wishedProducts.length === 1 ? 'item' : 'items'}
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-outline btn-sm" onClick={handleClearAll}>
                  Clear All
                </button>
                <button className="btn btn-dark btn-sm" onClick={handleAddAll}>
                  <CartIcon /> Add All to Cart
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="wish-grid">
              {wishedProducts.map(p => (
                <WishCard key={p._id} product={p} onRemove={handleRemove} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 52 }}>
              <Link to="/collection" className="btn btn-outline">
                Continue Shopping →
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}