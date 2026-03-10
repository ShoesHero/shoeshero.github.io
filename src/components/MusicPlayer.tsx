import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const DISK_SCALE = 0.148; /* 56/378 ≈ disk size / panel width */
const TRANSITION_DURATION = 0.35;

type Track = {
  title: string;
  artist: string;
  src: string;
  duration?: string;
};

const PLAYLIST: Track[] = [
  {
    title: 'Midnight Build',
    artist: 'ShoesHero',
    src: 'audio/midnight-build.mp3',
    duration: '3:12',
  },
  {
    title: 'Flow State',
    artist: 'ShoesHero',
    src: 'audio/flow-state.mp3',
    duration: '4:05',
  },
];

type MusicPlayerProps = {
  autoPlay?: boolean;
};

export function MusicPlayer({ autoPlay = false }: MusicPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [justExpanded, setJustExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const track = PLAYLIST[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!audio.duration) return;
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const onEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  useEffect(() => {
    if (autoPlay) {
      setIsPlaying(true);
    }
  }, [autoPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      void audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
    setProgress(0);
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const value = Number(event.target.value);
    audio.currentTime = (value / 100) * audio.duration;
    setProgress(value);
  };

  const handleMinimize = () => {
    setIsMinimizing(true);
  };

  const handleExpand = () => {
    setJustExpanded(true);
    setIsMinimized(false);
  };

  const handleShrinkComplete = () => {
    setIsMinimizing(false);
    setIsMinimized(true);
  };

  const handleExpandComplete = () => {
    setJustExpanded(false);
  };

  if (isMinimized) {
    return (
      <>
        <audio ref={audioRef} src={track.src} preload="metadata" />
        <motion.button
          type="button"
          className="player-disk"
          onClick={handleExpand}
          aria-label="Expand player"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="player-disk-icon">{isPlaying ? '❚❚' : '▶'}</span>
        </motion.button>
      </>
    );
  }

  return (
    <>
      <audio ref={audioRef} src={track.src} preload="metadata" />
      <motion.div
        className="player-wrapper"
        style={{ originX: 1, originY: 1 }}
        initial={{ scale: justExpanded ? DISK_SCALE : 1, opacity: justExpanded ? 0.85 : 1 }}
        animate={{
          scale: isMinimizing ? DISK_SCALE : 1,
          opacity: 1,
        }}
        transition={{
          duration: TRANSITION_DURATION,
          ease: [0.22, 0.61, 0.36, 1],
        }}
        onAnimationComplete={() => {
          if (isMinimizing) handleShrinkComplete();
          else if (justExpanded) handleExpandComplete();
        }}
      >
        <motion.div
          className="player"
          animate={{ opacity: isMinimizing ? 0 : 1 }}
          transition={{ duration: TRANSITION_DURATION * 0.6 }}
        >
          <button
            type="button"
            className="player-minimize"
            onClick={handleMinimize}
            aria-label="Minimize player"
          >
            −
          </button>
          <div className="player-visual">
        <motion.div
          className="player-orb"
          animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
          transition={
            isPlaying
              ? { repeat: Infinity, duration: 1.6, ease: 'easeInOut' }
              : undefined
          }
        />
        <div className="player-bars">
          {[1, 2, 3, 4].map((bar) => (
            <motion.span
              // eslint-disable-next-line react/no-array-index-key
              key={bar}
              className="bar"
              animate={{
                scaleY: isPlaying ? [0.4, 1.2, 0.6, 1] : 0.6,
              }}
              transition={
                isPlaying
                  ? {
                      repeat: Infinity,
                      duration: 0.9 + bar * 0.1,
                      ease: 'easeInOut',
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      <div className="player-info">
        <p className="player-label">Portfolio playlist</p>
        <h3>{track.title}</h3>
        <p className="player-artist">{track.artist}</p>
      </div>

      <div className="player-controls">
        <div className="player-buttons">
          <button type="button" className="icon-button" onClick={handlePrev}>
            ‹
          </button>
          <button
            type="button"
            className="icon-button icon-button-primary"
            onClick={handlePlayPause}
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>
          <button type="button" className="icon-button" onClick={handleNext}>
            ›
          </button>
        </div>

        <div className="player-slider">
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={handleSeek}
          />
          <div className="player-meta">
            <span>{track.duration ?? '--:--'}</span>
            <span>
              {currentIndex + 1} / {PLAYLIST.length}
            </span>
          </div>
        </div>
      </div>
        </motion.div>
      </motion.div>
    </>
  );
}

