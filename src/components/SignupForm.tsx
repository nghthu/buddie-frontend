'use client';

import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, FormProps, Input, message } from 'antd';
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
  useSignInWithEmailAndPassword,
  useSendEmailVerification,
} from 'react-firebase-hooks/auth';
import styles from '@/styles/components/SignupForm.module.scss';
import { auth } from '@/lib/firebase';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const [signInWithEmailAndPassword, signedInUser, signingIn, signInError] =
    useSignInWithEmailAndPassword(auth);
  const [updateNameSuccessfully, setUpdateNameSuccessfully] = useState(false);
  const router = useRouter();
  const [sendEmailVerification, sending, sendingEmailError] =
    useSendEmailVerification(auth);

  const isEmailExists = useMemo(() => {
    if (createError?.code === 'auth/email-already-in-use') {
      return true;
    }
    return false;
  }, [createError]);

  useEffect(() => {
    if (createdUser) {
      updateProfile({
        displayName: form.getFieldValue('full_name'),
      }).then((updateNameSuccessfully) => {
        if (updateNameSuccessfully) {
          sendEmailVerification();
          setUpdateNameSuccessfully(true);
        } else {
          setUpdateNameSuccessfully(false);
        }
      });
    }
  }, [createdUser]);

  useEffect(() => {
    if (updateNameSuccessfully) {
      signInWithEmailAndPassword(
        form.getFieldValue('email'),
        form.getFieldValue('password')
      ).then((signedInUser) => {
        if (signedInUser && !signedInUser.user.emailVerified) {
          router.push('/verify');
        } else {
          router.push('/');
        }
      });
    }
  }, [updateNameSuccessfully]);

  const onFinish: FormProps<SignupProps>['onFinish'] = (values) => {
    const { email, password } = values as Required<SignupProps>;
    createUserWithEmailAndPassword(email, password);
  };

  const onFinishFailed: FormProps<SignupProps>['onFinishFailed'] = (
    errorInfo
  ) => {
    console.error('Sign up failed:', errorInfo);
  };

  if (createError) {
    console.error(createError.message);
  }

  if (updateError) {
    console.error(updateError.message);
  }

  if (signInError) {
    console.error(signInError.message);
  }

  if (sendingEmailError) {
    console.error(sendingEmailError.message);
  }

  return (
    <Form
      form={form}
      className={styles.form}
      onFinish={onFinish}
      size="large"
      onFinishFailed={onFinishFailed}
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

      <Form.Item hidden={!isEmailExists}>
        <Alert
          className={styles.alert}
          message="Email đã tồn tại"
          type="error"
          showIcon
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: '0px' }}>
        <Button
          type="primary"
          htmlType="submit"
          className={styles['signup-btn']}
          loading={creating || updating || signingIn}
        >
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignupForm;
