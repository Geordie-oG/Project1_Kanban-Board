function SummaryCard({ label, value, helper, icon: Icon, tone = 'mint' }) {
  return (
    <article className={`summary-card summary-card--${tone}`}>
      <div className="summary-card__topline">
        <span className="summary-card__icon" aria-hidden="true">
          <Icon size={19} strokeWidth={2.1} />
        </span>
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{helper}</small>
      </div>
    </article>
  )
}

export default SummaryCard
