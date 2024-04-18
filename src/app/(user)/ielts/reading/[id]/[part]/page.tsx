'use client';
import ReadingLayout from '@/components/ReadingLayout';
import SkillHeader from '@/components/SkillHeader';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useEffect, useState } from 'react';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import { Spin, Button, notification } from 'antd';
import styles from '@/styles/components/SkillHeader.module.scss';

import { User } from 'firebase/auth';
import { auth } from '@/lib';
import useSWR from 'swr';

interface questiongroup {
  is_single_question?: boolean | object;
  question_groups_info?: {
    question_groups_duration: number;
    question_groups_prompt: string;
    question_groups_image_urls: Array<string>;
    question_groups_recording: string;
  };
  questions?: Array<object>;
}
interface subpart {
  part_number: number;
  part_duration: number;
  part_recording: string;
  part_prompt: string;
  part_image_urls: Array<string>;
  question_groups: Array<questiongroup>;
}
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
export default function IeltsPart({ params, }: { params: { id: string; part: string }; }) {
  const router = useRouter();
  const [answers, setAnswers] = useState({}); // {1: "A", 2: ["B","C"], 3: "False", 4:"arthitis"}
  const [testTime, setTestTime] = useState('20:00');
  const [currentPart, setCurrentPart] = useState(1);
  const changePart = (part: number) => {
    setCurrentPart(part);
  };

  const user = auth.currentUser;
  const {
    data: tests,
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
  useEffect(() => {
    if (params.part !== 'all') {
      setCurrentPart(Number(params.part));
    }
  }, [params.part])

  if (isLoading) {
    return <Spin size='large' />
  }

  const temp_metaData = { ...tests };
  console.log(tests);
  delete temp_metaData['parts'];
  const metaData = temp_metaData;
  const jsonData = [];
  if (params.part === 'all') {
    const partData = tests['parts'].map(
      (subpart: subpart) => subpart
    );
    jsonData.push(...partData);
    //setActivePart('1');
  } else {
    //setCurrentPart(Number(params.part));
    const partData = tests['parts'].filter(
      (subpart: subpart) => subpart['part_number'] === Number(params.part)
    );
    jsonData.push(...partData);
    //setActivePart(params.part);
  }




  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await fetch(`/api/tests/${params.id}`);
  //     const data = await res.json();
  //     const temp_metaData = { ...data['data'] };
  //     delete temp_metaData['parts'];
  //     setMetaData(temp_metaData);
  //     console.log(data['data']);
  //     if (params.part === 'all') {
  //       const partData = data['data']['parts'].map(
  //         (subpart: subpart) => subpart
  //       );
  //       setJsonData(partData);
  //       setActivePart('1');
  //     } else {
  //       setCurrentPart(Number(params.part));
  //       const partData = data['data']['parts'].filter(
  //         (subpart: subpart) => subpart['part_number'] === Number(params.part)
  //       );
  //       setJsonData(partData);
  //       setActivePart(params.part);
  //     }
  //   };
  //   fetchData();
  // }, []);
  const passageButtons = (
    <div className={styles.partChangeWrapper}>
      <Button
        icon={<DoubleLeftOutlined />}
        onClick={() => {
          const prevPassage = (currentPart - 1);
          setCurrentPart(prevPassage);
        }}
        disabled={currentPart === 1 || params.part !== 'all'}
      />
      Đổi bài đọc
      <Button
        icon={<DoubleRightOutlined />}
        onClick={() => {
          const nextPassage = (currentPart + 1);
          setCurrentPart(nextPassage);
        }}
        disabled={currentPart === jsonData.length || params.part !== 'all'}
      />
    </div>);
  const parts = jsonData.map((part: subpart) => {
    const prevPart =
      params.part === 'all'
        ? Math.max(part['part_number'] - 1, 1)
        : Number(params.part);
    const nextPart =
      params.part === 'all'
        ? Math.min(part['part_number'] + 1, jsonData.length)
        : Number(params.part);
    console.log('part: ', part['part_number']);
    return (
      <React.Fragment key={part['part_number']}>
        {currentPart === part['part_number'] && (
          <ReadingLayout
            setPrevState={() => changePart(prevPart)}
            setNextState={() => changePart(nextPart)}
            data={part}
            setAnswer={setAnswers}
            answers={answers}
          />
        )}
      </React.Fragment>
    );
  });
  return (
    <>
      {contextHolder}
      <SkillHeader title={metaData['test_name']} countdownTime={testTime}>
        {passageButtons}
      </SkillHeader>
      {parts}
    </>
  );
}
