import { store } from '@/store';
import styles from '@/styles/layouts/AuthLayout.module.scss';
import { Provider } from 'react-redux';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <Provider store={store}>
    <div className={styles.container}>
      <div className={styles.star}></div>
      {[...Array(15)].map((_, index) => (
        <div
          className={styles[`meteor-${index + 1}`]}
          key={index}
        ></div>
      ))}

      {children}
    </div>
    /* </Provider> */
  );
}
