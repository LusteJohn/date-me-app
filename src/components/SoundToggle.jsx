import { useEffect, useState } from 'react'
import { subscribeSound, isMuted, toggleSound } from '../utils/sound'

export default function SoundToggle() {
  const [muted, setMuted] = useState(isMuted())

  useEffect(() => subscribeSound(setMuted), [])

  return (
    <button
      type="button"
      className={`sound-toggle ${muted ? 'off' : 'on'}`}
      onClick={() => toggleSound()}
      aria-pressed={!muted}
      aria-label={muted ? 'Turn sound effects on' : 'Turn sound effects off'}
      title={muted ? 'Sound off' : 'Sound on'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
