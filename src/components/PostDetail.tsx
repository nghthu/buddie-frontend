'use client';

import TextCard from './TextCard';
import { SendOutlined, SoundOutlined } from '@ant-design/icons';
import styles from '@/styles/components/Post.module.scss';
import PostAnswer from './PostAnswer';
import clsx from 'clsx';

import React, { useEffect, useState } from 'react';
import { Button, Input } from 'antd';
import { auth } from '@/lib';

const { TextArea } = Input;

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
  const user = auth.currentUser;

  const [value, setValue] = useState('');
  const [postAnswers, setPostAnswers] = useState<React.JSX.Element[]>([]);
  useEffect(() => {
    const postAnswersTemp = postData.answers.map((answer) => (
      <PostAnswer
        key={answer._id}
        answer={answer}
      />
    ));
    setPostAnswers(postAnswersTemp);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  // TODO: api
  const handlePost = async () => {
    const token = await user?.getIdToken();
    const res = await fetch(`/api/community/${postData._id}`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answer: { content: value },
      }),
    }).then((res) => res.json());
    console.log(res);
    const newAnswer = res.data.answers.filter((answer: Post) => {
      return answer.user.user_id === token;
    });
    setPostAnswers((prev) => [
      ...prev,
      <PostAnswer
        key={newAnswer._id}
        answer={newAnswer}
      />,
    ]);
  };

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
            className={clsx(
              styles['post-text-card'],
              styles['post-text-card-modal']
            )}
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
          <div className={styles.replies}>{postAnswers}</div>

          <div className={styles.userInput}>
            <div>
              <img
                src={user?.photoURL ?? ''}
                alt="User Avatar"
                className={clsx(styles.avatar, styles.bigger)}
              />
              <TextArea
                placeholder="Nhập câu trả lời của bạn"
                autoSize={{ minRows: 1, maxRows: 3 }}
                value={value}
                onChange={handleChange}
              />
            </div>
            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              onClick={handlePost}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetail;
