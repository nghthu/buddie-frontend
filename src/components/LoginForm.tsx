'use client';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, FormProps, Input } from 'antd';
import styles from '@/styles/components/LoginForm.module.scss';

type LoginFieldType = {
  email?: string;
  password?: string;
};

const LoginForm = () => {
  const onFinish: FormProps<LoginFieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed: FormProps<LoginFieldType>['onFinishFailed'] = (
    errorInfo
  ) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      className={styles.form}
      onFinish={onFinish}
      size="large"
      onFinishFailed={onFinishFailed}
    >
      <h1 className={styles.title}>Đăng nhập</h1>
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Email không được bỏ trống' }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Mật khẩu không được bỏ trống' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Mật khẩu"
        />
      </Form.Item>
      <Button
        type="link"
        className={styles['forgot-password']}
      >
        Quên mật khẩu
      </Button>

      <Form.Item style={{ marginBottom: '0px' }}>
        <Button
          type="primary"
          htmlType="submit"
          className={styles['login-btn']}
        >
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
