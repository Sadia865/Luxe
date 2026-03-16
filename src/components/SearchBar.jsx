import { useEffect, useRef, useState, useCallback } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { assets } from '../assets/assets'

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>
  </svg>
)
const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const TrendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

const TRENDING = ['Cotton Top', 'Denim Jacket', 'Palazzo Pants', 'Kids Tee', 'Winterwear']

export default function SearchBar() {
  const { search, setSearch, showSearch, setShowSearch, products, navigate } = useShop()
  const location  = useLocation()
  const inputRef  = useRef()
  const wrapRef   = useRef()

  const [focused,  setFocused]  = useState(false)
  const [recent,   setRecent]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('forever-recent-searches') || '[]') }
    catch { return [] }
  })

  // Live result count
  const resultCount = search.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.subCategory.toLowerCase().includes(search.toLowerCase())
      ).length
    : 0

  // Live suggestions (top 5 matches)
  const suggestions = search.trim().length > 1
    ? products
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 5)
    : []

  // Focus input when bar opens
  useEffect(() => {
    if (showSearch) setTimeout(() => inputRef.current?.focus(), 60)
  }, [showSearch])

  // Keyboard shortcut — Cmd/Ctrl + K opens search
  useEffect(() => {
    const handler = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (!showSearch) {
          setShowSearch(true)
          if (location.pathname !== '/collection') navigate('/collection')
        } else {
          inputRef.current?.focus()
        }
      }
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false)
        setSearch('')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showSearch, location.pathname])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Save search to recent
  const saveRecent = useCallback((term) => {
    if (!term.trim()) return
    const updated = [term, ...recent.filter(r => r !== term)].slice(0, 6)
    setRecent(updated)
    localStorage.setItem('forever-recent-searches', JSON.stringify(updated))
  }, [recent])

  const handleSubmit = e => {
    e.preventDefault()
    if (!search.trim()) return
    saveRecent(search.trim())
    setFocused(false)
    if (location.pathname !== '/collection') navigate('/collection')
  }

  const handleSelect = term => {
    setSearch(term)
    saveRecent(term)
    setFocused(false)
    if (location.pathname !== '/collection') navigate('/collection')
    inputRef.current?.focus()
  }

  const clearRecent = e => {
    e.stopPropagation()
    setRecent([])
    localStorage.removeItem('forever-recent-searches')
  }

  const removeRecent = (e, term) => {
    e.stopPropagation()
    const updated = recent.filter(r => r !== term)
    setRecent(updated)
    localStorage.setItem('forever-recent-searches', JSON.stringify(updated))
  }

  const handleClose = () => {
    setShowSearch(false)
    setSearch('')
    setFocused(false)
  }

  // Show dropdown when focused and (has search or has recent/trending)
  const showDropdown = focused && (suggestions.length > 0 || !search.trim())

  if (!showSearch) return null

  return (
    <div className="sb-overlay">
      <div className="sb-wrap" ref={wrapRef}>
        <form className="sb-inner" onSubmit={handleSubmit}>
          {/* Search icon */}
          <span className="sb-icon"><SearchIcon /></span>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, styles, categories…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            className="sb-input"
            autoComplete="off"
            spellCheck="false"
          />

          {/* Live result count badge */}
          {search.trim() && (
            <span className="sb-count">
              {resultCount} result{resultCount !== 1 ? 's' : ''}
            </span>
          )}

          {/* Clear button */}
          {search && (
            <button
              type="button"
              className="sb-clear"
              onClick={() => { setSearch(''); inputRef.current?.focus() }}
              title="Clear"
            >
              <CloseIcon />
            </button>
          )}

          {/* Keyboard hint */}
          <span className="sb-kbd">ESC</span>

          {/* Close bar */}
          <button type="button" className="sb-close" onClick={handleClose}>
            Close
          </button>
        </form>

        {/* ── Dropdown panel ───────────────────────── */}
        {showDropdown && (
          <div className="sb-dropdown">

            {/* Live product suggestions */}
            {suggestions.length > 0 && (
              <div className="sb-section">
                <p className="sb-section__label">Products</p>
                {suggestions.map(p => (
                  <Link
                    key={p._id}
                    to={`/product/${p._id}`}
                    className="sb-suggestion"
                    onClick={() => { saveRecent(search); handleClose() }}
                  >
                    <div className="sb-suggestion__img">
                      <img src={p.image[0]} alt={p.name}
                        onError={e => e.target.style.display = 'none'} />
                    </div>
                    <div className="sb-suggestion__info">
                      <p className="sb-suggestion__name">
                        {/* Highlight matching text */}
                        {p.name.split(new RegExp(`(${search})`, 'gi')).map((part, i) =>
                          part.toLowerCase() === search.toLowerCase()
                            ? <mark key={i} className="sb-highlight">{part}</mark>
                            : part
                        )}
                      </p>
                      <p className="sb-suggestion__meta">{p.category} · {p.subCategory}</p>
                    </div>
                    <span className="sb-suggestion__price">${p.price}</span>
                    <span className="sb-suggestion__arrow"><ArrowIcon /></span>
                  </Link>
                ))}
                {/* View all results link */}
                {resultCount > 5 && (
                  <button
                    className="sb-view-all"
                    onClick={() => {
                      saveRecent(search)
                      setFocused(false)
                      if (location.pathname !== '/collection') navigate('/collection')
                    }}
                  >
                    View all {resultCount} results for "{search}"
                    <ArrowIcon />
                  </button>
                )}
              </div>
            )}

            {/* No results */}
            {search.trim().length > 1 && suggestions.length === 0 && (
              <div className="sb-no-results">
                <p className="sb-no-results__title">No results for "{search}"</p>
                <p className="sb-no-results__sub">Try a different keyword or browse our collection.</p>
              </div>
            )}

            {/* Recent searches */}
            {!search.trim() && recent.length > 0 && (
              <div className="sb-section">
                <div className="sb-section__head">
                  <p className="sb-section__label">Recent</p>
                  <button className="sb-section__clear" onClick={clearRecent}>
                    Clear all
                  </button>
                </div>
                {recent.map(term => (
                  <div key={term} className="sb-recent-item" onClick={() => handleSelect(term)}>
                    <span className="sb-recent-icon"><ClockIcon /></span>
                    <span className="sb-recent-text">{term}</span>
                    <button
                      className="sb-recent-remove"
                      onClick={e => removeRecent(e, term)}
                      title="Remove"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Trending searches */}
            {!search.trim() && (
              <div className="sb-section">
                <div className="sb-section__head">
                  <p className="sb-section__label">
                    <span className="sb-section__icon"><TrendIcon /></span>
                    Trending
                  </p>
                </div>
                <div className="sb-trending">
                  {TRENDING.map(term => (
                    <button
                      key={term}
                      className="sb-trend-chip"
                      onClick={() => handleSelect(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}