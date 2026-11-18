import { useState } from 'react'
import { burstFrom } from '../utils/burst'

const EMOJI = { 'Tomorrow': '🌅', 'Saturday': '🎈', 'Sunday': '☀️', 'Next Saturday': '🗓️', 'Lunch': '🍽️', 'Afternoon': '🌤️', 'Dinner': '🌇', 'Late night': '🌙' }
const PREFILL = ['💌', '🌙', '✨', '☕', '🎡']

const emojiFor = (label, i) => EMOJI[String(label)] || PREFILL[i % PREFILL.length]

export default function Chips({ items, value, onPick }) {
  const [picked, setPicked] = useState(null)

  const handle = (e, v) => {
    onPick(v)
    setPicked(v)
    burstFrom(e.currentTarget)
  }

  return (
    <div className="chips">
      {items.map((it, i) => {
        const { label, value: v } = typeof it === 'string' ? { label: it, value: it } : it
        const hasEmoji = /\p{Extended_Pictographic}/u.test(String(label))
        return (
          <button
            type="button"
            key={v}
            className={`chip ${value === v ? 'on' : ''} ${picked === v ? 'picked' : ''}`}
            onClick={(e) => handle(e, v)}
            onAnimationEnd={() => setPicked(null)}
          >
            {hasEmoji ? label : `${emojiFor(label, i)} ${label}`}
          </button>
        )
      })}
    </div>
  )
}
