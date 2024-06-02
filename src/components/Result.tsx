'use client';

import TextCard from '@/components/TextCard';
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  CheckOutlined,
} from '@ant-design/icons';
import styles from '@/styles/components/Result.module.scss';
import Card from '@/components/Card';
import { Button, Tabs, Modal, Spin } from 'antd';
import type { TabsProps } from 'antd';
import { useEffect, useState } from 'react';
import merge from 'lodash/merge';
import clsx from 'clsx';
import { auth } from '@/lib';
import { User } from 'firebase/auth';
import useSWR from 'swr';

interface QuestionGroupInfo {
  question_groups_duration: number | null;
  question_groups_prompt: string | null;
  question_groups_recording: string | null;
  question_groups_image_urls: string[] | null;
}

interface Question {
  question_number: number;
  question_type: string;
  question_prompt: string | null;
  question_image_urls: string[] | null;
  question_duration: number | null;
  answer: string;
  answer_result: AnswerResult;
  options: string[] | null;
  _id: string;
}

interface QuestionGroup {
  question_groups_info: QuestionGroupInfo;
  is_single_question: boolean;
  questions: Question[];
  _id: string;
}

interface Part {
  part_number: number;
  part_duration: number | null;
  part_recording: string | null;
  part_prompt: string | null;
  part_image_urls: string[] | null;
  question_groups: QuestionGroup[];
}

interface AnswerResult {
  user_answer: string;
  assess: boolean;
  is_correct: boolean;
}

interface TestResult {
  user_id: string;
  test_id: string;
  question_count: number;
  correct_answer_count: number;
  score: number;
  parts: Part[];
}

interface Props {
  testId: string;
  testSubmissionId: string;
  part: string;
}

const fetcher = async ({ url, user }: { url: string; user: User | null }) => {
  const token = await user?.getIdToken();
  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    return res.json();
  });

  if (response.status === 'error') {
    throw new Error(response.error.message);
  }

  return response.data;
};

