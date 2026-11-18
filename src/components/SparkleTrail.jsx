import { useEffect, useRef } from 'react'

const SPARKLES = ['✨', '💫', '💕']
const INTERVAL = 120

export function useSparkleTrail(ref) {
  const last = useRef(0)
  useEffect(() => {
    const el = ref?.current
    if (!el) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const spawn = (e) => {
      const now = performance.now()
      if (now - last.current < INTERVAL) return
      last.current = now
      const s = document.createElement('span')
      s.className = 'sparkle'
      s.textContent = SPARKLES[Math.floor(Math.random() * SPARKLES.length)]
      s.style.left = `${e.clientX + (Math.random() * 16 - 8)}px`
      s.style.top = `${e.clientY + (Math.random() * 16 - 8)}px`
      s.style.fontSize = `${10 + Math.random() * 8}px`
      document.body.appendChild(s)
      setTimeout(() => s.remove(), 900)
    }

    el.addEventListener('pointermove', spawn)
    return () => el.removeEventListener('pointermove', spawn)
  }, [ref])
}
