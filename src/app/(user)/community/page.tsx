'use client';

import Card from '@/components/Card';
import Post from '@/components/Post';
import { Input, Spin, notification } from 'antd';
import styles from '@/styles/pages/Community.module.scss';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { AudioOutlined, PictureOutlined } from '@ant-design/icons';
import useSWR from 'swr';
import { User } from 'firebase/auth';
import { auth } from '@/lib';
const { TextArea } = Input;
interface FetchArgs {
  url: string;
  user: User | null;
}
interface question {
  name: string;
  avatar: string;
  date: string;
  text: string;
  audio: string;
  postImg: string;
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
const LIMIT = 10;
const Community = () => {
  const [openPostDetail, setOpenPostDetail] = useState(false);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [newPostValue, setNewPostValue] = useState('');
  // TODO: Implement infinite scroll and fetch more data and use setOffset
  const [offset] = useState(0);
  const [questionDetail, setQuestionDetail] = useState({} as question);
  // TODO: use answerDetail later
  const [answerDetail, setAnswerDetail] = useState({});
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
  // const postData = {
  //   name: 'Phạm Hoài An',
  //   avatar: 'images/avatar.jpg',
  //   date: '13 tháng 3',
  //   text: 'Hãy giúp mình sửa phát âm với!',
  //   audio: 'someAudio.webm',
  //   postImg: 'images/post.jpg',
  // };

  const showPostDetail = (data: question, answer: object) => {
    setAnswerDetail(answer);
    setQuestionDetail(data);
    setOpenPostDetail(true);
  };

  const hidePostDetail = () => {
    setOpenPostDetail(false);
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
    await fetch(`/api/community`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        contentType: 'multipart/form-data',
      },
      body: data,
    });
    // reset fields
    // setTimeout(() => {
    //   setLoadingCreate(false);
    //   setOpenCreatePost(false);
    // }, 3000);
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

  const postData = questions.questions.map(
    (question: {
      _id: string | null | undefined;
      answers: [];
      user: { display_name: string; photo_url: string };
      created_at: string;
      text: string;
      audio_url: string;
      image_url: string;
    }) => {
      const data = {
        name: question.user.display_name,
        avatar: question.user.photo_url,
        date: question.created_at,
        text: question.text,
        audio: question.audio_url,
        postImg: question.image_url,
      };
      return (
        <Post
          key={question._id}
          postData={data}
          comments={question.answers.length}
          onClick={() => showPostDetail(data, question.answers)}
          showComments
        />
      );
    }
  );
  return (
    <>
      {console.log(answerDetail)}
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
          {postData}
        </Card>
      </div>

      <Modal
        open={openPostDetail}
        title=""
        onCancel={hidePostDetail}
        footer={[]}
      >
        <Post
          postData={questionDetail}
          comments={1}
        />
      </Modal>

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
