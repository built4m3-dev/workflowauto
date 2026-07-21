#!/usr/bin/env node
/* ============================================================================
 * build-pass.mjs — turn pass.config.json into a signed Apple Wallet .pkpass
 *
 * Zero dependencies (Node built-ins + the `openssl` and `zip` CLIs only).
 *
 *   node build-pass.mjs
 *
 * Certificates (see README.md for how to obtain them). Provide the three PEM
 * files either at wallet/certs/ with these names, or via env vars:
 *   certs/signerCert.pem   or  $WALLET_CERT   — your Pass Type ID certificate
 *   certs/signerKey.pem    or  $WALLET_KEY    — its private key
 *   certs/wwdr.pem         or  $WALLET_WWDR   — Apple WWDR intermediate cert
 *   (if the key has a passphrase, set $WALLET_KEY_PASS)
 *
 * Output: daniel-casarez.pkpass  (rename via serialNumber/first-last).
 * ==========================================================================*/
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const DIR    = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(DIR, "assets");
const CERTS  = path.join(DIR, "certs");
const BUILD  = path.join(DIR, ".build");

const die = (m) => { console.error("\n✖ " + m + "\n"); process.exit(1); };
const ok  = (m) => console.log("  ✓ " + m);

/* ---- load + validate config ---------------------------------------------- */
const cfg = JSON.parse(fs.readFileSync(path.join(DIR, "pass.config.json"), "utf8"));
const C = cfg.contact;
const fullName = [C.firstName, C.lastName].filter(Boolean).join(" ").trim();

if (cfg.apple.passTypeIdentifier.includes("CHANGE-ME"))
  die("Set apple.passTypeIdentifier in pass.config.json (e.g. pass.org.hidalgoso.businesscard).");
if (cfg.apple.teamIdentifier.includes("CHANGE-ME"))
  die("Set apple.teamIdentifier in pass.config.json (your 10-char Apple Team ID).");

/* ---- resolve certificates ------------------------------------------------- */
const certPath = process.env.WALLET_CERT || path.join(CERTS, "signerCert.pem");
const keyPath  = process.env.WALLET_KEY  || path.join(CERTS, "signerKey.pem");
const wwdrPath = process.env.WALLET_WWDR || path.join(CERTS, "wwdr.pem");
for (const [p, name] of [[certPath, "Pass Type ID certificate"], [keyPath, "private key"], [wwdrPath, "Apple WWDR certificate"]])
  if (!fs.existsSync(p)) die(`Missing ${name}: ${p}\n  See README.md → "Get your certificate".`);

/* ---- build the vCard (identical shape to the web card's QR) --------------- */
function vcard() {
  const L = ["BEGIN:VCARD", "VERSION:3.0"];
  L.push(`N:${C.lastName || ""};${C.firstName || ""};;;`);
  L.push(`FN:${fullName}`);
  if (C.agency) L.push(`ORG:${C.agency}`);
  if (C.role)   L.push(`TITLE:${C.role}`);
  (C.phones || []).forEach((p) => {
    if (!p || !p.number) return;
    const t = /off|work/i.test(p.label || "") ? "WORK" : /cell|mob/i.test(p.label || "") ? "CELL" : "VOICE";
    L.push(`TEL;TYPE=${t}:${p.number}`);
  });
  if (C.email) L.push(`EMAIL;TYPE=INTERNET:${C.email}`);
  L.push("END:VCARD");
  return L.join("\r\n");
}

