'use client';

import styles from '@/styles/components/FacebookSignInButton.module.scss';
import { useSignInWithFacebook } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button, Modal } from 'antd';
import { auth } from '@/lib';

interface FacebookSignInButtonProps {
  text: string;
}

const FacebookSignInButton = ({ text }: FacebookSignInButtonProps) => {
  const [signInWithFacebook, user, loading, error] =
    useSignInWithFacebook(auth);
  const [modal, modalContextHolder] = Modal.useModal();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/verify');
    }
  }, [user, router]);

  const showErrorModal = (error: string) => {
    modal.error({
      title: 'Lỗi đăng nhập Facebook',
      content: error,
    });
  };

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

  return (
    <>
      {modalContextHolder}
      <Button
        className={styles['facebook-btn']}
        onClick={() => signInWithFacebook()}
        icon={
          <img
            src="/images/facebook.svg"
            alt="Facebook"
            className={styles['facebook-logo']}
          />
        }
      >
        {text}
      </Button>
    </>
  );
};

export default FacebookSignInButton;
