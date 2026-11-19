import { useEffect, useState } from 'react'
import FloatingHearts from './components/FloatingHearts'
import ProgressBar from './components/ProgressBar'
import Question from './components/Question'
import WhenStep from './components/WhenStep'
import StepShell from './components/StepShell'
import OptionGrid from './components/OptionGrid'
import Summary from './components/Summary'
import Success from './components/Success'
import { LOCATIONS, TYPES, FOODS, DRINKS } from './data/options'
import { todayISO } from './utils/dates'

const LABELS = ['When', 'Where', 'Vibe', 'Menu', 'Confirm']
const KEY = 'dateInvite:v1'
const EMPTY = {
  eventName: '', date: '', time: '18:30',
  location: [], customPlace: '',
  type: [], food: [], drink: [], extras: '', note: '',
}

// restore an unfinished plan after a refresh
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (!s || typeof s !== 'object') return null
    const form = { ...EMPTY, ...s.form }
    let step = Number.isInteger(s.step) ? Math.min(Math.max(s.step, 0), 5) : 0
    if (form.date && form.date < todayISO()) {
      form.date = '' // saved date already passed
      if (step > 1) step = 1
    }
    return { form, step }
  } catch {
    return null
  }
}

export default function App() {
  const [saved] = useState(load)
  const [step, setStep] = useState(saved?.step ?? 0)
  const [form, setForm] = useState(saved?.form ?? EMPTY)
  const [leaving, setLeaving] = useState(false)
  const [dir, setDir] = useState('fwd') // slide direction: 'fwd' | 'back'
  const [tip, setTip] = useState(false)
  const [returnTo, setReturnTo] = useState(null) // set when editing a row from the summary

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  useEffect(() => {
    try {
      if (step === 6) localStorage.removeItem(KEY)
      else localStorage.setItem(KEY, JSON.stringify({ form, step }))
    } catch { /* storage unavailable: ignore */ }
  }, [form, step])

  const go = (n, after) => {
    setDir(n < step ? 'back' : 'fwd')
    setLeaving(true)
    setTimeout(() => {
      setStep(n)
      after?.()
      setLeaving(false)
      requestAnimationFrame(() => {
        // move focus to the new heading so keyboard / screen-reader users land in the right place
        document.querySelector('.step h1, .step h2')?.focus({ preventScroll: true })
        document.querySelector('.card')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      })
    }, 300)
  }

  const finishEdit = () => {
    const t = returnTo
    setReturnTo(null)
    go(t)
  }
  const nav = returnTo
    ? { onBack: finishEdit, onNext: finishEdit }
    : { onBack: () => go(step - 1), onNext: () => go(step + 1) }
  const nav1 = {
    ...nav,
    showBack: Boolean(returnTo),
    onNext: () => {
      setTip(true)
      setTimeout(() => {
        setTip(false)
        nav.onNext()
      }, 120)
    },
  }
  const saveLabel = returnTo ? 'Save ✓' : undefined

  return (
    <>
      <FloatingHearts />
      <main className="card">
        {step > 0 && step < 6 && (
          <ProgressBar
            step={step}
            labels={LABELS}
            onJump={(n) => {
              setReturnTo(null)
              go(n)
            }}
          />
        )}

        {/* key forces a remount so the "in" animation replays on every step */}
        <section key={step} className={`step ${leaving ? 'leaving' : 'active'} ${dir === 'back' ? 'back' : ''}`}>
          {step === 0 && <Question onYes={() => go(1)} />}

          {step === 1 && (
            <WhenStep
              form={form}
              set={set}
              {...nav1}
              showTip={tip}
              nextLabel={tip ? 'One sec… 💕' : saveLabel || 'Next'}
            />
          )}

          {step === 2 && (
            <StepShell title="Where should we go?" sub="Pick a spot, or tell me your own."
              {...nav} nextLabel={saveLabel}
              nextDisabled={!form.location.length && !form.customPlace.trim()}
              nudge="Pick a place first 🌸">
              <OptionGrid options={LOCATIONS} selected={form.location} onChange={set('location')} />
              <label className="lbl" htmlFor="place">Somewhere else?</label>
              <input id="place" type="text" maxLength={60} placeholder="Type a place you love"
                value={form.customPlace} onChange={(e) => set('customPlace')(e.target.value)} />
            </StepShell>
          )}

          {step === 3 && (
            <StepShell title="What’s the vibe?" sub="Pick as many as you like."
              {...nav} nextLabel={saveLabel} nextDisabled={!form.type.length} nudge="Pick at least one vibe ✨">
              <OptionGrid multi options={TYPES} selected={form.type} onChange={set('type')} />
            </StepShell>
          )}

          {step === 4 && (
            <StepShell title="Let’s eat and drink" sub="Choose at least one of each."
              {...nav} nextLabel={saveLabel || 'Review'} nextDisabled={!form.food.length || !form.drink.length}
              nudge="Pick at least one food and drink 🍜">
              <h3>Food</h3>
              <OptionGrid multi options={FOODS} selected={form.food} onChange={set('food')} />
              <h3>Drinks</h3>
              <OptionGrid multi options={DRINKS} selected={form.drink} onChange={set('drink')} />
              <label className="lbl" htmlFor="extras">Allergies or anything I should know?</label>
              <input id="extras" type="text" maxLength={80} placeholder="Optional"
                value={form.extras} onChange={(e) => set('extras')(e.target.value)} />
            </StepShell>
          )}

          {step === 5 && (
            <Summary
              form={form}
              onNote={set('note')}
              onBack={nav.onBack}
              onEdit={(n) => {
                setReturnTo(5)
                go(n)
              }}
              onSent={() => go(6)}
            />
          )}

          {step === 6 && (
            <Success
              form={form}
              onRestart={() => {
                setReturnTo(null)
                go(0, () => setForm(EMPTY))
              }}
            />
          )}
        </section>
      </main>
    </>
  )
}
