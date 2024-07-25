'use client';

import SkillHeader from '@/components/SkillHeader';
import TestSelector from '@/components/TestSelector';
import { useEffect, useState } from 'react';
import { auth } from '@/lib';
import AdminDashboard from '@/components/AdminDashboard';

const IELTS = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchAdminStatus() {
      const tokenResult = await auth.currentUser?.getIdTokenResult();
      const isAdmin = tokenResult?.claims.admin;
      setIsAdmin(!!isAdmin);
    }

    fetchAdminStatus();
  }, []);
  return (
    <>
      {!isAdmin && (
        <>
          <SkillHeader title={'Luyện tập IELTS cùng Buddie'}></SkillHeader>
          <TestSelector
            pageLoading={pageLoading}
            setPageLoading={setPageLoading}
            skill={'ielts_reading'}
          />
        </>
      )}
      {isAdmin && <AdminDashboard buddie />}
    </>
  );
};

export default IELTS;
