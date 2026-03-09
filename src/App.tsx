import { ExperienceSection } from './components/ExperienceSection';
import { MusicPlayer } from './components/MusicPlayer';

function App() {
  return (
    <div className="app">
      <header className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-kicker">Portfolio</p>
          <h1 className="hero-title">ShoesHero</h1>
          <p className="hero-subtitle">
            Frontend engineer crafting smooth experiences with motion, music, and micro-interactions.
          </p>
          <div className="hero-cta-row">
            <a href="#experience" className="btn btn-primary">
              View experience
            </a>
            <a href="#music" className="btn btn-ghost">
              Play some music
            </a>
          </div>
        </div>
      </header>

      <main>
        <section id="experience" className="section">
          <div className="section-header">
            <h2>Experience in Motion</h2>
            <p>Scroll through a timeline of what you&apos;ve built and shipped.</p>
          </div>
          <ExperienceSection />
        </section>

        <section id="music" className="section section-alt">
          <div className="section-header">
            <h2>Now Playing</h2>
            <p>Because every great session needs a soundtrack.</p>
          </div>
          <MusicPlayer />
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} ShoesHero. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
