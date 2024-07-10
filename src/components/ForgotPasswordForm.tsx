'use client';

import { MailOutlined } from '@ant-design/icons';
import { Alert, Button, Form, FormProps, Input } from 'antd';
import styles from '@/styles/components/ForgotPasswordForm.module.scss';
import { auth } from '@/lib';
import {
  useAuthState,
  useSendPasswordResetEmail,
} from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface ForgotPasswordProps {
  email?: string;
}

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

const ForgotPasswordForm = () => {
  const [form] = Form.useForm<ForgotPasswordProps>();
  const [authStateUser] = useAuthState(auth);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (authStateUser) {
      router.replace('/ielts');
    }
  }, [authStateUser, router]);

  const onFinish: FormProps<ForgotPasswordProps>['onFinish'] = async (
    values
  ) => {
    const { email } = values as Required<ForgotPasswordProps>;
    const sendSuccessfully = await sendPasswordResetEmail(email);
    if (sendSuccessfully) {
      setSuccess(true);
    } else {
      setSuccess(false);
    }
  };

  if (error) {
    console.error(error.message);
  }

  return (
    <Form
      form={form}
      onFinish={onFinish}
      className={styles.form}
      size="large"
    >
      <h1 className={styles.title}>Quên mật khẩu</h1>

      <p className={styles.hint}>
        Nhập địa chỉ email và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại
        mật khẩu.
      </p>

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

      {!sending && error && (
        <Form.Item>
          <Alert
            className={styles.alert}
            message={error.message}
            type="error"
            showIcon
          />
        </Form.Item>
      )}

      {!sending && success && (
        <Form.Item>
          <Alert
            className={styles.alert}
            message="Gửi liên kết đặt lại mật khẩu thành công!"
            type="success"
            showIcon
          />
        </Form.Item>
      )}

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={sending}
          className={styles['submit-btn']}
        >
          Gửi
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ForgotPasswordForm;
