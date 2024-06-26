'use client';

import TextCard from '@/components/TextCard';
import { Input, Radio, Button, Spin } from 'antd';
import styles from '@/styles/pages/listening/Practice.module.scss';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AudioPlayer from '@/components/AudioPlayer';
import useSWR from 'swr';
import { auth } from '@/lib';
import { User } from 'firebase/auth';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';

interface Part {
  part_duration: number;
  part_image_urls: string[];
  part_number: number;
  part_prompt: string;
  part_recording: string;
  _id: string;
  question_groups: QuestionGroup[];
}

interface QuestionInfo {
  question_number: number;
  question_type: string;
  question_prompt: string;
  question_image_urls: string[];
  question_duration: number;
  options: string[];
  answer: string;
  _id: string;
}

interface QuestionGroupInfo {
  question_groups_duration: number;
  question_groups_prompt: string;
  question_groups_recording: string;
  question_groups_image_urls: string[];
}

interface QuestionGroup {
  is_single_question: boolean;
  question_groups_info: QuestionGroupInfo;
  questions: QuestionInfo[];
  _id: string;
}

interface AnswerResult {
  user_answer: string;
}

interface Answer {
  _id: string;
  answer_result: AnswerResult;
}

const fetcher = async ({ url, user }: { url: string; user: User | null }) => {
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

const ListeningPractice = ({
  params,
}: {
  params: { id: string; part: string };
}) => {
  const [testData, setTestData] = useState<QuestionGroup[] | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentPart, setCurrentPart] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = auth.currentUser;

  let finalPart = 0;

  const { data, isLoading } = useSWR(
    { url: `/api/tests/${params.id}`, user },
    fetcher
  );
  finalPart = data?.parts.length - 1;

  useEffect(() => {
    if (data && testData === null) {
      if (params.part !== 'all') {
        setTestData(data.parts[Number(params.part) - 1].question_groups);
      } else {
        setCurrentPart(0);
        setTestData(data.parts[0].question_groups);
      }
    }
  }, [data, testData, params.part]);

  const answerChangehandler = (questionId: string, userAnswer: string) => {
    let answerFound = false;

    const updatedAnswers = answers.map((answer) => {
      if (answer._id === questionId) {
        answerFound = true;
        return { ...answer, answer_result: { user_answer: userAnswer } };
      }
      return answer;
    });

    if (!answerFound) {
      updatedAnswers.push({
        _id: questionId,
        answer_result: { user_answer: userAnswer },
      });
    }
    setAnswers(updatedAnswers);
  };

  const findAnswerById = (id: string) => {
    const answer = answers.find((answer) => answer._id === id);
    return answer ? answer.answer_result.user_answer : '';
  };

  const submitHandler = async () => {
    setLoading(true);
    const structuredAnswers = {
      test_id: data._id,
      parts: data.parts.map((part: Part, index: number) => ({
        part_number: index + 1,
        _id: part._id,
        question_groups: part.question_groups.map(
          (questionGroup: QuestionGroup) => ({
            _id: questionGroup._id,
            questions: questionGroup.questions.map((question) => {
              const userAnswer = answers.find(
                (answer) => answer._id === question._id
              );
              return {
                _id: question._id,
                answer_result: {
                  user_answer: userAnswer
                    ? userAnswer.answer_result.user_answer
                    : '',
                },
              };
            }),
          })
        ),
      })),
    };
    let submittedAnswers;
    if (params.part === 'all') {
      submittedAnswers = structuredAnswers;
    } else {
      submittedAnswers = {
        test_id: structuredAnswers.test_id,
        parts: [structuredAnswers.parts[Number(params.part) - 1]],
      };
    }

    const token = await user?.getIdToken();
    console.log(submittedAnswers);

    const response: Response = await fetch(`/api/test-submissions`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submittedAnswers),
    });

    const responseData = await response.json();
    router.push(
      `/result?testId=${params.id}&testSubmissionId=${responseData._id}&part=${params.part}`
    );
  };

  const nextHandler = () => {
    const nextPart = currentPart + 1;
    setCurrentPart((prevPart) => prevPart + 1);
    setTestData(data.parts[nextPart].question_groups);
  };

  const backHandler = () => {
    const previousPart = currentPart - 1;
    setCurrentPart((prevPart) => prevPart - 1);
    setTestData(data.parts[previousPart].question_groups);
  };

  if (isLoading || loading) return <Spin size="large" />;

  return (
    <>
      <AudioPlayer audioUrl={data?.test_recording} />

      <TextCard
        width="100%"
        height="auto"
      >
        {testData?.map((group: QuestionGroup, index: number) => (
          <div key={index}>
            <h3 className={styles['question-prompt']}>
              {group.question_groups_info.question_groups_prompt}
            </h3>
            {group.question_groups_info.question_groups_image_urls?.map(
              (imageUrl, imageIndex) => (
                <img
                  className={styles.images}
                  key={imageIndex}
                  src={imageUrl}
                  alt={`Question ${index + 1}`}
                />
              )
            )}
            {group.questions.map((question) => (
              <div key={question.question_number}>
                <p>
                  Câu hỏi {question.question_number}: {question.question_prompt}
                </p>
                {question.question_image_urls?.map((imageUrl, imageIndex) => (
                  <img
                    className={styles.images}
                    key={imageIndex}
                    src={imageUrl}
                    alt={`Question ${question.question_number}`}
                  />
                ))}
                {question.question_type === 'completion' ? (
                  <Input
                    placeholder="Nhập câu trả lời"
                    onChange={(e) =>
                      answerChangehandler(question._id, e.target.value)
                    }
                  />
                ) : (
                  <Radio.Group
                    className={styles.answers}
                    value={findAnswerById(question._id)}
                    onChange={(e) =>
                      answerChangehandler(question._id, e.target.value)
                    }
                  >
                    {question.options.map((option, optionIndex) => (
                      <Radio
                        key={optionIndex}
                        value={optionIndex + 1}
                      >
                        {option}
                      </Radio>
                    ))}
                  </Radio.Group>
                )}
              </div>
            ))}
          </div>
        ))}
      </TextCard>

      <div className={styles['action-btn']}>
        <Button
          className={styles['exit-btn']}
          onClick={() => router.push('/ielts')}
        >
          Thoát
        </Button>
        <div className={styles['next-back-btn']}>
          {currentPart !== 0 && params.part === 'all' && (
            <Button onClick={backHandler}>
              <DoubleLeftOutlined />
            </Button>
          )}
          {currentPart !== finalPart && params.part === 'all' && (
            <Button onClick={nextHandler}>
              <DoubleRightOutlined />
            </Button>
          )}
          {((currentPart === finalPart && params.part === 'all') ||
            params.part !== 'all') && (
            <Button onClick={submitHandler}>Nộp bài</Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ListeningPractice;
