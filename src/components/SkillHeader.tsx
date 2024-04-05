import styles from '@/styles/components/SkillHeader.module.scss';
import CountdownClock from '@/components/CountdownClock';
import clsx from 'clsx';

const SkillHeader = (props: { title: string; countdownTime?: string }) => {
    return (
        <div className={clsx(styles.wrapper, !props.countdownTime && styles["wrappercenter"], (props.countdownTime!=="99:99" && props.countdownTime) && styles["wrapperspace-between"], props.countdownTime ==="99:99" && styles["wrapperflex-start"])}>
            <h2 className={styles.header}>
                {props.title}
            </h2>
            {(props.countdownTime && props.countdownTime !== "99:99") && <CountdownClock countdownTime={props.countdownTime} />}
        </div>
    )
}

export default SkillHeader;