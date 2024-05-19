import styles from '@/styles/components/questionLayouts.module.scss'

export default function ReadingContextLayout(props: { context: string, images: Array<string> }) {
    let context = props.context;
    const imageIndexs = [];
    const regex = /\\n\\n\\n/g;
    let matches;
    while ((matches = regex.exec(context)) !== null && imageIndexs.length < props.images.length) {
        imageIndexs.push(matches.index + 5);
    }
    for (let i = 0; i < imageIndexs.length; i++) {
        context = context.slice(0, imageIndexs[i]) + `<img src=${props.images[i]} alt="context-image" />` + context.slice(imageIndexs[i]);
    }
    return (
        <div className={styles.contextLayout}>
            <div style={{ fontWeight: "300" }}>
                {props.context && <>{props.context}</>}
            </div>
        </div>
    );
}