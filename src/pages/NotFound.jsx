import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found fade-up">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">Page not found</h1>
      <p className="not-found__sub">
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>
      <div className="not-found__actions">
        <Link to="/" className="btn btn-dark">
          ← Back to Home
        </Link>
        <Link to="/collection" className="btn btn-outline">
          Browse Collection
        </Link>
      </div>
    </div>
  )
}