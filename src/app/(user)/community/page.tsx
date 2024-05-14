'use client';

import Card from '@/components/Card';
import Post from '@/components/Post';
import { Input } from 'antd';
import styles from '@/styles/pages/Community.module.scss';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import { AudioOutlined, PictureOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const Community = () => {
  const [openPostDetail, setOpenPostDetail] = useState(false);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [newPostValue, setNewPostValue] = useState('');

  const postData = {
    name: 'Phạm Hoài An',
    avatar: 'images/avatar.jpg',
    date: '13 tháng 3',
    text: 'Hãy giúp mình sửa phát âm với!',
    audio: 'someAudio.webm',
    postImg: 'images/post.jpg',
  };

  const comments = {
    commentNumber: 2,
  };

  const showPostDetail = () => {
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

  const handleCreatePost = () => {
    setLoadingCreate(true);
    // create a post
    // reset fields
    setTimeout(() => {
      setLoadingCreate(false);
      setOpenCreatePost(false);
    }, 3000);
  };

  const handleCancelCreate = () => {
    setOpenCreatePost(false);
    // reset fields
    setNewPostValue('');
  };
  return (
    <>
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
        <Post
          postData={postData}
          comments={comments}
          onClick={showPostDetail}
          showComments
        />
      </Card>
      <Modal
        open={openPostDetail}
        title=""
        onCancel={hidePostDetail}
        footer={[]}
      >
        <Post
          postData={postData}
          comments={comments}
          onClick={showPostDetail}
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
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setNewPostValue(e.target.value)
          }
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
