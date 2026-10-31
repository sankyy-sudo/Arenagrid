import { CardGrid } from "./CardGrid";
import { cardSummary } from "../data/cardContent";
import { InfoCard } from "./InfoCard";
import { detailHref } from "../data/catalog";
import { useProjects } from "../hooks/useProjects";
import "../styles/projects.css";

export function ProjectsContent() {
  const { projects, loading, error, retry } = useProjects();
  return <section className="projects-empty" aria-labelledby="projects-title"><div>
    <h1 id="projects-title">Projects</h1>
    {loading ? <p role="status">Loading projects...</p> : error ? <div role="alert"><p>{error}</p><button type="button" className="button-link button-outline" onClick={retry}>Try again</button></div>
      : projects.length === 0 ? <p>Our projects will be shared here when they're ready.</p>
      : <CardGrid className="projects-list">{projects.map(project => {
        const isDemo = /^demo:\s*/i.test(project.name);
        const city = (project.location || "").replace(/\s*[^\p{L}\p{N}]*\s*illustrative location.*$/iu, "").split(",")[0].trim();
        return <InfoCard key={project.id} to={detailHref("projects", project)}
          title={project.name.replace(/^demo:\s*/i, "")}
          shortDescription={cardSummary(project).replace(/\s*This is a demo project\.?/gi, "").trim()}
          image={project.afterImageUrl || project.beforeImageUrl}
          category={project.progress === 100 ? "Completed" : "Ongoing"}
          secondaryBadge={isDemo ? "DEMO" : undefined}
          tags={city ? [city] : []} className="project-list-card" headingLevel={2} />;
      })}</CardGrid>}
  </div></section>;
}
