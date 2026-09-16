import { useCallback, useSyncExternalStore } from 'react'

/**
 * Live boolean for a CSS media query. Used to tell a mouse from a touchscreen and
 * to honour the reduced-motion preference, both of which can change at runtime.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  // Server snapshot: assume false so nothing autoplays before hydration.
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
