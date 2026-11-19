import { useState } from 'react'
import { burstFrom } from '../utils/burst'
import { playPop } from '../utils/sound'

const EMOJI = { 'Tomorrow': '🌅', 'Saturday': '🎈', 'Sunday': '☀️', 'Next Saturday': '🗓️', 'Lunch': '🍽️', 'Afternoon': '🌤️', 'Dinner': '🌇', 'Late night': '🌙', 'Lights On on the park': '🎆' }
const PREFILL = ['💌', '🌙', '✨', '☕', '🎡']

const emojiFor = (label, i) => EMOJI[String(label)] || PREFILL[i % PREFILL.length]

export default function Chips({ items, value, onPick }) {
  const [picked, setPicked] = useState(null)

  const handle = (e, v) => {
    playPop()
    onPick(v)
    setPicked(v)
    burstFrom(e.currentTarget)
  }

  return (
    <div className="chips">
      {items.map((it, i) => {
        const { label, value: v, badge } =
          typeof it === 'string'
            ? { label: it, value: it, badge: undefined }
            : { label: it.label ?? it.v, value: it.value ?? it.v, badge: it.badge }
        const key = `${v ?? label ?? i}-${i}`
        const hasEmoji = /\p{Extended_Pictographic}/u.test(String(label))
        return (
          <button
            type="button"
            key={key}
            className={`chip ${value === v ? 'on' : ''} ${picked === v ? 'picked' : ''} ${badge ? 'has-badge' : ''}`}
            onClick={(e) => handle(e, v)}
            onAnimationEnd={() => setPicked(null)}
          >
            {hasEmoji ? label : `${emojiFor(label, i)} ${label}`}
            {badge && <span className="chip-badge">{badge}</span>}
          </button>
        )
      })}
    </div>
  )
}
