import styles from '@/styles/components/PartSelector.module.scss';
import { Button } from 'antd';
import Link from 'next/link';

export default function PartSelector({ parts, testId }: { parts: { index: string | number, time: string }[], testId: string }) {
    return (
        <div className={styles.wrapper}>
            <h3>Chọn phần thi</h3>
            <div className={styles.partSelectorWrapper}>
                {parts.map((p, index) => (
                    <Link href={`tests/${testId}/${p.index}`} key={index}>
                        <div className={styles.items}>
                            <div>Phần {p.index}</div>
                            <div>Thời gian: {p.time} phút</div>
                        </div>
                    </Link>
                ))}
            </div>
            <Button type="primary">Làm tất cả</Button>
        </div>
    );
}