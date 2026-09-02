import type { Media as MediaType } from '../types'
import { PlayIcon } from './Icons'
import './Media.css'

interface Props {
  media?: MediaType
  /** Used for the placeholder label when there is no media yet. */
  title: string
}

/**
 * Renders a looping muted clip, a still image, or a placeholder.
 * The card does not care which - it just passes `project.media`.
 */
export function Media({ media, title }: Props) {
  if (!media) {
    return (
      <div className="media media--placeholder" role="img" aria-label={`${title} preview coming soon`}>
        <PlayIcon className="media__placeholder-icon" />
        <span>Demo clip coming soon</span>
      </div>
    )
  }

  if (media.type === 'video') {
    return (
      <div className="media">
        <video
          className="media__el"
          src={media.src}
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={media.alt}
        />
      </div>
    )
  }

  return (
    <div className="media">
      <img className="media__el" src={media.src} alt={media.alt} loading="lazy" decoding="async" />
    </div>
  )
}
