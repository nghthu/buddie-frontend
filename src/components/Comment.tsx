'use client';
/* eslint-disable @next/next/no-img-element */
import styles from '@/styles/components/Comment.module.scss';
import clsx from 'clsx';
import { useState } from 'react';
export default function Comment({
  // TODO: find some use for id

  userName,
  userPhotoURL,
  createdDate,
  content,
}: {
  id: string;
  userName: string;
  userPhotoURL: string;
  createdDate: string;
  content: string;
}) {
  const [isClamping, setIsClamping] = useState(true);
  function handleClamping() {
    setIsClamping(!isClamping);
  }
  const newDate = new Date(createdDate);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const formattedDate = formatDate(newDate);
  return (
    <div className={styles.wrapper}>
      <img
        src={userPhotoURL}
        className={styles.avatar}
        alt="avatar"
      />
      <div className={styles.contentWrapper}>
        <div className={styles.upper}>
          <div className={styles.userName}>{userName}</div>
          <div>{formattedDate}</div>
        </div>
        <div
          onClick={() => handleClamping()}
          className={clsx(styles.content, isClamping && styles.clamping)}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
