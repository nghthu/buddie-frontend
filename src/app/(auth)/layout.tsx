import styles from '@/styles/layouts/AuthLayout.module.scss';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
