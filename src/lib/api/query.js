/** @param {URLSearchParams} searchParams */
export function parseLimit(searchParams, fallback, max) {
  const raw = searchParams.get("limit");
  if (raw === null || raw === "") {
    return fallback;
  }
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.min(parsed, max);
}
