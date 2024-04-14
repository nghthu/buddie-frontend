import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import styles from '@/styles/pages/ForgotPassword.module.scss';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Quên mật khẩu - Buddie',
  description: 'Quên mật khẩu tài khoản Buddie',
};

const ForgotPassword = () => {
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

      <ForgotPasswordForm />
      <Link href="/login">
        <Button
          type="link"
          icon={<LeftOutlined />}
          className={styles['to-login']}
        >
          Quay lại trang đăng nhập
        </Button>
      </Link>
    </main>
  );
};

export default ForgotPassword;
