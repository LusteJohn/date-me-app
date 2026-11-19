import { formatWhen, places } from './email'

const pad = (n) => String(n).padStart(2, '0')

const toIcsStamp = (d) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(
    d.getUTCMinutes()
  )}${pad(d.getUTCSeconds())}Z`

const escapeIcs = (s) =>
  String(s ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')

const startDate = (f) => (f.date && f.time ? new Date(`${f.date}T${f.time}`) : null)

export function icsContent(f) {
  const start = startDate(f)
  if (!start) return ''
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
  const title = f.eventName.trim() || 'Our Date'
  const where = places(f).join(', ') || 'Somewhere lovely'
  const details = [
    'She said YES! 💖',
    '',
    ...(f.type.length ? [`Vibe: ${f.type.join(', ')}`] : []),
    ...(f.food.length ? [`Food: ${f.food.join(', ')}`] : []),
    ...(f.drink.length ? [`Drinks: ${f.drink.join(', ')}`] : []),
    ...(f.extras.trim() ? [`Notes: ${f.extras.trim()}`] : []),
    ...(f.note.trim() ? ['', `Her note: ${f.note.trim()}`] : []),
    '',
    `When: ${formatWhen(f.date, f.time)}`,
  ].join('\n')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//date-invite//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}-date-invite@local`,
    `DTSTAMP:${toIcsStamp(new Date())}`,
    `DTSTART:${toIcsStamp(start)}`,
    `DTEND:${toIcsStamp(end)}`,
    `SUMMARY:${escapeIcs(`💖 ${title}`)}`,
    `LOCATION:${escapeIcs(where)}`,
    `DESCRIPTION:${escapeIcs(details)}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcs(`Date with her soon: ${title}`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n')
}

export function downloadIcs(f) {
  const content = icsContent(f)
  if (!content) return false
  const name = `${(f.eventName.trim() || 'our-date').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return true
}

export function daysUntil(f) {
  const start = startDate(f)
  if (!start) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(start)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - today) / 86400000)
}

export function countdownParts(f) {
  const start = startDate(f)
  if (!start) return null
  const diff = start - new Date()
  if (diff <= 0) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    done: false,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}
