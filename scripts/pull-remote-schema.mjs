import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

const projectRef = process.env.SUPABASE_PROJECT_REF?.trim();
const accessToken = process.env.SUPABASE_ACCESS_TOKEN?.trim();

if (!projectRef || !accessToken) {
  console.error(
    "Missing SUPABASE_PROJECT_REF or SUPABASE_ACCESS_TOKEN in .env"
  );
  console.error("Create a token: https://supabase.com/dashboard/account/tokens");
  process.exit(1);
}

const url = new URL(
  `https://api.supabase.com/v1/projects/${projectRef}/types/typescript`
);
url.searchParams.set("included_schemas", "public");

const response = await fetch(url, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

if (!response.ok) {
  const body = await response.text();
  console.error(
    `Failed to pull remote schema types (${response.status} ${response.statusText})`
  );
  console.error(body);
  process.exit(1);
}

const typesSource = await response.text();
const outDir = path.join(root, "src", "types");
const outFile = path.join(outDir, "database.types.ts");

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, typesSource);

console.log(`Pulled remote DB types → ${path.relative(root, outFile)}`);
