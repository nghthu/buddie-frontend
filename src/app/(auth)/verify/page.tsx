'use client';

import { redirect } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  useAuthState,
  useSendEmailVerification,
} from 'react-firebase-hooks/auth';
import { MailFilled } from '@ant-design/icons';
import { Alert, Button, Space, Spin } from 'antd';
import styles from '@/styles/pages/Verify.module.scss';
import { auth } from '@/lib/firebase';

const Verify = () => {
  const [user, authStateLoading, authStateError] = useAuthState(auth);
  const [sendEmailVerification, sending, sendingEmailError] =
    useSendEmailVerification(auth);
  const [sendingSuccess, setSendingSuccess] = useState(false);

  useEffect(() => {
    if (user && !user?.emailVerified) {
      sendEmailVerification();
    }
  }, []);

  const resend = useCallback(async () => {
    const sendSuccessfully = await sendEmailVerification();
    if (sendSuccessfully) {
      setSendingSuccess(true);
    } else {
      setSendingSuccess(false);
    }
  }, []);

  if (!authStateLoading && (!user || authStateError)) {
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
        <Space
          direction="vertical"
          size="large"
        >
          <div>
            <p>
              Chỉ còn một bước nữa thôi, chúng tôi đã gửi một email đến địa chỉ
            </p>
            <h2>{user?.email}</h2>
          </div>
          <p>
            Nhấp vào liên kết trong email đó để hoàn tất việc đăng ký của bạn.
          </p>
          <p>
            Nếu vẫn không tìm thấy email, hãy nhấp vào nút gửi lại email xác
            minh dưới đây.
          </p>

          {!sending && sendingEmailError && (
            <Alert
              className={styles.alert}
              message={sendingEmailError.message}
              type="error"
              showIcon
            />
          )}

          {!sending && sendingSuccess && (
            <Alert
              className={styles.alert}
              message={`Email xác minh mới đã được gửi đến địa chỉ ${user?.email}.`}
              type="success"
              showIcon
            />
          )}

          <Button
            type="primary"
            size="large"
            className={styles['resend-btn']}
            onClick={resend}
            loading={sending}
          >
            Gửi lại email xác minh
          </Button>
        </Space>
      </Space>
    </main>
  );
};

export default Verify;
