export const ADMIN_TABLES = ["cv", "event", "live", "project-work", "text", "info"];

/** @type {Record<string, object>} */
export const ADMIN_TABLE_CONFIG = {
  cv: {
    label: "CV",
    dataTable: "cv",
    sortBy: "year",
    createHref: "/admin/cv/create",
    editHref: (id) => `/admin/cv/edit/${id}`,
    listColumns: ["year", "title_ko", "space_ko"],
    listColumnWidths: {
      year: "5rem",
      title_ko: "42%",
      space_ko: "42%",
    },
  },
  event: {
    label: "Event",
    dataTable: "event",
    sortBy: "date",
    createHref: "/admin/event/create",
    editHref: (id) => `/admin/event/edit/${id}`,
    listColumns: ["date", "title_ko", "space_ko"],
  },
  live: {
    label: "Live",
    dataTable: "live",
    sortBy: "start_at",
    createHref: "/admin/live/create",
    editHref: (id) => `/admin/live/edit/${id}`,
    listColumns: ["start_at", "end_at", "title_ko", "space_ko", "link_url"],
  },
  "project-work": {
    label: "Project / Work",
    tabLabel: "project / work",
    createLinks: [
      { href: "/admin/project/create", label: "Project 생성" },
      { href: "/admin/work/create", label: "Work 생성" },
    ],
  },
  text: {
    label: "Text",
    dataTable: "text",
    sortBy: "year",
    createHref: "/admin/text/create",
    editHref: (id) => `/admin/text/edit/${id}`,
    listColumns: ["year", "title_ko", "writer_ko"],
  },
  info: {
    label: "Info",
    dataTable: "info",
    sortBy: "email",
    sortOrder: "asc",
    createHref: "/admin/info/create",
    editHref: (id) => `/admin/info/edit/${id}`,
    listColumns: ["email", "bio_ko"],
  },
};
