import "server-only";

export { getDataClient } from "@/lib/server/data/supabase";
export { fetchTable, fetchInfo } from "@/lib/server/data/fetchers/shared";
export { fetchProjects } from "@/lib/server/data/fetchers/projects";
export { fetchWorks } from "@/lib/server/data/fetchers/works";
export { fetchEvents } from "@/lib/server/data/fetchers/events";
export { fetchTexts } from "@/lib/server/data/fetchers/texts";
export { fetchCvBundle } from "@/lib/server/data/fetchers/cv";
export { fetchLiveEntries } from "@/lib/server/data/fetchers/live";
