import styles from '@/styles/components/SkillHeader.module.scss';
import clsx from 'clsx';
import { Statistic } from 'antd';

const { Countdown } = Statistic;

const SkillHeader = (props: {
  title: string;
  countdownTime?: number;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        styles.wrapper,
        !props.countdownTime && styles['wrappercenter'],
        props.countdownTime !== 0 &&
          props.countdownTime &&
          styles['wrapperspace-between'],
        props.countdownTime === 0 && styles['wrapperflex-start']
      )}
    >
      <h2 className={styles.header}>{props.title}</h2>
      {props.children}

      {props.countdownTime !== undefined && (
        <Countdown
          title="Thời gian còn lại"
          value={props.countdownTime}
        />
      )}
    </div>
  );
};

export default SkillHeader;
