import Link from 'next/link';
import { Button } from 'antd';
import styles from '@/styles/pages/speaking/Speaking.module.scss';

const Speaking = () => {
  return (
    <div className={styles.container}>
      <div className={styles.instruction}>
        <p>
          Phần thi IELTS Speaking gồm 3 phần, hãy lựa chọn phần thi mà bạn muốn
          luyện tập. Hãy nhớ chuẩn bị Micro để có thể thực hiện bài luyện tập
          thật tốt nhé!
        </p>
        <img src="/images/logo.png" />
      </div>
      <div className={styles['btn-group']}>
        <Link href="speaking/part-1">
          <Button>Ielts Speaking part 1</Button>
        </Link>
        <Link href="speaking/part-2">
          <Button>Ielts Speaking part 1</Button>
        </Link>
        <Link href="speaking/part-3">
          <Button>Ielts Speaking part 1</Button>
        </Link>{' '}
      </div>
      <p>Hoặc</p>
      <Link href="speaking/practice-all">
        <Button className={styles['practice-all']}>Luyện tập tất cả</Button>
      </Link>
    </div>
  );
};

export default Speaking;
