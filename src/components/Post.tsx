'use client';

import TextCard from './TextCard';
import { SoundOutlined } from '@ant-design/icons';
import styles from '@/styles/components/Post.module.scss';
import { useRef, useState } from 'react';
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
  user_id: string;
}

interface Props {
  postData: Post;
  comments: number;
  onClose: () => void;
  showComments?: boolean;
}

const Post = ({ postData, comments, onClose }: Props) => {
  const [openPostDetail, setOpenPostDetail] = useState(false);
  const audioref = useRef<HTMLAudioElement>(null);

  const [audioPlaying, setAudioPlaying] = useState(false);
  const showPostDetail = () => {
    setOpenPostDetail(true);
  };

  const hidePostDetail = () => {
    onClose();
    setOpenPostDetail(false);
  };
  const handleAudio = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (audioPlaying) {
      audioref.current?.pause();
    } else {
      audioref.current?.play();
    }
    setAudioPlaying((prev) => !prev);
  };
  const newDate = new Date(postData.created_at);
  const formattedDay =
    newDate.getDate() < 10 ? '0' + newDate.getDate() : newDate.getDate();
  const formattedMonth =
    newDate.getMonth() + 1 < 10 ? '0' + newDate.getMonth() : newDate.getMonth();
  const formattedDate =
    formattedDay + '/' + formattedMonth + '/' + newDate.getFullYear();
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
              {postData.audio_url !== undefined && (
                <>
                  <audio
                    ref={audioref}
                    src={postData.audio_url}
                  />
                  <SoundOutlined onClick={handleAudio} />
                </>
              )}
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
