import "server-only";

import remoteTables from "./remote-tables.json";

const DEFAULT_TABLE_CONFIG = {
  select: "*",
  order: [],
  defaultLimit: 50,
  maxLimit: 100,
  defaultFilters: [],
};

/** @type {Record<string, typeof DEFAULT_TABLE_CONFIG>} */
const READABLE_TABLES = Object.fromEntries(
  remoteTables.tables.map((name) => [name, { ...DEFAULT_TABLE_CONFIG }])
);

/** @param {string} name */
export function getTableConfig(name) {
  return READABLE_TABLES[name] ?? null;
}

export function getReadableTableNames() {
  return remoteTables.tables;
}

export function getRemoteTablesMeta() {
  return {
    schema: remoteTables.schema,
    syncedAt: remoteTables.syncedAt,
    tables: remoteTables.tables,
  };
}
