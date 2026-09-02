import { profile } from '../data/profile'
import { FileIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons'
import './Hero.css'

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        <p className="hero__role">{profile.role}</p>
        <h1 className="hero__title">{profile.headline}</h1>
        <p className="hero__intro">{profile.intro}</p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#projects">
            See projects
          </a>
          <a className="btn btn--ghost" href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
            <FileIcon className="btn__icon" />
            CV
          </a>
          <a className="btn btn--ghost" href={profile.github} target="_blank" rel="noopener noreferrer">
            <GitHubIcon className="btn__icon" />
            GitHub
          </a>
          <a className="btn btn--ghost" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            <LinkedInIcon className="btn__icon" />
            LinkedIn
          </a>
          <a className="btn btn--ghost" href={`mailto:${profile.email}`}>
            <MailIcon className="btn__icon" />
            Email
          </a>
        </div>
      </div>
    </section>
  )
}
