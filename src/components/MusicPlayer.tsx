import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

const DISK_SCALE = 0.148;
const TRANSITION_DURATION = 0.35;
const FADE_MS = 600;
const FADE_INTERVAL_MS = 30;

type Track = {
  title: string;
  artist: string;
  src: string;
  duration?: string;
};

const PLAYLIST: Track[] = [
  { title: '星降る海', artist: 'Aqu3ra', src: 'audio/星降る海.mp3' },
  { title: '心做し', artist: 'Chouchou-P', src: 'audio/心做し.mp3' },
  { title: 'キャットフード', artist: 'Doriko', src: 'audio/キャットフード.mp3' },
];

type MusicPlayerProps = {
  autoPlay?: boolean;
};

export function MusicPlayer({ autoPlay = false }: MusicPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  if (PLAYLIST.length === 0) return null;

  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState('0:00');
  const [totalDuration, setTotalDuration] = useState('--:--');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const [justExpanded, setJustExpanded] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingIndexRef = useRef<number | null>(null);
  const track = PLAYLIST[currentIndex];

  const fadeOut = useCallback((): Promise<void> => {
    const audio = audioRef.current;
    if (!audio) return Promise.resolve();
    return new Promise((resolve) => {
      const steps = FADE_MS / FADE_INTERVAL_MS;
      const decrement = audio.volume / steps;
      const interval = setInterval(() => {
        if (audio.volume - decrement <= 0) {
          audio.volume = 0;
          audio.pause();
          clearInterval(interval);
          resolve();
        } else {
          audio.volume = Math.max(0, audio.volume - decrement);
        }
      }, FADE_INTERVAL_MS);
    });
  }, []);

  const fadeIn = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0;
    void audio.play();
    const steps = FADE_MS / FADE_INTERVAL_MS;
    const increment = 1 / steps;
    const interval = setInterval(() => {
      if (audio.volume + increment >= 1) {
        audio.volume = 1;
        clearInterval(interval);
      } else {
        audio.volume = Math.min(1, audio.volume + increment);
      }
    }, FADE_INTERVAL_MS);
  }, []);

  const switchTrack = useCallback(async (nextIndex: number) => {
    if (isFading) return;
    setIsFading(true);
    pendingIndexRef.current = nextIndex;
    await fadeOut();
    setCurrentIndex(nextIndex);
    setProgress(0);
    setIsPlaying(true);
    setIsFading(false);
  }, [isFading, fadeOut]);

  useEffect(() => {
    if (pendingIndexRef.current !== null && pendingIndexRef.current === currentIndex) {
      pendingIndexRef.current = null;
      fadeIn();
    }
  }, [currentIndex, fadeIn]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const formatTime = (secs: number) => {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const onLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setTotalDuration(formatTime(audio.duration));
      }
    };

    const onTimeUpdate = () => {
      if (!audio.duration) return;
      setProgress((audio.currentTime / audio.duration) * 100);
      setElapsed(formatTime(audio.currentTime));
    };

    const onEnded = () => {
      const nextIdx = (currentIndex + 1) % PLAYLIST.length;
      void switchTrack(nextIdx);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentIndex, switchTrack]);

  useEffect(() => {
    if (autoPlay) {
      setIsPlaying(true);
    }
  }, [autoPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.volume = 1;
      void audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying, currentIndex]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    void switchTrack((currentIndex + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    void switchTrack((currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length);
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
        <p className="player-label">ShoesHero&apos;s Pick</p>
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
            <span>{elapsed} / {totalDuration}</span>
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

