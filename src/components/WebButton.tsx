import styles from '@/styles/components/WebButton.module.scss';
import clsx from 'clsx';
export default function WebButton(props: {
  text: string;
  backgroundColorNumber?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      className={clsx(
        styles.webButton,
        !props.backgroundColorNumber && styles.webButtonColor1,
        props.backgroundColorNumber === '2' && styles.webButtonColor2
      )}
      onClick={props.onClick}
    >
      {props.text}
    </div>
  );
}
