import styles from '@/styles/pages/writing/Writing.module.scss';
import Link from 'next/link';

export default function WritingPage() {
  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.title}>Luyện tập IETLS Writing</h2>

        <div className={styles.landingContainer}>
          <p className={styles.textLanding}>
            Phần thi IELTS Writing gồm 2 phần, hãy lựa chọn phần thi mà bạn muốn
            luyện tập.
          </p>
          <div className={styles.timeContainer}>
            <p className={styles.textLanding}>Chọn thời gian:</p>
            <select className={styles.timeInput}>
              <option value="">Không giới hạn</option>
              <option value="5">5 phút</option>
              <option value="10">10 phút</option>
              <option value="15">15 phút</option>
              <option value="30">30 phút</option>
              <option value="60">60 phút</option>
            </select>
            <p className={styles.textLanding}>phút</p>
          </div>
          <div className={styles.buttonContainer}>
            <Link href="/ielts/writing/practicing?part=1">
              <button className={styles.primaryButton}>
                IELTS Writing Part 1
              </button>
            </Link>
            <Link href="/ielts/writing/practicing?part=2">
              <button className={styles.primaryButton}>
                IELTS Writing Part 2
              </button>
            </Link>
            <Link href="/ielts/writing/practicing?part=all">
              <button className={styles.practiceAllButton}>
                Luyện tập tất cả
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
