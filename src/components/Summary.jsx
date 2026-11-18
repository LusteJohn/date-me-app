import { useState } from 'react'
import { summaryLines, gmailUrl } from '../utils/email'
import { burstFrom } from '../utils/burst'

export default function Summary({ form, onNote, onBack }) {
  const [sent, setSent] = useState(false)

  return (
    <>
      <h2>It’s a date! 🎉</h2>
      <p className="sub">Check your plan, add a note, then send it.</p>

      <div className="ticket">
        <div className="ticket-head">
          <span className="stamp">YES 💖</span>
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
        </div>
      </div>

      <label className="lbl" htmlFor="note">A little message for him</label>
      <textarea
        id="note"
        rows="3"
        maxLength={300}
        placeholder="Say something sweet (optional)"
        value={form.note}
        onChange={(e) => onNote(e.target.value)}
      />
      <div className="btns" style={{ marginTop: 6 }}>
        <a
          className="btn next"
          href={gmailUrl(form)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            burstFrom(e.currentTarget)
            setSent(true)
          }}
        >
          Send to his Gmail 💌
        </a>
      </div>
      {sent && <p className="sent">Your Gmail draft is ready. Press send there to finish.</p>}
      <div className="nav">
        <button className="back" onClick={onBack}>Back</button>
        <span />
      </div>
    </>
  )
}
