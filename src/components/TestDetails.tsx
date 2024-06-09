'use client';
import styles from '@/styles/components/TestDetails.module.scss';
import { Modal, Rate } from 'antd';
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
  update_date,
  submission_count,
  test_id,
}: {
  user_name: string;
  rating: number;
  rating_count: number;
  update_date: string;
  submission_count: number;
  test_id: string;
}) {
  const user = auth.currentUser;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleChange = async (rating: number) => {
    const token = await user?.getIdToken();

    await fetch(`/api/rate`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        test_id: test_id,
        star: rating,
      }),
    });
  };
  return (
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
            defaultValue={rating}
          />
        </div>
        <Modal
          title="Đánh giá đề thi"
          open={isModalOpen}
          onOk={handleOk}
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
        <div>Ngày cập nhật: {getDate(update_date)}</div>
      </div>
      <div className={styles.items}>
        <div>{submission_count} lượt thi</div>
      </div>
    </div>
  );
}
