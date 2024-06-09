'use client';

import TextCard from '@/components/TextCard';
import { auth } from '@/lib';
import styles from '@/styles/pages/Profile.module.scss';
import { CameraOutlined } from '@ant-design/icons';
import { Spin, notification } from 'antd';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

interface FetchArgs {
  url: string;
  user: User | null;
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
  console.log('=======>', response.data);
  return response.data;
};
const Profile = () => {
  const user = auth.currentUser;
  const {
    data: profile,
    error,
    isLoading,
  } = useSWR(
    {
      url: `/api/profile/${user?.uid}`,
      user,
    },
    fetcher
  );
  const [notificationApi, contextHolder] = notification.useNotification();
  const [isHover, setIsHover] = useState(false);
  useEffect(() => {
    if (error) {
      notificationApi.error({
        message: 'Error',
        description: error?.message,
      });
    }
  }, [error, notificationApi]);
  // useEffect(() => {
  //   console.log(user?.getIdToken());
  //   console.log(user?.getIdTokenResult());
  // });
  if (isLoading) {
    return <Spin size="large" />;
  }
  const handleChangeAvatar = () => {
    console.log('dummy');
  };
  return (
    <>
      {contextHolder}
      <div className={styles.wrapper}>
        <div className={styles.user}>
          <div
            className={styles.avatarContainer}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={handleChangeAvatar}
          >
            {!isHover && (
              <img
                src={user?.photoURL ?? ''}
                alt="avatar"
                className={styles.avatar}
              />
            )}
            {isHover && <CameraOutlined className={styles.icon} />}
          </div>
          <div>
            <h1>{user?.displayName}</h1>
            <h4>{user?.email}</h4>
          </div>
        </div>
        <h2>Hoạt động cộng đồng</h2>
        <div className={styles.communityActivities}>
          <TextCard
            width={'100%'}
            height={'auto'}
            className={styles.greyCard}
          >
            <div className={styles.itemContainer3}>
              <div className={styles.items}>
                <h4>Bài tập đã công khai</h4>
                <div>{profile.public_test_count}</div>
              </div>
              <div className={styles.items}>
                <h4>Bài tập riêng tư</h4>
                <div>{profile.private_test_count}</div>
              </div>
              <div className={styles.items}>
                <h4>Câu hỏi đã đăng</h4>
                <div>{profile.question_count}</div>
              </div>
              <div className={styles.items}>
                <h4>Câu trả lời</h4>
                <div>{profile.answer_count}</div>
              </div>
              <div className={styles.items}>
                <h4>Câu trả lời được đánh giá cao</h4>
                <div>{profile.excellent_answer_count}</div>
              </div>
            </div>
          </TextCard>
        </div>
        <h2>Lượng request còn lại</h2>
        <div className={styles.communityActivities}>
          <TextCard
            width={'100%'}
            height={'auto'}
            className={styles.greyCard}
          >
            <div className={styles.itemContainer2}>
              <div className={styles.items}>
                <h4>Request thường</h4>
                <div>{profile.standard_request_count}</div>
              </div>
              <div className={styles.items}>
                <h4>Request pro</h4>
                <div>{profile.pro_request_count}</div>
              </div>
            </div>
          </TextCard>
        </div>
      </div>
    </>
  );
};

export default Profile;
