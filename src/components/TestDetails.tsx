import styles from '@/styles/components/TestDetails.module.scss';
import { Rate } from 'antd';

function getDate(date: string) {
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}
export default function TestDetails({
  user_name,
  rating,
  rating_count,
  update_date,
  submission_count,
}: {
  user_name: string;
  rating: number;
  rating_count: number;
  update_date: string;
  submission_count: number;
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.items}>Đăng bởi: {user_name}</div>
      <div className={styles.items}>
        <div>{rating}</div>
        <Rate
          disabled
          allowHalf
          defaultValue={rating}
        />
        <div>({rating_count}) lượt đánh giá</div>
      </div>
      <div className={styles.items}>
        <div>Ngày cập nhật: {getDate(update_date)}</div>
      </div>
      <div className={styles.items}>
        <div>{submission_count} lượt thi</div>
      </div>
    </div>
  );
}
