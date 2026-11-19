import { useEffect, useState } from 'react'
import { summaryLines } from '../utils/email'
import { downloadIcs, countdownParts, daysUntil } from '../utils/calendar'
import { playChime } from '../utils/sound'
import Confetti from './Confetti'

const pad = (n) => String(n).padStart(2, '0')

export default function Success({ form, onReplay }) {
  const [restamp, setRestamp] = useState(false)
  const [excitement] = useState(() => form.excitement)
  const [time, setTime] = useState(() => countdownParts(form))

  useEffect(() => {
    playChime()
    const stampTimer = setInterval(() => {
      setRestamp(true)
      setTimeout(() => setRestamp(false), 1000)
    }, 5000)
    const tick = setInterval(() => setTime(countdownParts(form)), 1000)
    return () => {
      clearInterval(stampTimer)
      clearInterval(tick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const days = daysUntil(form)

  return (
    <div className="success">
      <Confetti />
      <div className="success-heart" aria-hidden="true">💞</div>
      <h2>She said YES! 🎉</h2>
      <p className="sub">The plan is on its way to him. Save it to your calendar too 💕</p>

      {time && !time.done && (
        <div className="countdown">
          <div className="cd-label">
            {days > 0 ? `${days} day${days === 1 ? '' : 's'} until` : 'Counting down to'} {form.eventName.trim()}
          </div>
          <div className="cd-grid">
            {[
              ['Days', time.days],
              ['Hours', time.hours],
              ['Mins', time.minutes],
              ['Secs', time.seconds],
            ].map(([label, v]) => (
              <div className="cd-cell" key={label}>
                <b>{pad(v)}</b>
                <small>{label}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ticket">
        <div className="ticket-head">
          <span className={`stamp ${restamp ? 'restamp' : ''}`}>YES 💖</span>
          <h3>{form.eventName.trim()}</h3>
          <p>Reserved just for the two of us</p>
        </div>
        <div className="rows">
          {summaryLines(form).map(([k, v]) => (
            <div key={k}>
              <b>{k}</b>
              <span>{v}</span>
            </div>
          ))}
          {excitement ? (
            <div>
              <b>Excitement</b>
              <span>{'💗'.repeat(excitement)}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="btns" style={{ marginTop: 10 }}>
        <button className="next" onClick={() => downloadIcs(form)}>Add to calendar 📅</button>
        <button className="back" onClick={onReplay}>Back to the plan</button>
      </div>
    </div>
  )
}
