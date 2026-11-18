const TITLES = {
  When: 'When should we go?',
  Where: 'Where should we go?',
  Vibe: 'What’s the vibe?',
  Menu: 'What are we eating?',
  Confirm: 'All set!',
}

const CHEERS = {
  When: 'Pick a day 💫',
  Where: 'Choose a spot 🌸',
  Vibe: 'Pick a vibe ✨',
  Menu: 'Pick a bite 🍜',
  Confirm: 'Review it 💌',
}

export default function ProgressBar({ step, labels }) {
  const label = labels[step - 1]
  return (
    <div>
      <div className="steps" aria-hidden="true">
        {labels.map((_, i) => (
          <i key={i} className={i < step ? 'on' : ''} />
        ))}
      </div>
      <p className="steplabel">
        <span className="stephearts" aria-hidden="true">
          {labels.map((_, i) => (
            <span key={i} className={i < step ? 'stepbeat' : 'off'}>{i < step ? '💗' : '🩶'}</span>
          ))}
        </span>
        <span>Stop {step} of {labels.length} · {TITLES[label] || label}</span>
        <span style={{ opacity: 0.75 }}>{CHEERS[label]}</span>
      </p>
    </div>
  )
}
