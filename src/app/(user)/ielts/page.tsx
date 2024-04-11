'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib';

const Ielts = () => {
  const [user, loading, error] = useAuthState(auth);

  return <></>;
};

export default Ielts;
