'use client';

import { Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib';
import { useEffect } from 'react';
import Header from '@/components/Header';

const UserLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || error)) {
      router.replace('/login');
    }

    if (user && !user?.emailVerified) {
      router.replace('/verify');
    }
  }, [user, loading, error, router]);

  if (user && user.emailVerified) {
    return (
      <>
        <Header activatedTab="home" />
        {children}
      </>
    );
  }

  return <Spin size="large" />;
};

export default UserLayout;
