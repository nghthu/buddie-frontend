'use client';

import Card from '@/components/Card';
import Post from '@/components/Post';
import { Empty, Input, Spin, notification } from 'antd';
import styles from '@/styles/pages/Community.module.scss';
import { Button, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { AudioOutlined, PictureOutlined } from '@ant-design/icons';
import useSWR from 'swr';
import { User } from 'firebase/auth';
import { auth } from '@/lib';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { SearchProps } from 'antd/es/input/Search';
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
const LIMIT = 20;
const { Search } = Input;
const Community = () => {
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [newPostValue, setNewPostValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState([] as question[]);
  const [hasMoreQuestions, setHasMoreQuestions] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  // TODO: Implement infinite scroll and fetch more data and use setOffset
  const user = auth.currentUser;
  const {
    data: questions,
    error,
    isLoading,
  } = useSWR(
    {
      url: `/api/community?offset=${offset}&limit=${LIMIT}&text=${search}`,
      user,
    },
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
      if (offset + LIMIT >= questions?.pagination?.total_count) {
        setHasMoreQuestions(false);
      } else {
        setHasMoreQuestions(true);
      }
    }
  }, [offset, questions]);

  useEffect(() => {
    if (questions) {
      setTotalQuestions((prev) => {
        const seen = new Set();
        const returnRes = [...prev, ...(questions.questions ?? [])].filter(
          (question) => {
            if (seen.has(question._id)) return false;
            seen.add(question._id);
            return true;
          }
        );
        return returnRes;
      });
    }
  }, [questions]);

  const handleLoadMoreComments = () => {
    if (!questions) return;
    setOffset((prev) => prev + LIMIT);
  };

  useEffect(() => {
    if (newPostValue !== '') setCanSubmit(true);
    else setCanSubmit(false);
  }, [newPostValue]);

  const handleCreatePost = async () => {
    setLoadingCreate(true);
    const token = await user?.getIdToken();
    const formData = new FormData();

    if (selectedAudioFile) {
      formData.append('audio', selectedAudioFile);
    }
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
    formData.append('text', newPostValue);

    const res = await fetch(`/api/questions`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then((res) => res.json());
    console.log(res);
    setTotalQuestions((prev) => {
      const seen = new Set();
      const returnRes = [res ?? {}, ...prev].filter((question) => {
        if (seen.has(question._id)) return false;
        seen.add(question._id);
        return true;
      });
      return returnRes;
    });
    setOffset((prev) => prev + 1);
    handleCancelCreate();
    setLoadingCreate(false);
  };

  const handleCancelCreate = () => {
    setOpenCreatePost(false);
    setSelectedFile(null);
    setSelectedAudioFile(null);
    setNewPostValue('');
    hideCreateModal();
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (type === 'imageFile') setSelectedFile(file);
      else if (type === 'audioFile') setSelectedAudioFile(file);
    }
  };

  const showCreateModal = () => {
    setOpenCreatePost(true);
  };

  const hideCreateModal = () => {
    setOpenCreatePost(false);
  };
  const refresh = async () => {
    const token = await user?.getIdToken();
    const res = await fetch(
      `/api/community?offset=${offset}&limit=${LIMIT}&text=${search}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => res.json());
    setTotalQuestions(() => {
      const seen = new Set();
      const returnRes = [...(res.data.questions ?? [])].filter((question) => {
        if (seen.has(question._id)) return false;
        seen.add(question._id);
        return true;
      });
      return returnRes;
    });
  };
  const onSearch: SearchProps['onSearch'] = (value) => {
    // split the search value into an array of words, delimiter is space
    const searchWords = encodeURIComponent(value.trim());
    setSearch(searchWords);
    setTotalQuestions([]);
  };

  const postData = totalQuestions.map((question: question) => {
    return (
      <Post
        key={question._id}
        postData={question}
        comments={question.answers.length}
        onClose={refresh}
      />
    );
  });
  hasMoreQuestions && !isLoading
    ? postData.push(
        <Empty
          key="empty"
          style={{ height: '200px' }}
          description={<p>Kéo xuống tiếp để tải thêm câu hỏi</p>}
        />
      )
    : null;
  return (
    <>
      {contextHolder}
      <div className={styles.wrapper}>
        <Card
          width="90%"
          height="fit-content"
          className={styles.container}
        >
          <div className={styles.searchAndCreate}>
            <div className={styles.search}>
              <Search
                placeholder="Nhập từ khóa cần tìm"
                onSearch={onSearch}
                style={{ width: 300 }}
              />
            </div>
            <button
              className={styles['create-question-btn']}
              onClick={showCreateModal}
            >
              Tạo câu hỏi
            </button>
          </div>
          {postData.length === 0 && !isLoading && (
            <Empty description={<h2>Không có câu hỏi nào</h2>} />
          )}
          {postData.length >= 0 && (
            <InfiniteScroll
              dataLength={postData.length}
              next={() => {
                handleLoadMoreComments();
              }}
              hasMore={hasMoreQuestions}
              loader={<Spin size="small" />}
              scrollThreshold={1}
            >
              {postData}
            </InfiniteScroll>
          )}
        </Card>
      </div>
      <Modal
        open={openCreatePost}
        title="Tạo câu hỏi"
        onCancel={hideCreateModal}
        footer={[
          <Button
            key="back"
            type="text"
            onClick={handleCancelCreate}
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loadingCreate}
            onClick={handleCreatePost}
            disabled={!canSubmit}
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
        {selectedFile && <div>{selectedFile.name}</div>}
        {selectedAudioFile && <div>{selectedAudioFile.name}</div>}
        <div className={styles['attach-btn-group']}>
          <Button
            type="text"
            icon={<AudioOutlined />}
            onClick={() => audioFileInputRef.current?.click()}
          />
          <input
            className={styles['file-input']}
            type="file"
            accept="audio/*"
            ref={audioFileInputRef}
            onChange={(e) => handleFileSelect(e, 'audioFile')}
          />
          <Button
            type="text"
            icon={<PictureOutlined />}
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            className={styles['file-input']}
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => handleFileSelect(e, 'imageFile')}
          />
        </div>
      </Modal>
    </>
  );
};

export default Community;
