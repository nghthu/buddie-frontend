'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib';

const IELTS = () => {
  const [user, loading, error] = useAuthState(auth);

  return <></>;
};

export default IELTS;
