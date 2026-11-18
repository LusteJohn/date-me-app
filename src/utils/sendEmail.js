import { YOUR_EMAIL, EMAILJS, emailjsReady } from '../config'
import { formatWhen, places, summaryLines } from './email'

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export function emailParams(f) {
  const name = f.eventName.trim()
  const rows = summaryLines(f)
  return {
    to_email: YOUR_EMAIL,
    subject: `She said YES! ${name} 💘`,
    event_name: name,
    event_when: formatWhen(f.date, f.time),
    event_where: places(f).join(', '),
    event_type: f.type.join(', '),
    event_food: f.food.join(', '),
    event_drink: f.drink.join(', '),
    event_notes: f.extras.trim() || 'None',
    her_note: f.note.trim() || 'No note, just vibes 💕',
    html_body: buildHtml(f, name, rows),
    text_body: [
      'She said YES! 💖',
      '',
      `Event: ${name}`,
      ...rows.map(([k, v]) => `${k}: ${v}`),
      f.note.trim() ? `\nHer note: ${f.note.trim()}` : '',
    ].join('\n'),
  }
}

function buildHtml(f, name, rows) {
  const name_ = esc(name)
  const note = esc(f.note.trim())
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#2b1233;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#2b1233;padding:28px 12px;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff3f6;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.35);">
      <tr>
        <td style="background:linear-gradient(135deg,#ff4f81,#ff8fab);padding:26px 22px;text-align:center;color:#fff;">
          <div style="font-size:34px;line-height:1;">💖</div>
          <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;opacity:.9;margin-top:10px;">She said YES</div>
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;margin-top:6px;">${name_}</div>
          <div style="font-size:13px;opacity:.95;margin-top:6px;">Reserved just for the two of you</div>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 22px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${rows
              .map(
                ([k, v]) => `<tr>
              <td style="padding:11px 0;border-bottom:1px dashed #ffe1e9;color:#8a6590;font-size:13px;font-weight:700;white-space:nowrap;vertical-align:top;">${esc(k)}</td>
              <td style="padding:11px 0;border-bottom:1px dashed #ffe1e9;color:#3a1540;font-size:14px;text-align:right;">${esc(v)}</td>
            </tr>`
              )
              .join('')}
          </table>
        </td>
      </tr>
      ${
        note
          ? `<tr><td style="padding:6px 22px 0;">
        <div style="background:#fff;border:2px dashed #ff8fab;border-radius:16px;padding:14px 16px;">
          <div style="font-size:12px;font-weight:700;color:#8a6590;letter-spacing:.06em;text-transform:uppercase;">A little message for you</div>
          <div style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:16px;color:#3a1540;margin-top:8px;line-height:1.5;">${note}</div>
        </div>
      </td></tr>`
          : ''
      }
      <tr>
        <td style="padding:18px 22px 24px;text-align:center;color:#8a6590;font-size:12px;line-height:1.6;">
          Sent with love from her date-invite page 💌<br />
          <span style="color:#ff4f81;font-weight:700;">See you there 🥰</span>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body></html>`
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
    throw new Error('EmailJS is not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY.')
  }
  const emailjs = await loadEmailJs()
  emailjs.init({ publicKey: EMAILJS.publicKey })
  return emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, emailParams(f))
}

export { gmailUrl } from './email'
