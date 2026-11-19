import { useState } from 'react'
import FloatingHearts from './components/FloatingHearts'
import ProgressBar from './components/ProgressBar'
import Question from './components/Question'
import WhenStep from './components/WhenStep'
import StepShell from './components/StepShell'
import OptionGrid from './components/OptionGrid'
import Summary from './components/Summary'
import SoundToggle from './components/SoundToggle'
import Chips from './components/Chips'
import { LOCATIONS, TYPES, FOODS, DRINKS, LOCAL_SPOTS } from './data/options'

const LABELS = ['When', 'Where', 'Vibe', 'Menu', 'Confirm']

export default function App() {
  const [step, setStep] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [tip, setTip] = useState(false)
  const [form, setForm] = useState({
    eventName: '', date: '', time: '18:30',
    location: [], customPlace: '',
    type: [], food: [], drink: [], extras: '', note: '',
    excitement: 0, herEmail: '',
  })
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  const pickSpot = (value) => {
    setForm((f) => ({
      ...f,
      customPlace: value,
      location: f.location.filter((x) => x !== value),
    }))
  }

  const go = (n) => {
    setLeaving(true)
    setTimeout(() => {
      setStep(n)
      setLeaving(false)
      requestAnimationFrame(() => {
        document.querySelector('.card')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      })
    }, 300)
  }
  const nav = { onBack: () => go(step - 1), onNext: () => go(step + 1) }
  const nav1 = {
    ...nav,
    onNext: () => {
      setTip(true)
      setTimeout(() => {
        setTip(false)
        go(step + 1)
      }, 120)
    },
  }

  return (
    <>
      <SoundToggle />
      <FloatingHearts />
      <main className="card">
        {step > 0 && <ProgressBar step={step} labels={LABELS} />}

        {/* key forces a remount so the "in" animation replays on every step */}
        <section key={step} className={`step ${leaving ? 'leaving' : 'active'}`}>
          {step === 0 && <Question onYes={() => go(1)} />}

          {step === 1 && (
            <WhenStep form={form} set={set} {...nav1} showTip={tip} nextLabel={tip ? 'One sec… 💕' : 'Next'} />
          )}

          {step === 2 && (
            <StepShell title="Where should we go?" sub="Pick a spot, or tell me your own."
              {...nav} nextDisabled={!form.location.length && !form.customPlace.trim()}
              nudge="Pick a place first 🌸">

              <OptionGrid options={LOCATIONS} selected={form.location} onChange={set('location')} />
              <label className="lbl" htmlFor="place">Somewhere else?</label>
              <input id="place" type="text" maxLength={60} placeholder="Type a place you love"
                value={form.customPlace} onChange={(e) => set('customPlace')(e.target.value)} />
              <div className="spot-chips">
                <Chips items={LOCAL_SPOTS} value={form.customPlace} onPick={pickSpot} />
              </div>
            </StepShell>
          )}

          {step === 3 && (
            <StepShell title="What’s the vibe?" sub="Pick as many as you like."
              {...nav} nextDisabled={!form.type.length} nudge="Pick at least one vibe ✨">
              <OptionGrid multi options={TYPES} selected={form.type} onChange={set('type')} />
            </StepShell>
          )}

          {step === 4 && (
            <StepShell title="Let’s eat and drink" sub="Choose at least one of each."
              {...nav} nextLabel="Review" nextDisabled={!form.food.length || !form.drink.length}
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

          {step === 5 && <Summary form={form} set={set} onBack={nav.onBack} />}
        </section>
      </main>
    </>
  )
}
