'use client';

// import { useAuthState } from 'react-firebase-hooks/auth';
// import { auth } from '@/lib';
import SkillHeader from '@/components/SkillHeader';
import TestHistory from '@/components/TestHistory';
import { useState } from 'react';

const UserTestHistory = () => {
  // const [user, loading, error] = useAuthState(auth);
  const [pageLoading, setPageLoading] = useState(false);
  return (
    <>
      <SkillHeader title={'Đề Thi Đã Làm'}></SkillHeader>
      <TestHistory
        pageLoading={pageLoading}
        setPageLoading={setPageLoading}
      />
    </>
  );
};

export default UserTestHistory;
