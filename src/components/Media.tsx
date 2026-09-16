import type { Media as MediaType } from '../types'
import { PlayIcon } from './Icons'
import { YouTubePreview } from './YouTubePreview'
import './Media.css'

interface Props {
  media?: MediaType
  /** Used for the placeholder label and the video's accessible name. */
  title: string
  /**
   * Load this one straight away instead of lazily. The first project's preview is
   * the main image above the fold, so deferring it just delays the page looking ready.
   */
  priority?: boolean
}

/**
 * Renders a YouTube preview, a looping muted clip, a still image, or a placeholder.
 * The card does not care which - it just passes `project.media`.
 */
export function Media({ media, title, priority = false }: Props) {
  if (!media) {
    return (
      <div className="media media--placeholder" role="img" aria-label={`${title} preview coming soon`}>
        <PlayIcon className="media__placeholder-icon" />
        <span>Demo clip coming soon</span>
      </div>
    )
  }

  if (media.type === 'youtube') {
    return <YouTubePreview media={media} title={title} priority={priority} />
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
    <div className={`media${media.fit === 'contain' ? ' media--contain' : ''}`}>
      <img
        className="media__el"
        src={media.src}
        alt={media.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  )
}
