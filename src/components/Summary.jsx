import { useState } from 'react'
import { summaryLines, gmailUrl } from '../utils/email'
import { sendDateEmail } from '../utils/sendEmail'
import { burstFrom } from '../utils/burst'

export default function Summary({ form, onNote, onBack }) {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  const handleSend = async (e) => {
    if (status === 'sending') return
    burstFrom(e.currentTarget)
    setStatus('sending')
    setError('')
    try {
      await sendDateEmail(form)
      setStatus('sent')
    } catch (err) {
      setError(err?.message || 'Something went wrong while sending.')
      setStatus('error')
    }
  }

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
        disabled={status === 'sending'}
      />

      <div className="btns" style={{ marginTop: 6 }}>
        <button className="next" onClick={handleSend} disabled={status === 'sending' || status === 'sent'}>
          {status === 'sending' ? 'Sending 💌…' : status === 'sent' ? 'Sent! 💖' : 'Send to his Gmail 💌'}
        </button>
      </div>

      {status === 'sent' && <p className="sent">Your date invite is on its way. Check his inbox 💕</p>}

      {status === 'error' && (
        <div className="send-error">
          <p className="sent">Couldn’t send automatically. 😢</p>
          <a className="btn next" href={gmailUrl(form)} target="_blank" rel="noopener noreferrer">
            Open Gmail draft instead 💌
          </a>
          {error && <p className="err-detail">{error}</p>}
        </div>
      )}

      <div className="nav">
        <button className="back" onClick={onBack} disabled={status === 'sending'}>Back</button>
        <span />
      </div>
    </>
  )
}
