import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  description: string;
  tech: string[];
  details: string[];
  images?: string[];
};

type EducationItem = {
  school: string;
  degree: string;
  period: string;
  location: string;
  details: string[];
};

const EXPERIENCE: ExperienceItem[] = [
  {
    company: 'HighQ Technologies',
    role: 'Full Stack Developer',
    period: 'Jan 2026 — Present',
    description:
      'Rebuilding scientific control and visualization tools with a modern React + FastAPI stack and production-ready automation.',
    tech: [
      'Python',
      'FastAPI',
      'TypeScript',
      'React',
      'Vite',
      'PyQt5',
      'Jira',
      'Bitbucket',
      'GitHub Actions',
    ],
    details: [
      'Recreated a complex experiment equipment controller by decoupling a legacy standalone system into a React frontend and FastAPI backend, improving modularity and long-term maintainability.',
      'Refactored a scientific measurement library to isolate signal event management, replacing event-driven behavior with a robust polling mechanism for greater reliability and testability.',
      'Redesigned a customized HDF5 file viewer in PyQt5, delivering an intuitive scientific file explorer UI for complex data inspection.',
      'Implemented a production-grade build and deployment pipeline with GitHub Actions, enabling reproducible, automated, and reliable deployments across environments.',
    ],
  },
  {
    company: 'PuppyAgent Tech',
    role: 'Backend Developer',
    period: 'May 2024 — Dec 2025',
    description:
      'Built the first production-ready backend for an open-source RAG pipeline platform and shipped custom LLM-powered chat solutions.',
    tech: [
      'Python',
      'FastAPI',
      'Supabase',
      'PostgreSQL',
      'Docker',
      'OpenAI API',
      'Cloudflare R2',
      'Amazon S3',
    ],
    details: [
      'Spearheaded development of the first production-ready backend for an open-source RAG pipeline platform using FastAPI, Supabase, PostgreSQL, and Docker.',
      'Integrated OpenAI APIs, performing major system refactoring and adding new features that strengthened functionality and scalability.',
      'Designed and maintained frontend-to-backend communication protocols, ensuring reliable, efficient, and secure data exchange between client interfaces and server systems.',
      'Continuously contributed to the open-source project by maintaining and enhancing the codebase for community-wide adoption.',
      'Delivered an independently developed custom client chatbot solution valued at $20,000, achieving <2s time-to-first-token with integrated knowledge base and internet querying.',
    ],
  },
  {
    company: 'N7interactive Inc.',
    role: 'Backend Developer',
    period: 'May 2025 — Aug 2025',
    description:
      'Developed backend services in Go, designed PostgreSQL schemas, and architected scalable AWS infrastructure with automated data crawling.',
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
    details: [
      'Developed business logic and server-side systems, building RESTful APIs with hz (HTTP) and kitex (RPC code generation).',
      'Designed and optimized the PostgreSQL database schema, ensuring scalability and data integrity.',
      'Architected scalable AWS infrastructure including load balancer, API gateway, message broker, dockerized microservices, and Lambda functions, ensuring high availability and performance.',
      'Automated large-scale data crawling with Selenium, successfully acquiring 50,000+ product records from one of the biggest fashion e-commerce platforms.',
      'Designed robust GitHub Actions pipelines for CI/CD, automating testing, building, and deployment of microservices.',
    ],
  },
  {
    company: 'Independent Project',
    role: 'GRT Transit Application',
    period: 'Jan 2024 — Apr 2024',
    description:
      'Developed a full-stack transit app with real-time bus information, route planning, fare calculation, and user account management.',
    tech: ['C#', 'TypeScript', 'MySQL', 'React', '.NET', 'REST APIs', 'Git'],
    details: [
      'Built a full-stack transit application providing real-time bus information, route planning, fare calculation, station search, and user account management.',
      'Designed and implemented MySQL database schema with efficient query handling for route lookups, station indexing, and real-time schedule updates.',
      'Developed backend services in .NET and exposed RESTful APIs for frontend integration and mobile compatibility.',
      'Created interactive React components, enabling users to search bus schedules by stop or location, and view clear overviews of available transit options.',
      'Utilized Git-based version control workflows to ensure collaboration, maintain code integrity, and streamline teamwork.',
    ],
  },
  {
    company: 'Independent Project',
    role: 'Embedded Systems Kernel Development',
    period: '2023',
    description:
      'Implemented a lightweight RTOS-style kernel in C with Assembly-based context switching, preemptive scheduling, and heap-based memory management on STM32.',
    tech: ['C', 'C++', 'Assembly', 'Embedded Systems', 'RTOS', 'Memory Management', 'Multithreading', 'Microcontrollers'],
    details: [
      'Implemented a lightweight RTOS-style kernel in C with Assembly-based context switching for task scheduling.',
      'Designed a dynamic heap-based memory management system using first-fit allocation to improve memory utilization and reduce fragmentation.',
      'Built a preemptive multi-threading scheduler using SVC interrupts for task context switching.',
      'Developed and tested the kernel on the STM32F411RE microcontroller.',
    ],
  },
  {
    company: 'Asus Technology Co., Ltd.',
    role: 'Wireless Network Security Testing Intern',
    period: 'May 2023 - Aug 2023',
    description:
      'Conducted network penetration testing, verified router interoperability within Asus AiMesh, and performed competitive benchmarking.',
    tech: ['Linux', 'Network Security', 'Penetration Testing', 'Networking', 'Security Testing', 'Performance Testing', 'Technical Analysis'],
    details: [
      'Conducted network penetration testing using Linux-based security tools to identify vulnerabilities in wireless devices.',
      'Verified interoperability among router models by testing networking protocols and integration within the Asus AiMesh system.',
      'Performed competitive product benchmarking and performance testing against market competitors.',
      'Produced technical reports analyzing vulnerabilities, device performance, and market positioning.',
    ],
  }
];

