'use client';

import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, FormProps, Input, Space } from 'antd';
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
  useSignInWithEmailAndPassword,
  useSendEmailVerification,
} from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/components/SignupForm.module.scss';
import { auth } from '@/lib';

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
  const [signInWithEmailAndPassword, signInUser, signInLoading, signInError] =
    useSignInWithEmailAndPassword(auth);
  const [sendEmailVerification, sending, sendingEmailError] =
    useSendEmailVerification(auth);
  const router = useRouter();

  const errors = [createError, updateError, signInError];
  const existingAuthError = createError || updateError || signInError;

  useEffect(() => {
    if (createdUser) {
      updateNameAndSignIn();
    }
  }, [createdUser]);

  const updateNameAndSignIn = async () => {
    const {
      email,
      password,
      full_name: fullName,
    } = form.getFieldsValue() as Required<SignupProps>;

    const updateNameSuccessfully = await updateProfile({
      displayName: fullName,
    });

    if (updateNameSuccessfully) {
      sendEmailVerification();

      signInWithEmailAndPassword(email, password).then((emailSignInUser) => {
        if (emailSignInUser && !emailSignInUser.user.emailVerified) {
          router.push('/verify');
        } else {
          router.push('/profile');
        }
      });
    }
  };

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

      <Form.Item hidden={!existingAuthError}>
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
          loading={creating || updating || signInLoading}
        >
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignupForm;
