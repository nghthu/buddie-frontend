'use client';
import styles from '@/styles/components/TestDetails.module.scss';
import { Modal, Rate, notification } from 'antd';
import { useState } from 'react';
import { auth } from '@/lib';

function getDate(date: string) {
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}
const desc = ['rất tệ', 'tệ', 'bình thường', 'tốt', 'rất tốt'];
export default function TestDetails({
  user_name,
  rating,
  rating_count,
  create_date,
  submission_count,
  test_id,
  handleRefresh,
}: {
  user_name: string;
  rating: number;
  rating_count: number;
  create_date: string;
  submission_count: number;
  test_id: string;
  handleRefresh: (rate: number) => void;
}) {
  const user = auth.currentUser;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [userRating, setUserRating] = useState<number>(0);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async (rate: number) => {
    const token = await user?.getIdToken();

    const res = await fetch(`/api/rate`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        test_id: test_id,
        user_id: user?.uid,
        star: userRating,
      }),
    });
    const data = await res.json();
    if (data.status === 'error') {
      api.open({
        message: 'Lỗi',
        description: data.error.message,
      });
    } else {
      handleRefresh(rate);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleChange = async (rating: number) => {
    setUserRating(rating);
  };
  return (
    <>
      {contextHolder}
      <div className={styles.wrapper}>
        <div className={styles.items}>Đăng bởi: {user_name}</div>
        <div className={styles.items}>
          <div>{rating}</div>
          <div
            onClick={showModal}
            style={{ cursor: 'pointer' }}
          >
            <Rate
              disabled
              allowHalf
              value={rating}
            />
          </div>
          <Modal
            title="Đánh giá đề thi"
            open={isModalOpen}
            onOk={() => handleOk(userRating)}
            onCancel={handleCancel}
          >
            <div className={styles.rate}>
              <Rate
                defaultValue={0}
                tooltips={desc}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </Modal>
          <div>({rating_count}) lượt đánh giá</div>
        </div>
        <div className={styles.items}>
          <div>Ngày cập nhật: {getDate(create_date)}</div>
        </div>
        <div className={styles.items}>
          <div>{submission_count} lượt thi</div>
        </div>
      </div>
    </>
  );
}
