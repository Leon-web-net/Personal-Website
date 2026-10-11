import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { ExternalIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons'
import './Hero.css'

/** One row each: icon, label, and the line of personality beside it. */
const links = [
  {
    key: 'github',
    label: 'GitHub',
    href: profile.github,
    blurb: profile.linkBlurbs.github,
    Icon: GitHubIcon,
    external: true,
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    href: profile.linkedin,
    blurb: profile.linkBlurbs.linkedin,
    Icon: LinkedInIcon,
    external: true,
  },
  {
    key: 'email',
    label: 'Email',
    href: `mailto:${profile.email}`,
    // The address is more use here than a quip.
    blurb: profile.email,
    Icon: MailIcon,
    external: false,
  },
]

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        {/* Identity and links sit side by side, then wrap to stacked when the two no
            longer fit across the content column. */}
        <div className="hero__top">
          <div className="hero__identity">
            <img
              className="hero__photo"
              src={profile.photo}
              alt={profile.photoAlt}
              width={360}
              height={360}
              fetchPriority="high"
              decoding="async"
            />
            <div>
              <h1 className="hero__name">{profile.name}</h1>
              <p className="hero__degree">{profile.degree}</p>
              <p className="hero__university">{profile.university}</p>
            </div>
          </div>

          <ul className="hero__links">
            {links.map(({ key, label, href, blurb, Icon, external }) => (
              <li key={key} className="hero__link-row">
                <a
                  className="hero__link"
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <Icon className="hero__link-icon" />
                  {label}
                  {external && <ExternalIcon className="hero__link-out" />}
                </a>
                <span className="hero__blurb">{blurb}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Jumps straight to a project instead of dumping you at the top of the list. */}
        <nav className="hero__projects" aria-label="Jump to a project">
          {projects.map((project) => (
            <a key={project.id} className="btn btn--ghost" href={`#${project.id}`}>
              {project.shortTitle ?? project.title}
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}
