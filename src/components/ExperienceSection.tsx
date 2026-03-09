import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  description: string;
  tech: string[];
};

const EXPERIENCE: ExperienceItem[] = [
  {
    company: 'ShoesHero Studio',
    role: 'Frontend Engineer',
    period: '2024 — Present',
    description:
      'Building interactive product experiences with React, TypeScript, and delightful motion.',
    tech: ['React', 'TypeScript', 'Framer Motion', 'Vite'],
  },
  {
    company: 'Creative Lab',
    role: 'UI Engineer',
    period: '2022 — 2024',
    description:
      'Designed and implemented high-fidelity UI with smooth animations and micro-interactions.',
    tech: ['React', 'CSS Animations', 'Design Systems'],
  },
  {
    company: 'Freelance',
    role: 'Web Developer',
    period: '2019 — 2022',
    description:
      'Shipped custom websites and portfolios for artists, brands, and creators.',
    tech: ['JavaScript', 'HTML/CSS', 'Responsive Design'],
  },
];

export function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="experience" ref={containerRef}>
      <motion.div
        className="experience-line"
        style={{ scaleY: scrollYProgress, originY: 0 }}
      />
      <motion.div className="experience-glow" style={{ height: lineHeight }} />

      <div className="experience-cards">
        {EXPERIENCE.map((item, index) => {
          const delay = index * 0.15;
          return (
            <motion.article
              key={item.company}
              className="experience-card"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1], delay }}
              whileHover={{ y: -8, scale: 1.01 }}
            >
              <header className="experience-card-header">
                <div>
                  <h3>{item.role}</h3>
                  <p className="company">{item.company}</p>
                </div>
                <span className="period">{item.period}</span>
              </header>
              <p className="description">{item.description}</p>
              <div className="tech-row">
                {item.tech.map((t) => (
                  <span key={t} className="pill">
                    {t}
                  </span>
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

