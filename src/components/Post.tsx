'use client';

import TextCard from './TextCard';
import { SoundOutlined } from '@ant-design/icons';
import styles from '@/styles/components/Post.module.scss';
import clsx from 'clsx';

interface Post {
  name: string;
  avatar: string;
  date: string;
  text: string;
  audio: string;
  postImg: string;
}

interface Props {
  postData: Post;
  comments: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  showComments?: boolean;
}

const Post = ({ postData, comments, onClick, showComments }: Props) => {
  return (
    <>
      <div className={styles.post}>
        <img
          className={styles.avatar}
          src={postData.avatar}
        />
        <div className={styles['post-info']}>
          <div className={styles['post-info-user']}>
            <p>{postData.name}</p>
            <p>{new Date(postData.date).toUTCString()}</p>
          </div>
          <TextCard
            width="100%"
            height="fit-content"
            className={styles['post-text-card']}
            onClick={onClick}
          >
            <div className={styles['post-text']}>
              <p>{postData.text}</p>
              {postData.audio !== undefined && <SoundOutlined />}
            </div>
            {postData.postImg && (
              <img
                className={styles['post-img']}
                src={postData.postImg}
              />
            )}
            {showComments && (
              <div
                className={clsx(comments !== 0 && styles.green, styles.answer)}
              >
                {comments}
              </div>
            )}
          </TextCard>
        </div>
      </div>
    </>
  );
};

export default Post;
