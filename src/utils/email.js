import { YOUR_EMAIL } from '../config'

export function formatWhen(date, time) {
  if (!date) return ''
  const d = new Date(`${date}T${time}`)
  return (
    d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) +
    ' at ' +
    d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  )
}

export const places = (f) => [...f.location, f.customPlace.trim()].filter(Boolean)

export function summaryLines(f) {
  const rows = [
    ['When', formatWhen(f.date, f.time)],
    ['Where', places(f).join(', ')],
    ['Type of date', f.type.join(', ')],
    ['Food', f.food.join(', ')],
    ['Drinks', f.drink.join(', ')],
  ]
  if (f.extras.trim()) rows.push(['Food notes', f.extras.trim()])
  return rows
}

export function gmailUrl(f) {
  const body =
    `She said YES! 💖\n\nEvent: ${f.eventName.trim()}\n` +
    summaryLines(f).map(([k, v]) => `${k}: ${v}`).join('\n') +
    (f.note.trim() ? `\n\nHer note: ${f.note.trim()}` : '')
  const subject = `She said YES! ${f.eventName.trim()} 💘`
  return (
    'https://mail.google.com/mail/?view=cm&fs=1' +
    `&to=${encodeURIComponent(YOUR_EMAIL)}` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`
  )
}
