import { useState, useEffect, useCallback } from 'react'
import { useShop } from '../context/ShopContext'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/ProductSkeleton'

/* ── Icons ──────────────────────────────────────────────── */
const FilterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const CATS = ['Men', 'Women', 'Kids']
const SUBS = ['Topwear', 'Bottomwear', 'Winterwear']

export default function Collection() {
  const { products, search, showSearch } = useShop()

  const [category,    setCategory]    = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortBy,      setSortBy]      = useState('relevant')
  const [filtered,    setFiltered]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [drawerOpen,  setDrawerOpen]  = useState(false)

  const toggle = (arr, set, val) =>
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  const applyFilters = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      let list = [...products]
      if (showSearch && search)
        list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      if (category.length)    list = list.filter(p => category.includes(p.category))
      if (subCategory.length) list = list.filter(p => subCategory.includes(p.subCategory))
      if (sortBy === 'low-high')  list.sort((a, b) => a.price - b.price)
      if (sortBy === 'high-low')  list.sort((a, b) => b.price - a.price)
      if (sortBy === 'newest')    list.sort((a, b) => b.date - a.date)
      if (sortBy === 'bestseller')list = list.filter(p => p.bestseller).concat(list.filter(p => !p.bestseller))
      setFiltered(list)
      setLoading(false)
    }, 300) // small delay so skeleton is visible
  }, [products, search, showSearch, category, subCategory, sortBy])

  useEffect(() => { applyFilters() }, [applyFilters])

  // Close drawer on outside click
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const clearAll = () => {
    setCategory([])
    setSubCategory([])
    setSortBy('relevant')
  }

  const hasFilters = category.length > 0 || subCategory.length > 0

  /* ── Sidebar filter group (shared between sidebar + drawer) ── */
  const FilterGroups = () => (
    <>
      <div className="filter-group">
        <p className="filter-group__label">Category</p>
        {CATS.map(cat => (
          <label key={cat} className={`filter-option${category.includes(cat) ? ' active' : ''}`}>
            <input
              type="checkbox"
              checked={category.includes(cat)}
              onChange={() => toggle(category, setCategory, cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <p className="filter-group__label">Type</p>
        {SUBS.map(sub => (
          <label key={sub} className={`filter-option${subCategory.includes(sub) ? ' active' : ''}`}>
            <input
              type="checkbox"
              checked={subCategory.includes(sub)}
              onChange={() => toggle(subCategory, setSubCategory, sub)}
            />
            {sub}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <p className="filter-group__label">Price Range</p>
        {['Under $150', '$150 – $250', '$250 – $350', 'Above $350'].map(r => (
          <label key={r} className="filter-option">
            <input type="checkbox" /> {r}
          </label>
        ))}
      </div>

      <div className="filter-group" style={{ borderBottom: 'none' }}>
        <p className="filter-group__label">Sort By</p>
        {[
          ['relevant',   'Most Relevant'],
          ['newest',     'Newest First'],
          ['low-high',   'Price: Low → High'],
          ['high-low',   'Price: High → Low'],
          ['bestseller', 'Bestsellers First'],
        ].map(([val, label]) => (
          <label key={val} className={`filter-option${sortBy === val ? ' active' : ''}`}>
            <input
              type="radio"
              name="sort"
              checked={sortBy === val}
              onChange={() => setSortBy(val)}
              style={{ accentColor: 'var(--gold)' }}
            />
            {label}
          </label>
        ))}
      </div>
    </>
  )

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <div className="page-header__inner">
          <h1 className="page-header__title">Collection</h1>
          <nav className="breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">/</span>
            <span>Collection</span>
          </nav>
        </div>
      </div>

      <div className="collection-layout">

        {/* ── Desktop Sidebar ─────────────────── */}
        <aside className="filter-sidebar">
          <div className="filter-sidebar__head">
            <span className="filter-sidebar__title">Filters</span>
            {hasFilters && (
              <button className="filter-clear" onClick={clearAll}>Clear All</button>
            )}
          </div>
          <FilterGroups />
        </aside>

        {/* ── Main Content ──────────────────────── */}
        <div>
          {/* Toolbar */}
          <div className="collection-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              {/* Mobile filter button */}
              <button
                className="filter-toggle-btn"
                onClick={() => setDrawerOpen(true)}
              >
                <FilterIcon />
                Filters
                {hasFilters && (
                  <span style={{
                    background: 'var(--gold)',
                    color: 'var(--white)',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 'var(--r-full)',
                    marginLeft: 2,
                  }}>
                    {category.length + subCategory.length}
                  </span>
                )}
              </button>

              <p className="collection-count">
                {loading ? 'Loading…' : <>Showing <strong>{filtered.length}</strong> products</>}
              </p>
            </div>

            {/* Desktop sort */}
            <div className="collection-sort" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FilterIcon />
              <select
                className="sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="relevant">Most Relevant</option>
                <option value="newest">Newest First</option>
                <option value="low-high">Price: Low → High</option>
                <option value="high-low">Price: High → Low</option>
                <option value="bestseller">Bestsellers First</option>
              </select>
            </div>
          </div>

          {/* Active filter chips */}
          {hasFilters && (
            <div className="active-filters" style={{ marginBottom: 20 }}>
              {category.map(c => (
                <button
                  key={c}
                  className="filter-chip"
                  onClick={() => toggle(category, setCategory, c)}
                >
                  {c}
                  <span className="filter-chip__x">✕</span>
                </button>
              ))}
              {subCategory.map(s => (
                <button
                  key={s}
                  className="filter-chip"
                  onClick={() => toggle(subCategory, setSubCategory, s)}
                >
                  {s}
                  <span className="filter-chip__x">✕</span>
                </button>
              ))}
              <button
                className="filter-chip"
                onClick={clearAll}
                style={{ background: 'transparent', color: 'var(--mid)', borderColor: 'var(--mist)' }}
              >
                Clear all ✕
              </button>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <ProductSkeleton count={8} grid="grid-4" />
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--mid)' }}>
              <p style={{ fontFamily: 'var(--display)', fontSize: 26, marginBottom: 10, color: 'var(--ink)' }}>
                No products found
              </p>
              <p style={{ fontSize: 14, marginBottom: 28, fontWeight: 300 }}>
                Try adjusting your filters or search term.
              </p>
              <button className="btn btn-outline" onClick={clearAll}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid-4 fade-up">
              {filtered.map(p => <ProductCard key={p._id} {...p} />)}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Filter Drawer ─────────────── */}
      <div
        className={`filter-overlay${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />
      <div className={`filter-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="filter-drawer__head">
          <div className="filter-drawer__handle" />
          <span className="filter-drawer__title">Filters & Sort</span>
          <button className="filter-drawer__close" onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <div className="filter-drawer__body">
          <FilterGroups />
        </div>
        <div className="filter-drawer__foot">
          <button className="filter-drawer__reset" onClick={clearAll}>Reset</button>
          <button
            className="filter-drawer__apply"
            onClick={() => setDrawerOpen(false)}
          >
            Show {filtered.length} Results
          </button>
        </div>
      </div>
    </>
  )
}