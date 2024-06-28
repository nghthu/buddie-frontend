'use client';
import { Button, Spin } from 'antd';
import DropdownLayout from './DropdownLayout';
import MultiChoiceLayout from './MultiChoiceLayout';
import ReadingContextLayout from './ReadingContextLayout';
import SingleChoiceLayout from './SingleChoiceLayout';
import FillTheBlankLayout from './FillTheBlankLayout';
import TextCard from './TextCard';

import questionLayouts from '@/styles/components/questionLayouts.module.scss';
import textCardStyles from '@/styles/components/TextCard.module.scss';
import buttonStyles from '@/styles/components/WebButton.module.scss';
import clsx from 'clsx';
import { useState } from 'react';
import React from 'react';

import BuddieSupport from './BuddieSupport';
import { CloseChatContext } from './CloseChatContext';
import Link from 'next/link';
import { auth } from '@/lib';
import { useRouter } from 'next/navigation';

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
interface data {
  _id: string;
  part_number: number;
  part_duration: number;
  part_recording: string;
  part_prompt: string;
  part_image_urls: Array<string>;
  question_groups: Array<object>;
}
interface questiongroup {
  _id: string;
  is_single_question: boolean | object;
  question_groups_info: {
    question_groups_duration: number;
    question_groups_prompt: string;
    question_groups_image_urls: Array<string>;
    question_groups_recording: string;
  };
  questions: Array<question>;
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
interface chatRequests {
  avatar: string;
  request: string;
  response: string;
}

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

interface Props {
  partNumber: number;
  data: data;
  answers: test_answer;
  chatVisible: boolean;
  isChatProcessing: boolean;
  testId: string;
  part: string;
  chatRequests: Array<chatRequests>;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>) => void;
  setAnswer: React.Dispatch<React.SetStateAction<test_answer>>;
  setChatVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setChatRequests: React.Dispatch<React.SetStateAction<Array<chatRequests>>>;
  setIsChatProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setResultPage: React.Dispatch<React.SetStateAction<boolean>>;
  setFetchedData: React.Dispatch<React.SetStateAction<TestData | undefined>>;
}

