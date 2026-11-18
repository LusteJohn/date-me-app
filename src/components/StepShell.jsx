import { burstFrom } from '../utils/burst'

export default function StepShell({ title, sub, onBack, onNext, nextDisabled, nextLabel = 'Next', tip, showTip, children }) {
  const handleNext = (e) => {
    if (nextDisabled) return
    burstFrom(e.currentTarget)
    onNext(e)
  }
  return (
    <>
      <h2>{title}</h2>
      {sub && <p className="sub">{sub}</p>}
      {children}
      <div className="nav">
        <button className="back" onClick={onBack}>Back</button>
        <span className={`tip ${showTip ? 'show' : ''}`} data-tip={tip}>
          <button className="next" onClick={handleNext} disabled={nextDisabled}>{nextLabel}</button>
        </span>
      </div>
    </>
  )
}
