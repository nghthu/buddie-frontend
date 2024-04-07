import { useState, useRef } from 'react';
import styles from '@/styles/components/AudioPlayer.module.scss';
import { CaretRightOutlined } from '@ant-design/icons';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        console.log(audioRef.current.duration);
        setDuration(audioRef.current.duration);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  return (
    <div className={styles.audioPlayer}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
      />
      <div className={styles.controls}>
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className={styles['play-btn']}
          >
            <CaretRightOutlined />
          </button>
        )}

        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
