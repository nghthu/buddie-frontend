
import Card from '@/components/Card';
import styles from '@/styles/components/BuddieSuport.module.scss';

const BuddieSuport = () => {
  const DUMMY_REQUESTS = [
    {
      request: 'Tóm tắt',
      avatar: '/images/avatar.jpg',
      response:
        'The graph illustrates the fluctuating number of tourists visiting a Caribbean island from 2010 to 2017, with an overall upward trend, peaking in 2015 possibly due to factors such as marketing campaigns or infrastructure improvements.',
    },
    {
      request: 'Tóm tắt',
      avatar: '/images/avatar.jpg',
      response:
        'The graph illustrates the fluctuating number of tourists visiting a Caribbean island from 2010 to 2017, with an overall upward trend, peaking in 2015 possibly due to factors such as marketing campaigns or infrastructure improvements.',
    },
    {
      request: 'Tóm tắt',
      avatar: '/images/avatar.jpg',
      response:
        'The graph illustrates the fluctuating number of tourists visiting a Caribbean island from 2010 to 2017, with an overall upward trend, peaking in 2015 possibly due to factors such as marketing campaigns or infrastructure improvements.',
    },
    {
      request: 'Tóm tắt',
      avatar: '/images/avatar.jpg',
      response:
        'The graph illustrates the fluctuating number of tourists visiting a Caribbean island from 2010 to 2017, with an overall upward trend, peaking in 2015 possibly due to factors such as marketing campaigns or infrastructure improvements.',
    },
    {
      request: 'Tóm tắt',
      avatar: '/images/avatar.jpg',
      response:
        'The graph illustrates the fluctuating number of tourists visiting a Caribbean island from 2010 to 2017, with an overall upward trend, peaking in 2015 possibly due to factors such as marketing campaigns or infrastructure improvements.',
    },
    {
      request: 'Tóm tắt',
      avatar: '/images/avatar.jpg',
      response:
        'The graph illustrates the fluctuating number of tourists visiting a Caribbean island from 2010 to 2017, with an overall upward trend, peaking in 2015 possibly due to factors such as marketing campaigns or infrastructure improvements.',
    },
  ];

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
        {DUMMY_REQUESTS.map((chat, index) => (
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
                  <img src="/images/logo.png" />
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

export default BuddieSuport;
