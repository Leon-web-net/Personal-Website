/** A short-form media preview shown beside a project description. */
export type Media =
  | { type: 'video'; src: string; poster?: string; alt: string }
  | { type: 'image'; src: string; alt: string }

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
