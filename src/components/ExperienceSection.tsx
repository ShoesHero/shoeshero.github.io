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
    company: 'PuppyAgent Tech',
    role: 'Backend Developer',
    period: 'May 2024 — Dec 2025',
    description:
      'Led development of the first production-ready backend for an open-source LLM application, integrating OpenAI APIs and scalable storage.',
    tech: [
      'Python',
      'FastAPI',
      'Docker',
      'Supabase',
      'PostgreSQL',
      'OpenAI API',
      'Cloudflare R2',
      'Amazon S3',
    ],
  },
  {
    company: 'N7interactive Inc.',
    role: 'Backend Developer',
    period: 'May 2025 — Aug 2025',
    description:
      'Built backend services and microservices in Go, designed PostgreSQL schemas, and architected scalable AWS infrastructure with automated data crawling.',
    tech: [
      'Golang',
      'PostgreSQL',
      'AWS',
      'Docker',
      'Selenium',
      'GitHub Actions',
      'hz',
      'kitex',
    ],
  },
  {
    company: 'GRT Transit Application',
    role: 'Independent Project',
    period: 'Jan 2024 — Apr 2024',
    description:
      'Developed a full-stack transit app with real-time bus information, route planning, fare calculation, and user account management.',
    tech: ['C#', 'TypeScript', 'MySQL', 'React', '.NET', 'REST APIs', 'Git'],
  }
];

/** All unique skills from experience, for danmaku etc. */
export const ALL_SKILLS = [...new Set(EXPERIENCE.flatMap((e) => e.tech))];

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

