const EMOJI = ['💖', '💘', '💕', '✨', '🌸', '💗']

export function burst(x, y) {
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('span')
    p.className = 'pop'
    p.textContent = EMOJI[i % EMOJI.length]
    p.style.left = x + 'px'
    p.style.top = y + 'px'
    const a = Math.random() * Math.PI * 2
    const d = 90 + Math.random() * 140
    p.style.setProperty('--x', Math.cos(a) * d + 'px')
    p.style.setProperty('--y', Math.sin(a) * d - 60 + 'px')
    document.body.appendChild(p)
    setTimeout(() => p.remove(), 1300)
  }
}

export function burstFrom(el) {
  const r = el.getBoundingClientRect()
  burst(r.left + r.width / 2, r.top + r.height / 2)
}