/* ---- assemble pass.json --------------------------------------------------- */
const phones = C.phones || [];
const pass = {
  formatVersion: 1,
  passTypeIdentifier: cfg.apple.passTypeIdentifier,
  teamIdentifier: cfg.apple.teamIdentifier,
  organizationName: cfg.apple.organizationName || C.agency,
  description: `${fullName} — ${C.role}`,
  serialNumber: cfg.serialNumber || `${C.firstName}-${C.lastName}`.toLowerCase(),
  logoText: C.brand || C.agency,
  foregroundColor: cfg.colors.foreground,
  labelColor: cfg.colors.label,
  backgroundColor: cfg.colors.background,
  sharingProhibited: false,
  barcodes: [{ format: "PKBarcodeFormatQR", message: vcard(), messageEncoding: "iso-8859-1", altText: "Scan to save contact" }],
  barcode:   { format: "PKBarcodeFormatQR", message: vcard(), messageEncoding: "iso-8859-1", altText: "Scan to save contact" },
  generic: {
    primaryFields:   [{ key: "name",  label: "", value: fullName }],
    secondaryFields: [{ key: "title", label: "TITLE", value: C.role }],
    auxiliaryFields: phones.slice(0, 2).map((p, i) => ({ key: "aux" + i, label: (p.label || "PHONE").toUpperCase(), value: p.number })),
    backFields: [
      { key: "agency", label: "Agency", value: C.agency },
      ...(C.email ? [{ key: "email", label: "Email", value: C.email }] : []),
      ...phones.map((p, i) => ({ key: "bp" + i, label: p.label || "Phone", value: p.number })),
    ],
  },
};

/* ---- stage files ---------------------------------------------------------- */
fs.rmSync(BUILD, { recursive: true, force: true });
fs.mkdirSync(BUILD, { recursive: true });

const files = [];
const add = (name, buf) => { fs.writeFileSync(path.join(BUILD, name), buf); files.push(name); };

add("pass.json", Buffer.from(JSON.stringify(pass, null, 2)));

const imageNames = ["icon.png", "icon@2x.png", "icon@3x.png", "logo.png", "logo@2x.png", "logo@3x.png"];
for (const img of imageNames) {
  const src = path.join(ASSETS, img);
  if (!fs.existsSync(src)) die(`Missing asset: ${src}`);
  add(img, fs.readFileSync(src));
}
ok(`staged ${files.length} files (pass.json + ${imageNames.length} images)`);

/* ---- manifest.json (SHA-1 of every file) ---------------------------------- */
const manifest = {};
for (const name of files) manifest[name] = crypto.createHash("sha1").update(fs.readFileSync(path.join(BUILD, name))).digest("hex");
fs.writeFileSync(path.join(BUILD, "manifest.json"), JSON.stringify(manifest, null, 2));
ok("wrote manifest.json");

/* ---- sign manifest.json → signature (detached DER PKCS#7) ----------------- */
const args = [
  "smime", "-binary", "-sign",
  "-certfile", wwdrPath,
  "-signer", certPath,
  "-inkey", keyPath,
  "-in", path.join(BUILD, "manifest.json"),
  "-out", path.join(BUILD, "signature"),
  "-outform", "DER", "-noattr",
];
if (process.env.WALLET_KEY_PASS) args.push("-passin", "pass:" + process.env.WALLET_KEY_PASS);
try {
  execFileSync("openssl", args, { stdio: ["ignore", "ignore", "pipe"] });
} catch (e) {
  die("openssl signing failed:\n" + (e.stderr ? e.stderr.toString() : e.message) +
      "\n  Check that the cert/key match and the key passphrase ($WALLET_KEY_PASS) is correct.");
}
ok("signed manifest.json");

/* ---- zip into .pkpass ----------------------------------------------------- */
const outName = `${(C.firstName + "-" + C.lastName).toLowerCase().replace(/[^a-z0-9-]/g, "")}.pkpass`;
const outPath = path.join(DIR, outName);
fs.rmSync(outPath, { force: true });
execFileSync("zip", ["-X", "-q", outPath, "pass.json", "manifest.json", "signature", ...imageNames], { cwd: BUILD });
fs.rmSync(BUILD, { recursive: true, force: true });

console.log(`\n✔ Built ${outName}  (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
console.log(`  Next: host it with Content-Type "application/vnd.apple.pkpass", then set`);
console.log(`  walletPass to that URL in ../index.html. See README.md.\n`);
