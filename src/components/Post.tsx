'use client';

import TextCard from './TextCard';
import { SoundOutlined } from '@ant-design/icons';
import styles from '@/styles/components/Post.module.scss';
import { useState } from 'react';
import clsx from 'clsx';
import { Modal } from 'antd';
import PostDetail from './PostDetail';
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
interface Post {
  _id: string;
  text: string;
  created_at: string;
  updated_at: string;
  __v: string;
  answers: PostAnswer[];
  user: User;
  audio_url: string;
  image_url: string;
}

interface Props {
  postData: Post;
  comments: number;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  showComments?: boolean;
}

const Post = ({ postData, comments }: Props) => {
  const [openPostDetail, setOpenPostDetail] = useState(false);

  const showPostDetail = () => {
    setOpenPostDetail(true);
  };

  const hidePostDetail = () => {
    setOpenPostDetail(false);
  };
  const newDate = new Date(postData.created_at);
  const formattedDate =
    (newDate.getDate() < 10 ? newDate.getDate() : '0' + newDate.getDate()) +
    '/' +
    (newDate.getMonth() + 1) +
    '/' +
    newDate.getFullYear();
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
            <p>{formattedDate}</p>
          </div>
          <TextCard
            width="100%"
            height="fit-content"
            className={styles['post-text-card']}
            onClick={() => showPostDetail()}
          >
            <div className={styles['post-text']}>
              <p>{postData.text}</p>
              {postData.audio_url !== undefined && <SoundOutlined />}
            </div>
            {postData.image_url && (
              <img
                className={styles['post-img']}
                src={postData.image_url}
              />
            )}
            <div
              className={clsx(comments !== 0 && styles.green, styles.answer)}
            >
              {comments}
            </div>
          </TextCard>
        </div>
      </div>

      <Modal
        open={openPostDetail}
        title=""
        onCancel={hidePostDetail}
        footer={[]}
        width={800}
      >
        <PostDetail postData={postData} />
      </Modal>
    </>
  );
};

export default Post;
