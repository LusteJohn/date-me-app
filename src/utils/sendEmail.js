import { YOUR_EMAIL, EMAILJS, emailjsReady, missingEmailVars } from '../config'
import { formatWhen, formatDate, formatTime, places } from './email'

export function emailParams(f) {
  const name = f.eventName.trim()
  return {
    to_email: YOUR_EMAIL,
    subject: `She said YES! ${name} 💘`,
    event_name: name,
    event_date: formatDate(f.date),
    event_time: formatTime(f.time),
    event_when: formatWhen(f.date, f.time),
    event_where: places(f).join(', '),
    event_type: f.type.join(', '),
    event_food: f.food.join(', '),
    event_drink: f.drink.join(', '),
    event_notes: f.extras.trim() || 'None',
    her_note: f.note.trim() || 'No note, just vibes 💕',
  }
}

function loadEmailJs() {
  if (window.emailjs) return Promise.resolve(window.emailjs)
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'
    s.async = true
    s.onload = () => (window.emailjs ? resolve(window.emailjs) : reject(new Error('EmailJS failed to load')))
    s.onerror = () => reject(new Error('EmailJS failed to load'))
    document.head.appendChild(s)
  })
}

export async function sendDateEmail(f) {
  if (!emailjsReady()) {
    throw new Error(
      `EmailJS is not configured. Missing: ${missingEmailVars().join(', ')}. ` +
        'Add these to Vercel → Settings → Environment Variables, then redeploy (Vite bakes VITE_* vars at build time).'
    )
  }
  const emailjs = await loadEmailJs()
  emailjs.init({ publicKey: EMAILJS.publicKey })
  try {
    return await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, emailParams(f), {
      publicKey: EMAILJS.publicKey,
    })
  } catch (err) {
    const detail =
      err?.text ||
      err?.response?.text ||
      err?.message ||
      (typeof err === 'string' ? err : JSON.stringify(err))
    const status = err?.status || err?.response?.status || ''
    throw new Error(`EmailJS ${status ? `(${status}) ` : ''}${detail}`)
  }
}

export { gmailUrl } from './email'
