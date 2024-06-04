import styles from '@/styles/components/PartSelector.module.scss';
import { Button } from 'antd';
import Link from 'next/link';

export default function PartSelector({
  parts,
  testId,
}: {
  parts: { index: string | number; time: string }[];
  testId: string;
}) {
  return (
    <div className={styles.wrapper}>
      <h3>Chọn phần thi</h3>
      <div className={styles.partSelectorWrapper}>
        {parts.map((p, index) => (
          <Link
            href={`tests/${testId}/${p.index}`}
            key={index}
          >
            <div className={styles.items}>
              <img
                src="/images/test.svg"
                alt="Google"
                className={styles.testIcon}
              />
              <div>Phần {p.index}</div>
              <div>Thời gian: {Number(p.time) / 60 || 0} phút</div>
            </div>
          </Link>
        ))}
      </div>
      <Link href={`tests/${testId}/all`}>
        <Button type="primary">Làm tất cả</Button>
      </Link>
    </div>
  );
}
