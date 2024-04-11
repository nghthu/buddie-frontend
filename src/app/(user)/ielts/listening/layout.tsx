import Card from '@/components/Card';
import styles from '@/styles/pages/IeltsLayout.module.scss';

const ListeningLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <h2 className={styles.header}>Luyện tập Ielts Listening</h2>
      <Card
        width="97%"
        height="auto"
        className={styles.container}
      >
        {children}
      </Card>
    </>
  );
};

export default ListeningLayout;
