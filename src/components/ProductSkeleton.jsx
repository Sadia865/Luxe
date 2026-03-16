/**
 * ProductSkeleton — shimmer placeholder while products load.
 * Usage: <ProductSkeleton count={5} />
 */
const SingleSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-card__img" />
    <div className="skeleton-card__info">
      <div className="skeleton skeleton-card__line skeleton-card__line--sm" style={{ marginBottom: 8 }} />
      <div className="skeleton skeleton-card__line skeleton-card__line--lg" style={{ marginBottom: 6 }} />
      <div className="skeleton skeleton-card__line skeleton-card__line--md" style={{ marginBottom: 14 }} />
      <div className="skeleton skeleton-card__line skeleton-card__line--sm" />
    </div>
  </div>
)

export default function ProductSkeleton({ count = 5, grid = 'grid-5' }) {
  return (
    <div className={grid}>
      {Array.from({ length: count }).map((_, i) => (
        <SingleSkeleton key={i} />
      ))}
    </div>
  )
}