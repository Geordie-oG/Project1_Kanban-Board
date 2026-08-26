function SummaryCard({ label, value, helper, icon: Icon, tone = 'mint' }) {
  return (
    <article className={`summary-card summary-card--${tone} summary-card--enhanced`}>
      <div className="summary-card__accent" aria-hidden="true" />

      <div className="summary-card__topline">
        <span className="summary-card__icon" aria-hidden="true">
          <Icon size={20} strokeWidth={2} />
        </span>

        <span className="summary-card__status-dot" aria-hidden="true" />
      </div>

      <div className="summary-card__body">
        <p className="summary-card__label">{label}</p>

        <strong className="summary-card__value">{value}</strong>

        <div className="summary-card__footer-info">
          <small>{helper}</small>
        </div>
      </div>
    </article>
  )
}

export default SummaryCard