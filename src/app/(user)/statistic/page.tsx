'use client';

import styles from '@/styles/pages/home/Home.module.scss';
import {
  RightOutlined,
  SoundFilled,
  AudioFilled,
  ReadFilled,
  EditFilled,
} from '@ant-design/icons';
import { Button, Spin } from 'antd';
import clsx from 'clsx';
import Link from 'next/link';
import { defaults } from 'chart.js/auto';
import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';
import { Chart as ChartComponent, Doughnut, Bar } from 'react-chartjs-2';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = 'start';
defaults.plugins.title.color = 'black';

import Footer from '@/components/Footer';
import useSWR, { mutate } from 'swr';
import { auth } from '@/lib';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';

interface TimeSpentEntry {
  label: string;
  time_spent: number;
  _id: string;
  submission_count: number;
}

interface SkillEntry {
  label: string;
  value: number;
}

interface GeneralReport {
  user_id: string;
  month: number;
  year: number;
  submission_count: {
    speaking: number;
    reading: number;
    listening: number;
    writing: number;
    custom: number;
  };
  standard_request_count: {
    translate: number;
    speaking_idea: number;
    paraphrase_writing: number;
    assess_writing: number;
    synonyms: number;
    paraphrase_reading: number;
    generate_heading: number;
  };
  pro_request_count: {
    assess_speaking: number;
  };
  time_spent_per_day: {
    label: string;
    time_spent: number;
    submission_count: number;
  }[];
  created_at: string;
  updated_at: string;
}

const fetcher = async ({ url, user }: { url: string; user: User | null }) => {
  const token = await user?.getIdToken();
  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

  if (response.status === 'error') {
    throw new Error(response.error.message);
  }

  return response.data;
};

const createDailyData = (
  data: TimeSpentEntry[],
  month: number,
  year: number
): TimeSpentEntry[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyData: TimeSpentEntry[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    dailyData.push({
      label: day.toString(),
      time_spent: 0,
      _id: '',
      submission_count: 0,
    });
  }

  data.forEach((item) => {
    const day = parseInt(item.label);
    if (day >= 1 && day <= daysInMonth) {
      dailyData[day - 1] = {
        ...item,
        label: day.toString(),
      };
    }
  });

  console.log('daily data', dailyData);

  return dailyData;
};

const convertToTitleCase = (str: string) => {
  const words = str.split('_');

  for (let i = 0; i < words.length; i++) {
    words[i] =
      words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }

  const result = words.join(' ');

  return result;
};

const transformObjectToArray = (data: GeneralReport, type: number = 1) => {
  const { standard_request_count, pro_request_count, submission_count } = data;

  let transformedArray = [];
  let sum = 0;
  const timeSpentKeys = Object.keys(submission_count) as Array<
    keyof typeof submission_count
  >;

  timeSpentKeys.forEach((key) => {
    if (typeof submission_count[key] === 'number') {
      sum += submission_count[key] as number;
    }
  });

  const convertToObjectArray = (obj: Record<string, number | string>) => {
    const isPercentage = type === 2;

    const values = Object.entries(obj)
      .filter(([key]) => key !== '_id')
      .map(([key, value]) => ({
        label: convertToTitleCase(key),
        value:
          typeof value === 'number'
            ? isPercentage
              ? ((value as number) / sum) * 100
              : value
            : 0,
      }));

    return values;
  };

  if (type === 1) {
    transformedArray = [
      ...convertToObjectArray(standard_request_count),
      ...convertToObjectArray(pro_request_count),
    ];
  } else {
    console.log('sum', sum);
    transformedArray = [...convertToObjectArray(submission_count)];
  }

  console.log('api data', transformedArray);
  return transformedArray;
};

