import { useState, useRef } from 'react';
import styles from '@/styles/components/AudioPlayer.module.scss';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface AudioPlayerProps {
  audioUrl: string;
  disableStopButton?: boolean;
}

const AudioPlayer = ({
  audioUrl,
  disableStopButton = false,
}: AudioPlayerProps) => {
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
        setDuration(audioRef.current.duration);
      }
      setIsPlaying(!isPlaying);
    }
  };

  // const stop = () => {
  //   if (audioRef.current) {
  //     audioRef.current.pause();
  //     audioRef.current.currentTime = 0;
  //     setCurrentTime(0);
  //     setIsPlaying(false);
  //   }
  // };

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
          <Button
            shape="circle"
            onClick={togglePlay}
            className={styles['play-btn']}
            icon={<CaretRightOutlined />}
          />
        )}

        {isPlaying && !disableStopButton && (
          <Button
            shape="circle"
            onClick={togglePlay}
            className={styles['play-btn']}
            icon={<PauseOutlined />}
          />
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
