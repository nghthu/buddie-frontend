'use client';

import { Empty, Spin, notification } from 'antd';

import { User } from 'firebase/auth';
import { auth } from '@/lib';
import useSWR from 'swr';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import TestCard from './TestCard';
import styles from '@/styles/components/TestSelector.module.scss';
import { Input } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from 'next/navigation';

interface FetchArgs {
  url: string;
  user: User | null;
}
interface user {
  user_id: string;
  display_name: string;
  photo_url: string;
}
interface test {
  _id: string;
  test_name: string;
  test_type: string;
  user: user;
  review: { star: number; count: number };
  duration: number;
  tags: string[];
  test_recording?: string;
  parts?: { _id: string }[];
  submission_count: number;
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
const LIMIT = 10;
export default function TestLibrary(props: {
  pageLoading: boolean;
  setPageLoading: React.Dispatch<SetStateAction<boolean>>;
  text?: string;
}) {
  const [offset, setOffset] = useState(0);
  const [filteredTests, setFilteredTests] = useState<test[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const apiUrl = `/api/tests?offset=${offset}&search=${searchValue}&limit=${LIMIT}&isbuddie=false`;
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
      //tests.current = [...new Set([...tests.current, ...rawTests.tests])];

      setFilteredTests((prev) => {
        const seen = new Set();
        const returnRes = [...prev, ...(rawTests.tests ?? [])].filter(
          (test) => {
            if (seen.has(test._id)) return false;
            seen.add(test._id);
            return true;
          }
        );
        
        return returnRes;
      });
      // handleFilterTests();
      // setTests((prev) => [...prev, ...rawTests.tests]);
    }
  }, [rawTests]);
  useEffect(() => {
    if (isLoading) {
      scrollRef.current?.style.setProperty('overflow-y', 'hidden');
    } else {
      scrollRef.current?.style.setProperty('overflow-y', 'scroll');
    }
  }, [isLoading]);

  const refreshTests = () => {
    router.refresh();
  };

  const onSearch: SearchProps['onSearch'] = (value) => {
    // split the search value into an array of words, delimiter is space
    const searchWords = encodeURIComponent(value.trim());
    setOffset(0);
    setSearchValue(searchWords);
    setFilteredTests([]);
  };

  const testComponent = filteredTests.map((test) => {
    const partIds = test.parts
      ? test.parts.map((part: { _id: string }) => part._id)
      : [];
    return (
      <TestCard
        submissionCount={test.submission_count}
        setPageLoading={props.setPageLoading}
        key={test._id}
        testName={test.test_name}
        testDuration={test.duration.toString()}
        testTags={test.tags}
        testSkill={test.test_type}
        testId={test._id}
        partIds={partIds}
        isUserTest={true}
        user={test.user}
        review={test.review}
        refreshParent={refreshTests}
      />
    );
  });
  const handleInfScroll = () => {
    if (offset + LIMIT < rawTests?.pagination?.total_count ?? 0) {
      setOffset((prev) => prev + LIMIT);
    }
  };

  const createTest = () => {
    router.push('/tests/create');
  };

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
        <button
          className={styles['create-question-btn']}
          onClick={createTest}
        >
          Tạo đề thi
        </button>
      </div>
      <div
        className={styles.wrapper}
        ref={scrollRef}
        id="scrollableDiv"
      >
        <InfiniteScroll
          scrollThreshold={0.9}
          scrollableTarget="scrollableDiv"
          dataLength={testComponent.length}
          next={handleInfScroll}
          hasMore={offset + LIMIT < rawTests?.pagination?.total_count ?? 0}
          loader={<h4>Loading...</h4>}
          className={styles.wrapper}
        >
          {(isLoading || props.pageLoading) && (
            <Spin
              size="large"
              style={{
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
              }}
            />
          )}
          {testComponent}
        </InfiniteScroll>
        {testComponent.length === 0 && !(isLoading || props.pageLoading) && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không tìm thấy bài thi nào"
            style={{ width: '100%' }}
          />
        )}
        {offset + LIMIT < (rawTests?.pagination?.total_count ?? 0) && (
          <div className={styles.freeSpace}></div>
        )}
      </div>
    </div>
  );
}
