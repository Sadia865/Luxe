import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { assets } from '../assets/assets'
import showToast from '../utils/toast'

const HeartIcon = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function ProductCard({ _id, name, price, image, bestseller }) {
  const { currency, addToCart, isWished, toggleWishlist } = useShop()
  const [added,         setAdded]         = useState(false)
  const [imgError,      setImgError]      = useState(false)
  const [hoverImgError, setHoverImgError] = useState(false)

  const wished = isWished(_id)

  const handleAdd = e => {
    e.preventDefault(); e.stopPropagation()
    addToCart(_id, 'M')
    showToast.cart(name.length > 32 ? name.slice(0, 32) + '…' : name, 'M')
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleWish = e => {
    e.preventDefault(); e.stopPropagation()
    toggleWishlist(_id)
    showToast.wish(!wished, name.length > 32 ? name.slice(0, 32) + '…' : name)
  }

  return (
    <Link to={`/product/${_id}`} className="p-card">
      <div className="p-card__img-wrap">
        {imgError
          ? <div style={{ width:'100%', height:'100%', background:'var(--sand)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--mist)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
          : <img src={image[0]} alt={name} className="p-card__img p-card__img--main" onError={() => setImgError(true)} />
        }
        {image[1] && !hoverImgError && (
          <img src={image[1]} alt={name} className="p-card__img p-card__img--hover" onError={() => setHoverImgError(true)} />
        )}
        {bestseller && <span className="p-card__badge p-card__badge--gold">Best Seller</span>}
        <div className="p-card__actions">
          <button className="p-card__add" onClick={handleAdd}
            style={added ? { background:'var(--success)' } : {}}>
            {added ? <><CheckIcon /> Added</> : 'Add to Cart'}
          </button>
          <button className="p-card__wish" onClick={handleWish}
            style={wished ? { color:'#D05C5C', background:'linear-gradient(135deg,#fff3f3,#ffe8e8)', borderColor:'transparent' } : {}}>
            <HeartIcon filled={wished} />
          </button>
        </div>
      </div>
      <div className="p-card__info">
        <div className="p-card__stars">
          {[1,2,3,4,5].map(i => <img key={i} src={i<=4?assets.star_icon:assets.star_dull_icon} alt="" className="p-card__star" />)}
        </div>
        <p className="p-card__name">{name}</p>
        <p className="p-card__price">{currency}{price}</p>
      </div>
    </Link>
  )
}