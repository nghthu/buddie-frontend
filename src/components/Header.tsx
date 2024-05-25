'use client';

import { CaretDownOutlined, LogoutOutlined } from '@ant-design/icons';
import { useSignOut } from 'react-firebase-hooks/auth';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space, notification } from 'antd';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import type { User } from 'firebase/auth';
import styles from '@/styles/components/Header.module.scss';
import { auth } from '@/lib';
import Image from 'next/image';

interface Props {
  activatedTab: string;
  user: User;
}

const Header = (props: Props) => {
  //const [user, loading, error] = useAuthState(auth);
  const [activatedTab, setActiveTab] = useState(props.activatedTab);
  const [logout, logoutLoading, logoutError] = useSignOut(auth);
  const [notificationApi, contextHolder] = notification.useNotification();

  const accountItems: MenuProps['items'] = [
    {
      label: <a href="">1st menu item</a>,
      key: '0',
    },
    {
      label: <a href="">2nd menu item</a>,
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <Button
          type="text"
          className={clsx(styles['logout-btn'])}
          icon={<LogoutOutlined />}
          onClick={logout}
          loading={logoutLoading}
        >
          Đăng xuất
        </Button>
      ),
      key: '3',
    },
  ];

  const tabClickHandler = (tab: string) => {
    setActiveTab(tab);
  };

  if (!logoutLoading && logoutError) {
    console.error(logoutError.message);
    notificationApi.error({
      message: 'Đăng xuất không thành công',
      description: logoutError.message,
    });
  }

  return (
    <>
      {contextHolder}
      <div className={styles.header}>
        <Link href="/home">
          <div
            className={styles.logo}
            onClick={() => tabClickHandler('home')}
          >
            <Image
              height={60}
              width={60}
              src="/images/logo/main.svg"
              alt="Buddie logo"
            />
            <div>
              <h2>buddie</h2>
              <p>Học tiếng Anh cùng AI</p>
            </div>
          </div>
        </Link>
        <div className={clsx(styles.navigator)}>
          <Link
            href="/home"
            onClick={() => tabClickHandler('home')}
          >
            <p className={clsx(activatedTab === 'home' && styles.activate)}>
              Trang chủ
            </p>
          </Link>
          <Link
            href="/tests"
            onClick={() => tabClickHandler('exams')}
          >
            <p className={clsx(activatedTab === 'exams' && styles.activate)}>
              Đề thi
            </p>
          </Link>
          <Link
            href="/community"
            onClick={() => tabClickHandler('community')}
          >
            <p
              className={clsx(activatedTab === 'community' && styles.activate)}
            >
              Cộng đồng
            </p>
          </Link>
          <Link
            href="/ielts"
            onClick={() => tabClickHandler('ielts')}
          >
            <p className={clsx(activatedTab === 'ielts' && styles.activate)}>
              IELTS cùng AI ✨
            </p>
          </Link>
          <Dropdown
            className={clsx(styles.dropdown)}
            menu={{ items: accountItems }}
            placement="bottomRight"
            trigger={['click']}
            overlayStyle={{ marginTop: '10px' }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space align={'center'}>
                <img
                  height={40}
                  width={40}
                  src={props.user.photoURL || ''}
                  alt={props.user.displayName || 'Avatar'}
                  className={clsx(styles.avatar)}
                />
                <CaretDownOutlined className={clsx(styles['dropdown-icon'])} />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
    </>
  );
};

export default Header;
