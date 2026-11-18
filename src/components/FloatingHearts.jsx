import { useMemo } from 'react'

const EMOJI = ['💗', '💕', '✨', '🌸', '💖']

export default function FloatingHearts() {
  const items = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        e: EMOJI[i % EMOJI.length],
        left: Math.random() * 100,
        size: 14 + Math.random() * 22,
        dur: 9 + Math.random() * 10,
        delay: -Math.random() * 15,
      })),
    []
  )
  return (
    <div className="floaters" aria-hidden="true">
      {items.map((h, i) => (
        <span
          key={i}
          style={{ left: `${h.left}%`, fontSize: h.size, animationDuration: `${h.dur}s`, animationDelay: `${h.delay}s` }}
        >
          {h.e}
        </span>
      ))}
    </div>
  )
}
