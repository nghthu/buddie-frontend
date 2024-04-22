'use client';

import { Button, Modal } from 'antd';
import styles from '@/styles/components/GoogleSignInButton.module.scss';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '@/lib';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { User, getAdditionalUserInfo } from 'firebase/auth';
import { ResponseData, ResponseStatus, UserCustomClaims } from '@/common';

interface GoogleSignInButtonProps {
  text: string;
}

const GoogleSignInButton = ({ text }: GoogleSignInButtonProps) => {
  const [signInWithGoogle, userCredential, , signInError] =
    useSignInWithGoogle(auth);
  const [modal, modalContextHolder] = Modal.useModal();
  const [updateClaimsError, setUpdateClaimsError] = useState<Error | null>(
    null
  );

  const errors = useMemo(
    () => [signInError, updateClaimsError],
    [signInError, updateClaimsError]
  );

  const updateClaims = useCallback(
    async (user: User) => {
      const token = await user.getIdToken();
      const updateClaimsResult = (await fetch('/api/user/claims', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
        .then(async (res) => {
          return await res.json();
        })
        .catch((err) => {
          setUpdateClaimsError(err);
        })) as ResponseData<UserCustomClaims> | undefined;

      if (!updateClaimsResult) {
        return false;
      }

      if (updateClaimsResult.status === ResponseStatus.ERROR) {
        setUpdateClaimsError(new Error('Ối, đã có lỗi xảy ra!'));
        return false;
      }

      setUpdateClaimsError(null);
      return true;
    },
    [setUpdateClaimsError]
  );

  useEffect(() => {
    if (userCredential && getAdditionalUserInfo(userCredential)?.isNewUser) {
      updateClaims(userCredential.user);
    }
  }, [userCredential, updateClaims]);

  const showErrorModal = useCallback(
    (error: string) => {
      modal.error({
        title: 'Lỗi đăng nhập Google',
        content: error,
      });
    },
    [modal]
  );

  useEffect(() => {
    errors.forEach((error) => {
      if (!error) {
        return;
      }

      let errorMessage = error.message;
      if (error instanceof FirebaseError) {
        if (
          error.code === 'auth/cancelled-popup-request' ||
          error.code === 'auth/popup-closed-by-user'
        ) {
          return;
        }

        if (error.code === 'auth/account-exists-with-different-credential') {
          errorMessage = 'Email đã được đăng ký bằng phương thức khác.';
        }
      }

      showErrorModal(errorMessage);
      return;
    });
  }, [errors, showErrorModal]);

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
