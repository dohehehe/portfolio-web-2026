import "server-only";

import {
  sortByYearDesc,
  sortWorksByOrder,
} from "@/components/navigation/workListUtils";
import { getDataClient } from "@/lib/server/data/supabase";

const NAV_PROJECT_COLUMNS = "id,created_at,year,title_ko,title_en";
const NAV_WORK_COLUMNS =
  'id,created_at,year,project_id,title_ko,title_en,"order"';
const NAV_EVENT_COLUMNS = "id,created_at,title_ko,title_en,date";
const NAV_TEXT_COLUMNS =
  "id,created_at,year,title_ko,title_en,writer_ko,writer_en";

export async function getNavigationWorkListData() {
  const supabase = await getDataClient();

  const [projectsResult, worksResult] = await Promise.all([
    supabase.from("project").select(NAV_PROJECT_COLUMNS).eq("is_active", true),
    supabase.from("work").select(NAV_WORK_COLUMNS).eq("is_active", true),
  ]);

  if (projectsResult.error || worksResult.error) {
    return { projects: [], works: [] };
  }

  return {
    projects: sortByYearDesc(projectsResult.data ?? []),
    works: sortWorksByOrder(worksResult.data ?? []),
  };
}

export async function getNavigationEventListData() {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("event")
    .select(NAV_EVENT_COLUMNS)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function getNavigationTextListData() {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("text")
    .select(NAV_TEXT_COLUMNS)
    .eq("is_active", true);

  if (error) {
    return [];
  }

  return sortByYearDesc(data ?? []);
}
