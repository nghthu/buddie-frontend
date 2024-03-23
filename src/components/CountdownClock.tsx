import styles from '@/styles/components/CountdownClock.module.scss';
import { useEffect, useState } from 'react';

const CountdownClock = () => {
  return (
    <div className={styles.oclock}>
      <p>Thời gian còn lại:</p>
      <p className={styles.timer}>25:09</p>
    </div>
  );
};

export default CountdownClock;
