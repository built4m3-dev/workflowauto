# Digital Business Card — Daniel Casarez

A self-contained, black/tactical digital contact card with a scannable QR code
for **Daniel Casarez — Task Force Commander, Hidalgo County Sheriff's Combined
Auto Theft Task Force**.

Everything (fonts, QR generator, styling) is embedded in a single file —
**no internet connection, build step, or dependencies required.**

- **File:** [`index.html`](./index.html)
- **Scan the QR code** → the full contact (name, title, agency, phone, email,
  location) saves straight to the scanner's phone.
- **Tap "Save Contact"** → downloads a `.vcf` that imports into any contacts app.
- **Tap Email / Call** → opens the phone's mail or dialer.

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
  phone     : "956 587 1742",
  website   : "",                      // e.g. "https://www.hidalgocounty.us"
  location  : "Hidalgo County, TX",

  socials   : [
    // { label:"LINKEDIN", url:"https://linkedin.com/in/…" },
  ],

  qrEncodes : "vcard"        // "vcard" = scan saves contact · "website" = scan opens a site
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

## 🌐 Publish it as a link (free, via GitHub Pages)

1. Push this repo to GitHub (already on your branch).
2. Repo **Settings → Pages → Build from branch**, pick your branch, folder `/`.
3. Your card goes live at
   `https://<user>.github.io/workflowauto/business-card/`.

Any static host (Netlify drop, Cloudflare Pages, etc.) works too — it's one file.

## 🔧 Under the hood

- **QR / vCard** — generated in-browser with [`qrcode-generator`](https://github.com/kazuhikoarase/qrcode-generator) (MIT), error-correction level **M**, with a 4-module quiet zone baked in for reliable scanning.
- **Type** — Big Shoulders (display) + Geist Mono (data), embedded as base64 `@font-face` so they render anywhere.
- **No tracking, no external calls, no official seals or badge graphics** — it is a personal contact card, not an issued credential. Open the file and read the source; that's all there is.
