import { profile } from '../data/profile'
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons'
import './Footer.css'

export function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <h2 className="footer__title">Get in touch</h2>
        <p className="footer__lead">
          Open to graduate roles in machine learning, computer vision and control. The quickest way
          to reach me is email.
        </p>
        <div className="footer__links">
          <a className="btn btn--primary" href={`mailto:${profile.email}`}>
            <MailIcon className="btn__icon" />
            {profile.email}
          </a>
          <a className="btn btn--ghost" href={profile.github} target="_blank" rel="noopener noreferrer">
            <GitHubIcon className="btn__icon" />
            GitHub
          </a>
          <a className="btn btn--ghost" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            <LinkedInIcon className="btn__icon" />
            LinkedIn
          </a>
        </div>
        <p className="footer__fine">
          &copy; {new Date().getFullYear()} {profile.name}. Built with React, TypeScript and Vite.
        </p>
      </div>
    </footer>
  )
}
