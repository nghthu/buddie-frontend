'use client';

import TextCard from './TextCard';
import { SoundOutlined } from '@ant-design/icons';
import styles from '@/styles/components/Post.module.scss';
import PostAnswer from './PostAnswer';
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
}

const PostDetail = ({ postData }: Props) => {
  const postAnswers = postData.answers.map((answer) => (
    <PostAnswer
      key={answer._id}
      answer={answer}
    />
  ));

  return (
    <>
      <div className={styles.post}>
        <img
          className={styles.avatar}
          src={postData.user.photo_url}
        />
        <div className={styles['post-info-modal-version']}>
          <div className={styles['post-info-user']}>
            <p>{postData.user.display_name}</p>
            <p>{new Date(postData.created_at).toUTCString()}</p>
          </div>
          <TextCard
            width="100%"
            height="fit-content"
            className={styles['post-text-card']}
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
          </TextCard>
          {postAnswers}
        </div>
      </div>
    </>
  );
};

export default PostDetail;
