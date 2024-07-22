'use client';

import { Spin } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib';
import styles from '@/styles/layouts/AuthLayout.module.scss';
import { useEffect } from 'react';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/verify' && !user) {
      return router.replace('/login');
    }
    if (user) {
      user.reload().then(() => {
        if (user.emailVerified) {
          return router.replace('/statistic');
        } else if (pathname !== '/verify') {
          return router.replace('/verify');
        }
      });
    }
  }, [user, router, pathname]);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.star}></div>
      {[...Array(15)].map((_, index) => (
        <div
          className={styles[`meteor-${index + 1}`]}
          key={index}
        ></div>
      ))}

      {children}
    </div>
  );
}
