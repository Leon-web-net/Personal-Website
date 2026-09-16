/**
 * Thin wrapper around the YouTube IFrame Player API.
 *
 * We use the official API rather than raw postMessage because `onStateChange` tells
 * us the exact moment playback starts, which is what times the poster/player crossfade.
 */

/** Only the parts of the player we actually call. */
export interface YTPlayer {
  playVideo(): void
  pauseVideo(): void
  mute(): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  destroy(): void
  getCurrentTime(): number
  /**
   * Read-only. There is deliberately no setter here: `setPlaybackQuality` is
   * deprecated and measurably does nothing - calling it with 'hd1080' leaves the
   * stream exactly where it was. Quality is influenced only by player size.
   */
  getPlaybackQuality(): string
  getAvailableQualityLevels(): string[]
}

export interface YTStateChangeEvent {
  target: YTPlayer
  data: number
}

interface YTPlayerOptions {
  host?: string
  videoId: string
  width?: string
  height?: string
  playerVars?: Record<string, string | number>
  events?: {
    onReady?: (event: { target: YTPlayer }) => void
    onStateChange?: (event: YTStateChangeEvent) => void
    onPlaybackQualityChange?: (event: { target: YTPlayer; data: string }) => void
  }
}

export interface YTNamespace {
  Player: new (element: HTMLElement | string, options: YTPlayerOptions) => YTPlayer
  PlayerState: {
    UNSTARTED: number
    ENDED: number
    PLAYING: number
    PAUSED: number
    BUFFERING: number
    CUED: number
  }
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<YTNamespace> | null = null

/** Injects the IFrame API script once and resolves when the namespace is ready. */
export function loadYouTubeApi(): Promise<YTNamespace> {
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT)
      return
    }

    // The API calls this global when it finishes loading. Chain any existing
    // handler rather than clobbering it.
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve(window.YT as YTNamespace)
    }

    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    document.head.append(script)
  })

  return apiPromise
}

/**
 * Call a no-argument player method, but only if it is genuinely there.
 *
 * `new YT.Player()` hands back an object immediately, yet its methods are not attached
 * until the iframe reports ready - and they go away again once destroy() has run. Calling
 * one outside that window throws a TypeError, and an unguarded throw inside a React effect
 * unmounts the whole tree, which the visitor sees as a blank white page.
 *
 * Checking for the method rather than tracking a ready flag covers both ends: too early,
 * and after teardown.
 */
export function callPlayer(
  player: YTPlayer | null,
  method: 'playVideo' | 'pauseVideo' | 'mute' | 'destroy',
): boolean {
  const fn = player?.[method]
  if (typeof fn !== 'function') return false
  try {
    fn.call(player)
    return true
  } catch {
    // The player can be torn down between the check and the call.
    return false
  }
}

export const thumbUrl = (id: string, quality: 'maxresdefault' | 'hqdefault') =>
  `https://i.ytimg.com/vi/${id}/${quality}.jpg`

let warmed = false

/** Opens connections to YouTube ahead of the first play, so it starts sooner. */
export function warmYouTubeConnections() {
  if (warmed) return
  warmed = true
  for (const href of [
    'https://www.youtube-nocookie.com',
    'https://www.youtube.com',
    'https://googlevideo.com',
  ]) {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = href
    document.head.append(link)
  }
}
