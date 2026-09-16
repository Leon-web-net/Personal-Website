import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Rendered in place of the children if they throw. Defaults to nothing. */
  fallback?: ReactNode
  /** Named in the console log, so it is obvious which part failed. */
  label?: string
}

interface State {
  failed: boolean
}

/**
 * Stops one broken piece of the page from blanking the whole site.
 *
 * Without a boundary, any error thrown while React renders or runs an effect unmounts the
 * entire tree and leaves an empty <div id="root"> - a white screen. A portfolio should
 * degrade to "one preview is missing" instead.
 *
 * Error boundaries have no hook equivalent; a class is the only way to build one.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.label ?? 'ErrorBoundary'}] recovered from:`, error, info.componentStack)
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}
