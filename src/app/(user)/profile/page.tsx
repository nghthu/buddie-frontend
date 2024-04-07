'use client';

import { auth } from '@/lib';
import { Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';

const Profile = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  if (!loading && (!user || error)) {
    router.replace('/login');
  }

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      Chào {user?.displayName} - {user?.email}
    </div>
  );
};

export default Profile;
