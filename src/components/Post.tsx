'use client';

import TextCard from './TextCard';
import { SoundOutlined } from '@ant-design/icons';
import styles from '@/styles/components/Post.module.scss';
import clsx from 'clsx';

interface Post {
  name: string;
  avater: string;
  date: string;
  text: string;
  audio: string;
  postImg: string;
}

interface Comments {
  commentNumber: number;
}

interface Props {
  postData: Post;
  comments: Comments;
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
            <p>{postData.date}</p>
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
                className={clsx(
                  comments.commentNumber !== 0 && styles.green,
                  styles.answer
                )}
              >
                {comments.commentNumber}
              </div>
            )}
          </TextCard>
        </div>
      </div>
    </>
  );
};

export default Post;
