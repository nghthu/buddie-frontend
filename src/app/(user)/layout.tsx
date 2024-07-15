'use client';

import { Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib';
import { useEffect } from 'react';
import Header from '@/components/Header';
import { getIdToken, User } from 'firebase/auth';

const UserLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const onUserChanged = async (currentUser: User | null): Promise<void> => {
    if (currentUser) {
      await getIdToken(currentUser, true);
    }
  };

  const [user, loading, error] = useAuthState(auth, {
    onUserChanged,
  });

  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || error)) {
      router.replace('/login');
    }

    if (user) {
      user.reload().then(() => {
        if (!user.emailVerified) {
          router.replace('/verify');
        }
      });
    }
  }, [user, loading, error, router]);

  if (user?.emailVerified) {
    return (
      <>
        <Header
          activatedTab="home"
          user={user}
        />
        {children}
      </>
    );
  }

  return <Spin size="large" />;
};

export default UserLayout;
