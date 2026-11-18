# Date Invite (React + Vite)

A cute, multi-step date-invite page. She says yes, picks when/where/what, and the plan is emailed to you via EmailJS.

## Setup

```
npm install
npm run dev
```

Recipient address: `src/config.js` → `YOUR_EMAIL`.

### EmailJS env vars

Vite inlines `VITE_*` vars at build time, so set these in Vercel **and redeploy** after changing them:

```
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

Copy `.env.example` to `.env.local` for local development. The EmailJS template body holds the email design; the app only sends plain variables (`to_email`, `subject`, `event_name`, `event_date`, `event_time`, `event_where`, `event_type`, `event_food`, `event_drink`, `event_notes`, `her_note`).

## Accessibility

All animation and transition work is wrapped by a `prefers-reduced-motion` rule in `src/index.css`, including hover lifts, press squishes and the hero sparkle trail, so the page stays static for users who ask for less motion. Focus rings are themed but always visible.
