'use client';

import { auth } from '@/lib';
import { useEffect } from 'react';

const Profile = () => {
  const user = auth.currentUser;

  useEffect(() => {
    console.log(user?.getIdToken());
    console.log(user?.getIdTokenResult());
  });

  return (
    <div>
      Chào {user?.displayName} - {user?.email}
    </div>
  );
};

export default Profile;
