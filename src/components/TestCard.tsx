'use client';
import { ClockCircleOutlined } from '@ant-design/icons';
import styles from '@/styles/components/TestCard.module.scss';
import { Button, Modal, Rate, Select, Space } from 'antd';
import { SetStateAction, useState, useEffect } from 'react';

import Link from 'next/link';
import { auth } from '@/lib';
interface user {
  user_id: string;
  display_name: string;
  photo_url: string;
}
export default function TestCard(props: {
  setPageLoading: React.Dispatch<SetStateAction<boolean>>;
  submissionCount?: number;
  review?: { star: number; count: number };
  user?: user;
  isUserTest?: boolean;
  testName: string;
  testDuration?: string;
  testTags?: string[];
  testSkill?: string;
  testId: string;
  partIds: string[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchAdminStatus() {
      const tokenResult = await auth.currentUser?.getIdTokenResult();
      const isAdmin = tokenResult?.claims.admin;
      setIsAdmin(!!isAdmin);
    }

    fetchAdminStatus();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleClick = () => {
    showModal();
  };
  // TODO: handle timer
  const handleSelectChange = (value: string) => {
    console.log(value);
  };

  const handleDelete = () => {
    // You need to define this function
  };

  const skill = props.testSkill?.split('_')[1];
  const duration = Number(props.testDuration) / 60;

  const partSelectButtons = (
    <div className={styles.partSelect}>
      {props.partIds.map((part, index) => {
        return (
          <Link
            href={`ielts/${skill}/${props.testId}/${index + 1}`}
            key={part}
          >
            <Button
              key={part}
              type="primary"
              onClick={() => props.setPageLoading(true)}
            >
              Part {index + 1}
            </Button>
          </Link>
        );
      })}
    </div>
  );
  return (
    <div className={styles.cardWrapper}>
      <h3 className={styles.header}>{props.testName}</h3>
      {!props.isUserTest && (
        <>
          <div className={styles.clock}>
            <ClockCircleOutlined />
            {duration} phút
          </div>
          <div className={styles.testTagWrapper}>
            {props.testTags?.map((tag) => {
              return (
                <span
                  className={styles.testTag}
                  key={tag}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          {isAdmin ? (
            <div className={styles.buttonContainer}>
              <Link href={`tests/update/${props.testId}`}>
                <Button>Cập nhật</Button>
              </Link>
              <button
                className={styles['red-btn']}
                onClick={handleDelete}
              >
                Xóa
              </button>
            </div>
          ) : (
            <Button
              onClick={handleClick} // Existing click handler for "Chi tiết"
              className={styles.button}
            >
              Chi tiết
            </Button>
          )}
        </>
      )}
      {props.isUserTest && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            Đăng bởi:
            <Space />
            {props.user?.display_name}
          </div>
          <div>
            <Rate
              disabled
              defaultValue={props.review ? props.review.star : 0}
            />
            ({props.review ? props.review.count : 0})
          </div>
          <div>
            Lượt làm bài: {props.submissionCount ? props.submissionCount : 0}
          </div>
          {isAdmin ? (
            <div className={styles.buttonContainer}>
              <Link href={`tests/update/${props.testId}`}>
                <Button>Cập nhật</Button>
              </Link>
              <button
                className={styles['red-btn']}
                onClick={handleDelete}
              >
                Xóa
              </button>
            </div>
          ) : (
            <Link href={`tests/${props.testId}`}>
              <Button
                className={styles.button}
                onClick={() => props.setPageLoading(true)}
              >
                Chi tiết
              </Button>
            </Link>
          )}
        </>
      )}
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className={styles.modal}>
          <h3>{props.testName}</h3>
          <div className={styles.testTagWrapperModal}>
            {props.testTags?.map((tag) => {
              return (
                <span
                  className={styles.testTag}
                  key={tag}
                >
                  {tag}
                </span>
              );
            })}
          </div>
          <div className={styles.modalSelect}>
            Chọn thời gian
            <Select
              defaultValue="không giới hạn"
              options={[
                { value: 'unlimied', label: 'không giới hạn' },
                { value: 'dependent', label: 'theo thời gian của đề' },
              ]}
              style={{ width: '200px' }}
              onChange={handleSelectChange}
            />
          </div>
          {partSelectButtons}
          <Link href={`ielts/${skill}/${props.testId}/all`}>
            <Button
              type="primary"
              className={styles.purpleBtn}
              onClick={() => props.setPageLoading(true)}
            >
              Luyện tập tất cả
            </Button>
          </Link>
        </div>
      </Modal>
    </div>
  );
}
