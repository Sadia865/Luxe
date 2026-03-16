import { createContext, useContext, useEffect, useState } from 'react'
import { products } from '../assets/assets.js'
import showToast from '../utils/toast.jsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const ShopContext = createContext()

const CART_KEY     = 'forever-cart'
const WISHLIST_KEY = 'forever-wishlist'
const USER_KEY     = 'forever-user'

const saveCart     = (c)  => localStorage.setItem(CART_KEY,     JSON.stringify(c))
const saveWishlist = (wl) => localStorage.setItem(WISHLIST_KEY, JSON.stringify(wl))
const saveUser     = (u)  => localStorage.setItem(USER_KEY,     JSON.stringify(u))

const loadCart     = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)     || '{}') } catch { return {} } }
const loadWishlist = () => { try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]') } catch { return [] } }
const loadUser     = () => { try { return JSON.parse(localStorage.getItem(USER_KEY)     || 'null') } catch { return null } }

/* ── Get initials from name ─────────────────────────────── */
export const getInitials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '').join('') || '?'

const ShopContextProvider = ({ children }) => {
  const currency     = '$'
  const delivery_fee = 10
  const backendUrl   = import.meta.env.VITE_BACKEND_URL

  const [search,     setSearch]     = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [cartItems,  setCartItemsRaw] = useState(loadCart)
  const [wishlist,   setWishlist]   = useState(loadWishlist)
  const [token,      setToken]      = useState(() => localStorage.getItem('token') || '')
  const [user,       setUserRaw]    = useState(loadUser)  // { name, email }

  const navigate = useNavigate()

  /* ── Setters that sync localStorage ────────────────────── */
  const setCartItems = (cart) => { setCartItemsRaw(cart); saveCart(cart) }
  const setUser = (u) => { setUserRaw(u); if (u) saveUser(u); else localStorage.removeItem(USER_KEY) }

  /* ─── Cart ─────────────────────────────────────────────── */
  const addToCart = async (itemId, size) => {
    if (!size) { showToast.sizeRequired(); return }
    const cartData = structuredClone(cartItems)
    cartData[itemId] = cartData[itemId] || {}
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1
    setCartItems(cartData)
    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } })
      } catch (err) { console.error('Cart add:', err.message) }
    }
  }

  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems)
    if (quantity <= 0) {
      if (cartData[itemId]) {
        delete cartData[itemId][size]
        if (!Object.keys(cartData[itemId]).length) delete cartData[itemId]
      }
    } else {
      cartData[itemId] = cartData[itemId] || {}
      cartData[itemId][size] = quantity
    }
    setCartItems(cartData)
    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, { headers: { token } })
      } catch (err) { console.error('Cart update:', err.message) }
    }
  }

  const removeFromCart = (itemId, size) => updateQuantity(itemId, size, 0)
  const clearCart = () => { setCartItemsRaw({}); localStorage.removeItem(CART_KEY) }

  const getCartCount = () =>
    Object.values(cartItems).reduce(
      (t, sizes) => t + Object.values(sizes).reduce((s, q) => s + Math.max(0, q), 0), 0)

  const getCartAmount = () =>
    Object.entries(cartItems).reduce((total, [id, sizes]) => {
      const item = products.find(p => p._id === id)
      if (!item) return total
      return total + Object.values(sizes).reduce((s, q) => s + item.price * Math.max(0, q), 0)
    }, 0)

  /* ─── Wishlist ──────────────────────────────────────────── */
  const isWished       = (id) => wishlist.includes(id)
  const getWishlistCount = () => wishlist.length

  const toggleWishlist = (id) =>
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      saveWishlist(next); return next
    })

  const addToWishlist = (id) => {
    if (isWished(id)) return
    setWishlist(prev => { const next = [...prev, id]; saveWishlist(next); return next })
  }

  const removeFromWishlist = (id) =>
    setWishlist(prev => { const next = prev.filter(x => x !== id); saveWishlist(next); return next })

  /* ─── Auth ──────────────────────────────────────────────── */
  const logout = () => {
    setToken('')
    setUser(null)
    clearCart()
    localStorage.removeItem('token')
    showToast.success('Signed out', 'See you next time!')
    navigate('/')
  }

  /* ─── Sync backend cart on login ───────────────────────── */
  const syncCartFromBackend = async (userToken, localCart = {}) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/cart/get`, {},
        { headers: { token: userToken } }
      )
      if (data.success) {
        const merged = structuredClone(data.cartData || {})
        Object.entries(localCart).forEach(([id, sizes]) => {
          Object.entries(sizes).forEach(([size, qty]) => {
            if (qty > 0) {
              merged[id] = merged[id] || {}
              merged[id][size] = (merged[id][size] || 0) + qty
            }
          })
        })
        setCartItems(merged)
      }
    } catch (err) { console.error('Cart sync:', err.message) }
  }

  /* ─── Restore on mount ──────────────────────────────────── */
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
      syncCartFromBackend(savedToken, loadCart())
    }
  }, [])

  const value = {
    products, currency, delivery_fee, backendUrl,
    search,    setSearch,
    showSearch, setShowSearch,
    cartItems, setCartItems,
    addToCart, updateQuantity, removeFromCart, clearCart,
    getCartCount, getCartAmount,
    wishlist, toggleWishlist, addToWishlist, removeFromWishlist,
    isWished, getWishlistCount,
    token, setToken,
    user,  setUser,
    logout, navigate,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export const useShop = () => useContext(ShopContext)
export default ShopContextProvider