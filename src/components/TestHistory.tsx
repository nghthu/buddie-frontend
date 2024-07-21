'use client';

import { Button, Empty, Select, Spin, notification } from 'antd';

import { User } from 'firebase/auth';
import { auth } from '@/lib';
import useSWR from 'swr';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import styles from '@/styles/components/TestSelector.module.scss';
import { Input } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import Link from 'next/link';
interface FetchArgs {
  url: string;
  user: User | null;
}

interface TestSubmission {
  _id: string;
  test: Test;
  correct_answer_count: number;
  question_count: number;
  time_spent: number;
}

interface Test {
  test_name: string;
  duration: number;
  _id: string;
}

const fetcher = async ({ url, user }: FetchArgs) => {
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
const { Search } = Input;

export default function TestLibrary(props: {
  pageLoading: boolean;
  setPageLoading: React.Dispatch<SetStateAction<boolean>>;
  text?: string;
}) {
  const [totalPage] = useState(1);
  const [filteredTests, setFilteredTests] = useState([]);
  // const [searchValue, setSearchValue] = useState('');
  // const [selectedSkill, setSelectedSkill] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const apiUrl = `/api/test-submissions?offset=${0}&limit=20`;
  const user = auth.currentUser;
  const {
    data: rawTests,
    error,
    isLoading,
  } = useSWR({ url: apiUrl, user }, fetcher);
  const [notificationApi, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (error) {
      notificationApi.error({
        message: 'Error',
        description: error?.message,
      });
    }
  }, [error, notificationApi]);

  useEffect(() => {
    if (rawTests) {
      console.log(rawTests);
      setFilteredTests(rawTests.test_submissions);
    }
  }, [rawTests]);

  useEffect(() => {
    if (isLoading) {
      scrollRef.current?.style.setProperty('overflow-y', 'hidden');
    } else {
      scrollRef.current?.style.setProperty('overflow-y', 'scroll');
    }
  }, [isLoading]);

  const onSearch: SearchProps['onSearch'] = (value) => {
    const searchWords = encodeURIComponent(value.trim());
    console.log(searchWords);
    // setSearchValue(searchWords);
  };

  const handleChange = (value: string) => {
    // setSelectedSkill(value);
    console.log(value);
  };

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes =
      minutes < 10 ? String(minutes) : String(minutes).padStart(2, '0');

    const formattedSeconds =
      seconds < 10 ? String(seconds) : String(seconds).padStart(2, '0');

    if (Number(formattedMinutes) === 0) return `${formattedSeconds}s`;
    if (Number(formattedSeconds) === 0) return `${formattedMinutes} phút`;
    return `${formattedMinutes}p${formattedSeconds}s`;
  };

  if ((isLoading && filteredTests.length === 0) || props.pageLoading) {
    return <Spin size="default" />;
  }
  console.log(rawTests);
  const testComponent = filteredTests.map((submission: TestSubmission) => {
    return (
      <div
        key={submission._id}
        className={styles.test}
      >
        <div>
          <h1>{submission.test.test_name}</h1>
          <div>
            <p className={styles.score}>
              {submission.correct_answer_count}/{submission.question_count} Câu
              đúng
            </p>
            <p>
              {formatTime(submission.time_spent)}/
              {formatTime(submission.test.duration)}
            </p>
          </div>
        </div>

        <Link
          href={`/result?testId=${submission.test._id}&testSubmissionId=${submission._id}&part=all`}
        >
          <Button className={styles.detailButton}>Chi tiết</Button>
        </Link>
      </div>
    );
  });
  return (
    <div className={styles.container}>
      {contextHolder}
      <p>{props.text}</p>
      <div className={styles.control}>
        <Search
          placeholder="Nhập từ khóa cần tìm"
          onSearch={onSearch}
          style={{ width: 300 }}
        />
        <Select
          defaultValue=""
          options={[
            {
              value: '',
              label: 'Tất cả bài thi',
            },
            {
              value: 'ielts_listening',
              label: 'Listening',
            },
            {
              value: 'ielts_reading',
              label: 'Reading',
            },
            {
              value: 'ielts_writing',
              label: 'Writing',
            },
            {
              value: 'ielts_speaking',
              label: 'Speaking',
            },
          ]}
          style={{ width: 200 }}
          onChange={handleChange}
        />
      </div>
      <div
        className={styles.wrapper}
        ref={scrollRef}
      >
        {testComponent}
        {testComponent.length === 0 && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không tìm thấy bài thi nào"
            style={{ width: '100%' }}
          />
        )}
        {isLoading && (
          <div className={styles.overlay}>
            <Spin
              size="default"
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 100 }}
                  spin
                />
              }
            />
          </div>
        )}
        {rawTests && totalPage < rawTests.pagination.total_count / 8 && (
          <div className={styles.freeSpace}></div>
        )}
      </div>
    </div>
  );
}
