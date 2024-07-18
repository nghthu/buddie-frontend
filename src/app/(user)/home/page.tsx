'use client';

import styles from '@/styles/pages/home/Home.module.scss';
import {
  RightOutlined,
  SoundFilled,
  AudioFilled,
  ReadFilled,
  EditFilled,
} from '@ant-design/icons';
import { Button } from 'antd';
import clsx from 'clsx';
import Link from 'next/link';
import { defaults } from 'chart.js/auto';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = 'start';
// defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = 'black';

import revenueData from './revenueData.json';
import sourceData from './sourceData.json';
import Footer from '@/components/Footer';

const Home = () => {
  const dateChangeHandler: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };

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
        <div className={styles.headerContainer}>
          <h1> Kết quả luyện thi gần đây</h1>
          <Link href={'/tests/history'}>
            <p>Xem tất cả</p>
          </Link>
        </div>

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

      <div className={styles.statistic}>
        <DatePicker
          onChange={dateChangeHandler}
          picker="month"
          className={styles.datePicker}
        />
        <div className={clsx(styles.dataCard, styles.timeSpendCard)}>
          <Line
            data={{
              labels: revenueData.map((data) => data.label),
              datasets: [
                {
                  label: 'Thời gian làm bài',
                  data: revenueData.map((data) => data.revenue),
                  backgroundColor: '#064FF0',
                  borderColor: '#064FF0',
                },
                {
                  label: 'Số bài thi',
                  data: revenueData.map((data) => data.cost),
                  backgroundColor: '#FF3030',
                  borderColor: '#FF3030',
                },
              ],
            }}
            options={{
              elements: {
                line: {
                  tension: 0.3,
                },
              },
              plugins: {
                title: {
                  text: 'Thời gian làm bài và số bài thi',
                },
              },
            }}
          />
        </div>

        <div className={clsx(styles.dataCard, styles.skillTimeCard)}>
          <Doughnut
            data={{
              labels: sourceData.map((data) => data.label),
              datasets: [
                {
                  label: 'Phần trăm',
                  data: sourceData.map((data) => data.value),
                  backgroundColor: [
                    'rgba(43, 63, 229, 0.8)',
                    'rgba(250, 192, 19, 0.8)',
                    'rgba(253, 135, 135, 0.8)',
                  ],
                  borderColor: [
                    'rgba(43, 63, 229, 0.8)',
                    'rgba(250, 192, 19, 0.8)',
                    'rgba(253, 135, 135, 0.8)',
                  ],
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  text: 'Tỉ lệ làm bài theo kỹ năng',
                },
              },
            }}
          />
        </div>

        <div className={clsx(styles.dataCard, styles.buddieSupportCard)}>
          <Bar
            data={{
              labels: sourceData.map((data) => data.label),
              datasets: [
                {
                  label: 'Số lượng',
                  data: sourceData.map((data) => data.value),
                  backgroundColor: [
                    'rgba(43, 63, 229, 0.8)',
                    'rgba(250, 192, 19, 0.8)',
                    'rgba(253, 135, 135, 0.8)',
                  ],
                  borderRadius: 5,
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  text: 'Buddie Support đã sử dụng',
                },
              },
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
