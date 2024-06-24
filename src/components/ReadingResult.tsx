'use client';
import Link from 'next/link';
import TextCard from './TextCard';
import { Button } from 'antd';
import { useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styles from '@/styles/components/ReadingResult.module.scss';
import clsx from 'clsx';
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
interface questionAndAnswer {
  index: number | number[];
  question: string;
  answer: string | string[];
  userAnswer: string | string[];
  isCorrect: boolean;
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
interface Props {
  fetchedData: TestData | undefined;
  jsonData: subpart[];
  answers: test_answer;
}

const compareArray = (array1: string[], array2: string[]) => {
  if (array1.length !== array2.length) {
    return false;
  }
  const sortedArray1 = [...array1].sort();
  const sortedArray2 = [...array2].sort();
  for (let i = 0; i < sortedArray1.length; i++) {
    if (sortedArray1[i] !== sortedArray2[i]) {
      return false;
    }
  }
  return true;
};

export default function ReadingResult({
  fetchedData,
  jsonData,
  answers,
}: Props) {
  const [testResultPage, setTestResultPage] = useState(0);
  const questionOnly: questionAndAnswer[] = [];
  jsonData.forEach((part: subpart) => {
    // Iterate through each question group
    part.question_groups.forEach((questionGroup: questiongroup) => {
      // Iterate through each question
      questionGroup.questions?.forEach((question: question) => {
        // Get the question prompt
        const questionPrompt = question.question_prompt;
        const answer = question.answer;
        // get the answer from answers using the question_id
        let answerFromUser: string | string[];
        answers.parts.forEach((part) => {
          part.question_groups.forEach((questionGroup) => {
            questionGroup.questions.forEach((q) => {
              if (q._id === question._id) {
                answerFromUser = q.answer_result.user_answer;

                if (question.question_type !== 'multiple_choices') {
                  const questionNumber = question.question_number;
                  questionOnly.push({
                    index: questionNumber,
                    question: questionPrompt,
                    answer: answer,
                    userAnswer: answerFromUser,
                    isCorrect: answer === answerFromUser,
                  });
                } else {
                  const questionNumber = [];
                  for (let i = 0; i < question.answer.length; i++) {
                    questionNumber.push(question.question_number + i);
                  }
                  questionOnly.push({
                    index: questionNumber,
                    question: questionPrompt,
                    answer: answer,
                    userAnswer: answerFromUser,
                    isCorrect: compareArray(
                      answer as string[],
                      answerFromUser as string[]
                    ),
                  });
                }
              }
            });
          });
        });
      });
    });
  });
  const totalLength = questionOnly.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.overView}>
        <h3>Kết quả bài làm</h3>
        <TextCard
          width={'100%'}
          height={'auto'}
        >
          <h4>
            Số câu đúng: {fetchedData?.correct_answer_count}/
            {fetchedData?.question_count}
          </h4>
          <img
            src="/images/logo/good.svg"
            width="100px"
          />
        </TextCard>
        <div className={styles.buttons}>
          <Link href="/">
            <Button
              type="primary"
              className={clsx('ant-btn-red', styles.button)}
            >
              Về lại trang chính
            </Button>
          </Link>
          <Button
            type="primary"
            onClick={() => window.location.reload()}
            className={styles.button}
          >
            Làm lại
          </Button>
        </div>
      </div>
      <div className={styles.detail}>
        <h3>Kết quả chi tiết</h3>
        <TextCard
          width={'100%'}
          height="auto"
        >
          <div className={styles.answerDetail}>
            <div className={styles.question}>
              <div>
                Câu {questionOnly[testResultPage].index}/{totalLength}
              </div>
              <div>
                {questionOnly[testResultPage].isCorrect ? (
                  <div style={{ color: 'green' }}>
                    <CheckCircleOutlined />
                    Đúng
                  </div>
                ) : (
                  <div style={{ color: 'red' }}>
                    <CloseCircleOutlined />
                    Sai
                  </div>
                )}
              </div>
            </div>

            <div>{questionOnly[testResultPage].question}</div>
            <div
              className={clsx(
                questionOnly[testResultPage].isCorrect
                  ? styles.correct
                  : styles.wrong
              )}
            >
              Bạn trả lời:{' '}
              {questionOnly[testResultPage].userAnswer ||
                'Bạn không trả lời câu này'}
            </div>
            <div
              className={clsx(
                questionOnly[testResultPage].isCorrect
                  ? styles.correct
                  : styles.wrong
              )}
            >
              Đáp án: {questionOnly[testResultPage].answer}
            </div>
            <div
              className={clsx(
                testResultPage > 0 ? styles.buttons : styles.buttonsEnd
              )}
            >
              {testResultPage > 0 && (
                <Button
                  type="primary"
                  onClick={() => setTestResultPage((prev) => prev - 1)}
                >
                  Câu trước
                </Button>
              )}
              {testResultPage < totalLength - 1 && (
                <Button
                  type="primary"
                  onClick={() => setTestResultPage((prev) => prev + 1)}
                >
                  Câu sau
                </Button>
              )}
            </div>
          </div>
        </TextCard>
      </div>
    </div>
  );
}
