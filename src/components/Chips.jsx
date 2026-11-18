export default function Chips({ items, value, onPick }) {
  return (
    <div className="chips">
      {items.map((it) => {
        const { label, value: v } = typeof it === 'string' ? { label: it, value: it } : it
        return (
          <button type="button" key={v} className={`chip ${value === v ? 'on' : ''}`} onClick={() => onPick(v)}>
            {label}
          </button>
        )
      })}
    </div>
  )
}
