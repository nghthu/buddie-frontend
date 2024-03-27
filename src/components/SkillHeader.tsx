import styles from '@/styles/components/SkillHeader.module.scss';
import CountdownClock from '@/components/CountdownClock';

const SkillHeader = (props: { title: string; placement?:string;countdownTime?:string }) => {
    if (props.countdownTime) {
        return (
            <div className={styles.wrapper} style={{justifyContent:"space-between"}}>
            <h2 className={styles.header}>
                {props.title}
            </h2>
            <CountdownClock countdownTime={props.countdownTime}/>
            </div>
        )
    }
    return (
        <div style={{display:"flex",justifyContent:"center"}}>
        <h2 className={styles.header}>
            {props.title}
        </h2>
        </div>
    )
}

export default SkillHeader;