import styles from '@/styles/components/TextCard.module.scss';

const TextCard = (props: { children: React.ReactNode; width: string; height: string }) => {
  return (
    <div
      className={styles.card}
      style={{ width: props.width, height: props.height }}
    >
      {props.children}
    </div>
  );
};

export default TextCard;
