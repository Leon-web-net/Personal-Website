import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { Footer } from './components/Footer'
import { ErrorBoundary } from './components/ErrorBoundary'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        {/* Backstop. Losing the projects list is bad; losing the entire page is worse. */}
        <ErrorBoundary label="projects">
          <Projects />
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  )
}
