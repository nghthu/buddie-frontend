'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  useAuthState,
  useSendEmailVerification,
  useSignOut,
} from 'react-firebase-hooks/auth';
import { LogoutOutlined, MailFilled } from '@ant-design/icons';
import { Alert, Button, Divider, Space, notification } from 'antd';
import clsx from 'clsx';
import styles from '@/styles/pages/Verify.module.scss';
import { auth } from '@/lib/firebase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Verify = () => {
  const [user, authStateLoading, authStateError] = useAuthState(auth);
  const [sendEmailVerification, sending, sendingEmailError] =
    useSendEmailVerification(auth);
  const [logout, logoutLoading, logoutError] = useSignOut(auth);
  const [sendingSuccess, setSendingSuccess] = useState(false);
  const [notificationApi, contextHolder] = notification.useNotification();
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (verified) {
      router.push('/profile');
    }
  }, [router, verified]);

  const resend = useCallback(async () => {
    const sendSuccessfully = await sendEmailVerification();
    if (sendSuccessfully) {
      setSendingSuccess(true);
    } else {
      setSendingSuccess(false);
    }
  }, [sendEmailVerification, setSendingSuccess]);

  const handleExplore = async () => {
    await user?.reload();

    if (!user?.emailVerified) {
      notificationApi.error({
        message: 'Chuyển trang không thành công',
        description: 'Email chưa được xác minh',
      });
    } else if (user?.emailVerified) {
      setVerified(true);
    }
  };

  if (sendingEmailError) {
    console.error(sendingEmailError.message);
    notificationApi.error({
      message: 'Gửi lại email xác minh không thành công',
      description: sendingEmailError.message,
    });
  }

  if (logoutError) {
    console.error(logoutError.message);
    notificationApi.error({
      message: 'Đăng xuất không thành công',
      description: logoutError.message,
    });
  }

  return (
    <>
      {contextHolder}
      <div>
        <Button
          className={clsx(styles['logout-btn'])}
          icon={<LogoutOutlined />}
          onClick={logout}
          loading={logoutLoading}
          ghost
        >
          Đăng xuất
        </Button>
        <main className={clsx(styles.main)}>
          <Space
            className={clsx(styles.container)}
            direction="vertical"
            size="large"
          >
            <div className={clsx(styles['mail-icon-wrapper'])}>
              <MailFilled className={clsx(styles['mail-icon'])} />
            </div>
            <h1>Xác minh email của bạn</h1>
            <Space
              direction="vertical"
              size="large"
            >
              <div>
                <p>
                  Chỉ còn một bước nữa thôi, chúng tôi đã gửi một email đến địa
                  chỉ
                </p>
                <h2>{user?.email}</h2>
              </div>
              <p>
                Nhấn vào liên kết trong email đó để hoàn tất việc đăng ký của
                bạn.
              </p>
              <p>
                Nếu vẫn không tìm thấy email, hãy nhấn vào nút gửi lại email xác
                minh dưới đây.
              </p>

              {!sending && sendingEmailError && (
                <Alert
                  className={clsx(styles.alert)}
                  message={sendingEmailError.message}
                  type="error"
                  showIcon
                />
              )}

              {!sending && sendingSuccess && (
                <Alert
                  className={clsx(styles.alert)}
                  message={`Email xác minh mới đã được gửi đến địa chỉ ${user?.email}.`}
                  type="success"
                  showIcon
                />
              )}

              <div className={clsx(styles['btn-container'])}>
                <Button
                  type="primary"
                  size="large"
                  className={clsx(styles['resend-btn'])}
                  onClick={resend}
                  loading={sending}
                >
                  Gửi lại email xác minh
                </Button>
                <Divider
                  className={clsx(styles.divider)}
                  plain
                  orientationMargin={10}
                >
                  Nếu đã xác minh
                </Divider>
                <Button
                  size="large"
                  className={clsx(styles['explore-btn'])}
                  onClick={handleExplore}
                >
                  Khám phá Buddie
                  <Image
                    src="/images/logo/main.svg"
                    alt="Buddie logo"
                    height={24}
                    width={24}
                  />
                </Button>
              </div>
            </Space>
          </Space>
        </main>
      </div>
    </>
  );
};

export default Verify;
