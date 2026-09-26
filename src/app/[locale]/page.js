import LanguageSwitch from "@/components/locale/LanguageSwitch";
import { pickLocalized } from "@/lib/locale/pickLocalized";
import { getDataClient } from "@/lib/server/data/supabase";
import { fetchInfo } from "@/lib/server/data/fetchers/shared";
import { fetchProjects } from "@/lib/server/data/fetchers/projects";
import styles from "./page.module.css";

export default async function HomePage({ params }) {
  const { locale } = await params;
  const supabase = await getDataClient();
  const [info, projects] = await Promise.all([
    fetchInfo(supabase),
    fetchProjects(supabase, { limit: 3 }),
  ]);

  const bio = pickLocalized(info, "bio", locale);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <LanguageSwitch />
      </header>
      <main className={styles.main}>
        <p className={styles.localeTag}>locale: {locale}</p>
        {bio ? <p className={styles.bio}>{bio}</p> : null}
        <ul className={styles.list}>
          {projects.map((project) => (
            <li key={project.id}>
              {pickLocalized(project, "title", locale) ?? project.id}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
