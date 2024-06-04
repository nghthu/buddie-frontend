'use client';

import SkillHeader from '@/components/SkillHeader';
import TestLibrary from '@/components/TestLibrary';
import { useState } from 'react';

const UserTestLibrary = () => {
  const [pageLoading, setPageLoading] = useState(false);
  return (
    <>
      <SkillHeader title={'Lịch sử làm bài'}></SkillHeader>
      <TestLibrary
        pageLoading={pageLoading}
        setPageLoading={setPageLoading}
      />
    </>
  );
};

export default UserTestLibrary;
