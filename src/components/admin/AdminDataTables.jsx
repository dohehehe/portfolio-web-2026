"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTableRows } from "@/hooks/admin/useTableRows";
import {
  ADMIN_TABLE_CONFIG,
  ADMIN_TABLES,
} from "@/lib/admin/tableConfig";
import { formatCellValue, sortAdminItems } from "@/lib/admin/formatters";
import CvGroupedTable from "./CvGroupedTable";
import ProjectWorkGroupedTable from "./ProjectWorkGroupedTable";
import styles from "./AdminDataTables.module.css";

function ResourceTable({ table, items, config }) {
  const columns = config.listColumns;

  if (items.length === 0) {
    return <p className={styles.status}>{table} 데이터가 없습니다.</p>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {columns.map((column) => (
                <td key={column} className={styles.textCell}>
                  {formatCellValue(item[column])}
                </td>
              ))}
              <td className={styles.actionsCell}>
                <Link
                  className={styles.actionLink}
                  href={config.editHref(item.id)}
                >
                  수정
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDataTables() {
  const [activeTable, setActiveTable] = useState(ADMIN_TABLES[0]);

  const config = ADMIN_TABLE_CONFIG[activeTable];
  const isProjectWork = activeTable === "project-work";
  const dataTable = config.dataTable ?? null;

  const { data, loading, error } = useTableRows(dataTable, {
    enabled: Boolean(dataTable),
  });
  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
  } = useTableRows("project", { enabled: isProjectWork });
  const {
    data: works,
    loading: worksLoading,
    error: worksError,
  } = useTableRows("work", { enabled: isProjectWork });
  const { data: cvTypes, loading: cvTypesLoading } = useTableRows("cv_type", {
    enabled: activeTable === "cv",
  });

  const isLoading = isProjectWork
    ? projectsLoading || worksLoading
    : loading || (activeTable === "cv" && cvTypesLoading);
  const tableError = isProjectWork ? projectsError || worksError : error;

  const sortedItems = useMemo(
    () => sortAdminItems(data, config.sortBy, config.sortOrder),
    [data, config.sortBy, config.sortOrder]
  );

  return (
    <section className={styles.section}>
      <div className={styles.toolbar}>
        <div className={styles.toggleGroup}>
          {ADMIN_TABLES.map((table) => (
            <button
              key={table}
              className={`${styles.toggleButton} ${
                activeTable === table ? styles.toggleButtonActive : ""
              }`}
              type="button"
              onClick={() => setActiveTable(table)}
            >
              {ADMIN_TABLE_CONFIG[table].tabLabel ?? table}
            </button>
          ))}
        </div>

        {config.createLinks ? (
          <div className={styles.createLinks}>
            {config.createLinks.map((link) => (
              <Link
                key={link.href}
                className={styles.createLink}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ) : (
          <Link className={styles.createLink} href={config.createHref}>
            {config.label} 생성
          </Link>
        )}
      </div>

      {isLoading && <p className={styles.status}>Loading...</p>}

      {!isLoading && tableError && (
        <p className={`${styles.status} ${styles.error}`}>
          {tableError.message}
        </p>
      )}

      {!isLoading && !tableError && activeTable === "cv" && (
        <CvGroupedTable
          items={data}
          cvTypes={cvTypes}
          columns={config.listColumns}
          columnWidths={config.listColumnWidths}
          editHref={config.editHref}
        />
      )}

      {!isLoading && !tableError && isProjectWork && (
        <ProjectWorkGroupedTable projects={projects} works={works} />
      )}

      {!isLoading &&
        !tableError &&
        activeTable !== "cv" &&
        !isProjectWork && (
          <ResourceTable
            table={activeTable}
            items={sortedItems}
            config={config}
          />
        )}
    </section>
  );
}
