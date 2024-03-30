import { Button, Divider, Form, FormProps, Input } from 'antd';
import styles from '@/styles/pages/Signup.module.scss';
import SignupForm from '@/components/SignupForm';

const Signup = () => {
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

      <SignupForm />
      <Divider
        plain
        orientationMargin={10}
      >
        hoặc
      </Divider>
      <Button
        className={styles['third-party-signup-btn']}
        icon={
          <img
            src="/images/google.svg"
            alt="Google"
            className={styles['third-party-logo']}
          />
        }
      >
        Đăng ký bằng Google
      </Button>
      <Button
        className={styles['third-party-signup-btn']}
        icon={
          <img
            src="/images/facebook.svg"
            alt="Facebook"
            className={styles['third-party-logo']}
          />
        }
      >
        Đăng ký bằng Facebook
      </Button>
      <div className={styles['to-login-wrapper']}>
        Đã có tài khoản?{' '}
        <Button
          type="link"
          href="/login"
          className={styles['to-login']}
        >
          Đăng nhập
        </Button>
      </div>
    </main>
  );
};

export default Signup;
