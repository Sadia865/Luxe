import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import showToast from '../utils/toast'

export default function ProtectedRoute({ children }) {
  const { token, navigate } = useShop()
  const location = useLocation()

  useEffect(() => {
    if (!token) {
      showToast.error('Sign in required', 'Please sign in to access this page')
      // Pass current path so Login can redirect back after auth
      navigate('/login', { state: { from: location.pathname } })
    }
  }, [token])

  if (!token) {
    return (
      <div className="auth-required fade-up">
        <div className="auth-required__icon">🔒</div>
        <p className="auth-required__title">Sign in required</p>
        <p className="auth-required__sub">
          You need to be logged in to view this page.
          <br />Redirecting to login…
        </p>
        <button className="btn btn-dark"
          onClick={() => navigate('/login', { state: { from: location.pathname } })}>
          Go to Login
        </button>
      </div>
    )
  }

  return children
}