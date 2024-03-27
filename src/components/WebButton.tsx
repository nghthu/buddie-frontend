import styles from '@/styles/components/WebButton.module.scss';
export default function WebButton(props:{text:string,onClick?:React.MouseEventHandler<HTMLDivElement>}){
    return (
        <div className={styles.webButton} onClick={props.onClick}>{props.text}</div>
    )
}