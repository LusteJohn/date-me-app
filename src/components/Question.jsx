import { useState } from 'react'
import { burstFrom } from '../utils/burst'

const TIPS = ['Nice try 😏', 'Are you sure? 🥺', 'Wrong button 😅', 'Pretty please? 💕', 'Just say yes 😘']
const YES_TIPS = ['Yes please! 🥰', 'Best choice 💕', 'Aww, yes! 😍', 'Correct answer 💖', 'I knew it 😘']

export default function Question({ onYes }) {
  const [shake, setShake] = useState(false)
  const [tries, setTries] = useState(0)
  const [yesTries, setYesTries] = useState(0)

  const handleYes = (e) => {
    burstFrom(e.currentTarget)
    setTimeout(onYes, 500)
  }
  const handleHover = () => {
    setTries((t) => t + 1)
    setShake(false)
    requestAnimationFrame(() => setShake(true))
  }
  const handleYesHover = () => {
    setYesTries((t) => t + 1)
  }

  return (
    <div className="hero">
      <div className="bigheart">💘</div>
      <h1>Do you want to date me?</h1>
      <p className="sub">Choose carefully <mark className="hl">"My Pahinga❣️"</mark>. Only one button works.</p>
      <p className="sub">Don't worry, Your <mark className="hl hl2">"My Programmer🫰"</mark> will guide you.</p>
      <div className="btns">
        <span
          className="tip"
          data-tip={YES_TIPS[yesTries % YES_TIPS.length]}
          onMouseEnter={handleYesHover}
        >
          <button className="yes" onClick={handleYes}>Yes! 💖</button>
        </span>
        <span
          className={`nowrap ${shake ? 'shake' : ''}`}
          data-tip={TIPS[tries % TIPS.length]}
          onMouseEnter={handleHover}
          onAnimationEnd={() => setShake(false)}
        >
          <button className="no" disabled aria-disabled="true">No</button>
        </span>
      </div>
    </div>
  )
}
