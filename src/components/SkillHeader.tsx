import styles from '@/styles/components/SkillHeader.module.scss';
import CountdownClock from '@/components/CountdownClock';

const SkillHeader = (props: { title: string; countdownTime?: string }) => {
    if (props.countdownTime) {
        return (
            <div className={styles.wrapper} style={{ justifyContent: "space-between" }}>
                <h2 className={styles.header}>
                    {props.title}
                </h2>
                <CountdownClock countdownTime={props.countdownTime} />
            </div>
        )
    }
    return (
        <div className={styles.wrapper} style={{ justifyContent: "center" }}>
            <h2 className={styles.header}>
                {props.title}
            </h2>
        </div>
    )
}

export default SkillHeader;