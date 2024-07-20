'use client';

import styles from '@/styles/components/CountdownClock.module.scss';
import { useEffect, useState } from 'react';

interface Props {
  countdownTime?: string;
  onStop?: boolean;
  setUsedTime: (usedTime: number) => void;
}

const CountdownClock = ({ countdownTime, onStop, setUsedTime }: Props) => {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    if (!countdownTime) {
      setTime('unlimited');
    } else {
      setTime(countdownTime);
    }
  }, [countdownTime]);

  useEffect(() => {
    if (time === 'unlimited') {
      return;
    }

    const interval = setInterval(() => {
      setTime((prevTime: string | null) => {
        if (onStop && prevTime !== null) {
          const [minutes, seconds] = prevTime.split(':').map(Number);
          const remainingSeconds = minutes * 60 + seconds;
          console.log('logcheck', remainingSeconds);
          setUsedTime(remainingSeconds);
        }

        if (prevTime === null || prevTime === '00:00') {
          clearInterval(interval);
          if (onStop && prevTime !== null) {
            const [minutes, seconds] = prevTime.split(':').map(Number);
            const remainingSeconds = minutes * 60 + seconds;
            console.log('logcheck', remainingSeconds);
            setUsedTime(remainingSeconds);
          }
          return '00:00';
        }

        const [minutes, seconds] = prevTime.split(':').map(Number);
        if (seconds === 0 && minutes > 0) {
          return `${minutes - 1}:59`;
        } else if (seconds > 0) {
          return `${minutes}:${seconds - 1}`;
        } else {
          return '00:00';
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [time, onStop]);

  return (
    <>
      {time !== 'unlimited' && (
        <div className={styles.oclock}>
          <p>Thời gian còn lại:</p>
          <p className={styles.timer}>{time}</p>
        </div>
      )}
    </>
  );
};

export default CountdownClock;
