import fs from "node:fs";
import path from "node:path";
import { loadEnvFile, requireEnv } from "./lib/load-env.mjs";

const root = loadEnvFile();

const supabaseUrl = requireEnv("SUPABASE_URL");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const response = await fetch(`${supabaseUrl}/rest/v1/`, {
  headers: {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    Accept: "application/openapi+json",
  },
});

if (!response.ok) {
  const body = await response.text();
  console.error(
    `Failed to introspect remote schema (${response.status} ${response.statusText})`
  );
  console.error(body);
  process.exit(1);
}

const openApi = await response.json();
const tables = Object.keys(openApi.paths ?? {})
  .map((routePath) => routePath.replace(/^\//, ""))
  .filter((name) => name && !name.includes("{") && !name.includes("rpc"))
  .sort();

const payload = {
  schema: "public",
  syncedAt: new Date().toISOString(),
  tables,
};

const outFile = path.join(root, "src/lib/db/remote-tables.json");
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`);

console.log(`Remote public tables (${tables.length}):`);
for (const table of tables) {
  console.log(`  - ${table}`);
}
console.log(`\nSaved → ${path.relative(root, outFile)}`);
