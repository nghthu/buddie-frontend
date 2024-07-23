'use client';

import SkillHeader from '@/components/SkillHeader';
import TestLibrary from '@/components/TestLibrary';
import { useEffect, useState } from 'react';
import { auth } from '@/lib';
import AdminDashboard from '@/components/AdminDashboard';

const UserTestLibrary = () => {
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
          <SkillHeader title={'Đề thi IELTS'}></SkillHeader>
          <TestLibrary
            pageLoading={pageLoading}
            setPageLoading={setPageLoading}
          />
        </>
      )}
      {isAdmin && <AdminDashboard />}
    </>
  );
};

export default UserTestLibrary;
