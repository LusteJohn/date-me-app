import { useEffect, useMemo, useState } from 'react'

const EMOJI = ['💗', '💕', '✨', '🌸', '💖', '💘']

export default function Confetti({ count = 60, duration = 3200 }) {
  const [gone, setGone] = useState(false)
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        e: EMOJI[i % EMOJI.length],
        left: Math.random() * 100,
        size: 12 + Math.random() * 16,
        dur: 1.8 + Math.random() * 1.4,
        delay: Math.random() * 0.8,
        drift: Math.random() * 120 - 60,
      })),
    [count]
  )

  useEffect(() => {
    const t = setTimeout(() => setGone(true), duration)
    return () => clearTimeout(t)
  }, [duration])

  if (gone) return null

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            '--drift': `${p.drift}px`,
          }}
        >
          {p.e}
        </span>
      ))}
    </div>
  )
}
