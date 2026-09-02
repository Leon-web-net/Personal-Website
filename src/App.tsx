import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects />
      </main>
      <Footer />
    </>
  )
}
