'use client';

import TextCard from './TextCard';
import { SendOutlined, SoundOutlined } from '@ant-design/icons';
import styles from '@/styles/components/Post.module.scss';
import PostAnswer from './PostAnswer';
import clsx from 'clsx';

import React, { useEffect, useRef, useState } from 'react';
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
  user_id: string;
}

interface Props {
  postData: Post;
}

const PostDetail = ({ postData }: Props) => {
  const user = auth.currentUser;

  const [value, setValue] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [postAnswers, setPostAnswers] = useState<React.JSX.Element[]>([]);
  const audioref = useRef<HTMLAudioElement>(null);

  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    const canSetExcellent = postData.answers.every(
      (answer) => !answer.is_excellent
    );
    const postAnswersTemp = postData.answers.map((answer) => (
      <PostAnswer
        key={answer._id}
        questionId={postData._id}
        answer={answer}
        canSetExcellent={canSetExcellent && postData.user_id === user?.uid}
      />
    ));
    setPostAnswers(postAnswersTemp);
  }, [
    setPostAnswers,
    postData.answers,
    user?.uid,
    postData._id,
    postData.user_id,
  ]);

  const handleAudio = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (audioPlaying) {
      audioref.current?.pause();
    } else {
      audioref.current?.play();
    }
    setAudioPlaying((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  // TODO: api
  const handlePost = async () => {
    setIsPosting(true);
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
    const userId = user?.uid;
    const newAnswer = res.data.answers
      .filter((answer: Post) => {
        return answer.user.user_id === userId;
      })
      .sort((a: Post, b: Post) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      })[0];
    const canSetExcellent = postData.answers.every(
      (answer) => !answer.is_excellent
    );
    setPostAnswers((prev) => [
      ...prev,
      <PostAnswer
        key={newAnswer._id}
        answer={newAnswer}
        questionId={postData._id}
        canSetExcellent={canSetExcellent && postData.user_id === user?.uid}
      />,
    ]);
    setValue('');
    setIsPosting(false);
  };
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const newDate = new Date(postData.created_at);
  // const formattedDate =
  //   (newDate.getDate() < 10 ? newDate.getDate() : '0' + newDate.getDate()) +
  //   '/' +
  //   (newDate.getMonth() + 1) +
  //   '/' +
  //   newDate.getFullYear();
  const formattedDate = formatDate(newDate);
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
            <p>{formattedDate}</p>
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
              disabled={value === '' || isPosting}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetail;
