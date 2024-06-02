'use client';

import Card from '@/components/Card';
import Post from '@/components/Post';
import { Empty, Input, Spin, notification } from 'antd';
import styles from '@/styles/pages/Community.module.scss';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { AudioOutlined, PictureOutlined } from '@ant-design/icons';
import useSWR from 'swr';
import { User } from 'firebase/auth';
import { auth } from '@/lib';
import InfiniteScroll from 'react-infinite-scroll-component';
//import InfiniteScroll from 'react-infinite-scroll-component';
const { TextArea } = Input;
interface FetchArgs {
  url: string;
  user: User | null;
}
interface questionUser {
  user_id: string;
  display_name: string;
  photo_url: string;
}
interface PostAnswer {
  content: string;
  is_excellent: boolean;
  _id: string;
  created_at: string;
  user: questionUser;
}
interface question {
  _id: string;
  text: string;
  created_at: string;
  updated_at: string;
  __v: string;
  answers: PostAnswer[];
  user: questionUser;
  audio_url: string;
  image_url: string;
}
const fetcher = async ({ url, user }: FetchArgs) => {
  const token = await user?.getIdToken();
  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  if (response.status === 'error') {
    throw new Error(response.error.message);
  }

  return response.data;
};
const LIMIT = 6;
const Community = () => {
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [newPostValue, setNewPostValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState([] as question[]);
  const [hasMoreQuestions, setHasMoreQuestions] = useState(true);
  // TODO: Implement infinite scroll and fetch more data and use setOffset
  const user = auth.currentUser;
  const {
    data: questions,
    error,
    isLoading,
  } = useSWR(
    { url: `/api/community?offset=${offset}&limit=${LIMIT}`, user },
    fetcher
  );
  const [notificationApi, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (error) {
      notificationApi.error({
        message: 'Error',
        description: error?.message,
      });
    }
  }, [error, notificationApi]);
  useEffect(() => {
    if (questions) {
      if (offset + LIMIT >= questions.pagination.total_count) {
        setHasMoreQuestions(false);
      } else {
        setHasMoreQuestions(true);
      }
    }
  }, [offset, questions]);
  useEffect(() => {
    if (questions) {
      setTotalQuestions((prev) => [...prev, ...questions.questions]);
    }
  }, [questions]);
  const handleLoadMoreComments = () => {
    if (!questions) return;
    setOffset((prev) => prev + LIMIT);
  };
  const showCreateModal = () => {
    setOpenCreatePost(true);
  };

  const hideCreateModal = () => {
    setOpenCreatePost(false);
  };

  const handleCreatePost = async () => {
    setLoadingCreate(true);
    const token = await user?.getIdToken();
    // create a post
    const data = new FormData();
    data.append('text', newPostValue);
    console.log(data);
    await fetch(`/api/community`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: data,
    });
    setLoadingCreate(false);
    setNewPostValue('');
  };

  // const handleCancelCreate = () => {
  //   setOpenCreatePost(false);
  //   // reset fields
  //   setNewPostValue('');
  // };
  if (isLoading) {
    return <Spin size="default" />;
  }

  const postData = totalQuestions.map((question: question) => {
    return (
      <Post
        key={question._id}
        postData={question}
        comments={question.answers.length}
      />
    );
  });
  postData.push(
    <Empty
      description={<></>}
      key="empty"
    />
  );
  // TODO: Inf scroll
  return (
    <>
      {contextHolder}
      <div className={styles.wrapper}>
        <Card
          width="90%"
          height="fit-content"
          className={styles.container}
        >
          <button
            className={styles['create-question-btn']}
            onClick={showCreateModal}
          >
            Tạo câu hỏi
          </button>
          <InfiniteScroll
            dataLength={postData.length}
            next={() => {
              handleLoadMoreComments();
            }}
            hasMore={hasMoreQuestions}
            loader={<h4>Loading...</h4>}
            scrollThreshold={1}
          >
            {postData}
          </InfiniteScroll>
        </Card>
      </div>
      <Modal
        open={openCreatePost}
        title="Tạo câu hỏi"
        onCancel={hideCreateModal}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loadingCreate}
            onClick={handleCreatePost}
          >
            Đăng
          </Button>,
        ]}
      >
        <TextArea
          value={newPostValue}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setNewPostValue(e.target.value);
          }}
          placeholder="Aa"
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
        <div className={styles['attach-btn-group']}>
          <Button
            type="text"
            icon={<AudioOutlined />}
          />
          <Button
            type="text"
            icon={<PictureOutlined />}
          />
        </div>
      </Modal>
    </>
  );
};

export default Community;
