'use client';

import clsx from 'clsx';
import { useState } from 'react';
import styles from '@/styles/components/Post.module.scss';
import { CheckCircleFilled, StarOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

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
  const newDate = new Date(answer.created_at);
  const formattedDate =
    (newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate()) +
    '/' +
    (newDate.getMonth() + 1 < 10
      ? '0' + newDate.getMonth()
      : newDate.getMonth()) +
    '/' +
    newDate.getFullYear();
  return (
    <div
      className={clsx(
        styles['post-answer'],
        answer.is_excellent && styles.checked
      )}
    >
      <div className={styles['post-answer-metadata']}>
        <img
          className={styles.avatar}
          src={answer.user.photo_url}
        />
        <div className={styles['post-answer-name-date']}>
          <p>{answer.user.display_name}</p>
          <p>{formattedDate}</p>
        </div>
      </div>
      <div
        className={clsx(styles['post-answer-info'], clamp && styles.clamping)}
        onClick={() => setClamp(!clamp)}
      >
        <p>{answer.content}</p>
        <Tooltip title="Bình chọn câu trả lời nổi bật">
          <Button
            type="text"
            shape="circle"
            icon={<StarOutlined />}
            className={styles.excellentBtn}
          />
        </Tooltip>
      </div>
      {answer.is_excellent && (
        <CheckCircleFilled style={{ color: 'green', fontSize: '25px' }} />
      )}
    </div>
  );
}
