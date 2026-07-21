# Add to Apple Wallet — pass generator

This folder builds a signed **Apple Wallet pass** (`.pkpass`) of Daniel Casarez's
contact card. Adding it to Wallet puts your name, title, agency, both phone
numbers, email, and a **scannable QR (vCard)** one swipe away on an iPhone.

> **Why there's a build step:** Apple only accepts passes that are
> cryptographically signed with an Apple **Pass Type ID certificate**. That
> signature can't be produced in a browser, so this runs once on your computer
> (or any machine with `node`, `openssl`, and `zip`). After that, the card's
> **"Add to Apple Wallet"** button just points at the hosted file.

Everything here is already filled in with your details — you only need to supply
the certificate.

---

## What you need

- An **Apple Developer Program** membership ($99/yr) — required for a Pass Type ID.
- `node`, `openssl`, and `zip` (preinstalled on macOS; all standard on Linux).

## Step 1 — Create a Pass Type ID + certificate

1. Go to **developer.apple.com → Certificates, IDs & Profiles → Identifiers**.
2. **+ → Pass Type IDs**, register something like `pass.org.hidalgoso.businesscard`.
3. Select it → **Create Certificate**, follow the prompts (on a Mac, Keychain
   Access generates the CSR), and **download** the resulting certificate.
4. Note your **Team ID** (top-right of the developer site, or Membership page).

## Step 2 — Turn the certificate into three PEM files

Put the results in a new `certs/` folder here (`wallet/certs/`).

**If you exported a `.p12` from Keychain Access:**
```bash
mkdir -p certs
openssl pkcs12 -in Certificates.p12 -clcerts -nokeys  -out certs/signerCert.pem
openssl pkcs12 -in Certificates.p12 -nocerts  -nodes  -out certs/signerKey.pem
```

**Apple WWDR intermediate certificate** (free — download the current "Worldwide
Developer Relations" cert from <https://www.apple.com/certificateauthority/>):
```bash
openssl x509 -inform der -in AppleWWDRCAG4.cer -out certs/wwdr.pem
```

You should now have: `certs/signerCert.pem`, `certs/signerKey.pem`, `certs/wwdr.pem`.
(These are git-ignored and must **never** be committed.)

## Step 3 — Set your two Apple identifiers

Edit **`pass.config.json`** and replace the `CHANGE-ME` values:
```json
"passTypeIdentifier": "pass.org.hidalgoso.businesscard",   // must match Step 1
"teamIdentifier":     "YOUR10CHARID"
```
(The contact details there are already correct — keep them in sync with `../index.html` if you ever edit one.)

## Step 4 — Build the pass

```bash
node build-pass.mjs
# if your private key has a passphrase:
# WALLET_KEY_PASS='yourpass' node build-pass.mjs
```
This writes **`daniel-casarez.pkpass`**. AirDrop or email it to your iPhone and
tap it — it should open in Wallet with an **Add** button. 🎉

## Step 5 — Host it + turn on the card button

The `.pkpass` must be served with the right MIME type or iOS won't open it in Wallet:

- **Easiest:** deploy to **Netlify** (drag-and-drop). The included `_headers`
  file already sets `Content-Type: application/vnd.apple.pkpass`.
- Any host where you can set that content type works (Cloudflare Pages, S3 with
  the object's Content-Type set, etc.).
- ⚠️ **GitHub Pages** does **not** set that MIME type, so the button may just
  download the file instead of opening Wallet — use a configurable host.

Then, in **`../index.html`**, set:
```js
walletPass : "https://your-host/daniel-casarez.pkpass",
```
Reload — the **"Add to Apple Wallet"** button now appears on the card.

---

### Files here

| File | Purpose |
|------|---------|
| `pass.config.json` | Your details + Apple identifiers (edit this) |
| `build-pass.mjs` | Generates `pass.json`, hashes, signs, and zips the `.pkpass` (no npm deps) |
| `assets/` | Pass icon + logo (amber "DC" monogram) |
| `_headers` | Netlify/Cloudflare MIME header for the `.pkpass` |
| `certs/` | **You add this** — your PEM certs (git-ignored) |

### Notes
- The QR inside the pass is the same vCard as the web card, so scanning either one saves your full contact.
- No sheriff's star, seal, or badge is used — this is a personal contact pass, not an issued credential. If your unit has an approved logo you're cleared to use, drop it in as `assets/logo.png` (+`@2x`, `@3x`) and rebuild.
