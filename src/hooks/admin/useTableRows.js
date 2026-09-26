"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/client";

/**
 * @param {string | null} table
 * @param {{ enabled?: boolean; limit?: number }} [options]
 */
export function useTableRows(table, options = {}) {
  const { enabled = true, limit = 100 } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!enabled || !table) {
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const payload = await api.table(table).list({ limit });
        if (cancelled) {
          return;
        }
        setData(payload?.rows ?? []);
      } catch (err) {
        if (cancelled) {
          return;
        }
        const nextError =
          err instanceof Error ? err : new Error("데이터를 불러오지 못했습니다.");
        setError(nextError);
        setData([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [enabled, table, limit, reloadToken]);

  const refetch = useCallback(async () => {
    setReloadToken((value) => value + 1);
  }, []);

  const isLoading = Boolean(enabled && table && loading);

  return { data, loading: isLoading, error, refetch };
}
