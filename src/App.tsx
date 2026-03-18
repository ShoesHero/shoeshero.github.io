import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExperienceSection } from './components/ExperienceSection';
import { HeroDanmaku } from './components/HeroDanmaku';
import { MusicPlayer } from './components/MusicPlayer';

const HERO_NAMES = ['ShoesHero', 'Percival Li', 'Dingyu Li'];

function RotatingName() {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullName = HERO_NAMES[index];

    if (!isDeleting && charIndex <= fullName.length) {
      const timeout = setTimeout(() => {
        setDisplay(fullName.slice(0, charIndex));
        setCharIndex((prev) => prev + 1);
      }, 110);
      return () => clearTimeout(timeout);
    }

    if (!isDeleting && charIndex > fullName.length) {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2500);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex >= 0) {
      const timeout = setTimeout(() => {
        setDisplay(fullName.slice(0, charIndex));
        setCharIndex((prev) => prev - 1);
      }, 70);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex < 0) {
      setIsDeleting(false);
      setCharIndex(0);
      setIndex((prev) => (prev + 1) % HERO_NAMES.length);
    }
  }, [charIndex, index, isDeleting]);

  useEffect(() => {
    // kick off typing when component mounts
    if (charIndex === 0 && !display && !isDeleting) {
      setCharIndex(1);
    }
  }, [charIndex, display, isDeleting]);

  return (
    <span className="hero-name-typing">
      {display}
      <span className="hero-name-caret" />
    </span>
  );
}

function App() {
  const [showMusicPrompt, setShowMusicPrompt] = useState(true);
  const [autoPlayMusic, setAutoPlayMusic] = useState(false);

  const handleAcceptMusic = () => {
    setAutoPlayMusic(true);
    setShowMusicPrompt(false);
  };

  const handleDeclineMusic = () => {
    setShowMusicPrompt(false);
  };

  const handleHeroDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number } }) => {
    if (info.offset.y < -120) {
      const experienceSection = document.getElementById('experience');
      experienceSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="app">
      {showMusicPrompt && (
        <div
          className="music-modal-overlay"
          onClick={handleDeclineMusic}
          aria-hidden="true"
        >
          <div
            className="music-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="music-modal-kicker">ShoesHero&apos;s pick</p>
            <h2 className="music-modal-title">
              Want a soundtrack while you explore?
            </h2>
            <p className="music-modal-body">
              Do you want to listen to ShoesHero&apos;s pick while browsing this
              portfolio?
            </p>
            <div className="music-modal-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAcceptMusic}
              >
                Yes, play the music
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleDeclineMusic}
              >
                No thanks
              </button>
            </div>
          </div>
        </div>
      )}
      <motion.header
        className="hero"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={handleHeroDragEnd}
      >
        <HeroDanmaku />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-kicker">Portfolio</p>
          <h1 className="hero-title">
            <RotatingName />
          </h1>
          <p className="hero-subtitle">
            Backend &amp; Full-Stack Engineer with hands-on AI integration experience.
            Shipping production systems in Python, Go, and C/C++ <br />
            From full-stack web applications to LLM-powered products.
          </p>
          <div className="hero-cta-row">
            <a
              href="#experience"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('experience');
              }}
            >
              View experience
            </a>
            <a
              href="#contact"
              className="btn btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
            >
              Contact me
            </a>
          </div>
        </div>
      </motion.header>

      <main>
        <section id="experience" className="section">
          <div className="section-header">
            <h2>Experience in Motion</h2>
            <p>Scroll through a timeline of what I&apos;ve built and shipped.</p>
          </div>
          <ExperienceSection />
        </section>

        <section id="contact" className="section section-alt">
          <div className="section-header">
            <h2>Contact Me</h2>
            <p>Get in touch — email or call.</p>
          </div>
          <div className="contact-options">
            <a href="mailto:p5li@uwaterloo.ca" className="btn btn-primary contact-btn">
              Email — p5li@uwaterloo.ca
            </a>
            <a href="sms:+16475505290" className="btn btn-ghost contact-btn">
              Text — +1 647 550 5290
            </a>
          </div>
        </section>
      </main>

      <MusicPlayer autoPlay={autoPlayMusic} />

      <footer className="footer">
        <p>© {new Date().getFullYear()} ShoesHero. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
