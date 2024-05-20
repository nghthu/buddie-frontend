import styles from '@/styles/components/Comment.module.scss';

export default function Comment({
  id,
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
          <div>{createdDate}</div>
        </div>
        <div className={styles.content}>{content}</div>
      </div>
    </div>
  );
}
