# Setup — one-time, about 10 minutes

This page lives in `index.html`. It needs a free Firebase project to store live results, then any free static host to actually publish the URL.

## 1. Create the Firebase project

1. Go to https://console.firebase.google.com and sign in with **irenehsuuk@gmail.com**.
2. Click **Add project** → name it e.g. `tennis-social-game` → keep default settings → **Create project**.
3. In the left sidebar, click **Build → Firestore Database** → **Create database** → choose a region close to you → start in **Production mode**.

## 2. Create the two data documents

Still in Firestore Database:

1. Click **Start collection** → Collection ID: `brackets`.
2. First document ID: `doubles`. Add fields:
   - `names` (type: array) → 5 strings: `Team 1`, `Team 2`, `Team 3`, `Team 4`, `Team 5`
   - `winners` (type: map) → leave empty
3. Click **Add document** again, document ID: `singles`. Add fields:
   - `names` (array) → 13 strings: `Player 1` through `Player 13`
   - `winners` (map) → leave empty

(You can put in real names right away instead of placeholders if you already have them — same fields.)

## 3. Publish the security rules

1. In Firestore Database, click the **Rules** tab.
2. Delete the existing content and paste in everything from `firestore.rules` (in this folder).
3. Replace `__SHARED_PIN__` with your real PIN (must match `SHARED_PIN` in Netlify's environment variables — see below).
4. Click **Publish**.

This makes the bracket readable by anyone with the link, but only editable by someone who knows the PIN. The placeholder here is intentional — this repo is public, so the real PIN only ever lives in Netlify's environment variables and directly in Firebase's Rules editor, never committed to git.

## 4. Get your web app config

1. Click the gear icon next to **Project Overview** → **Project settings**.
2. Under **Your apps**, click the **</>** (web) icon → nickname it e.g. `tennis-web` → **Register app**. Skip the hosting step it offers.
3. Copy the `firebaseConfig` object it shows you (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).
4. Send me those 6 values, or paste them directly into `index.html` yourself — near the top of the `<script type="module">` block, replacing the `PASTE_...` placeholders.

## 5. Publish the page

Easiest free option, no account needed:

1. Go to https://app.netlify.com/drop
2. Drag the whole `webapp` folder (just `index.html` is fine too) onto the page.
3. It gives you a live URL immediately — that's the link to share with everyone.

To update later (e.g. after changing the PIN or config), just drag the folder again — same trick, though the URL changes each time unless you make a free Netlify account and claim the site so it keeps one permanent URL.

## Changing the PIN or site password later

`index.html` no longer has the real values in it — it has placeholders
(`__SHARED_PIN__`, `__SITE_PASSWORD__`) that `build.js` fills in at deploy
time, so the real values never sit in this public repo's git history.

To change either one:
- **Netlify**: Site settings → Environment variables → edit `SHARED_PIN` and/or
  `SITE_PASSWORD` → trigger a new deploy (or just push any commit).
- **Local testing**: edit the gitignored `.env` file in this folder (same two
  keys), then run `node build.js` and open `dist/index.html`.
- **Firestore write rule**: `firestore.rules` still has `"0815"` hardcoded —
  if you change `SHARED_PIN`, update it there too and re-publish via the
  Rules tab, or edits won't save.
