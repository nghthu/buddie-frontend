'use client';

import styles from '@/styles/components/WritingAssessment.module.scss';
import { Progress, Spin } from 'antd';
import type { ProgressProps } from 'antd';
import TextCard from './TextCard';
// import { useState } from 'react';
import useSWR from 'swr';
import { auth } from '@/lib';
import { User } from 'firebase/auth';
// import merge from 'lodash/merge';

const vietnameseTitles = {
  task_achievement: 'Đáp ứng yêu cầu đề bài',
  coherence_and_cohesion: 'Sự liên kết và kết nối',
  lexical_resource: 'Từ vựng',
  grammatical_range_and_accuracy: 'Độ chính xác ngữ pháp',
};

interface Props {
  testId: string;
  testSubmissionId: string;
  part: string;
}

interface QuestionGroupInfo {
  question_groups_duration: number | null;
  question_groups_prompt: string | null;
  question_groups_recording: string | null;
  question_groups_image_urls: string[] | null;
}

interface AssessmentFeedback {
  band_score: number;
  examiner_feedback: string;
  band_descriptors: string;
}

interface Assessment {
  task_achievement: AssessmentFeedback;
  coherence_and_cohesion: AssessmentFeedback;
  lexical_resource: AssessmentFeedback;
  grammatical_range_and_accuracy: AssessmentFeedback;
  overall_presentation: AssessmentFeedback;
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
  final_score: number;
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
  assessment: Assessment;
}

// interface TestResult {
//   user_id: string;
//   test_id: string;
//   question_count: number;
//   correct_answer_count: number;
//   score: number;
//   parts: Part[];
// }

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

const conicColors: ProgressProps['strokeColor'] = {
  '0%': '#fea097',
  '50%': '#fcda6b',
  '100%': '#6cd53e',
};

const WritingAssessment = (props: Props) => {
  // const [testResultData, setTestResultData] = useState<TestResult | null>(null);
  const user = auth.currentUser;

  // const {
  //   data: test,
  //   isLoading: isTestDataLoading,
  //   error: testError,
  // } = useSWR({ url: `/api/tests/${props.testId}`, user }, fetcher);
  const {
    data: testSubmission,
    isLoading: isSubmissionDataLoading,
    // error: submissionError,
  } = useSWR(
    { url: `/api/test-submissions/${props.testSubmissionId}`, user },
    fetcher
  );

  // useEffect(() => {
  //   if (test && testSubmission && testResultData === null) {
  //     console.log('hehe', test);
  //     const mergedData = merge({}, test, testSubmission);
  //     console.log('haha', mergedData);
  //     if (props.part === 'all') setTestResultData(mergedData);
  //     else {
  //       const filteredParts = mergedData.parts.filter(
  //         (part: Part) => part.part_number === Number(props.part)
  //       );
  //       mergedData.parts = filteredParts;
  //       setTestResultData(mergedData);
  //     }
  //   }
  // }, [test, testSubmission, testResultData, props.part]);

  console.log('kkkk', testSubmission);

  if (isSubmissionDataLoading) return <Spin size="small" />;
  return (
    <>
      {testSubmission.parts.map((part: Part, partIndex: number) => (
        <div
          key={partIndex}
          className={styles.part}
        >
          {part.question_groups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className={styles.questionGroup}
            >
              {group.questions.map((question, questionIndex) => (
                <div
                  key={questionIndex}
                  className={styles.question}
                >
                  <div className={styles.overview}>
                    <div className={styles.overall}>
                      <Progress
                        type="circle"
                        percent={testSubmission.score * 10}
                        strokeColor={conicColors}
                        format={() => `${testSubmission.score}`}
                      />
                      <p>Điểm tổng kết</p>
                    </div>

                    <div className={styles.bars}>
                      <div className={styles['score-label']}>
                        <p>Đáp ứng yêu cầu đề bài</p>
                        <p>
                          {
                            question.answer_result.assessment.task_achievement
                              .band_score
                          }
                          /9
                        </p>
                      </div>
                      <div className={styles['score-bar']}>
                        <div
                          style={{
                            width: `${(question.answer_result.assessment.task_achievement.band_score * 270) / 9}px`,
                          }}
                          className={styles['score-bar-value']}
                        ></div>
                      </div>
                      <div className={styles['score-label']}>
                        <p>Sự liên kết và kết nối</p>
                        <p>
                          {
                            question.answer_result.assessment
                              .coherence_and_cohesion.band_score
                          }
                          /9
                        </p>
                      </div>
                      <div className={styles['score-bar']}>
                        <div
                          style={{
                            width: `${(question.answer_result.assessment.coherence_and_cohesion.band_score * 270) / 9}px`,
                          }}
                          className={styles['score-bar-value']}
                        ></div>
                      </div>
                      <div className={styles['score-label']}>
                        <p>Từ vựng</p>
                        <p>
                          {
                            question.answer_result.assessment.lexical_resource
                              .band_score
                          }
                          /9
                        </p>
                      </div>
                      <div className={styles['score-bar']}>
                        <div
                          style={{
                            width: `${(question.answer_result.assessment.lexical_resource.band_score * 270) / 9}px`,
                          }}
                          className={styles['score-bar-value']}
                        ></div>
                      </div>
                      <div className={styles['score-label']}>
                        <p>Độ chính xác ngữ pháp</p>
                        <p>
                          {
                            question.answer_result.assessment
                              .grammatical_range_and_accuracy.band_score
                          }
                          /9
                        </p>
                      </div>
                      <div className={styles['score-bar']}>
                        <div
                          style={{
                            width: `${(question.answer_result.assessment.grammatical_range_and_accuracy.band_score * 270) / 9}px`,
                          }}
                          className={styles['score-bar-value']}
                        ></div>
                      </div>
                      {/* <div className={styles['score-label']}>
                        <p>Overall Presentation</p>
                        <p>
                          {
                            question.answer_result.assessment
                              .overall_presentation.band_score
                          }
                          /9
                        </p>
                      </div>
                      <div className={styles['score-bar']}>
                        <div
                          style={{
                            width: `${(question.answer_result.assessment.overall_presentation.band_score * 270) / 9}px`,
                          }}
                          className={styles['score-bar-value']}
                        ></div>
                      </div> */}
                    </div>
                  </div>
                  Câu trả lời:
                  <TextCard
                    width="100%"
                    height="100%"
                  >
                    {question.answer_result.user_answer}
                  </TextCard>
                  <div className={styles.detailed}>
                    {/* Detailed assessment section */}
                    {Object.entries(question.answer_result.assessment).map(
                      ([key, value]) =>
                        vietnameseTitles[
                          key as keyof typeof vietnameseTitles
                        ] && (
                          <div
                            key={key}
                            className={styles.detailItem}
                          >
                            <h3 className={styles.heading}>
                              {vietnameseTitles[
                                key as keyof typeof vietnameseTitles
                              ] || 'Unknown Title'}
                            </h3>
                            <p>
                              <strong>Phản hồi:</strong>{' '}
                              {value.examiner_feedback}
                            </p>
                            <p>
                              <strong>Tiêu chí đánh giá:</strong>{' '}
                              {value.band_descriptors}
                            </p>
                          </div>
                        )
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default WritingAssessment;
