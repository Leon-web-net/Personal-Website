/** A short-form media preview shown beside a project description. */
export type Media =
  /**
   * A YouTube video (unlisted is fine). Shows the thumbnail at rest and plays on
   * hover, so the player only loads for people who look at it.
   * `id` is the part after youtu.be/ or watch?v= - e.g. 'EW4Ia1L1KV4'.
   * `start`/`end` (seconds) loop just a segment, which is usually a better preview
   * than a long video played from the top.
   */
  | {
      type: 'youtube'
      id: string
      alt: string
      poster?: string
      start?: number
      end?: number
    }
  /** A self-hosted clip in /public/media. Autoplays muted on loop. */
  | { type: 'video'; src: string; poster?: string; alt: string }
  /** A still image. Use fit: 'contain' for plots and diagrams you must not crop. */
  | { type: 'image'; src: string; alt: string; fit?: 'cover' | 'contain' }

export type ProjectStatus = 'live' | 'complete' | 'in-progress'

export interface Project {
  /** Stable id, also used as the DOM anchor (#gesture-app). */
  id: string
  title: string
  /** One-line hook shown under the title, e.g. "Real-time hand tracking in the browser". */
  tagline: string
  /** 2-4 short sentences: what it does, then the interesting technical bit. */
  description: string
  /** Optional bullet list of headline results / numbers. Keep to 2-3 items. */
  highlights?: string[]
  tags: string[]
  liveUrl?: string
  codeUrl?: string
  /** Extra link, e.g. a report, writeup or an older version. */
  extraLink?: { label: string; url: string }
  status: ProjectStatus
  /** Year or range, shown as plain text. */
  period: string
  /** Omit while you don't have a clip yet - a placeholder is rendered instead. */
  media?: Media
}

export interface MiniProject {
  title: string
  description: string
  tags: string[]
  codeUrl: string
}
