import { useEffect, useState } from 'react'
import { summaryLines, gmailUrl } from '../utils/email'
import { sendDateEmail } from '../utils/sendEmail'
import { downloadIcs } from '../utils/calendar'
import { playChime } from '../utils/sound'
import { burstFrom } from '../utils/burst'
import ExcitementMeter from './ExcitementMeter'
import Success from './Success'

const PLACEHOLDERS = [
  'Say something sweet (optional)',
  "I'll bring the snacks 💕",
  'Pick me up at 7? 😘',
  'Wear something cute 💐',
  'Can’t wait for this one 🥰',
]

export default function Summary({ form, set, onBack }) {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')
  const [restamp, setRestamp] = useState(false)
  const [ph, setPh] = useState(0)

  useEffect(() => {
    const stampTimer = setInterval(() => {
      setRestamp(true)
      setTimeout(() => setRestamp(false), 1000)
    }, 5000)
    const phTimer = setInterval(() => setPh((p) => (p + 1) % PLACEHOLDERS.length), 3800)
    return () => {
      clearInterval(stampTimer)
      clearInterval(phTimer)
    }
  }, [])

  const handleSend = async (e) => {
    if (status === 'sending') return
    burstFrom(e.currentTarget)
    setStatus('sending')
    setError('')
    try {
      await sendDateEmail(form)
      playChime()
      setStatus('sent')
    } catch (err) {
      setError(err?.message || 'Something went wrong while sending.')
      setStatus('error')
    }
  }

  const emailOk = !form.herEmail.trim() || /.+@.+\..+/.test(form.herEmail.trim())

  return (
    <>
      <h2>It’s a date! 🎉</h2>
      <p className="sub">Check your plan, add a note, then send it.</p>

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
          {form.excitement ? (
            <div>
              <b>Excitement</b>
              <span>{'💗'.repeat(form.excitement)}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="btns" style={{ marginTop: 4, marginBottom: 4 }}>
        <button className="back" type="button" onClick={() => downloadIcs(form)}>Add to calendar 📅</button>
      </div>

      <label className="lbl">How excited are you?</label>
      <ExcitementMeter value={form.excitement} onChange={set('excitement')} />

      <label className="lbl" htmlFor="note">A little message for him</label>
      <textarea
        id="note"
        rows="3"
        maxLength={300}
        placeholder={PLACEHOLDERS[ph]}
        value={form.note}
        onChange={(e) => set('note')(e.target.value)}
        disabled={status === 'sending'}
      />

      <label className="lbl" htmlFor="her-email">Want a copy too?</label>
      <input
        id="her-email"
        type="email"
        maxLength={80}
        placeholder="your.email@example.com (optional)"
        value={form.herEmail}
        onChange={(e) => set('herEmail')(e.target.value)}
        disabled={status === 'sending'}
      />

      <div className="btns" style={{ marginTop: 6 }}>
        <button className="next" onClick={handleSend} disabled={status === 'sending' || status === 'sent' || !emailOk}>
          {status === 'sending' ? 'Sending 💌…' : status === 'sent' ? 'Sent! 💖' : 'Send to his Gmail 💌'}
        </button>
      </div>

      {!emailOk && <p className="err-detail" style={{ textAlign: 'center' }}>That email looks a little off 🌸</p>}

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
        <button className="back" onClick={onBack} disabled={status === 'sending'}>← Back</button>
        <span />
      </div>

      {status === 'sent' && <Success form={form} onReplay={onBack} />}
    </>
  )
}
