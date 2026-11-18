export default function ProgressBar({ step, labels }) {
  return (
    <div>
      <div className="steps" aria-hidden="true">
        {labels.map((_, i) => (
          <i key={i} className={i < step ? 'on' : ''} />
        ))}
      </div>
      <p className="steplabel">Step {step} of {labels.length}: {labels[step - 1]}</p>
    </div>
  )
}
