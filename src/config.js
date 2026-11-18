// Change this to your own Gmail address
export const YOUR_EMAIL = 'luste.johnmark19@gmail.com'

// EmailJS credentials (set these in Vercel env vars / .env)
export const EMAILJS = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
}

export const emailjsReady = () => Boolean(EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey)
