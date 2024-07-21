'use client';
import ReadingLayout from '@/components/ReadingLayout';
import SkillHeader from '@/components/SkillHeader';
// import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import { Spin, Button, notification } from 'antd';
import styles from '@/styles/components/SkillHeader.module.scss';

import { User } from 'firebase/auth';
import { auth } from '@/lib';
import useSWR from 'swr';
import ReadingFunctionMenu from '@/components/ReadingFunctionMenu';
import ReadingResult from '@/components/ReadingResult';
interface test_answer {
  test_id: string;
  parts: {
    _id: string;
    part_number: number;
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
  questions?: Array<question>;
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
interface question {
  _id: string;
  question_number: number;
  question_type: string;
  question_prompt: string;
  question_image_urls: Array<string>;
  question_duration: number;
  options: Array<string>;
  answer: Array<string> | string;
}

// for response from api
interface Question {
  answer_result: {
    user_answer: string | string[];
    assess: boolean;
    is_correct: boolean;
  };
  _id: string;
}

interface QuestionGroup {
  questions: Question[];
  _id: string;
}

interface Part {
  question_groups: QuestionGroup[];
  _id: string;
}

interface TestData {
  user_id: string;
  test_id: string;
  question_count: number;
  correct_answer_count: number;
  score: number;
  parts: Part[];
  _id: string;
  created_at: string;
  updated_at: string;
  __v: number;
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
  const [answers, setAnswers] = useState<test_answer>({
    test_id: '',
    parts: [],
  });

  const [fetchedData, setFetchedData] = useState<TestData>();
  // TODO: use timer and setTestTime

  const [currentPart, setCurrentPart] = useState(1);

  const [resultPage, setResultPage] = useState(false);

  const [chatVisible, setChatVisible] = useState(false);
  const [isChatProcessing, setIsChatProcessing] = useState(false);
  const [selection, setSelection] = useState<string>('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const [chatRequests, setChatRequests] = useState<
    Array<{ avatar: string; request: string; response: string }>
  >([]);

  const [remainingTime, setRemainingTime] = useState<number>(Date.now());

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      setRemainingTime(Date.now() + tests.duration * 1000);
      if (params.part !== 'all') {
        const temp_test_answer: {
          test_id: string;
          parts: {
            _id: string;
            part_number: number;
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
          part_number: Number(params.part),
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
            part_number: number;
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
              part_number: i1 + 1,
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

  const showMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    let newSelection = '';
    if ((event.target as Element).tagName === 'TEXTAREA') {
      newSelection =
        textareaRef.current?.value.substring(
          textareaRef.current?.selectionStart || 0,
          textareaRef.current?.selectionEnd || 0
        ) || '';
    } else if ((event.target as Element).tagName === 'DIV') {
      newSelection = window.getSelection()?.toString() || '';
    }

    if (newSelection != '') {
      setSelection(newSelection);
      setMenuVisible(true);
      setMenuPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const hideMenu = () => {
    setMenuVisible(false);
  };

  const callTranslateAPI = async () => {
    const token = await user?.getIdToken();

    const response = await fetch('/api/ai/translate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        target_lang: 'vi',
        content: selection,
      }),
    });

    const data = await response.json();
    return data;
  };

  const callParaphraseAPI = async (content: string) => {
    const token = await user?.getIdToken();

    const response = await fetch('/api/ai/paraphrase-reading/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: content,
      }),
    });

    const data = await response.json();
    return data;
  };

  const callGenerateHeadingAPI = async (content: string) => {
    const token = await user?.getIdToken();

    const response = await fetch('/api/ai/generate-heading/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: content,
      }),
    });

    const data = await response.json();
    return data;
  };

  const callSynonymsAPI = async (word: string) => {
    const token = await user?.getIdToken();

    const response = await fetch(`/api/ai/synonyms?word=${word}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  };

  const showChat = async (message: string) => {
    setIsChatProcessing(true);

    let apiResponse;
    const request = {
      avatar: user?.photoURL || '',
      request: message + ' ' + selection,
      response: 'Đang xử lý... đợi Buddie chút nhé!',
    };

    setChatRequests((prevRequests) => [...prevRequests, request]);
    setChatVisible(true);

    if (message === 'Dịch') {
      apiResponse = await callTranslateAPI();
      request.response = apiResponse.data.translated;
      setIsChatProcessing(false);
    }

    if (message === 'Viết lại') {
      apiResponse = await callParaphraseAPI(selection);
      request.response = apiResponse.data.paraphrased;
      setIsChatProcessing(false);
    }

    if (message === 'Từ đồng nghĩa') {
      apiResponse = await callSynonymsAPI(selection);
      request.response = apiResponse.data.synonyms.join(', ');
      setIsChatProcessing(false);
    }

    if (message === 'Tạo tiêu đề') {
      apiResponse = await callGenerateHeadingAPI(selection);
      request.response = apiResponse.data.heading;
      setIsChatProcessing(false);
    }

    setChatRequests((prevRequests) => {
      const newRequests = [...prevRequests];
      newRequests[newRequests.length - 1] = request;
      return newRequests;
    });

    // Clear the selection
    if (textareaRef.current) {
      textareaRef.current.selectionStart = 0;
      textareaRef.current.selectionEnd = 0;
    }
  };

  const temp_metaData = { ...tests };
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
    return (
      <React.Fragment key={part['part_number']}>
        {currentPart === part['part_number'] && (
          <ReadingLayout
            partNumber={part['part_number']}
            data={part}
            chatVisible={chatVisible}
            isChatProcessing={isChatProcessing}
            chatRequests={chatRequests}
            answers={answers}
            onContextMenu={showMenu}
            setAnswer={setAnswers}
            setChatVisible={setChatVisible}
            setChatRequests={setChatRequests}
            setIsChatProcessing={setIsChatProcessing}
            setResultPage={setResultPage}
            setFetchedData={setFetchedData}
            testId={params.id}
            part={params.part}
            testTime={tests.duration}
            remainingTime={remainingTime}
          />
        )}
        <ReadingFunctionMenu
          visible={menuVisible}
          position={menuPosition}
          onMenuItemClick={showChat}
        />
      </React.Fragment>
    );
  });

  return (
    <div onClick={hideMenu}>
      {contextHolder}
      {!resultPage && (
        <>
          <SkillHeader
            title={metaData['test_name']}
            countdownTime={remainingTime}
          >
            {passageButtons}
          </SkillHeader>
          {parts}
        </>
      )}
      {resultPage && (
        <ReadingResult
          jsonData={jsonData}
          fetchedData={fetchedData}
          answers={answers}
        />
      )}
    </div>
  );
}
