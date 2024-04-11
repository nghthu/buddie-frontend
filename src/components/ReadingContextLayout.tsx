import styles from '@/styles/components/questionLayouts.module.scss'

export default function ReadingContextLayout(props: { context?: string }) {
    return (
        <div className={styles.contextLayout}>
            {props.context && <>{props.context}</>}
        </div>
    );
}