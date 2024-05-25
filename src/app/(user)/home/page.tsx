import styles from '@/styles/pages/home/Home.module.scss';
import {
  RightOutlined,
  SoundFilled,
  AudioFilled,
  ReadFilled,
  EditFilled,
} from '@ant-design/icons';
import { Button } from 'antd';
import Link from 'next/link';

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.ieltsContainer}>
        <div className={styles.banner}>
          <div>
            <h1>Luyện tập IELTS</h1>
            <p>Với sự trợ giúp của AI thông minh</p>
          </div>
          {
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/images/logo/hello.svg"
              alt="hello"
            />
          }
        </div>

        <div className={styles.skillContainer}>
          <Link href={'/ielts/listening'}>
            <div className={styles.skill}>
              <div className={styles.icon}>
                <SoundFilled />
              </div>
              <p>Listening</p>
              <RightOutlined className={styles.arrow} />
            </div>
          </Link>
          <Link href={'/ielts/reading'}>
            <div className={styles.skill}>
              <div className={styles.icon}>
                <ReadFilled />
              </div>
              <p>Reading</p>
              <RightOutlined className={styles.arrow} />
            </div>
          </Link>
          <Link href={'/ielts/speaking'}>
            <div className={styles.skill}>
              <div className={styles.icon}>
                <AudioFilled />
              </div>
              <p>Speaking</p>
              <RightOutlined className={styles.arrow} />
            </div>
          </Link>
          <Link href={'/ielts/writing'}>
            <div className={styles.skill}>
              <div className={styles.icon}>
                <EditFilled />
              </div>
              <p>Writing</p>
              <RightOutlined className={styles.arrow} />
            </div>
          </Link>
        </div>
      </div>

      <div className={styles.historyContainer}>
        <h1> Kết quả luyện thi gần đây</h1>
        <div className={styles.resultContainer}>
          <div className={styles.result}>
            <h1>7h21p</h1>
            <p>Tổng thời gian</p>
          </div>

          <div className={styles.result}>
            <h1>12</h1>
            <p>Bài tập</p>
          </div>

          <div className={styles.result}>
            <h1>85%</h1>
            <p>Điểm trung bình</p>
          </div>
        </div>

        <div className={styles.testContainer}>
          <div className={styles.test}>
            <div>
              <h1>IELTS Simulation Listening Test 1</h1>
              <div>
                <p className={styles.score}>85%</p>
                <p>48/60 phút</p>
              </div>
            </div>

            <Button className={styles.detailButton}>Chi tiết</Button>
          </div>

          <div className={styles.test}>
            <div>
              <h1>IELTS Simulation Listening Test 1</h1>
              <div>
                <p className={styles.score}>85%</p>
                <p>48/60 phút</p>
              </div>
            </div>

            <Button className={styles.detailButton}>Chi tiết</Button>
          </div>

          <div className={styles.test}>
            <div>
              <h1>IELTS Simulation Listening Test 1</h1>
              <div>
                <p className={styles.score}>85%</p>
                <p>48/60 phút</p>
              </div>
            </div>

            <Button className={styles.detailButton}>Chi tiết</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
