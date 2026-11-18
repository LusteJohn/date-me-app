export default function OptionGrid({ options, selected, onChange, multi = false }) {
  const toggle = (v) => {
    if (!multi) return onChange([v])
    onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v])
  }
  return (
    <div className="grid">
      {options.map(({ e, v, d }) => (
        <div
          key={v}
          role={multi ? 'checkbox' : 'radio'}
          aria-checked={selected.includes(v)}
          tabIndex={0}
          className={`opt ${selected.includes(v) ? 'sel' : ''}`}
          onClick={() => toggle(v)}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
              ev.preventDefault()
              toggle(v)
            }
          }}
        >
          <span className="e">{e}</span>
          {v}
          {d && <small>{d}</small>}
          <span className="tick" aria-hidden="true">✓</span>
        </div>
      ))}
    </div>
  )
}
