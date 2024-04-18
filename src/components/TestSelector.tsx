'use client';

import { Spin, notification } from 'antd';

import { User } from 'firebase/auth';
import { auth } from '@/lib';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
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

export default function TestSelector(props: { skill: string}) {
    const [currentPage, setCurrentPage] = useState(0);
    const user = auth.currentUser;
    const {
        data: tests,
        error,
        isLoading,
    } = useSWR({ url: `/api/tests?limit=10&offset=0`, user }, fetcher);
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
        return <Spin size='large' />
    }

    return(
        <div>
            {contextHolder}
            {JSON.stringify(tests)}
        </div>
    )
}