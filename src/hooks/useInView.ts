import { useEffect, useState, type RefObject } from 'react'

/**
 * Tracks whether an element is currently in view, and keeps tracking it.
 *
 * Takes the ref rather than creating one so the same element can be watched at two
 * different thresholds (e.g. "visible enough to play" and "near enough to keep alive").
 *
 * Deliberately separate from `useReveal`, which fires once and disconnects - here we
 * need the live value so a preview can pause when it scrolls away and resume later.
 */
export function useInView<T extends HTMLElement>(
  ref: RefObject<T | null>,
  threshold = 0.5,
  rootMargin = '0px',
): boolean {
  // Without IntersectionObserver, treat everything as visible rather than never
  // playing. Set as the initial value so no effect has to correct it afterwards.
  const [inView, setInView] = useState(() => !('IntersectionObserver' in window))

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold, rootMargin])

  return inView
}
