'use client';

import SkillHeader from '@/components/SkillHeader';
import TestSelector from '@/components/TestSelector';
import { useState } from 'react';

const IELTS = () => {
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
