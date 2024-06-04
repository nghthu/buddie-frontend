'use client';

import TextCard from './TextCard';
import { SoundOutlined } from '@ant-design/icons';
import styles from '@/styles/components/Post.module.scss';
import clsx from 'clsx';
import AudioPlayer from './AudioPlayer';
import Answer from './Answer';
import { auth } from '@/lib';
import { useEffect, useState } from 'react';

interface Answer {
  user_id: string;
  content: string;
  is_excellent: boolean;
  _id: string;
  created_at: string;
  user: {
    user_id: string;
    display_name: string;
    photo_url: string;
  };
}

interface User {
  user_id: string;
  display_name: string;
  photo_url: string;
}

interface Post {
  _id: string;
  user_id: string;
  text: string;
  answers: Answer[];
  user: User;
  image_url: string;
  audio_url: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  postData: Post;
  showDetail?: boolean;
}

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const Post = ({ postData, showDetail }: Props) => {
  const formattedCreateDate = formatDate(postData.created_at);
  const user = auth.currentUser;
  const [canSetExcellent, setCanSetExcellent] = useState(false);

  useEffect(() => {
    let hasExcellentAnswer = false;
    if (postData.answers) {
      postData.answers.forEach((answer) => {
        if (answer.is_excellent) {
          hasExcellentAnswer = true;
        }
      });
    }
    if (user?.uid === postData.user_id && !hasExcellentAnswer) {
      setCanSetExcellent(true);
    }
  }, [user, postData]);

  return (
    <>
      <div className={styles.post}>
        <img
          className={styles.avatar}
          src={postData.user.photo_url}
        />
        <div className={styles['post-info']}>
          <div className={styles['post-info-user']}>
            <p>{postData.user.display_name}</p>
            <p>{formattedCreateDate}</p>
          </div>
          <TextCard
            width="100%"
            height="fit-content"
            className={styles['post-text-card']}
          >
            <div className={styles['post-text']}>
              <p>{postData.text}</p>
              {!showDetail && postData.audio_url && <SoundOutlined />}
            </div>
            {showDetail && postData.audio_url && (
              <AudioPlayer audioUrl={postData.audio_url} />
            )}
            {postData.image_url && (
              <img
                className={clsx(
                  styles['post-img'],
                  showDetail ? styles['detail-img'] : ''
                )}
                src={postData.image_url}
              />
            )}
            {!showDetail && (
              <div
                className={clsx(
                  postData.answers.length !== 0 && styles.green,
                  styles.answer
                )}
              >
                {postData.answers.length}
              </div>
            )}
          </TextCard>
        </div>
      </div>
      <div>
        {postData.answers.map((answer) => (
          <Answer
            key={answer._id}
            data={answer}
            questionId={postData._id}
            canSetExcellent={canSetExcellent}
          />
        ))}
      </div>
    </>
  );
};

export default Post;
