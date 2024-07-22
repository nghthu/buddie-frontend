import styles from '@/styles/components/TextCard.module.scss';
import clsx from 'clsx';

const TextCard = (props: {
  children: React.ReactNode;
  width: string;
  height: string;
  className?: string;
  scroll?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  return (
    <div
      className={clsx(styles.card, props.className ? props.className : '')}
      style={{
        width: props.width,
        height: props.height,
      }}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

export default TextCard;
