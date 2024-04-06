import { Button, Divider } from 'antd';
import styles from '@/styles/pages/Login.module.scss';
import LoginForm from '@/components/LoginForm';

import type { Metadata } from 'next';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import FacebookSignInButton from '@/components/FacebookSignInButton';

export const metadata: Metadata = {
  title: 'Đăng nhập - Buddie',
  description: 'Đăng nhập vào Buddie',
};

const Login = () => {
  return (
    <main className={styles.main}>
      <div className={styles.logo}>
        <img
          src="/images/logo.png"
          alt="buddie-logo"
          className={styles['logo-img']}
        />
        <h2 className={styles['logo-text']}>buddie</h2>
      </div>

      <LoginForm />
      <Divider
        plain
        orientationMargin={10}
      >
        hoặc
      </Divider>
      <GoogleSignInButton text="Đăng nhập bằng Google" />
      <FacebookSignInButton text="Đăng nhập bằng Facebook" />
      <div className={styles['to-signup-wrapper']}>
        Chưa có tài khoản?{' '}
        <Button
          type="link"
          href="/signup"
          className={styles['to-signup']}
        >
          Đăng ký
        </Button>
      </div>
    </main>
  );
};

export default Login;
