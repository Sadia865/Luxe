import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import showToast from '../utils/toast'

const EyeIcon = ({ show }) => show
  ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>

const validate = (mode, form) => {
  if (mode === 'register' && !form.name.trim())  return 'Full name is required'
  if (!form.email.trim())                        return 'Email address is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address'
  if (!form.password)                            return 'Password is required'
  if (form.password.length < 8)                 return 'Password must be at least 8 characters'
  if (mode === 'register' && form.password !== form.confirm) return 'Passwords do not match'
  return null
}

/* ── Parse network/server error into human message ──────── */
const parseError = (err) => {
  if (!err.response) {
    // Network error = backend not running or no internet
    return 'Cannot connect to server. Make sure the backend is running on port 4000.'
  }
  const status = err.response.status
  const msg    = err.response?.data?.message
  if (status === 409 || msg?.toLowerCase().includes('exist'))
    return 'An account with this email already exists. Try signing in instead.'
  if (status === 401 || msg?.toLowerCase().includes('password'))
    return 'Incorrect email or password. Please try again.'
  if (status === 404)
    return 'No account found with this email. Please register first.'
  if (status === 429)
    return 'Too many attempts. Please wait a moment and try again.'
  return msg || 'Something went wrong. Please try again.'
}

export default function Login() {
  const { token, setToken, setUser, navigate, backendUrl } = useShop()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [mode,     setMode]     = useState('login')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [form,     setForm]     = useState({ name: '', email: '', password: '', confirm: '' })

  if (token) { navigate(from, { replace: true }); return null }

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const switchMode = m => {
    setMode(m)
    setForm({ name: '', email: '', password: '', confirm: '' })
    setShowPass(false); setShowConf(false)
  }

  const submit = async e => {
    e.preventDefault()
    const err = validate(mode, form)
    if (err) { showToast.error('Check your details', err); return }

    setLoading(true)
    try {
      const url  = `${backendUrl}/api/user/${mode === 'login' ? 'login' : 'register'}`
      const body = mode === 'login'
        ? { email: form.email.trim(), password: form.password }
        : { name: form.name.trim(), email: form.email.trim(), password: form.password }

      const { data } = await axios.post(url, body)

      if (data.success) {
        // Store token
        setToken(data.token)
        localStorage.setItem('token', data.token)

        // Store user profile (name + email) for avatar/display
        const userName = mode === 'register' ? form.name.trim() : (data.name || form.email.split('@')[0])
        setUser({ name: userName, email: form.email.trim() })

        showToast.success(
          mode === 'login' ? `Welcome back, ${userName.split(' ')[0]}!` : `Welcome to Forever, ${userName.split(' ')[0]}!`,
          mode === 'login' ? 'Great to see you again' : 'Your account is ready'
        )
        navigate(from, { replace: true })
      } else {
        showToast.error('Login failed', data.message || 'Please try again')
      }
    } catch (err) {
      showToast.error('Sign in failed', parseError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">

        {/* Top */}
        <div className="auth-card__top">
          <img src={assets.logo} alt="Forever" className="auth-card__logo" />
          <h1 className="auth-card__title">
            {mode === 'login' ? 'Welcome back' : 'Join Forever'}
          </h1>
          <p className="auth-card__sub">
            {mode === 'login'
              ? 'Sign in to your account to continue'
              : 'Create your free account in seconds'}
          </p>
        </div>

        {/* Body */}
        <div className="auth-card__body">

          {/* Tabs */}
          <div className="auth-tabs">
            <button className={`auth-tab${mode === 'login'    ? ' active' : ''}`} onClick={() => switchMode('login')}>Sign In</button>
            <button className={`auth-tab${mode === 'register' ? ' active' : ''}`} onClick={() => switchMode('register')}>Register</button>
          </div>

          {/* Backend offline notice */}
          {!backendUrl && (
            <div style={{
              background: 'rgba(216,92,92,.08)', border: '1px solid rgba(216,92,92,.2)',
              borderRadius: 'var(--r-lg)', padding: '12px 16px',
              fontSize: 13, color: 'var(--error)', marginBottom: 20, lineHeight: 1.5,
            }}>
              ⚠️ Backend URL not configured. Set <code>VITE_BACKEND_URL</code> in your <code>.env</code> file.
            </div>
          )}

          <form onSubmit={submit} noValidate>

            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input name="name" type="text" className="form-input"
                  placeholder="Jane Doe" value={form.name} onChange={update}
                  autoComplete="name" />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" className="form-input"
                placeholder="hello@example.com" value={form.email} onChange={update}
                autoComplete="email" />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrap">
                <input name="password" type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder={mode === 'register' ? 'Min. 8 characters' : 'Your password'}
                  value={form.password} onChange={update}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  style={{ paddingRight: 48 }} />
                <button type="button" className="form-eye-btn"
                  onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                  <EyeIcon show={showPass} />
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="form-input-wrap">
                  <input name="confirm" type={showConf ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Re-enter your password"
                    value={form.confirm} onChange={update}
                    autoComplete="new-password"
                    style={{ paddingRight: 48 }} />
                  <button type="button" className="form-eye-btn"
                    onClick={() => setShowConf(v => !v)} tabIndex={-1}>
                    <EyeIcon show={showConf} />
                  </button>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginBottom: 18, marginTop: -4 }}>
                <a href="#" style={{ fontSize: 12.5, color: 'var(--gold-dk)', fontWeight: 600 }}
                  onClick={e => { e.preventDefault(); showToast.info('Coming soon', 'Password reset will be available with the backend') }}>
                  Forgot password?
                </a>
              </div>
            )}

            {mode === 'register' && (
              <p style={{ fontSize: 12, color: 'var(--mid)', marginBottom: 18, lineHeight: 1.6, fontWeight: 300 }}>
                By creating an account you agree to our{' '}
                <a href="#" style={{ color: 'var(--gold-dk)' }}>Terms of Service</a> and{' '}
                <a href="#" style={{ color: 'var(--gold-dk)' }}>Privacy Policy</a>.
              </p>
            )}

            <button type="submit" className="btn btn-dark form-submit"
              disabled={loading}
              style={{ justifyContent: 'center', opacity: loading ? .72 : 1 }}>
              {loading
                ? <><span className="btn-spinner" /> Please wait…</>
                : mode === 'login' ? 'Sign In' : 'Create Account'
              }
            </button>
          </form>

          <div className="auth-divider">or</div>

          <p className="auth-footer-text">
            {mode === 'login'
              ? <>Don't have an account?{' '}
                  <a onClick={() => switchMode('register')} style={{ cursor: 'pointer' }}>Create one free →</a></>
              : <>Already have an account?{' '}
                  <a onClick={() => switchMode('login')} style={{ cursor: 'pointer' }}>Sign in →</a></>
            }
          </p>
        </div>
      </div>
    </div>
  )
}