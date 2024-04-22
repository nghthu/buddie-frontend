'use client';

import styles from '@/styles/components/FacebookSignInButton.module.scss';
import {
  useSendEmailVerification,
  useSignInWithFacebook,
} from 'react-firebase-hooks/auth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Modal } from 'antd';
import { auth } from '@/lib';
import { User, getAdditionalUserInfo } from 'firebase/auth';
import { ResponseData, ResponseStatus, UserCustomClaims } from '@/common';
import { FirebaseError } from 'firebase/app';

interface FacebookSignInButtonProps {
  text: string;
}

const FacebookSignInButton = ({ text }: FacebookSignInButtonProps) => {
  const [signInWithFacebook, , , signInError] = useSignInWithFacebook(auth);
  const [modal, modalContextHolder] = Modal.useModal();
  const [updateClaimsError, setUpdateClaimsError] = useState<Error | null>(
    null
  );
  const [sendEmailVerification] = useSendEmailVerification(auth);

  const errors = useMemo(
    () => [signInError, updateClaimsError],
    [signInError, updateClaimsError]
  );

  const signIn = async () => {
    signInWithFacebook().then(async (userCredential) => {
      if (userCredential && getAdditionalUserInfo(userCredential)?.isNewUser) {
        await sendEmailVerification();
        await updateClaims(userCredential.user);
      }
    });
  };

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

  const showErrorModal = useCallback(
    (error: string) => {
      modal.error({
        title: 'Lỗi đăng nhập Facebook',
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
        className={styles['facebook-btn']}
        onClick={signIn}
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
