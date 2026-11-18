import { burstFrom } from '../utils/burst'

export default function StepShell({ title, sub, onBack, onNext, nextDisabled, nextLabel = 'Next', tip, nudge, showTip, showBack = true, children }) {
  const handleNext = (e) => {
    if (nextDisabled) return
    burstFrom(e.currentTarget)
    onNext(e)
  }
  const tipText = nextDisabled ? nudge || tip : tip
  return (
    <>
      <h2>{title}</h2>
      {sub && <p className="sub">{sub}</p>}
      {children}
      <div className="nav">
        {showBack ? (
          <button className="back" onClick={onBack}>← Back</button>
        ) : (
          <span />
        )}
        <span className={`tip ${showTip ? 'show' : ''} ${nextDisabled ? 'tip-nudge' : ''}`} data-tip={tipText}>
          <button className="next" onClick={handleNext} disabled={nextDisabled}>{nextLabel}</button>
        </span>
      </div>
    </>
  )
}
