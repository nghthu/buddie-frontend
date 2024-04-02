'use client';

import { CaretDownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import styles from '@/styles/components/Header.module.scss';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  activatedTab: string;
}

const Header = (props: Props) => {
  const [activatedTab, setActiveTab] = useState(props.activatedTab);
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
      label: '3rd menu item',
      key: '3',
    },
  ];

  const tabClickHandler = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.header}>
      <Link href="/home">
        <div
          className={styles.logo}
          onClick={() => tabClickHandler('home')}
        >
          <img src="/images/logo.png"></img>
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
        <Link href="/">
          <p className={clsx(activatedTab === 'exams' && styles.activate)}>
            Đề thi
          </p>
        </Link>
        <Link href="/">
          <p className={clsx(activatedTab === 'comunity' && styles.activate)}>
            Cộng đồng
          </p>
        </Link>
        <Link
          href="/ielts"
          onClick={() => tabClickHandler('ielts')}
        >
          <p className={clsx(activatedTab === 'ielts' && styles.activate)}>
            Ielts cùng AI✨
          </p>
        </Link>
        <div className={clsx(styles.avatarMenu)}>
          <img
            src="/images/avatar.jpg"
            className={clsx(styles.avatar)}
          />
          <Dropdown
            menu={{ items: accountItems }}
            placement="bottomRight"
            trigger={['click']}
            overlayStyle={{ marginTop: '10px' }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <CaretDownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Header;
