'use client';

import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, FormProps, Input, Space } from 'antd';
import { FirebaseError } from 'firebase/app';
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
  useSignInWithEmailAndPassword,
  useSendEmailVerification,
  useSignOut,
} from 'react-firebase-hooks/auth';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/components/SignupForm.module.scss';
import { auth } from '@/lib';
import { DefaultUserProfile } from '@/utils';
import { ResponseData, ResponseStatus, UserCustomClaims } from '@/common';

export interface SignupProps {
  full_name?: string;
  email?: string;
  password?: string;
}

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
const fullNameRegex = /^(?=.{1,50}$)[A-Za-z]+(?:\s[A-Za-z]+)*$/;

const SignupForm = () => {
  const [form] = Form.useForm<SignupProps>();
  const [createUserWithEmailAndPassword, createdUser, creating, createError] =
    useCreateUserWithEmailAndPassword(auth);
  const [updateProfile, updating, updateError] = useUpdateProfile(auth);
  const [signInWithEmailAndPassword, , signInLoading, signInError] =
    useSignInWithEmailAndPassword(auth);
  const [sendEmailVerification] = useSendEmailVerification(auth);
  const [updateClaimsError, setUpdateClaimsError] = useState<Error | null>(
    null
  );
  const [logout, logoutLoading] = useSignOut(auth);
  const router = useRouter();

  const errors = [createError, updateError, signInError, updateClaimsError];
  const existingError = errors.some((error) => {
    if (
      !error ||
      (error instanceof FirebaseError &&
        error.code === 'auth/popup-closed-by-user')
    ) {
      return false;
    }

    return true;
  });

  const updateUserProfile = useCallback(
    async (fullName: string) => {
      const updateProfileResult = await updateProfile({
        displayName: fullName,
        photoURL: createdUser?.user.photoURL || DefaultUserProfile.AVATAR,
      });

      if (!updateProfileResult) {
        return false;
      }

      const token = await createdUser?.user.getIdToken();

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
    [updateProfile, setUpdateClaimsError, createdUser?.user]
  );

  useEffect(() => {
    if (createdUser) {
      const { full_name: fullName } =
        form.getFieldsValue() as Required<SignupProps>;

      updateUserProfile(fullName).then(async (updateResult: boolean) => {
        if (!updateError && !updateClaimsError && updateResult) {
          await sendEmailVerification();
        } else {
          await logout();
        }
      });
    }
  }, [
    createdUser,
    updateUserProfile,
    sendEmailVerification,
    form,
    signInWithEmailAndPassword,
    router,
    updateClaimsError,
    updateError,
    logout,
  ]);

  const onFinish: FormProps<SignupProps>['onFinish'] = (values) => {
    const { email, password } = values as Required<SignupProps>;
    createUserWithEmailAndPassword(email, password);
  };

  return (
    <Form
      form={form}
      className={styles.form}
      onFinish={onFinish}
      size="large"
    >
      <h1 className={styles.title}>Đăng ký</h1>

      <Form.Item
        name="full_name"
        rules={[
          {
            required: true,
            message: 'Họ tên không được bỏ trống.',
          },
          () => ({
            validator(_, value) {
              if (!value || fullNameRegex.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(
                  'Họ tên chứa tối đa 50 ký tự, bắt đầu bằng chữ cái, có thể chứa dấu cách, không được chứa thêm ký tự khác.'
                )
              );
            },
          }),
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          type="text"
          placeholder="Họ tên"
        />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Email không được bỏ trống.' },
          () => ({
            validator(_, value) {
              if (!value || emailRegex.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Định dạng email không hợp lệ!'));
            },
          }),
        ]}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder="Email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Mật khẩu không được bỏ trống.',
          },
          () => ({
            validator(_, value) {
              if (!value || passwordRegex.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(
                  'Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm số, chữ thường và chữ in hoa.'
                )
              );
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Mật khẩu"
        />
      </Form.Item>

      <Form.Item hidden={!existingError}>
        <Space
          direction="vertical"
          className={styles['alert-space']}
          size="middle"
        >
          {errors.map((error, index) => {
            if (!error) {
              return;
            }
            console.error(error);

            let message = error?.message;
            if ('code' in error && error.code === 'auth/email-already-in-use') {
              message = 'Email đã tồn tại';
            }

            return (
              <Alert
                key={index}
                className={styles.alert}
                message={message}
                type="error"
                showIcon
              />
            );
          })}
        </Space>
      </Form.Item>

      <Form.Item style={{ marginBottom: '0px' }}>
        <Button
          type="primary"
          htmlType="submit"
          className={styles['signup-btn']}
          loading={creating || updating || signInLoading || logoutLoading}
        >
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignupForm;
