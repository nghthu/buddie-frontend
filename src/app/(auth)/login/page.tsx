import { Button, Divider, Form, FormProps, Input } from 'antd';
import styles from '@/styles/pages/Login.module.scss';
import LoginForm from '@/components/LoginForm';

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
      <Button
        className={styles['third-party-login-btn']}
        icon={
          <img
            src="/images/google.svg"
            alt="Google"
            className={styles['third-party-logo']}
          />
        }
      >
        Đăng nhập với Google
      </Button>
      <Button
        className={styles['third-party-login-btn']}
        icon={
          <img
            src="/images/facebook.svg"
            alt="Facebook"
            className={styles['third-party-logo']}
          />
        }
      >
        Đăng nhập với Facebook
      </Button>
      <div className={styles['to-signup-wrapper']}>
        Chưa có tài khoản?{' '}
        <Button
          type="link"
          className={styles['to-signup']}
        >
          Đăng ký
        </Button>
      </div>
    </main>
  );
};

export default Login;
