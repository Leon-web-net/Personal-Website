import { profile } from '../data/profile'
import { GitHubIcon, LinkedInIcon } from './Icons'
import './Nav.css'

export function Nav() {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <a href="#top" className="nav__brand">
          {profile.name}
        </a>
        <nav className="nav__links" aria-label="Primary">
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
          <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
            CV
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <GitHubIcon />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
        </nav>
      </div>
    </header>
  )
}
