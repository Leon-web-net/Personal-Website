import { miniProjects, projects } from '../data/projects'
import { ProjectCard } from './ProjectCard'
import { GitHubIcon } from './Icons'
import './Projects.css'

export function Projects() {
  return (
    <section className="section" id="projects">
      <div className="container">
        <h2 className="section__title">Projects</h2>
        <p className="section__lead">
          A few things I have built. Each one has a short preview, a link to the code and, where it
          runs in the browser, a live demo.
        </p>

        <div className="projects__list">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>

        {miniProjects.length > 0 && (
          <div className="mini">
            <h3 className="mini__title">Also built</h3>
            <ul className="mini__list">
              {miniProjects.map((m) => (
                <li key={m.title} className="mini__item">
                  <div className="mini__head">
                    <a href={m.codeUrl} target="_blank" rel="noopener noreferrer" className="mini__name">
                      <GitHubIcon />
                      {m.title}
                    </a>
                    <span className="mini__tags">{m.tags.join(' / ')}</span>
                  </div>
                  <p className="mini__desc">{m.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
