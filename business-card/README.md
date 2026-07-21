# Digital Business Card — WorkflowAuto

A self-contained, black/gritty digital business card with a scannable QR code.
Everything (fonts, QR generator, styling) is embedded in a single file —
**no internet connection, build step, or dependencies required.**

- **File:** [`index.html`](./index.html)
- **Scan the QR code** → the contact (name, title, company, email, phone, web)
  is saved straight to the scanner's phone.
- **Tap "Save Contact"** → downloads a `.vcf` that imports into any contacts app.

## ✏️ Edit your details (30 seconds)

Open `index.html` in any text editor and find the **`CONFIG`** block near the
bottom (it's clearly marked `▸▸▸ EDIT YOUR DETAILS HERE ◂◂◂`). Change the values:

```js
const CONFIG = {
  firstName : "Daniel",
  lastName  : "Casarez",
  role      : "Workflow Automation Specialist",
  company   : "WorkflowAuto",
  eyebrow   : "Automation Systems",
  tagline   : "I build n8n automations that capture leads ...",

  email     : "casarezd4477@yahoo.com",
  phone     : "",            // e.g. "+1 555 123 4567"
  website   : "",            // e.g. "https://workflowauto.io"
  location  : "",            // e.g. "Austin, TX"

  socials   : [
    // { label:"LINKEDIN",  url:"https://linkedin.com/in/…" },
    // { label:"INSTAGRAM", url:"https://instagram.com/…" },
  ],

  qrEncodes : "vcard"        // "vcard" = scan saves contact · "website" = scan opens your site
};
```

- Leave any field as `""` and it disappears from the card automatically.
- Reload the page — the **text, the QR code, and the `.vcf` all regenerate**
  from `CONFIG`, so they never fall out of sync.

> **Currently blank:** `phone`, `website`, `location`, and socials. Fill those in
> and the card fills out (the **Call** button appears once a phone number exists).

## 📤 How to share it

Pick whichever fits the moment:

1. **Send the link** — host it (below) and text/email the URL.
2. **Send the file** — `index.html` works offline; anyone can open it in a browser.
3. **Show the QR** — pull the card up on your phone and let people scan it.

## 🌐 Publish it as a link (free, via GitHub Pages)

1. Push this repo to GitHub (already on your branch).
2. Repo **Settings → Pages → Build from branch**, pick your branch, folder `/`.
3. Your card goes live at
   `https://<user>.github.io/workflowauto/business-card/`.

Any static host (Netlify drop, Cloudflare Pages, etc.) works too — it's one file.

## 🔧 Under the hood

- **QR / vCard** — generated in-browser with [`qrcode-generator`](https://github.com/kazuhikoarase/qrcode-generator) (MIT), error-correction level **M**, with a 4-module quiet zone baked in for reliable scanning.
- **Type** — Big Shoulders (display) + Geist Mono (data), embedded as base64 `@font-face` so they render anywhere.
- **No tracking, no external calls** — open the file and read the source; that's all there is.