const Home = () => {
  const user = auth.currentUser;
  const [timeSpentData, setTimeSpentData] = useState<null | TimeSpentEntry[]>(
    null
  );
  const [skillData, setSkillData] = useState<null | SkillEntry[]>(null);
  const [supportData, setSupportData] = useState<null | SkillEntry[]>(null);
  const [monthYear, setMonthYear] = useState<number[]>([7, 2024]);

  const { data, isLoading } = useSWR(
    {
      url: `/api/users/${user?.uid}/reports?month=${monthYear[0]}&year=${monthYear[1]}`,
      user,
    },
    fetcher
  );

  const { data: tests, isLoading: testLoading } = useSWR(
    {
      url: `/api/test-submissions?offset=${0}&limit=3`,
      user,
    },
    fetcher
  );

  console.log('test', tests);
  console.log('data', data);

  useEffect(() => {
    if (data) {
      console.log('data changed', data);
      setTimeSpentData(
        createDailyData(data.time_spent_per_day, data.month, data.year)
      );
      setSkillData(transformObjectToArray(data, 2));
      setSupportData(transformObjectToArray(data, 1));
    }
  }, [data, setTimeSpentData]);

  const dateChangeHandler: DatePickerProps['onChange'] = (date) => {
    setMonthYear([date.month() + 1, date.year()]);
    mutate(
      `/api/users/${user?.uid}/reports?month=${date.month() + 1}&year=${date.year()}`
    );
  };

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes =
      minutes < 10 ? String(minutes) : String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}p${formattedSeconds}s`;
  };

  const totalSpentTime =
    timeSpentData?.reduce((total, data) => total + data.time_spent, 0) ?? 0;

  if (isLoading || testLoading) return <Spin size="large" />;

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
          <Link href={'/ielts'}>
            <div className={styles.skill}>
              <div className={styles.icon}>
                <SoundFilled />
              </div>
              <p>Listening</p>
              <RightOutlined className={styles.arrow} />
            </div>
          </Link>
          <Link href={'/ielts'}>
            <div className={styles.skill}>
              <div className={styles.icon}>
                <ReadFilled />
              </div>
              <p>Reading</p>
              <RightOutlined className={styles.arrow} />
            </div>
          </Link>
          <Link href={'/ielts'}>
            <div className={styles.skill}>
              <div className={styles.icon}>
                <AudioFilled />
              </div>
              <p>Speaking</p>
              <RightOutlined className={styles.arrow} />
            </div>
          </Link>
          <Link href={'/ielts'}>
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
          <h1> Kết quả luyện thi trong tháng</h1>
          <Link href={'/tests/history'}>
            <p>Xem tất cả</p>
          </Link>
        </div>

        <div className={styles.resultContainer}>
          <div className={styles.result}>
            <h1>{formatTime(totalSpentTime)}</h1>
            <p>Tổng thời gian</p>
          </div>

          <div className={styles.result}>
            <h1>
              {timeSpentData?.reduce(
                (total, data) => total + data.submission_count,
                0
              ) ?? 0}
            </h1>
            <p>Bài tập</p>
          </div>
        </div>

        <div className={styles.testContainer}>
          {/* {tests.map((test)=>{
            return 
          })} */}
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
      {isLoading && <Spin size="large" />}
      {!isLoading && (
        <div className={styles.statistic}>
          <DatePicker
            onChange={dateChangeHandler}
            picker="month"
            className={styles.datePicker}
            placeholder="Chọn tháng"
          />
          <div className={clsx(styles.dataCard, styles.timeSpendCard)}>
            <ChartComponent
              data={{
                labels: timeSpentData?.map((data) => data.label),
                datasets: [
                  {
                    label: 'Số bài thi (bài)',
                    data: timeSpentData?.map((data) => data.submission_count),
                    backgroundColor: '#3c9de4',
                    borderColor: '#3c9de4',
                    type: 'line',
                    order: 0,
                    yAxisID: 'y1',
                  },
                  {
                    label: 'Thời gian làm bài (giây)',
                    data: timeSpentData?.map((data) => data.time_spent),
                    backgroundColor: '#ffb2c17f ',
                    borderColor: '#ffb2c17f',
                    order: 1,
                  },
                ],
              }}
              type="bar"
              options={{
                elements: {
                  line: {
                    tension: 0.3,
                  },
                },
                plugins: {
                  title: {
                    text: `Thời gian làm bài và số bài thi ${monthYear[0]}/${monthYear[1]}`,
                    font: {
                      family: 'Lexend',
                      size: 20,
                      style: 'normal',
                      lineHeight: 1.2,
                    },
                  },
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Ngày',
                      color: '#000',
                      font: {
                        family: 'Lexend',
                        size: 15,
                        style: 'normal',
                        lineHeight: 1.2,
                      },
                    },
                  },
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: 'Thời gian làm bài',
                      color: '#000',
                      font: {
                        family: 'Lexend',
                        size: 15,
                        style: 'normal',
                        lineHeight: 1.2,
                      },
                    },
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Số bài thi',
                      color: '#000',
                      font: {
                        family: 'Lexend',
                        size: 15,
                        style: 'normal',
                        lineHeight: 1.2,
                      },
                    },
                    // grid line settings
                    grid: {
                      drawOnChartArea: false, // only want the grid lines for one axis to show up
                    },
                  },
                },
              }}
            />
          </div>

          <div className={clsx(styles.dataCard, styles.skillTimeCard)}>
            <Doughnut
              data={{
                labels: skillData?.map((data) => data.label),
                datasets: [
                  {
                    label: 'Phần trăm',
                    data: skillData?.map((data) => data.value),
                    backgroundColor: [
                      '#4cc4c4',
                      '#ffcd56',
                      '#ff6384',
                      '#36a2eb',
                      '#ff9f40',
                      '#9966cc',
                      '#2cae1d',
                      '#574242',
                    ],
                    borderColor: [
                      '#4cc4c4',
                      '#ffcd56',
                      '#ff6384',
                      '#36a2eb',
                      '#ff9f40',
                      '#9966cc',
                      '#2cae1d',
                      '#574242',
                    ],
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    text: 'Tỉ lệ số bài làm theo kỹ năng',
                    font: {
                      family: 'Lexend',
                      size: 20,
                      style: 'normal',
                      lineHeight: 1.2,
                    },
                  },
                },
              }}
            />
          </div>

          <div className={clsx(styles.dataCard, styles.buddieSupportCard)}>
            <Bar
              data={{
                labels: supportData?.map((data) => data.label),
                datasets: [
                  {
                    label: 'Số lượng',
                    data: supportData?.map((data) => data.value),
                    backgroundColor: ['#4cc4c4'],
                    borderRadius: 5,
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    text: 'Buddie Support đã sử dụng',
                    font: {
                      family: 'Lexend',
                      size: 20,
                      style: 'normal',
                      lineHeight: 1.2,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Home;
