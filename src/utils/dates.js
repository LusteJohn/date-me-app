export const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const todayISO = () => toISO(new Date())

const addDays = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d
}

// next occurrence of a weekday (0 = Sunday ... 6 = Saturday), never today
const nextDow = (dow) => {
  const d = new Date()
  d.setDate(d.getDate() + (((dow - d.getDay() + 7) % 7) || 7))
  return d
}

export function quickDates() {
  const sat = nextDow(6)
  const nextSat = new Date(sat)
  nextSat.setDate(sat.getDate() + 7)
  const list = [
    { label: 'Tomorrow', value: toISO(addDays(1)) },
    { label: 'Saturday', value: toISO(sat) },
    { label: 'Sunday', value: toISO(nextDow(0)) },
    { label: 'Next Saturday', value: toISO(nextSat) },
  ]
  return list.filter((x, i) => list.findIndex((y) => y.value === x.value) === i)
}

export const QUICK_TIMES = [
  { label: '☀️ Lunch', value: '12:00' },
  { label: '🌤️ Afternoon', value: '15:00' },
  { label: '🌇 Dinner', value: '18:30' },
  { label: '🌙 Late night', value: '21:00' },
]

export const NAME_IDEAS = [
  'Our First Date',
  'Date Night',
  'Dinner Under the Stars',
  'Coffee & Kilig',
  'Adventure Day',
  { label: 'Lights On on the park', value: 'Lights On on the park', badge: 'new' },
]
