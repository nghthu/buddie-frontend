import styles from '@/styles/components/TextCard.module.scss';

const TextCard = (props: { children: React.ReactNode; width: string; height: string; backgroundColor?: string, display?: string, justifyContent?: string }) => {
  return (
    <div
      className={styles.card}
      style={{
        width: props.width, height: props.height,
        backgroundColor: props.backgroundColor, display: props.display,
        justifyContent: props.justifyContent, flexWrap: "wrap"
      }}
    >
      {props.children}
    </div>
  );
};

export default TextCard;
