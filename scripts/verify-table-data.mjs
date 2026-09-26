import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { loadEnvFile, requireEnv } from "./lib/load-env.mjs";

const root = loadEnvFile();
const supabaseUrl = requireEnv("SUPABASE_URL");
const publishableKey = requireEnv("SUPABASE_PUBLISHABLE_KEY");

const remoteTables = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/db/remote-tables.json"), "utf8")
);

const supabase = createClient(supabaseUrl, publishableKey);

const ACTIVE = new Set(["cv", "event", "project", "text", "work"]);

async function probeTable(table) {
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  if (ACTIVE.has(table)) {
    query = query.eq("is_active", true);
  }
  const { count, error } = await query;
  return { count: count ?? 0, error: error?.message ?? null };
}

async function probeHttp(table) {
  const base = process.env.VERIFY_BASE_URL ?? "http://127.0.0.1:3000";
  try {
    const res = await fetch(`${base}/api/${table}?limit=1`);
    const body = await res.json();
    const rows = body?.data?.rows;
    return {
      status: res.status,
      ok: body?.ok === true,
      rowCount: Array.isArray(rows) ? rows.length : null,
      error: body?.error ?? null,
    };
  } catch (err) {
    return {
      status: 0,
      ok: false,
      rowCount: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

console.log("=== Supabase (server publishable key, same as Route Handlers) ===\n");

const rows = [];
for (const table of remoteTables.tables) {
  const result = await probeTable(table);
  rows.push({ table, ...result });
}

const maxName = Math.max(...rows.map((r) => r.table.length));
for (const r of rows) {
  const status = r.error ? `FAIL — ${r.error}` : `OK — ${r.count} row(s)`;
  console.log(`${r.table.padEnd(maxName)}  ${status}`);
}

console.log("\n=== GET /api/{table} (optional, set VERIFY_BASE_URL) ===\n");

let httpAvailable = false;
for (const table of remoteTables.tables) {
  const r = await probeHttp(table);
  if (r.status > 0) {
    httpAvailable = true;
  }
  if (!httpAvailable && table === remoteTables.tables[0]) {
    console.log(`(skipped — dev server not reachable at ${process.env.VERIFY_BASE_URL ?? "http://127.0.0.1:3000"})`);
    break;
  }
  if (httpAvailable) {
    const status = r.ok
      ? `HTTP ${r.status} — sample ${r.rowCount} row(s)`
      : `HTTP ${r.status} — ${r.error}`;
    console.log(`${table.padEnd(maxName)}  ${status}`);
  }
}

const failed = rows.filter((r) => r.error);
process.exit(failed.length > 0 ? 1 : 0);
