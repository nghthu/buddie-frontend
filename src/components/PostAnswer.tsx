'use client';

import clsx from 'clsx';
import { useState } from 'react';
import styles from '@/styles/components/Post.module.scss';
import { CheckCircleFilled, StarOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { auth } from '@/lib';

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
  canSetExcellent: boolean;
  questionId: string;
}
export default function PostAnswer({
  answer,
  canSetExcellent,
  questionId,
}: Props) {
  const [clamp, setClamp] = useState(true);
  const user = auth.currentUser;
  const [isExcellentAnswer, setIsExcellentAnswer] = useState(
    answer.is_excellent
  );
  const [canAwardExcellent, setCanAwardExcellent] = useState(canSetExcellent);

  const newDate = new Date(answer.created_at);
  const formattedDate =
    (newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate()) +
    '/' +
    (newDate.getMonth() + 1 < 10
      ? '0' + newDate.getMonth()
      : newDate.getMonth()) +
    '/' +
    newDate.getFullYear();

  const setExcellentAnswerHandler = async () => {
    const token = user?.getIdToken();

    await fetch(`/api/questions/${questionId}`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        is_excellent: true,
        _id: answer._id,
      }),
    });

    setIsExcellentAnswer(true);
    setCanAwardExcellent(false);
  };

  return (
    <>
      {isExcellentAnswer && (
        <div className={styles['yellow-card']}>
          <StarOutlined />
          &nbsp;Câu trả lời nổi bật
        </div>
      )}
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
          {canAwardExcellent && (
            <Tooltip title="Bình chọn câu trả lời nổi bật">
              <Button
                type="text"
                shape="circle"
                icon={<StarOutlined />}
                className={styles.excellentBtn}
                onClick={setExcellentAnswerHandler}
              />
            </Tooltip>
          )}
        </div>
        {answer.is_excellent && (
          <CheckCircleFilled style={{ color: 'green', fontSize: '25px' }} />
        )}
      </div>
    </>
  );
}
