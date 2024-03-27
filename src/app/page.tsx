'use client';
import { Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import styles from '@/styles/pages/Root.module.scss';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.starContainer}>
        {[...Array(300)].map((_, index) => (
          <div className={styles[`star-${index + 1}`]}></div>  
        ))}
      </div>
      {[...Array(15)].map((_, index) => (
        <div className={styles[`meteor-${index + 1}`]}></div>
      ))}

      <div className={styles.information}>
        <Link href='/login' className={styles['login-btn']}>
          <button>Đi đến trang đăng nhập</button>
        </Link>
        <h1>Bạn muốn học tiếng Anh hiệu quả?</h1>
        <div className={styles.banner}>
          <img src='/images/logo.png'></img>
          <p>
            Thử ngay trên Buddie! Trang web kết hợp việc học tiếng Anh truyền
            thống và sự hỗ trợ mạnh mẽ của AI
          </p>
        </div>

        <button className={styles['try-now-btn']}>Thử ngay nào!</button>

        <div className={styles.featureList}>
          <p>
            <CheckCircleOutlined style={{ color: '#10A956' }} />
            &emsp;Thử sức bản thân với bộ đề thi thử IELTS
          </p>
          <p>
            <CheckCircleOutlined style={{ color: '#10A956' }} />
            &emsp;AI hỗ trợ người học cả 4 kỹ năng! Việc gì khó, cứ để AI lo!
          </p>
          <p>
            <CheckCircleOutlined style={{ color: '#10A956' }} />
            &emsp;Nhận phản hồi về kỹ năng và kết quả của bản thân từ AI nhanh
            chóng!
          </p>
        </div>
      </div>
    </div>
  );
}
