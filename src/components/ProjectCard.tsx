import type { Project } from '../types'
import { useReveal } from '../hooks/useReveal'
import { Media } from './Media'
import { ErrorBoundary } from './ErrorBoundary'
import { ExternalIcon, GitHubIcon } from './Icons'
import './ProjectCard.css'

interface Props {
  project: Project
  /** Position in the list. Odd indexes get the flipped (media-right) layout. */
  index: number
}

const statusLabel: Record<Project['status'], string> = {
  live: 'Live',
  complete: 'Complete',
  'in-progress': 'In progress',
}

export function ProjectCard({ project, index }: Props) {
  const ref = useReveal<HTMLElement>()
  const flipped = index % 2 === 1

  return (
    <article
      ref={ref}
      id={project.id}
      className={`project reveal${flipped ? ' project--flipped' : ''}`}
    >
      <div className="project__media">
        {/* A failing preview should cost this one card its video, not the whole page.
            The fallback is deliberately plain markup rather than <Media>: if Media is
            what threw, rendering it again would throw again. */}
        <ErrorBoundary
          label={`preview:${project.id}`}
          fallback={
            <div className="media media--placeholder" role="img" aria-label={`${project.title} preview unavailable`}>
              <span>Preview unavailable</span>
            </div>
          }
        >
          <Media media={project.media} title={project.title} priority={index === 0} />
        </ErrorBoundary>
      </div>

      <div className="project__body">
        <div className="project__meta">
          <span className={`project__status project__status--${project.status}`}>
            {statusLabel[project.status]}
          </span>
          <span className="project__period">{project.period}</span>
        </div>

        <h3 className="project__title">{project.title}</h3>
        <p className="project__tagline">{project.tagline}</p>
        <p className="project__desc">{project.description}</p>

        {project.highlights && project.highlights.length > 0 && (
          <ul className="project__highlights">
            {project.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}

        <ul className="project__tags" aria-label="Technologies">
          {project.tags.map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>

        <div className="project__actions">
          {project.liveUrl && (
            <a className="btn btn--primary" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              Live demo
              <ExternalIcon className="btn__icon" />
            </a>
          )}
          {project.codeUrl && (
            <a className="btn btn--ghost" href={project.codeUrl} target="_blank" rel="noopener noreferrer">
              <GitHubIcon className="btn__icon" />
              Code
            </a>
          )}
          {project.extraLink && (
            <a className="btn btn--ghost" href={project.extraLink.url} target="_blank" rel="noopener noreferrer">
              {project.extraLink.label}
              <ExternalIcon className="btn__icon" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
