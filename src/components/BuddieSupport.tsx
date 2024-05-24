import Card from '@/components/Card';
import styles from '@/styles/components/BuddieSupport.module.scss';
import { auth } from '@/lib';

const BuddieSupport = (props: {
  requests?: Array<{ request: string; avatar: string; response: string }>;
  setRequests: (requests: Array<{ request: string; avatar: string; response: string }>) => void;
  isProcessing?: boolean;
  setIsProcessing?: (isProcessing: boolean) => void;
}) => {
  const user = auth.currentUser;
  const translateHandler = async (chatResponse: string) => {
    props.setIsProcessing && props.setIsProcessing(true);
    let request = {
      avatar: user?.photoURL || '',
      request: `Dịch câu trả lời trên`,
      response: "Đang dịch... Đợi Buddie chút nhé!",
    };

    let newRequests = [...(props.requests || []), request];
    props.setRequests(newRequests);

    const token = await user?.getIdToken();

    const response = await fetch('/api/ai/translate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        target_lang: 'vi',
        content: chatResponse,
      }),
    });

    const result = await response.json();

    newRequests[newRequests.length - 1].response = result.data.translated;
    props.setRequests(newRequests);

    props.setIsProcessing && props.setIsProcessing(false);
  };

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
              {!props.isProcessing && (
                <img
                  className={styles.translate}
                  title="Dịch"
                  src="/images/translation.png"
                  onClick={() => translateHandler(chat.response)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BuddieSupport;
