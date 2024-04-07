'use client';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Alert, Button, Form, FormProps, Input } from 'antd';
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from 'react-firebase-hooks/auth';
import styles from '@/styles/components/LoginForm.module.scss';
import { auth } from '@/lib';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export interface LoginProps {
  email?: string;
  password?: string;
}

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const LoginForm = () => {
  const [form] = Form.useForm<LoginProps>();
  const [authStateUser, authStateLoading, authStateError] = useAuthState(auth);
  const [signInWithEmailAndPassword, signInUser, signInLoading, signInError] =
    useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const errorMsg =
    signInError?.code === 'auth/invalid-credential'
      ? 'Thông tin đăng nhập không đúng'
      : signInError?.message;

  useEffect(() => {
    if (authStateUser) {
      router.replace('/profile');
    }
  }, [authStateUser]);

  useEffect(() => {
    if (signInUser) {
      router.push('/profile');
    }
  }, [signInUser]);

  const onFinish: FormProps<LoginProps>['onFinish'] = async (values) => {
    const { email, password } = values as Required<LoginProps>;
    await signInWithEmailAndPassword(email, password);
  };

  if (signInError) {
    console.error(signInError.message);
  }

  return (
    <Form
      form={form}
      className={styles.form}
      onFinish={onFinish}
      size="large"
    >
      <h1 className={styles.title}>Đăng nhập</h1>
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
          { required: true, message: 'Mật khẩu không được bỏ trống.' },
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

      <Form.Item hidden={!signInError}>
        <Alert
          className={styles.alert}
          message={errorMsg}
          type="error"
          showIcon
        />
      </Form.Item>

      <Button
        type="link"
        href="/forgot-password"
        className={styles['forgot-password']}
      >
        Quên mật khẩu
      </Button>

      <Form.Item style={{ marginBottom: '0px' }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={signInLoading}
          className={styles['login-btn']}
        >
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
