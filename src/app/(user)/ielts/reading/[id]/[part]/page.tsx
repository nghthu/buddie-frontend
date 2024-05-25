'use client';
import ReadingLayout from '@/components/ReadingLayout';
import SkillHeader from '@/components/SkillHeader';
// import { useRouter } from 'next/navigation';
import React from 'react';
import { useEffect, useState } from 'react';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import { Spin, Button, notification } from 'antd';
import styles from '@/styles/components/SkillHeader.module.scss';

import { User } from 'firebase/auth';
import { auth } from '@/lib';
import useSWR from 'swr';
interface test_answer {
  test_id: string;
  parts: {
    _id: string;
    question_groups: {
      _id: string;
      questions: {
        _id: string;
        answer_result: {
          user_answer: string | string[];
        };
      }[];
    }[];
  }[];
}
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
  _id: string;
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
export default function IeltsPart({
  params,
}: {
  params: { id: string; part: string };
}) {
  // const router = useRouter();
  const [answers, setAnswers] = useState<test_answer>({
    test_id: '',
    parts: [],
  });
  // TODO: use timer and setTestTime
  const [testTime] = useState('20:00');
  const [currentPart, setCurrentPart] = useState(1);
  // const changePart = (part: number) => {
  //   setCurrentPart(part);
  // };

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
  }, [params.part]);
  useEffect(() => {
    if (tests) {
      if (params.part !== 'all') {
        const temp_test_answer: {
          test_id: string;
          parts: {
            _id: string;
            question_groups: {
              _id: string;
              questions: {
                _id: string;
                answer_result: { user_answer: string };
              }[];
            }[];
          }[];
        } = { test_id: params.id, parts: [] };
        //push in the right part
        temp_test_answer['parts'].push({
          _id: tests['parts'][Number(params.part) - 1]['_id'],
          question_groups: [],
        });

        // iterate through the question groups inside the part and push each question group to the temp_test_answer
        tests['parts'][Number(params.part) - 1]['question_groups'].map(
          (
            question_group: { _id: string; questions: { _id: string }[] },
            index: number
          ) => {
            temp_test_answer['parts'][0]['question_groups'].push({
              _id: question_group._id,
              questions: [],
            });

            // within each question group, iterate through the questions and push each question to the temp_test_answer
            question_group.questions.map((question: { _id: string }) => {
              temp_test_answer['parts'][0]['question_groups'][index][
                'questions'
              ].push({ _id: question._id, answer_result: { user_answer: '' } });
            });
          }
        );

        setAnswers(temp_test_answer);
      } else {
        const temp_test_answer: {
          test_id: string;
          parts: {
            _id: string;
            question_groups: {
              _id: string;
              questions: {
                _id: string;
                answer_result: { user_answer: string };
              }[];
            }[];
          }[];
        } = { test_id: params.id, parts: [] };
        //push in all parts
        tests['parts'].map(
          (
            part: {
              _id: string;
              question_groups: { _id: string; questions: { _id: string }[] }[];
            },
            i1: number
          ) => {
            temp_test_answer['parts'].push({
              _id: part._id,
              question_groups: [],
            });

            part.question_groups.map(
              (
                question_group: { _id: string; questions: { _id: string }[] },
                i2: number
              ) => {
                temp_test_answer['parts'][i1]['question_groups'].push({
                  _id: question_group._id,
                  questions: [],
                });
                question_group.questions.map((question: { _id: string }) => {
                  temp_test_answer['parts'][i1]['question_groups'][i2][
                    'questions'
                  ].push({
                    _id: question._id,
                    answer_result: { user_answer: '' },
                  });
                });
              }
            );
          }
        );

        setAnswers(temp_test_answer);
      }
    }
  }, [tests, params.part, params.id]);
  if (isLoading) {
    return <Spin size="large" />;
  }

  const temp_metaData = { ...tests };

  console.log('answers: ', answers);
  delete temp_metaData['parts'];
  const metaData = temp_metaData;
  const jsonData = [];
  if (params.part === 'all') {
    const partData = tests['parts'].map((subpart: subpart) => subpart);
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

  const passageButtons = (
    <div className={styles.partChangeWrapper}>
      <Button
        icon={<DoubleLeftOutlined />}
        onClick={() => {
          const prevPassage = currentPart - 1;
          setCurrentPart(prevPassage);
        }}
        disabled={currentPart === 1 || params.part !== 'all'}
      />
      Đổi bài đọc
      <Button
        icon={<DoubleRightOutlined />}
        onClick={() => {
          const nextPassage = currentPart + 1;
          setCurrentPart(nextPassage);
        }}
        disabled={currentPart === jsonData.length || params.part !== 'all'}
      />
    </div>
  );

  const parts = jsonData.map((part: subpart) => {
    // const prevPart =
    //   params.part === 'all'
    //     ? Math.max(part['part_number'] - 1, 1)
    //     : Number(params.part);
    // const nextPart =
    //   params.part === 'all'
    //     ? Math.min(part['part_number'] + 1, jsonData.length)
    //     : Number(params.part);
    // console.log('part: ', part['part_number']);
    return (
      <React.Fragment key={part['part_number']}>
        {currentPart === part['part_number'] && (
          <ReadingLayout
            partNumber={part['part_number']}
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
      <SkillHeader
        title={metaData['test_name']}
        countdownTime={testTime}
      >
        {passageButtons}
      </SkillHeader>
      {parts}
    </>
  );
}
