import { Button, Divider } from 'antd';
import styles from '@/styles/pages/Signup.module.scss';
import SignupForm from '@/components/SignupForm';

import type { Metadata } from 'next';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import FacebookSignInButton from '@/components/FacebookSignInButton';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Đăng ký - Buddie',
  description: 'Đăng ký tài khoản Buddie',
};

const Signup = () => {
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

      <SignupForm />
      <Divider
        plain
        orientationMargin={10}
      >
        hoặc
      </Divider>
      <GoogleSignInButton text="Đăng ký bằng Google" />
      <FacebookSignInButton text="Đăng ký bằng Facebook" />
      <div className={styles['to-login-wrapper']}>
        Đã có tài khoản?
        <Link href="login">
          <Button
            type="link"
            className={styles['to-login']}
          >
            Đăng nhập
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default Signup;
