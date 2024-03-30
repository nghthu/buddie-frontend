'use client';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, FormProps, Input } from 'antd';
import styles from '@/styles/components/SignupForm.module.scss';

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
  const onFinish: FormProps<SignupProps>['onFinish'] = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed: FormProps<SignupProps>['onFinishFailed'] = (
    errorInfo
  ) => {
    console.log('Failed:', errorInfo);
  };

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

      <Form.Item style={{ marginBottom: '0px' }}>
        <Button
          type="primary"
          htmlType="submit"
          className={styles['signup-btn']}
        >
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignupForm;
