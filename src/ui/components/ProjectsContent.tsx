import { useState } from "react";
import { ImageIcon, MapPin } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { mediaUrl } from "../../services/apiConfig";
import "../styles/projects.css";

function ProjectPhoto({ url, title, stage }: { url: string | null; title: string; stage: string }) {
  const [failed, setFailed] = useState(false);
  return <figure className="project-photo">
    <div>{url && !failed ? <img src={mediaUrl(url)} alt={`${title}: ${stage.toLowerCase()}`} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      : <span role="img" aria-label={`${stage} image not available`}><ImageIcon size={32} aria-hidden="true" />Image not available</span>}</div>
    <figcaption>{stage}</figcaption>
  </figure>;
}

export function ProjectsContent() {
  const { projects, loading, error, retry } = useProjects();
  return <section className="projects-empty" aria-labelledby="projects-title"><div>
    <h1 id="projects-title">Projects</h1>
    {loading ? <p role="status">Loading projects...</p> : error ? <div role="alert"><p>{error}</p><button type="button" className="button-link button-outline" onClick={retry}>Try again</button></div>
      : projects.length === 0 ? <p>Our projects will be shared here when they're ready.</p>
      : <div className="projects-list">{projects.map(project => <article className="project-card" key={project.id} aria-labelledby={`project-${project.id}`}>
        <h2 id={`project-${project.id}`}>{project.name}</h2>
        {project.location && <p className="project-location"><MapPin size={18} aria-hidden="true" />{project.location}</p>}
        <div className="project-comparison"><ProjectPhoto key={`before-${project.beforeImageUrl}`} url={project.beforeImageUrl} title={project.name} stage="Before" /><ProjectPhoto key={`after-${project.afterImageUrl}`} url={project.afterImageUrl} title={project.name} stage="After" /></div>
        {project.description && <p className="project-description">{project.description}</p>}
        <div className="project-progress">Project progress: <strong>{project.progress === 100 ? "Completed" : "Ongoing"}</strong></div>
      </article>)}</div>}
  </div></section>;
}
