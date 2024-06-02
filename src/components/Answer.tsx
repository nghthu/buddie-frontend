import styles from '@/styles/components/Answer.module.scss';
import TextCard from './TextCard';
import clsx from 'clsx';
import { StarOutlined } from '@ant-design/icons';

interface Answer {
  user_id: string;
  content: string;
  is_excellent: boolean;
  _id: string;
  created_at: string;
  user: {
    user_id: string;
    display_name: string;
    photo_url: string;
  };
}

interface Props {
  data: Answer;
}

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const Answer = ({ data }: Props) => {
  const formattedCreateDate = formatDate(data.created_at);

  return (
    <>
      <div className={clsx(styles.post)}>
        <img
          className={styles.avatar}
          src={data.user.photo_url}
        />
        <div className={styles['post-info']}>
          <div className={styles['post-info-user']}>
            <p>{data.user.display_name}</p>
            <p>{formattedCreateDate}</p>
          </div>
          {data.is_excellent && (
            <div className={styles['yellow-card']}>
              <StarOutlined />
              &nbsp;Câu trả lời nổi bật
            </div>
          )}
          <TextCard
            width="100%"
            height="fit-content"
            className={clsx(
              styles['post-text-card'],
              data.is_excellent ? styles.excellent : ''
            )}
          >
            <div className={styles['post-text']}>
              <p>{data.content}</p>
            </div>
          </TextCard>
        </div>
      </div>
    </>
  );
};

export default Answer;
