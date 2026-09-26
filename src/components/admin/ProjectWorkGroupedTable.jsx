"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  sortByYearDesc,
  sortWorksByOrder,
} from "@/components/work/workListUtils";
import { formatCellValue } from "@/lib/admin/formatters";
import styles from "./AdminDataTables.module.css";

export function buildProjectWorkGroups(projects, works) {
  const worksByProjectId = new Map();
  const standalone = [];

  for (const work of works) {
    if (!work.project_id) {
      standalone.push(work);
      continue;
    }

    const projectWorks = worksByProjectId.get(work.project_id) ?? [];
    projectWorks.push(work);
    worksByProjectId.set(work.project_id, projectWorks);
  }

  const groups = sortByYearDesc(projects).map((project) => ({
    id: project.id,
    kind: "project",
    project,
    works: sortWorksByOrder(worksByProjectId.get(project.id) ?? []),
  }));

  if (standalone.length > 0) {
    groups.push({
      id: "__standalone__",
      kind: "standalone",
      project: null,
      works: sortWorksByOrder(standalone),
    });
  }

  return groups;
}

export default function ProjectWorkGroupedTable({
  projects,
  works,
  deletingId,
  onDeleteProject,
  onDeleteWork,
}) {
  const groups = useMemo(
    () => buildProjectWorkGroups(projects, works),
    [projects, works]
  );

  if (!projects.length && !works.length) {
    return (
      <p className={styles.status}>project / work 데이터가 없습니다.</p>
    );
  }

  return (
    <div className={styles.projectWorkList}>
      <p className={styles.orderHint}>
        work 순서 변경·삭제는 편집 API 연결 후 사용할 수 있습니다.
      </p>

      {groups.map((group) => (
        <section key={group.id} className={styles.projectGroup}>
          {group.kind === "project" ? (
            <div className={styles.projectRow}>
              <div className={styles.projectMeta}>
                <h3 className={styles.projectTitle}>
                  {formatCellValue(group.project.title_ko)}
                </h3>
                <span className={styles.metaChip}>
                  {formatCellValue(group.project.year)}
                </span>
                <span className={styles.workCount}>
                  work {group.works.length}
                </span>
              </div>
              <div className={styles.actionsCell}>
                <Link
                  className={styles.actionLink}
                  href={`/admin/project/edit/${group.project.id}`}
                >
                  수정
                </Link>
                {onDeleteProject ? (
                  <button
                    className={styles.actionButton}
                    type="button"
                    disabled={deletingId === group.project.id}
                    onClick={() => onDeleteProject(group.project.id)}
                  >
                    {deletingId === group.project.id ? "삭제 중..." : "삭제"}
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <h3 className={styles.projectTitle}>미분류 work</h3>
          )}

          {group.works.length === 0 ? (
            <p className={styles.emptyWorks}>연결된 work가 없습니다.</p>
          ) : (
            <ul className={styles.workList}>
              {group.works.map((work, index) => (
                <li key={work.id} className={styles.workRow}>
                  <span className={styles.orderIndex}>{index}</span>

                  <div className={styles.workMeta}>
                    <span className={styles.workTitle}>
                      {formatCellValue(work.title_ko)}
                    </span>
                    <span className={styles.metaChip}>
                      {formatCellValue(work.year)}
                    </span>
                    <span className={styles.metaChip}>
                      {formatCellValue(work.medium_ko)}
                    </span>
                  </div>

                  <div className={styles.actionsCell}>
                    <Link
                      className={styles.actionLink}
                      href={`/admin/work/edit/${work.id}`}
                    >
                      수정
                    </Link>
                    {onDeleteWork ? (
                      <button
                        className={styles.actionButton}
                        type="button"
                        disabled={deletingId === work.id}
                        onClick={() => onDeleteWork(work.id)}
                      >
                        {deletingId === work.id ? "삭제 중..." : "삭제"}
                      </button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
