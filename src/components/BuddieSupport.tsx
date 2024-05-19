import Card from '@/components/Card';
import styles from '@/styles/components/BuddieSupport.module.scss';

const BuddieSupport = (props: {
  requests?: Array<{ request: string; avatar: string; response: string }>;
}) => {
  const translateHandler = () => {};

  return (
    <Card
      width="300px"
      height="80vh"
      showCloseButton
      backgroundColor="#ECEEF9"
      className={styles['chat-box']}
    >
      <div className={styles.container}>
        {props.requests?.map((chat, index) => (
          <div key={index}>
            <div className={styles.chat}>
              <div className={styles.user}>
                <img src={chat.avatar} />
                <p>Bạn</p>
              </div>
              <p>{chat.request}</p>
            </div>
            <div className={styles.chat}>
              <div className={styles.buddie}>
                <div className={styles['buddie-avatar']}>
                  <img src="/images/logo/main.svg" />
                </div>
                <p>Buddie</p>
              </div>
              <p>{chat.response}</p>
              <img
                className={styles.translate}
                title="Dịch"
                src="/images/translation.png"
                onClick={translateHandler}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BuddieSupport;
