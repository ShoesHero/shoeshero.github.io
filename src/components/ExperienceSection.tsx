import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

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
    period: 'Jan 2026 — Apr 2026',
    description:
      'Modular React and FastAPI control systems for experimental equipment, polling-based measurement libraries, and GitHub Actions CI/CD across dev, staging, and production.',
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
      'Rebuilt a complex experimental equipment control system using React and FastAPI by decoupling a legacy standalone application into modular frontend and backend services, enabling remote access from anywhere and receiving highly positive stakeholder feedback; additionally contributed to designing the architecture for the next major version of the application focused on full decoupling and modularization.',
      'Refactored a core scientific measurement library by replacing PyQt signal-based event handling with a standardized polling-based architecture, removing unnecessary frontend framework dependencies from the backend and resulting in improved reliability, easier debugging, and better testability.',
      'Implemented CI/CD pipelines using GitHub Actions to automate testing, builds, and deployments across development, staging, and production environments, reducing manual release effort and enabling consistent, reliable cross-environment deployments with improved release stability.',
    ],
  },
  {
    company: 'PuppyAgent Tech',
    role: 'Backend Developer',
    period: 'May 2024 — Dec 2025',
    description:
      'Production RAG platform backend on FastAPI and Supabase, RESTful client integration, and a revenue-generating custom AI chatbot with sub-2s time-to-first-token.',
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
      'Spearheaded development of the first production-ready backend for an open-source RAG platform using FastAPI, Supabase, PostgreSQL, and Docker by designing system architecture and implementing core infrastructure and business logic, while actively collecting user feedback to iterate on features and refine product design for improved usability and performance.',
      'Designed and implemented frontend-to-backend communication protocols using RESTful APIs and structured data exchange patterns by defining consistent request/response schemas, error-handling conventions, and authentication flows, enabling reliable and secure client-server integration.',
      'Delivered a custom AI chatbot solution with integrated knowledge-base retrieval and internet querying, achieving sub-2-second response time-to-first-token for a smooth live exhibition experience, generating approximately $20,000 in revenue.',
    ],
  },
  {
    company: 'N7interactive Inc.',
    role: 'Backend Developer',
    period: 'May 2025 — Aug 2025',
    description:
      'Go backends with hz and kitex, AWS distributed architecture, and Selenium-based large-scale data acquisition.',
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
      'Developed backend business logic and RESTful APIs using hz and kitex, resulting in scalable and maintainable server-side systems.',
      'Architected AWS infrastructure using load balancers, API Gateway, Lambda functions, and dockerized microservices, resulting in highly available and performant distributed systems.',
      'Automated large-scale data crawling using Selenium, resulting in successful acquisition of over 50,000 product records from a major fashion e-commerce platform.',
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

  useEffect(() => {
    if (selectedIndex === null) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [selectedIndex]);

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
