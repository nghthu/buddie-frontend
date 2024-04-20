'use client';

import { Button, Empty, Select, Spin, notification } from 'antd';

import { User } from 'firebase/auth';
import { auth } from '@/lib';
import useSWR from 'swr';
import { useCallback, useEffect, useRef, useState } from 'react';
import TestCard from './TestCard';
import { LoadingOutlined } from '@ant-design/icons';
import styles from '@/styles/components/TestSelector.module.scss';
import { Input } from 'antd';
import type { SearchProps } from 'antd/es/input/Search';
interface FetchArgs {
    url: string;
    user: User | null;
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

export default function TestSelector(props: { skill: string, text?: string }) {
    const [totalPage, setTotalPage] = useState(1);
    const tests = useRef([]);
    const [filteredTests, setFilteredTests] = useState([]);
    const [searchValue, setSearchValue] = useState<string[]>([]);
    const [selectedSkill, setSelectedSkill] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const user = auth.currentUser;
    const {
        data: rawTests,
        error,
        isLoading,
    } = useSWR({ url: `/api/tests?page=${totalPage}`, user }, fetcher);
    const [notificationApi, contextHolder] = notification.useNotification();

    const handleFilterTests = useCallback(() => {
        const filtered = tests.current.filter((test: { test_type: string, test_name: string, tags: string[] }) => {
            console.log('ok');
            console.log(selectedSkill, searchValue);
            console.log((selectedSkill === '' || test.test_type === selectedSkill));
            return (
                (selectedSkill === '' || test.test_type === selectedSkill) &&
                (searchValue.length === 0 || searchValue.every((word) => test.test_name.toLowerCase().includes(word.toLowerCase()) || test.tags.some(tag => tag.toLowerCase().includes(word.toLowerCase()))))
            )
        });
        setFilteredTests(filtered);
    }, [searchValue, selectedSkill]);

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
            tests.current = [...new Set([...tests.current, ...rawTests.tests])];
            handleFilterTests();
            //setTests((prev) => [...prev, ...rawTests.tests]);
        }
    }, [rawTests]);
    useEffect(() => {
        if (isLoading) {
            scrollRef.current?.style.setProperty('overflow-y', 'hidden');
        } else {
            scrollRef.current?.style.setProperty('overflow-y', 'scroll');
        }

    }, [isLoading]);

    const handleLoad = () => {
        setTotalPage((prev) => prev + 1);
    }
    const handleChange = (value: string) => {
        setSelectedSkill(value);
    }
    useEffect(() => {
        handleFilterTests();
    }, [selectedSkill, searchValue]);

    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        console.log(info?.source, value);
        // split the search value into an array of words, delimiter is space
        const searchWords = value.split(' ');
        setSearchValue(searchWords);
    };
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log([e.target.value]);
        setSearchValue([e.target.value]);
    }
    if (isLoading && tests.current.length === 0) {
        return <Spin size='default' />
    }
    const testComponent = filteredTests.map((test: { _id: string, test_name: string, test_type: string, duration: number, tags: string[], test_recording?: string, parts?: object[] }) => {
        return (
            <TestCard key={test._id} testName={test.test_name} testDuration={test.duration.toString()} testTags={test.tags} testparts={test.parts ? test.parts.length : 0} testSkill={test.test_type} testId={test._id} />
        )
    })
    return (
        <div className={styles.container}>
            {contextHolder}
            <h3>{props.text}</h3>
            <div className={styles.control}>
                <Search placeholder="Nhập từ khóa cần tìm" onSearch={onSearch} style={{ width: 300 }} />
                <Select defaultValue='' options={[
                    {
                        value: '',
                        label: 'Tất cả bài thi'
                    },
                    {
                        value: 'ielts_listening',
                        label: 'Listening'
                    },
                    {
                        value: 'ielts_reading',
                        label: 'Reading'
                    },
                    {
                        value: 'ielts_writing',
                        label: 'Writing'
                    },
                    {
                        value: 'ielts_speaking',
                        label: 'Speaking'
                    }
                ]} style={{ width: 200 }} onChange={handleChange} />
            </div>
            <div className={styles.wrapper} ref={scrollRef}>

                {testComponent}
                {testComponent.length===0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không tìm thấy bài thi nào' style={{width:'100%'}}/>}
                {isLoading && <div className={styles.overlay}><Spin size='default' indicator={<LoadingOutlined style={{ fontSize: 100 }} spin />} /></div>}

                {totalPage < (rawTests.pagination.total_count / 10) && <div className={styles.freeSpace}><Button onClick={handleLoad}>Xem thêm bài thi</Button></div>}
            </div>
        </div>
    )
}