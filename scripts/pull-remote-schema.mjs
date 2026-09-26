import fs from "node:fs";
import path from "node:path";
import { loadEnvFile } from "./lib/load-env.mjs";

const root = loadEnvFile();

const projectRef = process.env.SUPABASE_PROJECT_REF?.trim();
const accessToken = process.env.SUPABASE_ACCESS_TOKEN?.trim();

if (!projectRef || !accessToken) {
  console.warn(
    "Skipping TypeScript types: set SUPABASE_PROJECT_REF and SUPABASE_ACCESS_TOKEN for db:types"
  );
  process.exit(0);
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
