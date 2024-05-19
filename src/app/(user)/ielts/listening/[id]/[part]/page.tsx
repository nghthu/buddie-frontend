'use client';

import TextCard from '@/components/TextCard';
import { Input, Radio, Button, Spin } from 'antd';
import styles from '@/styles/pages/listening/Practice.module.scss';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AudioPlayer from '@/components/AudioPlayer';
import useSWR from 'swr';
import { auth } from '@/lib';
import { User } from 'firebase/auth';

interface QuestionInfo {
  question_number: number;
  question_type: string;
  question_prompt: string;
  question_image_urls: string[];
  question_duration: number;
  options: string[];
  answer: string;
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
  const [testData, setTestData] = useState<QuestionGroup | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[] | null>(null);
  const router = useRouter();
  const user = auth.currentUser;

  const { data, isLoading, error } = useSWR(
    { url: `/api/tests/${params.id}`, user },
    fetcher
  );

  if (data && testData === null) {
    setTestData(data.parts[Number(params.part) - 1].question_groups);
    const questionGroups = data.parts[Number(params.part) - 1].question_groups;

    let initialAnswers: string[] = [];

    questionGroups.forEach((questionGroup: QuestionGroup) => {
      questionGroup.questions.forEach((question) => {
        const index = question.question_number - 21;
        initialAnswers[index] = '';
      });
    });

    // Set the initial answers
    setAnswers(initialAnswers);
  }

  const aswerChangehandler = (questionNumber: number, userAnswer: string) => {
    const newAnswers = answers ? [...answers] : [];
    newAnswers[questionNumber - 1] = userAnswer;
    setAnswers(newAnswers);
    console.log(newAnswers);
  };

  const submitHandler = () => {
    console.log(answers);
  };

  if (isLoading) return <Spin size="large" />;

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
                    key={imageIndex}
                    src={imageUrl}
                    alt={`Question ${question.question_number}`}
                  />
                ))}
                {question.question_type === 'completion' ? (
                  <Input
                    placeholder="Nhập câu trả lời"
                    onChange={(e) =>
                      aswerChangehandler(
                        question.question_number,
                        e.target.value
                      )
                    }
                  />
                ) : (
                  <Radio.Group
                    className={styles.answers}
                    value={answers[question.question_number - 1]}
                    onChange={(e) =>
                      aswerChangehandler(
                        question.question_number,
                        e.target.value
                      )
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
        <Button onClick={() => router.push('/ielts')}>Thoát</Button>
        <Button onClick={submitHandler}>Kết thúc</Button>
      </div>
    </>
  );
};

export default ListeningPractice;