const EDUCATION: EducationItem[] = [
  {
    school: 'University of Waterloo',
    degree: 'Bachelor of Software Engineering (Honors, Co-op)',
    period: 'Expected April 2027',
    location: 'Waterloo, ON',
    details: [
      'Rigorous engineering curriculum with a focus on software design, systems programming, and large-scale application development.',
      'Completed multiple co-op terms building production systems across backend, full-stack web, and infrastructure roles.',
    ],
  },
];

/** All unique skills from experience, for danmaku etc. */
export const ALL_SKILLS = [...new Set(EXPERIENCE.flatMap((e) => e.tech))];

function ExperienceDetail({
  item,
  onClose,
}: {
  item: ExperienceItem;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="exp-detail-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="exp-detail-panel"
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 40 }}
        transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="exp-detail-close"
          onClick={onClose}
          aria-label="Close detail"
        >
          ×
        </button>

        <header className="exp-detail-header">
          <div>
            <h2>{item.role}</h2>
            <p className="company">{item.company}</p>
          </div>
          <span className="period">{item.period}</span>
        </header>

        <div className="tech-row" style={{ marginBottom: '1rem' }}>
          {item.tech.map((t) => (
            <span key={t} className="pill">
              {t}
            </span>
          ))}
        </div>

        <ul className="exp-detail-bullets">
          {item.details.map((d, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.35 }}
            >
              {d}
            </motion.li>
          ))}
        </ul>

        {item.images && item.images.length > 0 && (
          <div className="exp-detail-images">
            {item.images.map((src, i) => (
              <img key={i} src={src} alt={`${item.company} screenshot ${i + 1}`} />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="experience" ref={containerRef}>
      <motion.div
        className="experience-line"
        style={{ height: lineHeight }}
      />
      <motion.div className="experience-glow" style={{ height: lineHeight }} />

      <div className="experience-cards">
        {EXPERIENCE.map((item, index) => {
          const delay = index * 0.15;
          return (
            <motion.article
              key={item.company}
              className="experience-card experience-card-clickable"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1], delay }}
              whileHover={{ y: -8, scale: 1.01 }}
              onClick={() => setSelectedIndex(index)}
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
              <span className="exp-card-hint">Click for details</span>
            </motion.article>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <ExperienceDetail
            item={EXPERIENCE[selectedIndex]}
            onClose={() => setSelectedIndex(null)}
          />
        )}
      </AnimatePresence>

      <section className="education-panel">
        <header className="education-header">
          <h3>Education</h3>
        </header>
        <div className="education-cards">
          {EDUCATION.map((edu) => (
            <article key={edu.school} className="education-card">
              <header className="education-card-header">
                <div>
                  <h4>{edu.degree}</h4>
                  <p className="school">
                    {edu.school} — {edu.location}
                  </p>
                </div>
                <span className="period">{edu.period}</span>
              </header>
              <ul className="education-details">
                {edu.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
