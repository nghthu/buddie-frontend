'use client';
import SkillHeader from "@/components/SkillHeader";
import { Spin, Button, notification } from 'antd';

import { User } from 'firebase/auth';
import { auth } from '@/lib';
import useSWR from 'swr';
import { useEffect, useState } from "react";
import TextCard from "@/components/TextCard";
import TestDetails from "@/components/TestDetails";
import PartSelector from "@/components/PartSelector";
interface test_answer {
    test_id: string,
    parts: {
        _id: string,
        question_groups: {
            _id: string,
            questions: {
                _id: string,
                answer_result: {
                    user_answer: string | string[]
                }
            }[]
        }[]
    }[]
}
interface FetchArgs {
    url: string;
    user: User | null;
}

const fetcher = async ({ url, user }: FetchArgs) => {
    const token = await user?.getIdToken();
    console.log(token);
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

export default function TestLanding({ params, }: { params: { id: string }; }) {
    const [totalPage, setTotalPage] = useState(1);
    const user = auth.currentUser;
    const {
        data: test,
        error,
        isLoading,
    } = useSWR({ url: `/api/tests/${params.id}`, user }, fetcher);
    const [notificationApi, contextHolder] = notification.useNotification();
    useEffect(() => {
        if (error) {
            notificationApi.error({
                message: 'Error',
                description: error?.message,
            });
        }
    }, [error, notificationApi]);
    if (isLoading) {
        return <Spin size="large" />;
    }
    const parts = test?.parts.map((part: { part_duration: number }, index: number) => { return { index: index, time: part.part_duration } }) || [];
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center'
        }}>
            {contextHolder}
            <SkillHeader title={test.test_name} />
            <TextCard width={'90%'} height={'auto'} >
                <TestDetails user_name={test?.user?.display_name || "lorem ipsum"} rating={test?.review.star || 3.2} rating_count={test?.review.count || 13} update_date={test.updated_at || "2024-04-23T06:57:19.523Z"} submission_count={test.submission_count || 100} />
                <PartSelector parts = {parts} testId={params.id}/>
            </TextCard>
        </div>
    )
}