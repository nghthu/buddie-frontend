'use client';

import SkillHeader from '@/components/SkillHeader';
import TestLibrary from '@/components/TestLibrary';
import { useState, useEffect } from 'react';
import { auth } from '@/lib';
import AdminDashboard from '@/components/AdminDashboard';

const UserTestLibrary = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  console.log('logcheck1', isAdmin);

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
        <div>
          <SkillHeader title={'Đề thi IELTS'}></SkillHeader>
          <TestLibrary
            pageLoading={pageLoading}
            setPageLoading={setPageLoading}
          />
        </div>
      )}

      {isAdmin && <AdminDashboard />}
    </>
  );
};

export default UserTestLibrary;
