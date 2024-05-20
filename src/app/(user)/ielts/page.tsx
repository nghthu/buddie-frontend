'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib';
import SkillHeader from '@/components/SkillHeader';
import TestSelector from '@/components/TestSelector';
import { useState } from 'react';

const IELTS = () => {
  const [user, loading, error] = useAuthState(auth);
  const [pageLoading, setPageLoading] = useState(false);
  return (
    <>
      <SkillHeader title={'Luyện tập IELTS cùng Buddie'}></SkillHeader>
      <TestSelector
        pageLoading={pageLoading}
        setPageLoading={setPageLoading}
        skill={'ielts_reading'}
      />
    </>
  );
};

export default IELTS;
