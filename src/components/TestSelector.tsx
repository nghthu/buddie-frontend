'use client';

import { Empty, Select, Spin, notification } from 'antd';

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
export default function TestSelector(props: {
  pageLoading: boolean;
  setPageLoading: React.Dispatch<SetStateAction<boolean>>;
  skill: string;
  text?: string;
}) {
  // TODO: Implement infinite scroll and fetch more data and use setTotalPage
  const [totalPage, setTotalPage] = useState(1);
  // const tests = useRef([]);
  const [filteredTests, setFilteredTests] = useState<test[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const apiUrl = `/api/tests?page=${totalPage}&test_type=${selectedSkill}&search=${searchValue}&limit=${LIMIT}&isbuddie=true`;
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
      }); // handleFilterTests();
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
  const handleChange = (value: string) => {
    setSelectedSkill(value);
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
        />
      );
    }
  );
  const hasMore = rawTests && totalPage < rawTests.pagination.total_count / 10;
  const handleInfScroll = () => {
    setTotalPage((prev) => prev + LIMIT);
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
        id="infScrollDiv"
      >
        <InfiniteScroll
          dataLength={filteredTests.length}
          scrollableTarget="infScrollDiv"
          scrollThreshold={0.9}
          next={handleInfScroll}
          hasMore={hasMore}
          loader={<Spin size="default" />}
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
