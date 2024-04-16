import styles from '@/styles/components/questionLayouts.module.scss'

export default function ReadingContextLayout(props: { context?: string }) {
    return (
        <div className={styles.contextLayout}>
            <div style={{fontWeight:"300"}}>
            {props.context && <>{props.context}</>}
            </div>
        </div>
    );
}