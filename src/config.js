// Change this to your own Gmail address
export const YOUR_EMAIL = 'luste.johnmark19@gmail.com'

// EmailJS credentials (set these in Vercel env vars / .env)
const raw = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
}

// strips stray quotes/whitespace pasted into env vars
export const cleanEnv = (v) => String(v ?? '').trim().replace(/^['"]|['"]$/g, '').trim()

export const EMAILJS = {
  serviceId: cleanEnv(raw.serviceId),
  templateId: cleanEnv(raw.templateId),
  publicKey: cleanEnv(raw.publicKey),
}

export const missingEmailVars = () =>
  Object.entries({
    VITE_EMAILJS_SERVICE_ID: EMAILJS.serviceId,
    VITE_EMAILJS_TEMPLATE_ID: EMAILJS.templateId,
    VITE_EMAILJS_PUBLIC_KEY: EMAILJS.publicKey,
  })
    .filter(([, v]) => !v)
    .map(([k]) => k)

export const emailjsReady = () => missingEmailVars().length === 0

if (import.meta.env.DEV) {
  const missing = missingEmailVars()
  if (missing.length) {
    console.warn(
      `Missing EmailJS env vars: ${missing.join(', ')}. Email sending will not work until these are set.`
    )
  }
}
