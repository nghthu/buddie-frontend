'use client';

import Card from '@/components/Card';
import Post from '@/components/Post';
import { Input } from 'antd';
import styles from '@/styles/pages/Community.module.scss';
import { Button, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { AudioOutlined, PictureOutlined } from '@ant-design/icons';
import { auth } from '@/lib';

const { TextArea } = Input;

const Community = () => {
  const [openPostDetail, setOpenPostDetail] = useState(false);
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [newPostValue, setNewPostValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  const user = auth.currentUser;

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

    await fetch(`/api/questions`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    handleCancelCreate();
    setLoadingCreate(false);
  };

  const handleCancelCreate = () => {
    setOpenCreatePost(false);
    setSelectedFile(null);
    setSelectedAudioFile(null);
    setNewPostValue('');
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

  useEffect(() => {
    if (newPostValue !== '') setCanSubmit(true);
    else setCanSubmit(false);
  }, [newPostValue]);

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
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setNewPostValue(e.target.value)
          }
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
