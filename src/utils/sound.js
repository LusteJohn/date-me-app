let ctx = null
let muted = true

const KEY = 'date-invite:sound'

try {
  const saved = localStorage.getItem(KEY)
  if (saved === 'on') muted = false
} catch {
  /* storage blocked, keep muted */
}

const listeners = new Set()

export const isMuted = () => muted
export const toggleSound = () => setMuted(!muted)

export function setMuted(next) {
  muted = Boolean(next)
  try {
    localStorage.setItem(KEY, muted ? 'off' : 'on')
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn(muted))
  return muted
}

export function subscribeSound(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function audio() {
  if (typeof window === 'undefined') return null
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null
  if (!ctx) ctx = new Ctx()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone({ freq, to, type = 'sine', dur = 0.16, gain = 0.12, delay = 0 }) {
  const ac = audio()
  if (!ac) return
  const t0 = ac.currentTime + delay
  const osc = ac.createOscillator()
  const vol = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur)
  vol.gain.setValueAtTime(0.0001, t0)
  vol.gain.exponentialRampToValueAtTime(gain, t0 + 0.02)
  vol.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(vol).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

export function playPop() {
  if (muted) return
  tone({ freq: 520, to: 880, type: 'triangle', dur: 0.12, gain: 0.09 })
}

export function playTap() {
  if (muted) return
  tone({ freq: 660, to: 990, type: 'sine', dur: 0.09, gain: 0.06 })
}

export function playChime() {
  if (muted) return
  tone({ freq: 784, type: 'sine', dur: 0.22, gain: 0.1 })
  tone({ freq: 988, type: 'sine', dur: 0.24, gain: 0.09, delay: 0.11 })
  tone({ freq: 1319, type: 'sine', dur: 0.34, gain: 0.08, delay: 0.22 })
}
