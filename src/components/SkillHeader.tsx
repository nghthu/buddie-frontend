import styles from '@/styles/components/SkillHeader.module.scss';
import CountdownClock from '@/components/CountdownClock';
import clsx from 'clsx';

const SkillHeader = (props: { title: string; countdownTime?: string, children?:React.ReactNode }) => {
  return (
    <div
      className={clsx(
        styles.wrapper,
        !props.countdownTime && styles['wrappercenter'],
        props.countdownTime !== 'unlimited' &&
          props.countdownTime &&
          styles['wrapperspace-between'],
        props.countdownTime === 'unlimited' && styles['wrapperflex-start']
      )}
    >
      <h2 className={styles.header}>{props.title}</h2>
      {props.children}
      {props.countdownTime && props.countdownTime !== 'unlimited' && (
        <CountdownClock countdownTime={props.countdownTime} />
      )}
    </div>
  );
};

export default SkillHeader;