const Result = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [testResultData, setTestResultData] = useState<TestResult | null>(null);
  const user = auth.currentUser;

  const resultInfo = { right: 0, wrong: 0, skipped: 0 };

  const {
    data: test,
    isLoading: isTestDataLoading,
    error: testError,
  } = useSWR({ url: `/api/tests/${props.testId}`, user }, fetcher);
  const {
    data: testSubmission,
    isLoading: isSubmissionDataLoading,
    error: submissionError,
  } = useSWR(
    { url: `/api/test-submissions/${props.testSubmissionId}`, user },
    fetcher
  );

  useEffect(() => {
    if (test && testSubmission && testResultData === null) {
      const mergedData = merge({}, test, testSubmission);
      if (props.part === 'all') setTestResultData(mergedData);
      else {
        const filteredParts = mergedData.parts.filter(
          (part: Part) => part.part_number === Number(props.part)
        );
        mergedData.parts = filteredParts;
        setTestResultData(mergedData);
      }
    }
  }, [test, testSubmission, testResultData, props.part]);

  const showModal = (questionNumber: number) => {
    setCurrentQuestion(questionNumber);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const items: TabsProps['items'] = testResultData?.parts?.map(
    (part, index) => {
      const allQuestionsInfo = part.question_groups
        .map((questionGroup) => questionGroup.questions)
        .flat();

      allQuestionsInfo.forEach((question) => {
        if (question.answer_result.is_correct) {
          resultInfo.right++;
        } else if (question.answer_result.user_answer === undefined) {
          resultInfo.skipped++;
        } else {
          resultInfo.wrong++;
        }
      });

      return {
        key: String(index),
        label: `Part ${part.part_number}`,
        children: (
          <Card
            key={index}
            width="100%"
            height="fit-content"
            className={styles['answer-board']}
          >
            {allQuestionsInfo.map((question) => (
              <div
                key={question._id}
                className={styles.answer}
              >
                <p>Câu&nbsp;{question.question_number}:</p>
                {(question.question_type === 'single_choice' ||
                  question.question_type === 'selection') &&
                  question.options &&
                  question.options.map((option, oIndex) => (
                    <div
                      key={oIndex}
                      className={styles['radio-label']}
                    >
                      <span>{oIndex + 1}</span>
                      <div
                        className={`${styles['radio-button']} ${
                          question.answer_result.is_correct
                            ? question.answer === String(oIndex + 1)
                              ? styles['green']
                              : ''
                            : (oIndex + 1).toString() ===
                                question.answer_result.user_answer.toString()
                              ? styles['red']
                              : (oIndex + 1).toString() === question.answer &&
                                  question.answer_result.user_answer.toString() !==
                                    ''
                                ? styles['green']
                                : (oIndex + 1).toString() === question.answer &&
                                    question.answer_result.user_answer.toString() ===
                                      ''
                                  ? styles['red']
                                  : ''
                        }`}
                      ></div>
                    </div>
                  ))}
                {question.question_type === 'completion' && (
                  <>
                    <TextCard
                      width="fit-content"
                      height="30px"
                      className={`${styles['answer-field']} ${
                        question.answer_result.is_correct
                          ? styles['green-border']
                          : styles['red-border']
                      }`}
                    >
                      {question.answer_result.user_answer}
                    </TextCard>
                  </>
                )}
                {question.question_type === 'multiple_choices' &&
                  question.options &&
                  question.options.map((option, oIndex) => (
                    <div
                      key={oIndex}
                      className={styles['radio-label']}
                    >
                      <span>{oIndex + 1}</span>
                      <div
                        className={`${styles['check-box-button']} ${
                          question.answer.includes(String(oIndex + 1))
                            ? styles['green']
                            : question.answer_result.user_answer
                                  .toString()
                                  .includes(String(oIndex + 1))
                              ? styles['red']
                              : ''
                        }
                                        }`}
                      >
                        {question.answer.includes(String(oIndex + 1)) &&
                          question.answer_result.user_answer
                            .toString()
                            .includes(String(oIndex + 1)) && (
                            <CheckOutlined
                              style={{ width: '10px', color: 'green' }}
                            />
                          )}
                      </div>
                    </div>
                  ))}
                <Button
                  type="text"
                  onClick={() => showModal(question.question_number)}
                  block
                >
                  Chi tiết
                </Button>
              </div>
            ))}
          </Card>
        ),
      };
    }
  );

  if (isSubmissionDataLoading || isTestDataLoading)
    return <Spin size="large" />;

  if (testError || submissionError) {
    console.log('error:', testError, submissionError);
  }

  return (
    <>
      <div className={styles['result-board']}>
        <TextCard
          width="150px"
          height="fit-content"
          className={styles['result-card']}
        >
          <CheckCircleTwoTone
            twoToneColor="#52c41a"
            style={{ fontSize: '18px' }}
          />
          <h4 className={styles['correct-header']}>Trả lời đúng</h4>
          <p>{resultInfo.right}</p>
        </TextCard>
        <TextCard
          width="150px"
          height="fit-content"
          className={styles['result-card']}
        >
          <CloseCircleTwoTone
            twoToneColor="#c41a1a"
            style={{ fontSize: '18px' }}
          />
          <h4 className={styles['wrong-header']}>Trả lời sai</h4>
          <p>{resultInfo.wrong}</p>
        </TextCard>
      </div>
      <Tabs
        defaultActiveKey="1"
        items={items}
        // onChange={tabChangeHandler}
        className={styles.tab}
      />
      <Modal
        open={open}
        title={`Câu ${currentQuestion}`}
        onCancel={handleCancel}
        footer={[]}
        style={{ height: 'auto' }}
      >
        {testResultData?.parts?.map((part) =>
          part.question_groups.map((questionGroup) => {
            return questionGroup.questions.map((question) =>
              question.question_number === currentQuestion ? (
                <div key={question._id}>
                  <p className={styles['question-prompt']}>
                    {questionGroup.question_groups_info.question_groups_prompt}
                  </p>
                  {questionGroup.question_groups_info
                    .question_groups_image_urls && (
                    <img
                      className={styles.img}
                      src={
                        questionGroup.question_groups_info
                          .question_groups_image_urls[0]
                      }
                      alt="question"
                    />
                  )}
                  <p className={styles['question-prompt']}>
                    {question.question_prompt}
                  </p>
                  {question.question_image_urls && (
                    <img
                      className={styles.img}
                      src={question.question_image_urls[0]}
                      alt="question"
                    />
                  )}
                  <div className={clsx(styles['answer-options'])}>
                    {(question.question_type === 'single_choice' ||
                      question.question_type === 'selection') &&
                      question.options &&
                      question.options.map((option, index) => (
                        <div
                          key={index}
                          className={styles['radio-label']}
                        >
                          <div
                            className={`${styles['radio-button']} ${
                              question.answer_result.is_correct
                                ? question.answer === String(index + 1)
                                  ? styles['green']
                                  : ''
                                : (index + 1).toString() ===
                                    question.answer_result.user_answer.toString()
                                  ? styles['red']
                                  : (index + 1).toString() ===
                                        question.answer &&
                                      question.answer_result.user_answer.toString() !==
                                        ''
                                    ? styles['green']
                                    : (index + 1).toString() ===
                                          question.answer &&
                                        question.answer_result.user_answer.toString() ===
                                          ''
                                      ? styles['red']
                                      : ''
                            }`}
                          ></div>
                          <span>{option}</span>
                        </div>
                      ))}

                    {question.question_type === 'completion' && (
                      <>
                        <div className={styles['fill-answer']}>
                          <p>Your answer:</p>
                          <TextCard
                            width="fit-content"
                            height="30px"
                            className={`${styles['answer-field']} ${
                              question.answer_result.is_correct
                                ? styles['green-border']
                                : styles['red-border']
                            }`}
                          >
                            {question.answer_result.user_answer}
                          </TextCard>
                        </div>
                        {!question.answer_result.is_correct && (
                          <div className={styles['fill-answer']}>
                            <p>Correct answer:</p>
                            <TextCard
                              width="fit-content"
                              height="30px"
                              className={`${styles['answer-field']} ${styles['green-border']}`}
                            >
                              {question.answer}
                            </TextCard>
                          </div>
                        )}
                      </>
                    )}
                    {question.question_type === 'multiple_choices' &&
                      question.options &&
                      question.options.map((option, index) => (
                        <div
                          key={index}
                          className={styles['radio-label']}
                        >
                          <div
                            className={`${styles['check-box-button']} ${
                              question.answer.includes(String(index + 1))
                                ? styles['green']
                                : question.answer_result.user_answer
                                      .toString()
                                      .includes(String(index + 1))
                                  ? styles['red']
                                  : ''
                            }
                    }`}
                          >
                            {question.answer.includes(String(index + 1)) &&
                              question.answer_result.user_answer
                                .toString()
                                .includes(String(index + 1)) && (
                                <CheckOutlined
                                  style={{ width: '10px', color: 'green' }}
                                />
                              )}
                          </div>
                          <span>{option}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ) : null
            );
          })
        )}
      </Modal>
    </>
  );
};

export default Result;
