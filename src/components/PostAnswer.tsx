'use client';

import clsx from 'clsx';
import { useState } from 'react';
import styles from '@/styles/components/Post.module.scss';
import { CheckCircleFilled } from '@ant-design/icons';

interface User {
  user_id: string;
  display_name: string;
  photo_url: string;
}
interface PostAnswer {
  content: string;
  is_excellent: boolean;
  _id: string;
  created_at: string;
  user: User;
}
interface Props {
  answer: PostAnswer;
}
export default function PostAnswer({ answer }: Props) {
  const [clamp, setClamp] = useState(true);
  return (
    <div className={styles['post-answer']}>
      <div className={styles['post-answer-metadata']}>
        <img
          className={styles.avatar}
          src={answer.user.photo_url}
        />
        <p>{answer.user.display_name}</p>
        <p>{new Date(answer.created_at).toUTCString()}</p>
      </div>
      <div
        className={clsx(styles['post-answer-info'], clamp && styles.clamping)}
        onClick={() => setClamp(!clamp)}
      >
        <p>{answer.content}</p>
      </div>
      {answer.is_excellent && (
        <CheckCircleFilled style={{ color: 'green', fontSize: '25px' }} />
      )}
    </div>
  );
}
