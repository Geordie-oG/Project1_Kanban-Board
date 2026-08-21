function ChartCard({ eyebrow, title, description, className = '', children }) {
  return (
    <section className={`chart-card ${className}`}>
      <header className="chart-card__header">
        <div>
          <span className="section-eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        {description && <p>{description}</p>}
      </header>
      <div className="chart-card__body">{children}</div>
    </section>
  )
}

export default ChartCard
