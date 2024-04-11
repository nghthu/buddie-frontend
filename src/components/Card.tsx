'use client';

import styles from '@/styles/components/Card.module.scss';
import clsx from 'clsx';
import { useState } from 'react';

const Card = (props: {
  children: React.ReactNode;
  width: string;
  height: string;
  backgroundColor?: string;
  showCloseButton?: boolean;
  className?: string;
  onClose?: () => void;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const closeCardHandler = () => {
    setIsCollapsed(true);
    props.onClose && props.onClose();
  };

  return (
    <div
      className={clsx(
        styles.card,
        props.className,
        isCollapsed && styles.collapse
      )}
      style={{
        width: props.width,
        height: props.height,
        backgroundColor: props.backgroundColor,
      }}
    >
      {props.showCloseButton && (
        <img
          className={styles['close-btn']}
          src="/images/close.png"
          onClick={closeCardHandler}
        />
      )}
      {props.children}
    </div>
  );
};

export default Card;
