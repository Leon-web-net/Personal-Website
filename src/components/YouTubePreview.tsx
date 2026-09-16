import { useCallback, useEffect, useRef, useState } from 'react'
import type { Media } from '../types'
import { useInView } from '../hooks/useInView'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { loadYouTubeApi, thumbUrl, warmYouTubeConnections, type YTPlayer } from '../lib/youtube'
import { PlayIcon } from './Icons'

type YouTubeMedia = Extract<Media, { type: 'youtube' }>

/**
 * The size we tell YouTube the player is. YouTube picks streaming quality from the
 * player's *layout* size, and a CSS transform does not change layout size - so we lay
 * the player out at 1080p and scale it down to fit the card. That buys us a 1080p
 * stream in a ~540px box, and shrinks YouTube's own overlays by the same factor.
 */
const PLAYER_W = 1920
const PLAYER_H = 1080

/** Guards against mounting a player when the cursor is merely passing over the card. */
const HOVER_INTENT_MS = 80

interface Props {
  media: YouTubeMedia
  title: string
  priority: boolean
}

export function YouTubePreview({ media, title, priority }: Props) {
  const containerRef = useRef<HTMLButtonElement | null>(null)
  const hostRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<YTPlayer | null>(null)
  const creatingRef = useRef(false)
  const hoverTimerRef = useRef<number | undefined>(undefined)
  const wantsPlayRef = useRef(false)

  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [thumb, setThumb] = useState(media.poster ?? thumbUrl(media.id, 'maxresdefault'))

  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  // Two observers on the same element: one decides whether a touch device should be
  // playing, the other whether the player is worth keeping in memory at all.
  const visible = useInView(containerRef, 0.5)
  const nearby = useInView(containerRef, 0, '200% 0px')

  // With a mouse we play on hover (or keyboard focus); on a touchscreen there is no
  // hover, so playback follows the card into and out of view. Reduced motion opts out
  // of both and waits for a deliberate click.
  const autoTrigger = canHover ? hovered : visible
  const wantsPlay = reducedMotion ? pinned : autoTrigger || pinned

  // Derived rather than stored, so the player hides the instant intent drops instead of
  // waiting for YouTube to report a state change. `playing` alone can lag or go stale.
  const showPlayer = playing && wantsPlay && nearby

  // Mirrored into a ref for the async player setup, which resolves long after this render.
  useEffect(() => {
    wantsPlayRef.current = wantsPlay
  }, [wantsPlay])

  // Tell the scaler how far to shrink the 1920x1080 player to fit this card.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => el.style.setProperty('--yt-scale', String(el.clientWidth / PLAYER_W))
    update()

    if (!('ResizeObserver' in window)) return
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const createPlayer = useCallback(async () => {
    if (playerRef.current || creatingRef.current) return
    creatingRef.current = true

    try {
      const YT = await loadYouTubeApi()

      // Past the await, so this is not a synchronous render-phase update. Clears any
      // stale "playing" left over from a previous player that was torn down.
      setPlaying(false)

      // The API can take a second to arrive; by then the pointer may have moved on.
      if (!wantsPlayRef.current || !hostRef.current) return

      // YT.Player replaces its target element, so give it a throwaway child.
      const mount = document.createElement('div')
      hostRef.current.append(mount)

      playerRef.current = new YT.Player(mount, {
        host: 'https://www.youtube-nocookie.com',
        videoId: media.id,
        width: String(PLAYER_W),
        height: String(PLAYER_H),
        playerVars: {
          autoplay: 1,
          mute: 1, // required: browsers only allow muted autoplay
          controls: 0, // removes the control bar, and with it the settings gear
          rel: 0,
          playsinline: 1,
          disablekb: 1,
          iv_load_policy: 3, // no annotations
          loop: 1,
          playlist: media.id, // a single video will not loop without this
          ...(media.start ? { start: media.start } : {}),
          ...(media.end ? { end: media.end } : {}),
        },
        events: {
          onReady: (event) => {
            event.target.mute()
            if (wantsPlayRef.current) event.target.playVideo()
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              setPlaying(true)
            } else if (event.data === YT.PlayerState.PAUSED) {
              setPlaying(false)
            } else if (event.data === YT.PlayerState.ENDED && media.start) {
              // loop=1 restarts from 0, which would skip a trimmed intro.
              event.target.seekTo(media.start, true)
              event.target.playVideo()
            }
          },
        },
      })
    } finally {
      creatingRef.current = false
    }
  }, [media.id, media.start, media.end])

  // Single effect drives the player: tear down when far away, otherwise follow intent.
  useEffect(() => {
    if (!nearby) {
      playerRef.current?.destroy()
      playerRef.current = null
      hostRef.current?.replaceChildren()
      return
    }

    if (wantsPlay) {
      if (playerRef.current) playerRef.current.playVideo()
      else void createPlayer()
    } else {
      playerRef.current?.pauseVideo()
    }
  }, [nearby, wantsPlay, createPlayer])

  useEffect(
    () => () => {
      window.clearTimeout(hoverTimerRef.current)
      playerRef.current?.destroy()
      playerRef.current = null
    },
    [],
  )

  // `end` combined with `loop` is unreliable in the embed, so hold the segment ourselves.
  useEffect(() => {
    const until = media.end
    if (!playing || !until) return

    const from = media.start ?? 0
    const id = window.setInterval(() => {
      const player = playerRef.current
      if (player && player.getCurrentTime() >= until) player.seekTo(from, true)
    }, 250)

    return () => window.clearInterval(id)
  }, [playing, media.start, media.end])

  const beginHover = useCallback(() => {
    warmYouTubeConnections()
    window.clearTimeout(hoverTimerRef.current)
    hoverTimerRef.current = window.setTimeout(() => setHovered(true), HOVER_INTENT_MS)
  }, [])

  const endHover = useCallback(() => {
    window.clearTimeout(hoverTimerRef.current)
    setHovered(false)
  }, [])

  const handleThumbError = useCallback(() => {
    setThumb((current) => {
      const fallback = thumbUrl(media.id, 'hqdefault')
      return current === fallback ? current : fallback
    })
  }, [media.id])

  return (
    <button
      ref={containerRef}
      type="button"
      className="media media__facade"
      onMouseEnter={beginHover}
      onMouseLeave={endHover}
      onFocus={beginHover}
      onBlur={endHover}
      // Hovering already plays, so this is a no-op with a mouse. It is the only way in
      // for reduced-motion users and anyone driving the page from the keyboard.
      onClick={() => setPinned((p) => !p)}
      aria-label={`${showPlayer ? 'Pause' : 'Play'} preview of ${title}`}
    >
      <img
        className="media__el"
        src={thumb}
        alt={media.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onError={handleThumbError}
      />

      {/* Laid out at 1080p, scaled into the card, and deaf to the cursor so YouTube's
          hover overlays never appear. Sits above the poster and fades in once playing. */}
      <div
        ref={hostRef}
        className={`media__player${showPlayer ? ' is-playing' : ''}`}
        style={{ width: PLAYER_W, height: PLAYER_H }}
        aria-hidden="true"
      />

      <span className={`media__scrim${showPlayer ? ' is-hidden' : ''}`} />
      <span className={`media__play${showPlayer ? ' is-hidden' : ''}`}>
        <PlayIcon className="media__play-icon" />
      </span>
    </button>
  )
}
