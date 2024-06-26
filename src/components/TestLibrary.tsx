'use client';

import { Empty, Spin, notification } from 'antd';

import { User } from 'firebase/auth';
import { auth } from '@/lib';
import useSWR from 'swr';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import TestCard from './TestCard';
import { LoadingOutlined } from '@ant-design/icons';
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
  // TODO: Implement infinite scroll and fetch more data and use setTotalPage
  const [totalPage, setTotalPage] = useState(1);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const apiUrl = `/api/tests?page=${totalPage}&search=${searchValue}&isbuddie=false`;
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
      setFilteredTests(rawTests.tests);
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

  // const handleLoad = () => {
  //   setTotalPage((prev) => prev + 1);
  // };
  // useEffect(() => {
  //     handleFilterTests();
  // }, [selectedSkill, searchValue]);

  // TODO: use react inf scroll
  // useEffect(() => {
  //     const scrollElement = scrollRef.current;
  //     if (scrollElement) {
  //         scrollElement.addEventListener('scroll', () => {
  //             if (scrollElement.scrollHeight - scrollElement.scrollTop <= scrollElement.clientHeight) {
  //                 if (totalPage >= (rawTests.pagination.total_count / 10)) {
  //                     return;
  //                 }
  //                 handleLoad();
  //             }
  //         })
  //     }
  //     return () => {
  //         scrollElement?.removeEventListener('scroll', () => { });
  //     }
  // }, [])
  const onSearch: SearchProps['onSearch'] = (value) => {
    // split the search value into an array of words, delimiter is space
    const searchWords = encodeURIComponent(value.trim());
    setSearchValue(searchWords);
  };
  // const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     console.log([e.target.value]);
  //     setSearchValue([e.target.value]);
  // }
  if ((isLoading && filteredTests.length === 0) || props.pageLoading) {
    return <Spin size="default" />;
  }
  const testComponent = filteredTests.map(
    (test: {
      _id: string;
      test_name: string;
      test_type: string;
      user: user;
      review: { star: number; count: number };
      duration: number;
      tags: string[];
      test_recording?: string;
      parts?: { _id: string }[];
    }) => {
      const partIds = test.parts
        ? test.parts.map((part: { _id: string }) => part._id)
        : [];
      return (
        <TestCard
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
        />
      );
    }
  );
  const handleInfScroll = () => {
    if (totalPage < rawTests?.pagination.total_count / 10) {
      setTotalPage((prev) => prev + 1);
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
          hasMore={totalPage < rawTests?.pagination.total_count / 10}
          loader={<h4>Loading...</h4>}
          className={styles.wrapper}
        >
          {testComponent}
        </InfiniteScroll>
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
        {rawTests && totalPage < rawTests.pagination.total_count / 10 && (
          <div className={styles.freeSpace}></div>
        )}
      </div>
    </div>
  );
}
