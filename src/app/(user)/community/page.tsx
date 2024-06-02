'use client';

import Card from '@/components/Card';
import Post from '@/components/Post';
import { Input } from 'antd';
import styles from '@/styles/pages/Community.module.scss';
import { Button, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { AudioOutlined, PictureOutlined } from '@ant-design/icons';
import { auth } from '@/lib';
// import Link from 'next/link';
const { TextArea } = Input;

const Community = () => {
  // const [openPostDetail, setOpenPostDetail] = useState(false);
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

  // const showPostDetail = () => {
  //   setOpenPostDetail(true);
  // };

  // const hidePostDetail = () => {
  //   setOpenPostDetail(false);
  // };

  const showCreateModal = () => {
    setOpenCreatePost(true);
  };

  const hideCreateModal = () => {
    setOpenCreatePost(false);
  };

  const postData = {
    _id: '6647ab24dfa6bec4eda507e3',
    user_id: 'gVIadC2MMucZ21qLJX4cY6rwCSc2',
    text: 'Mọi người có mẹo nào để cải thiện phát âm tiếng Anh không?',
    audio_path:
      'question/question-6647ab24dfa6bec4eda507e3/audio-092b726a-8bcf-4f24-9c46-58f75b3e86ae.mp3',
    image_path:
      'question/question-6647ab24dfa6bec4eda507e3/image-13bf0661-c395-42f2-99b9-3bbc578caaa2.jpg',
    created_at: '2024-05-17T19:08:23.072Z',
    updated_at: '2024-05-19T07:19:27.400Z',
    __v: 12,
    answers: [
      {
        user_id: 'GQkcm8SDaIayaLjTUn5BX7KJbY33',
        content: 'Noi dung 1',
        is_excellent: false,
        _id: '6649a7cd182a91d89115c3ff',
        created_at: '2024-05-19T07:18:37.171Z',
        updated_at: '2024-05-19T07:18:37.171Z',
        __v: 0,
        user: {
          user_id: 'GQkcm8SDaIayaLjTUn5BX7KJbY33',
          display_name: 'Cuoc song',
          photo_url:
            'https://firebasestorage.googleapis.com/v0/b/english-buddie.appspot.com/o/user-avatar%2Fdefault-avatar.png?alt=media&token=34656993-5083-4b8f-bf30-85f8b6ced9c3',
        },
      },
      {
        user_id: 'GQkcm8SDaIayaLjTUn5BX7KJbY33',
        content: 'Noi dung 1',
        is_excellent: true,
        _id: '6649a7fe3571007d47100c12',
        created_at: '2024-05-19T07:19:26.777Z',
        updated_at: '2024-05-19T07:19:26.777Z',
        __v: 0,
        user: {
          user_id: 'GQkcm8SDaIayaLjTUn5BX7KJbY33',
          display_name: 'Cuoc song',
          photo_url:
            'https://firebasestorage.googleapis.com/v0/b/english-buddie.appspot.com/o/user-avatar%2Fdefault-avatar.png?alt=media&token=34656993-5083-4b8f-bf30-85f8b6ced9c3',
        },
      },
    ],
    user: {
      user_id: 'gVIadC2MMucZ21qLJX4cY6rwCSc2',
      display_name: 'Thùy Nguyễn Ngọc',
      photo_url:
        'https://lh3.googleusercontent.com/a/ACg8ocJxb1DnluqtQ6QdSoWFcoCVRegfYintRPqUJrdxVbSHSc5pNg=s96-c',
    },
    audio_url:
      'https://firebasestorage.googleapis.com/v0/b/english-buddie.appspot.com/o/question%2Fquestion-6647ab24dfa6bec4eda507e3%2Faudio-092b726a-8bcf-4f24-9c46-58f75b3e86ae.mp3?alt=media&token=f4acdc8d-5ff4-41d8-944e-e26c83a76151',
    image_url:
      'https://firebasestorage.googleapis.com/v0/b/english-buddie.appspot.com/o/question%2Fquestion-6647ab24dfa6bec4eda507e3%2Fimage-13bf0661-c395-42f2-99b9-3bbc578caaa2.jpg?alt=media&token=e0f302f1-a28f-48c1-874a-ea6c431c6e75',
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
        {/* <Link href={`/community/6647ab24dfa6bec4eda507e3`}> */}
        <Post
          postData={postData}
          showDetail
        />
        {/* </Link> */}
      </Card>
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
