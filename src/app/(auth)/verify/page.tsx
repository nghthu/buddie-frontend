'use client';

import { redirect } from 'next/navigation';
import {
  useAuthState,
  useSendEmailVerification,
} from 'react-firebase-hooks/auth';
import { Button, Space, Spin, message } from 'antd';
import styles from '@/styles/pages/Verify.module.scss';
import { auth } from '@/lib/firebase';
import { MailFilled, MailOutlined } from '@ant-design/icons';
import { useCallback, useEffect } from 'react';

const Verify = () => {
  const [user, authStateLoading, authStateError] = useAuthState(auth);
  const [sendEmailVerification, sending, sendingEmailError] =
    useSendEmailVerification(auth);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (user && !user?.emailVerified) {
      sendEmailVerification();
    }
  }, []);

  const resend = useCallback(async () => {
    const sendSuccessfully = await sendEmailVerification();
    if (sendSuccessfully) {
      messageApi.success(`Email xác minh mới đã được gửi đến ${user?.email}!`);
    } else {
      messageApi.error(
        'Có lỗi xảy ra khi gửi lại email xác minh, hãy thử lại sau.'
      );
    }
  }, []);

  if (!user || authStateError) {
    redirect('/login');
  }

  if (user && user?.emailVerified) {
    redirect('/');
  }

  if (authStateLoading) {
    return (
      <main className={styles.main}>
        <Spin
          className={styles.spin}
          size="large"
        />
      </main>
    );
  }

  if (sendingEmailError) {
    console.error(sendingEmailError.message);
  }

  return (
    <>
      {contextHolder}
      <main className={styles.main}>
        <Space
          className={styles.container}
          direction="vertical"
          size="large"
        >
          <div className={styles['mail-icon-wrapper']}>
            <MailFilled className={styles['mail-icon']} />
          </div>
          <h1>Xác minh email của bạn</h1>
          <div className={styles['content-group']}>
            <p>
              Chỉ còn một bước nữa thôi, chúng tôi đã gửi một email đến địa chỉ
            </p>
            <h2>{user?.email}</h2>
          </div>
          <div className={styles['content-group']}>
            <p>
              Nhấp vào liên kết trong email đó để hoàn tất việc đăng ký của bạn.
            </p>
            <p>
              Nếu không thấy email, hãy kiểm tra <b>hộp thư rác</b> của bạn.
            </p>
          </div>
          <div className={styles['content-group']}>
            <p>
              Nếu vẫn không tìm thấy email, hãy nhấp vào nút gửi lại email xác
              minh dưới đây.
            </p>
          </div>

          <Button
            type="primary"
            size="large"
            onClick={resend}
            loading={sending}
          >
            Gửi lại email xác minh
          </Button>
        </Space>
      </main>
    </>
  );
};

export default Verify;
