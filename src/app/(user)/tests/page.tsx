'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib';
import SkillHeader from '@/components/SkillHeader';
import TestLibrary from '@/components/TestLibrary';
import { useState } from 'react';

const UserTestLibrary = () => {
  const [user, loading, error] = useAuthState(auth);
  const [pageLoading, setPageLoading] = useState(false);
  return (
    <>
      <SkillHeader title={'Đề thi IELTS'}></SkillHeader>
      <TestLibrary pageLoading ={pageLoading} setPageLoading={setPageLoading} />
    </>
  );
};

export default UserTestLibrary;
