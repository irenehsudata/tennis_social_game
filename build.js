// Injects secrets from environment variables into index.html at deploy time,
// so the real values never sit in the git history of this public repo.
// Netlify sets these from Site settings -> Environment variables. For local
// testing, put the same names in a gitignored .env file (KEY=VALUE per line).
const fs = require("fs");
const path = require("path");

function loadDotEnv(file) {
  if (!fs.existsSync(file)) return;
  fs.readFileSync(file, "utf8").split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eq = trimmed.indexOf("=");
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  });
}
loadDotEnv(path.join(__dirname, ".env"));

const REQUIRED = ["SHARED_PIN", "SITE_PASSWORD"];
const missing = REQUIRED.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing required env var(s): ${missing.join(", ")}`);
  console.error("Set them in Netlify (Site settings -> Environment variables) or in a local .env file.");
  process.exit(1);
}

const outDir = path.join(__dirname, "dist");
fs.mkdirSync(outDir, { recursive: true });

let html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
html = html.replace(/__SHARED_PIN__/g, process.env.SHARED_PIN);
html = html.replace(/__SITE_PASSWORD__/g, process.env.SITE_PASSWORD);
fs.writeFileSync(path.join(outDir, "index.html"), html);

console.log("Built dist/index.html with secrets injected.");
