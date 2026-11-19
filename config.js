// strips stray quotes/whitespace pasted into env vars
export const cleanEnv = (v) => String(v ?? '').trim().replace(/^['"]|['"]$/g, '').trim()

// OPTIONAL. Only used by the "Open Gmail draft instead" fallback (and sent as {{to_email}} if set).
// Anything VITE_* is baked into the public bundle, so for privacy leave this unset and
// put your address in the "To email" field of the EmailJS template instead.
export const FALLBACK_EMAIL = cleanEnv(import.meta.env.VITE_FALLBACK_EMAIL)

// EmailJS credentials (set these in Vercel env vars / .env)
const raw = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
}

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
  console.info('[EmailJS] config', {
    serviceId: EMAILJS.serviceId || '(missing)',
    templateId: EMAILJS.templateId || '(missing)',
    publicKey: EMAILJS.publicKey ? `set (${EMAILJS.publicKey.length} chars)` : '(missing)',
    missing: missingEmailVars(),
  })
}
