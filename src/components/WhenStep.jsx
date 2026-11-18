import StepShell from './StepShell'
import Chips from './Chips'
import { quickDates, QUICK_TIMES, NAME_IDEAS, todayISO } from '../utils/dates'
import { formatWhen } from '../utils/email'

export default function WhenStep({ form, set, nextLabel, showTip, ...nav }) {
  const ready = form.eventName.trim() && form.date && form.time
  return (
    <StepShell
      title="Plan our date"
      sub="Name it, then pick the day and time."
      nextDisabled={!ready}
      nextLabel={nextLabel}
      showTip={showTip}
      tip="Almost there! 💌"
      nudge="Name it, pick a day and time 💫"
      {...nav}
    >
      <label className="lbl" htmlFor="ev">Name your date</label>
      <input
        id="ev"
        type="text"
        maxLength={40}
        placeholder="e.g. Our First Date"
        value={form.eventName}
        onChange={(e) => set('eventName')(e.target.value)}
      />
      <Chips items={NAME_IDEAS} value={form.eventName} onPick={set('eventName')} />

      <label className="lbl" htmlFor="dt">Pick a day</label>
      <input id="dt" type="date" min={todayISO()} value={form.date} onChange={(e) => set('date')(e.target.value)} />
      <Chips items={quickDates()} value={form.date} onPick={set('date')} />

      <label className="lbl" htmlFor="tm">What time?</label>
      <input id="tm" type="time" value={form.time} onChange={(e) => set('time')(e.target.value)} />
      <Chips items={QUICK_TIMES} value={form.time} onPick={set('time')} />

      {ready && (
        <div className="preview" key={form.eventName + form.date + form.time}>
          💌 {form.eventName.trim()}: {formatWhen(form.date, form.time)}
        </div>
      )}
    </StepShell>
  )
}