export default function ReadingLayout({
  partNumber,
  data,
  answers,
  chatVisible,
  isChatProcessing,
  chatRequests,
  testId,
  part,
  onContextMenu,
  setAnswer,
  setChatVisible,
  setChatRequests,
  setIsChatProcessing,
  setResultPage,
  setFetchedData,
}: Props) {
  const user = auth.currentUser;
  const [currentQuestionGroup, setCurrentQuestionGroup] = useState(1);
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  const maxGroup = data['question_groups'].length;
  const questionGroups = (data['question_groups'] as questiongroup[]).map(
    (questionGroup: questiongroup, index: number) => {
      const questions = questionGroup['questions'].map(
        (question: question, index2: number) => {
          const question_use_for_answer =
            answers?.parts[partNumber - 1]?.question_groups[index]?.questions[
              index2
            ];
          return (
            <React.Fragment key={question['question_number']}>
              {question['question_type'] === 'single_choice' && (
                <SingleChoiceLayout
                  question={question['question_prompt']}
                  options={question['options']}
                  partId={data._id}
                  questionGroupsId={questionGroup._id}
                  questionId={question._id}
                  questionIndex={question['question_number']}
                  setAnswer={setAnswer}
                  userAnswer={
                    question_use_for_answer?.answer_result.user_answer
                  }
                  //userAnswer={answers[question['question_number']]}
                />
              )}
              {question['question_type'] === 'multiple_choices' && (
                <MultiChoiceLayout
                  question={question['question_prompt']}
                  options={question['options']}
                  answers={question['answer'] as string[]}
                  partId={data._id}
                  questionGroupsId={questionGroup._id}
                  questionId={question._id}
                  questionIndex={question['question_number']}
                  setAnswer={setAnswer}
                  userAnswer={
                    question_use_for_answer?.answer_result.user_answer
                  }
                />
              )}
              {question['question_type'] === 'selection' && (
                <DropdownLayout
                  question={question['question_prompt']}
                  options={question['options']}
                  answer={question['answer'] as string}
                  partId={data._id}
                  questionGroupsId={questionGroup._id}
                  questionId={question._id}
                  questionIndex={question['question_number']}
                  setAnswer={setAnswer}
                  userAnswer={
                    question_use_for_answer?.answer_result.user_answer
                  }
                />
              )}
              {question['question_type'] === 'completion' && (
                <FillTheBlankLayout
                  question={question['question_prompt']}
                  answer={question['answer'] as string}
                  partId={data._id}
                  questionGroupsId={questionGroup._id}
                  questionId={question._id}
                  questionIndex={question['question_number']}
                  setAnswer={setAnswer}
                  userAnswer={
                    question_use_for_answer?.answer_result.user_answer
                  }
                />
              )}
            </React.Fragment>
          );
        }
      );

      return (
        <TextCard
          key={index}
          width={'100'}
          height={'auto'}
          className={'cardFlex'}
        >
          {questionGroup['question_groups_info'] &&
            questionGroup['question_groups_info']['question_groups_prompt'] && (
              <h3 style={{ whiteSpace: 'pre-wrap' }}>
                {
                  questionGroup['question_groups_info'][
                    'question_groups_prompt'
                  ]
                }
              </h3>
            )}
          {questionGroup['question_groups_info'] &&
            questionGroup['question_groups_info'][
              'question_groups_image_urls'
            ] &&
            questionGroup['question_groups_info']['question_groups_image_urls']
              .length > 0 && (
              <>
                {questionGroup['question_groups_info'][
                  'question_groups_image_urls'
                ].map((url: string, index: number) => {
                  return (
                    <img
                      key={index}
                      src={url}
                      alt={'question group image'}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  );
                })}
              </>
            )}

          {questions}
        </TextCard>
      );
    }
  );

  const hideChat = () => {
    setChatVisible(false);
  };
  const handleSubmitAnswer = async () => {
    setIsDisabled(true);
    const token = await user?.getIdToken();
    const response = await fetch(`/api/test-submissions`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answers),
    });
    const res = await response.json();
    setFetchedData(res);
    setResultPage(false);

    router.push(
      `/result?testId=${testId}&testSubmissionId=${res._id}&part=${part}`
    );
  };
  const display = (
    <div className={questionLayouts.readingLayout}>
      <div className={questionLayouts.contextWrapper}>
        <TextCard
          width={'100%'}
          height={'100%'}
          className={clsx(
            textCardStyles['card_background-color_very-light-grey'],
            textCardStyles['card_overflow_scroll']
          )}
        >
          <ReadingContextLayout
            context={data.part_prompt}
            images={data.part_image_urls}
            onContextMenu={onContextMenu}
          />
        </TextCard>
        <div className={questionLayouts.buttonWrapper}>
          <Link href={'/ielts'}>
            <Button
              className={clsx(buttonStyles.webButton, 'ant-btn-red')}
              type={'primary'}
              onClick={() => {}}
            >
              Quay về
            </Button>
          </Link>
          <Button
            className={buttonStyles.webButton}
            type={'primary'}
            onClick={handleSubmitAnswer}
          >
            Nộp bài
          </Button>
        </div>
      </div>
      <div className={questionLayouts.questionContainer}>
        {questionGroups[currentQuestionGroup - 1]}
        <div className={questionLayouts.buttonWrapper}>
          {currentQuestionGroup > 1 && (
            <Button
              className={clsx(buttonStyles.webButton)}
              onClick={() => {
                setCurrentQuestionGroup((prev) => prev - 1);
              }}
            >
              Các câu hỏi trước
            </Button>
          )}
          {currentQuestionGroup < maxGroup && (
            <Button
              className={buttonStyles.webButton}
              onClick={() => {
                setCurrentQuestionGroup((prev) => prev + 1);
              }}
            >
              Các câu hỏi tiếp theo
            </Button>
          )}
        </div>
        {chatVisible && (
          <div>
            <CloseChatContext.Provider value={hideChat}>
              <BuddieSupport
                requests={chatRequests}
                setRequests={setChatRequests}
                isProcessing={isChatProcessing}
                setIsProcessing={setIsChatProcessing}
                width={'100%'}
              ></BuddieSupport>
            </CloseChatContext.Provider>
          </div>
        )}
      </div>
    </div>
  );
  return (
    <>
      {!isDisabled && display}
      {isDisabled && <Spin size="large">{display}</Spin>}
    </>
  );
}
