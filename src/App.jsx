import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navbar       from './components/Navbar'
import Footer       from './components/Footer'
import SearchBar    from './components/SearchBar'
import BackToTop    from './components/BackToTop'
import CookieBanner from './components/CookieBanner'
import ProtectedRoute from './components/ProtectedRoute'

import Home       from './pages/Home'
import Collection from './pages/Collection'
import About      from './pages/About'
import Contact    from './pages/Contact'
import Product    from './pages/Product'
import Cart       from './pages/Cart'
import Login      from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders     from './pages/Orders'
import Verify     from './pages/Verify'
import NotFound   from './pages/NotFound'
import Wishlist   from './pages/Wishlist'

/* ── Scroll to top on every route change ──────────────── */
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

const App = () => {
  return (
    <div>
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      <Navbar />
      <SearchBar />

      <Routes>
        {/* Public routes */}
        <Route path="/"                   element={<Home />} />
        <Route path="/collection"         element={<Collection />} />
        <Route path="/about"              element={<About />} />
        <Route path="/contact"            element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart"               element={<Cart />} />
        <Route path="/login"              element={<Login />} />
        <Route path="/verify"             element={<Verify />} />
        <Route path="/wishlist"           element={<Wishlist />} />

        {/* Protected routes — require login */}
        <Route path="/place-order" element={
          <ProtectedRoute><PlaceOrder /></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute><Orders /></ProtectedRoute>
        } />

        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <BackToTop />
      <CookieBanner />
    </div>
  )
}

export default App