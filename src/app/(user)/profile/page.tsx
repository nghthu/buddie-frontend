'use client';

import { auth } from '@/lib';

const Profile = () => {
  const user = auth.currentUser;
  console.log(user);

  return (
    <div>
      Chào {user?.displayName} - {user?.email}
    </div>
  );
};

export default Profile;
