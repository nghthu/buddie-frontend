import type { Metadata } from 'next';
import styles from '@/styles/layouts/AuthLayout.module.scss';

export const metadata: Metadata = {
  title: 'Buddy',
  description: 'Học tiếng Anh cùng AI',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <div className={styles.wrapper}>
    //   <img
    //     className={styles.background}
    //     src="/images/star_sky_background.png"
    //     alt="Star sky background"
    //   />
    //   {children}
    // </div>
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
  );
}
