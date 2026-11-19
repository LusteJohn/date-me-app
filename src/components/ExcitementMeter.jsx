const LEVELS = [
  { v: 1, e: '🤍', label: 'Not yet' },
  { v: 2, e: '💗', label: 'A little' },
  { v: 3, e: '💖', label: 'Yes!' },
  { v: 4, e: '💞', label: 'Very' },
  { v: 5, e: '💘', label: 'So much' },
]

export default function ExcitementMeter({ value, onChange }) {
  return (
    <div className="excite" role="radiogroup" aria-label="How excited are you?">
      {LEVELS.map(({ v, e, label }) => {
        const on = value >= v
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={value === v}
            aria-label={`${label} (${v} of 5)`}
            className={`excite-heart ${on ? 'on' : ''} ${value === v ? 'current' : ''}`}
            onClick={() => onChange(value === v ? 0 : v)}
            title={label}
          >
            {e}
          </button>
        )
      })}
      <span className="excite-label">{value ? LEVELS[value - 1].label : 'Tap a heart'}</span>
    </div>
  )
}
