'use client';
import { Button } from 'antd';
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
import BuddieSuport from './BuddieSupport';
import { useState } from 'react';
import React from 'react';

interface data {
  part_number: number;
  part_duration: number;
  part_recording: string;
  part_prompt: string;
  part_image_urls: Array<string>;
  question_groups: Array<object>;
}
interface questiongroup {
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
  question_number: number;
  question_type: string;
  question_prompt: string;
  question_image_urls: Array<string>;
  question_duration: number;
  options: Array<string>;
  answer: Array<string> | string;
}
interface answer {
  [key: number]: string | Array<string>;
}
export default function ReadingLayout(props: {
  setPrevState: React.MouseEventHandler<HTMLDivElement>;
  setNextState: React.MouseEventHandler<HTMLDivElement>;
  data: data;
  setAnswer: React.Dispatch<React.SetStateAction<object>>;
  answers: answer;
}) {
  const [currentQuestionGroup, setCurrentQuestionGroup] = useState(1);
  const maxGroup = props.data['question_groups'].length;
  const questionGroups = props.data['question_groups'].map(
    (questionGroup: questiongroup, index: number) => {
      const questions = questionGroup['questions'].map((question: question) => {
        return (
          <React.Fragment key={question['question_number']}>
            {question['question_type'] === 'single_choice' && (
              <SingleChoiceLayout
                question={question['question_prompt']}
                options={question['options']}
                answer={question['answer'] as string}
                questionIndex={question['question_number']}
                setAnswer={props.setAnswer}
                userAnswer={props.answers[question['question_number']]}
              />
            )}
            {question['question_type'] === 'multiple_choices' && (
              <MultiChoiceLayout
                question={question['question_prompt']}
                options={question['options']}
                answers={question['answer'] as string[]}
                questionIndex={question['question_number']}
                setAnswer={props.setAnswer}
                userAnswer={props.answers[question['question_number']]}
              />
            )}
            {question['question_type'] === 'selection' && (
              <DropdownLayout
                question={question['question_prompt']}
                options={question['options']}
                answer={question['answer'] as string}
                questionIndex={question['question_number']}
                setAnswer={props.setAnswer}
                userAnswer={props.answers[question['question_number']]}
              />
            )}
            {question['question_type'] === 'completion' && (
              <FillTheBlankLayout
                question={question['question_prompt']}
                answer={question['answer'] as string}
                questionIndex={question['question_number']}
                setAnswer={props.setAnswer}
                userAnswer={props.answers[question['question_number']]}
              />
            )}
          </React.Fragment>
        );
      });
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
  return (
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
          <ReadingContextLayout context={props.data.part_prompt} />
        </TextCard>
        <div className={questionLayouts.buttonWrapper}>
          <Button
            className={clsx(buttonStyles.webButton, 'ant-btn-red')}
            type={'primary'}
            onClick={() => {}}
          >
            Kết thúc
          </Button>
          <Button
            className={buttonStyles.webButton}
            type={'primary'}
            onClick={() => {}}
          >
            Nộp bài
          </Button>
        </div>
      </div>
      <div className={questionLayouts.questionContainer}>
        {questionGroups[currentQuestionGroup - 1]}
        Buddie support here
        <div className={questionLayouts.buttonWrapper}>
          {currentQuestionGroup === 1 && (
            <Button
              className={clsx(buttonStyles.webButton, 'ant-btn-red')}
              type={'primary'}
              onClick={props.setPrevState}
            >
              Bài đọc trước
            </Button>
          )}
          {currentQuestionGroup > 1 && (
            <Button
              className={clsx(buttonStyles.webButton, 'ant-btn-red')}
              type={'primary'}
              onClick={() => {
                setCurrentQuestionGroup((prev) => prev - 1);
              }}
            >
              Các câu hỏi trước
            </Button>
          )}

          {currentQuestionGroup >= maxGroup && (
            <Button
              className={buttonStyles.webButton}
              type={'primary'}
              onClick={props.setNextState}
            >
              Bài đọc tiếp theo
            </Button>
          )}

          {currentQuestionGroup < maxGroup && (
            <Button
              className={buttonStyles.webButton}
              type={'primary'}
              onClick={() => {
                setCurrentQuestionGroup((prev) => prev + 1);
              }}
            >
              Các câu hỏi tiếp theo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
