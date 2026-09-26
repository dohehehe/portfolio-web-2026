/**
 * Browser-safe read-only API — `/api/{table}`, no Supabase keys.
 */

async function parseResponse(response) {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.error ??
      payload?.message ??
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload?.data ?? payload;
}

export async function apiFetch(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
  });
  return parseResponse(response);
}

/** @param {string} table */
export function tableApi(table) {
  return {
    list: (params) => {
      const search = new URLSearchParams();
      if (params?.limit != null) {
        search.set("limit", String(params.limit));
      }
      if (params?.by && params?.value != null) {
        search.set("by", params.by);
        search.set("value", String(params.value));
      }
      const qs = search.toString();
      return apiFetch(qs ? `/api/${table}?${qs}` : `/api/${table}`);
    },
    byId: (id) => apiFetch(`/api/${table}/${encodeURIComponent(id)}`),
  };
}

export const api = {
  health: () => apiFetch("/api/health"),
  table: tableApi,
};
