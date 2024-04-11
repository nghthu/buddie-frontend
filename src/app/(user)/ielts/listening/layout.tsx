import Card from '@/components/Card';
import styles from '@/styles/pages/IELTSLayout.module.scss';

const ListeningLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <h2 className={styles.header}>Luyện tập IELTS Listening</h2>
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
