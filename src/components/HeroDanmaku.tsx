import { useMemo } from 'react';
import { ALL_SKILLS } from './ExperienceSection';

const DANMAKU_REPEAT = 5;
const MIN_FONT_SIZE = 0.85;
const MAX_FONT_SIZE = 1.35;
const MIN_DURATION = 18;
const MAX_DURATION = 32;
const MAX_DELAY = 20;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function HeroDanmaku() {
  const bullets = useMemo(() => {
    const list: { id: number; skill: string; fontSize: number; top: number; duration: number; delay: number }[] = [];
    let id = 0;
    for (let r = 0; r < DANMAKU_REPEAT; r++) {
      for (const skill of ALL_SKILLS) {
        list.push({
          id: id++,
          skill,
          fontSize: randomBetween(MIN_FONT_SIZE, MAX_FONT_SIZE),
          top: randomBetween(2, 98),
          duration: randomBetween(MIN_DURATION, MAX_DURATION),
          delay: randomBetween(0, MAX_DELAY),
        });
      }
    }
    return list;
  }, []);

  return (
    <div className="hero-danmaku" aria-hidden>
      {bullets.map(({ id, skill, fontSize, top, duration, delay }) => (
        <span
          key={id}
          className="hero-danmaku-bullet"
          style={{
            top: `${top}%`,
            fontSize: `${fontSize}rem`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
