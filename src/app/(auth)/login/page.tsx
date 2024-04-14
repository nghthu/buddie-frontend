import { Button, Divider } from 'antd';
import type { Metadata } from 'next';
import styles from '@/styles/pages/Login.module.scss';
import LoginForm from '@/components/LoginForm';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import FacebookSignInButton from '@/components/FacebookSignInButton';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Đăng nhập - Buddie',
  description: 'Đăng nhập vào Buddie',
};

const Login = () => {
  return (
    <main className={styles.main}>
      <div className={styles.logo}>
        <Image
          height={70}
          width={70}
          src="/images/logo/main.svg"
          alt="Buddie logo"
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
        Chưa có tài khoản?
        <Link href="signup">
          <Button
            type="link"
            className={styles['to-signup']}
          >
            Đăng ký
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default Login;
