import Card from '@/components/Card';
import styles from '@/styles/pages/speaking/Layout.module.scss';

const SpeakingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <h2 className={styles.header}>Luyện tập IELTS Speaking</h2>
      <Card
        width="97%"
        height="75%"
        className={styles.container}
      >
        {children}
      </Card>
    </>
  );
};

export default SpeakingLayout;
