# Digital Business Card — Daniel Casarez

A self-contained, black/tactical digital contact card with a scannable QR code
for **Daniel Casarez — Task Force Commander, Hidalgo County Sheriff's Combined
Auto Theft Task Force**.

Everything (fonts, QR generator, styling) is embedded in `index.html` — **no
internet connection, build step, or dependencies required.** (A few small icon
files sit alongside it only to give the "Add to Home Screen" shortcut a branded icon.)

- **File:** [`index.html`](./index.html)
- **Scan the QR code** → opens this card in the scanner's browser; they tap
  **Save Contact** to add you. The QR holds a *link*, not your raw number — so
  phone cameras open the card instead of latching onto a phone number.
- **Tap "Save Contact"** → downloads a `.vcf` that imports into any contacts app.
- **Tap Email / Call** → opens the phone's mail or dialer.
- **Add to Home Screen** → installs the card as a tappable icon that opens
  full-screen like an app (free, iPhone & Android — no developer account).

## ✏️ Edit your details (30 seconds)

Open `index.html` in any text editor and find the **`CONFIG`** block near the
bottom (marked `▸▸▸ EDIT YOUR DETAILS HERE ◂◂◂`). Change the values:

```js
const CONFIG = {
  firstName : "Daniel",
  lastName  : "Casarez",
  role      : "Task Force Commander",
  company   : "Hidalgo County Sheriff's Combined Auto Theft Task Force",
  brand     : "Hidalgo Co. Sheriff",   // short label, top-left of the card
  eyebrow   : "Combined Auto Theft Task Force",
  region    : "Texas",                 // short label, top-right of the card
  tagline   : "",                      // optional line under your title

  email     : "danielr.casarez@hidalgoso.org",
  phones    : [                        // first number is what the "Call" button dials
    { label:"Cell",   number:"956-378-8082" },
    { label:"Office", number:"956-383-8114" },
  ],
  website   : "",                      // e.g. "https://www.hidalgocounty.us"
  location  : "",                      // e.g. "Hidalgo County, TX"

  socials   : [
    // { label:"LINKEDIN", url:"https://linkedin.com/in/…" },
  ],

  cardUrl   : "https://built4m3-dev.github.io/workflowauto/business-card/",  // where the QR points
  qrEncodes : "url"          // "url" = QR opens cardUrl (cameras can't grab a number) · "vcard" = QR holds the raw contact · "website" = QR opens your website
};
```

- Leave any field as `""` and it disappears from the card automatically
  (the **Call** button, for example, only shows when a phone number is present).
- Reload the page — the **text, the QR code, and the `.vcf` all regenerate**
  from `CONFIG`, so they never fall out of sync.

## 📤 How to share it

1. **Send the link** — host it (below) and text/email the URL.
2. **Send the file** — `index.html` works offline; anyone can open it in a browser.
3. **Show the QR** — pull the card up on your phone and let people scan it.

## 🌐 Publish it as a link (free, via GitHub Pages) — required for the QR

The QR points at **`cardUrl`**, so the card must be live at that address for
scanning to work. To turn on GitHub Pages:

1. Merge this branch into **`main`** (your default branch).
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a
   branch**, pick **`main`** and folder **`/ (root)`**, then **Save**.
3. After a minute the card is live at
   **`https://built4m3-dev.github.io/workflowauto/business-card/`** — exactly the
   `cardUrl` the QR already uses. Scan it to confirm.

Hosting elsewhere (Netlify, Cloudflare Pages, your own domain)? Just set
`cardUrl` to that address and reload so the QR regenerates.

## 📲 Add to Home Screen (the free "shortcut")

The card has an **"Add to Home Screen"** button — a free way to keep it one tap
away on a phone, with no Apple Developer account or fee. Tapping it:

- **iPhone (Safari):** shows the steps — Share button → *Add to Home Screen*.
- **Android (Chrome):** fires the native install prompt where available,
  otherwise shows the menu steps.

Once added, the card opens **full-screen like an app**. For the branded
home-screen icon, host this folder so the phone can load `apple-touch-icon.png`,
`icon-192.png`, `icon-512.png`, and `manifest.webmanifest` next to `index.html`
(GitHub Pages / Netlify — see above). Opened as a lone file it still installs,
just with a generic icon.

> Prefer an entry in the iOS **Shortcuts** app instead? That's also free — just
> ask; Add to Home Screen is the simpler, cross-platform option.

## 🔧 Under the hood

- **QR / vCard** — generated in-browser with [`qrcode-generator`](https://github.com/kazuhikoarase/qrcode-generator) (MIT), error-correction level **M**, with a 4-module quiet zone baked in for reliable scanning.
- **Type** — Big Shoulders (display) + Geist Mono (data), embedded as base64 `@font-face` so they render anywhere.
- **No tracking, no external calls, no official seals or badge graphics** — it is a personal contact card, not an issued credential. Open the file and read the source; that's all there is.
