'use client';

import { Button, Modal } from 'antd';
import styles from '@/styles/components/GoogleSignInButton.module.scss';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '@/lib';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface GoogleSignInButtonProps {
  text: string;
}

const GoogleSignInButton = ({ text }: GoogleSignInButtonProps) => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const [modal, modalContextHolder] = Modal.useModal();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      console.error(error.message);
      if (error.code === 'auth/account-exists-with-different-credential') {
        showErrorModal('Email đã được đăng ký bằng phương thức khác.');
        return;
      }
      showErrorModal(error.message);
    }
  }, [error]);

  const showErrorModal = (error: string) => {
    modal.error({
      title: 'Lỗi đăng nhập Google',
      content: error,
    });
  };

  return (
    <>
      {modalContextHolder}
      <Button
        className={styles['google-btn']}
        onClick={() => signInWithGoogle()}
        icon={
          <img
            src="/images/google.svg"
            alt="Google"
            className={styles['google-logo']}
          />
        }
      >
        {text}
      </Button>
    </>
  );
};

export default GoogleSignInButton;
