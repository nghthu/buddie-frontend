'use client';

import styles from '@/styles/components/CountdownClock.module.scss';
import { useEffect, useState } from 'react';


const CountdownClock = (props: { countdownTime?: string }) => {
  if (!props.countdownTime) {
    props.countdownTime = "00:05";
  }
  const [time, setTime] = useState(props.countdownTime);
  useEffect(() => {
    if (time === "99:99") {
      // unlimited time
      return;
    }
    const interval = setInterval(() => {
      setTime((prevTime: String) => {
        const [minutes, seconds] = prevTime.split(':').map((times) => parseInt(times));
        if (minutes === 0 && seconds === 0) {
          clearInterval(interval);
          return "00:00";
        } else {
          if (seconds - 1 < 0) {
            if (minutes - 1 < 10) {
              return `0${minutes - 1}:59`;
            }
            else {
              return `${minutes - 1}:59`;
            }
          } else {
            if (minutes < 10 && seconds - 1 >= 10) {
              return `0${minutes}:${seconds - 1}`;
            }
            else if (minutes < 10 && seconds - 1 < 10) {
              return `0${minutes}:0${seconds - 1}`;
            }
            else if (minutes >= 10 && seconds - 1 >= 10) {
              return `${minutes}:${seconds - 1}`;
            }
            else if (minutes >= 10 && seconds - 1 < 10) {
              return `${minutes}:0${seconds - 1}`;
            }
            else {
              return "00:00";
            }
          }
        }
      });

    }, 1000);
    return () => clearInterval(interval);
  }, [time]);
  return (
    <div className={styles.oclock}>
      <p>Thời gian còn lại:</p>
      <p className={styles.timer}>{time}</p>
    </div>
  );
};


export default CountdownClock;
