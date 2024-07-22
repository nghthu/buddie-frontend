'use client';

import styles from '@/styles/components/SpeakingAssessment.module.scss';
import { Progress, Spin } from 'antd';
import type { ProgressProps } from 'antd';
import AudioPlayer from './AudioPlayer';
import useSWR from 'swr';
import { auth } from '@/lib';
import { User } from 'firebase/auth';
import TextCard from './TextCard';

interface Props {
  testId: string;
  testSubmissionId: string;
  part: string;
}

interface SentenceDetail {
  level: string;
  word: string;
  pronunciation: number;
}

interface GrammarOperation {
  type: string;
  end1: number;
  end2: number;
  start1: number;
  start2: number;
}

interface Sentence {
  sentence: string;
  grammar: {
    corrected?: string;
    operations?: GrammarOperation[];
  };
  details: SentenceDetail[];
}

interface Assessment {
  transcription: string;
  overall: number;
  fluency_coherence: number;
  lexical_resource: number;
  grammar: number;
  pronunciation: number;
  relevance: number;
  sentences: Sentence[];
}

interface AnswerResult {
  user_answer_url: string;
  assessment: Assessment;
  transcript: string;
}

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
  _id: string;
}

const conicColors: ProgressProps['strokeColor'] = {
  '0%': '#fea097',
  '50%': '#fcda6b',
  '100%': '#6cd53e',
};

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

const SpeakingAssessment = (props: Props) => {
  const user = auth.currentUser;

  const {
    data: testSubmission,
    isLoading: isSubmissionDataLoading,
    // error: submissionError,
  } = useSWR(
    { url: `/api/test-submissions/${props.testSubmissionId}`, user },
    fetcher
  );

  console.log('kkkk', testSubmission);

  if (isSubmissionDataLoading) return <Spin size="small" />;

  return (
    <>
      {testSubmission.parts.map((part: Part) => (
        <div key={part._id}>
          {part.question_groups.map((group: QuestionGroup) => (
            <div key={group._id}>
              {group.questions.map((question: Question, index: number) => (
                <div key={index}>
                  <div className={styles.overview}>
                    <div className={styles.overall}>
                      <Progress
                        type="circle"
                        percent={question.answer_result.assessment.overall * 10}
                        strokeColor={conicColors}
                        format={() =>
                          `${question.answer_result.assessment.overall}`
                        }
                      />
                      <p>Tổng</p>
                    </div>

                    <div className={styles.score}>
                      <div className={styles['score-label']}>
                        <p>Trôi chảy và mạch lạc</p>
                        <p>
                          {question.answer_result.assessment.fluency_coherence}
                          /9
                        </p>
                      </div>
                      <div className={styles['score-bar']}>
                        <div
                          style={{
                            width: `${(question.answer_result.assessment.fluency_coherence * 270) / 9}px`,
                          }}
                          className={styles['score-bar-value']}
                        ></div>
                      </div>

                      <div className={styles['score-label']}>
                        <p>Khả năng sử dụng từ vựng</p>
                        <p>
                          {question.answer_result.assessment.lexical_resource}/9
                        </p>
                      </div>
                      <div className={styles['score-bar']}>
                        <div
                          style={{
                            width: `${(question.answer_result.assessment.lexical_resource * 270) / 9}px`,
                          }}
                          className={styles['score-bar-value']}
                        ></div>
                      </div>

                      <div className={styles['score-label']}>
                        <p>Ngữ pháp</p>
                        <p>{question.answer_result.assessment.grammar}/9</p>
                      </div>
                      <div className={styles['score-bar']}>
                        <div
                          style={{
                            width: `${(question.answer_result.assessment.grammar * 270) / 9}px`,
                          }}
                          className={styles['score-bar-value']}
                        ></div>
                      </div>

                      <div className={styles['score-label']}>
                        <p>Phát âm</p>
                        <p>
                          {question.answer_result.assessment.pronunciation}/9
                        </p>
                      </div>
                      <div className={styles['score-bar']}>
                        <div
                          style={{
                            width: `${(question.answer_result.assessment.pronunciation * 270) / 9}px`,
                          }}
                          className={styles['score-bar-value']}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.audio}>
                    <AudioPlayer
                      audioUrl={question.answer_result.user_answer_url}
                    />
                  </div>

                  <TextCard
                    width="80%"
                    height="auto"
                    className={styles.transcription}
                  >
                    {question.answer_result.assessment.sentences.map(
                      (sentence, index) => (
                        <p key={index}>
                          {sentence.details.map((word, i) => {
                            const isCorrected =
                              sentence.grammar &&
                              sentence.grammar.operations &&
                              sentence.grammar.operations.some(
                                (op) => op.start2 === i
                              );

                            const isIncorrect =
                              sentence.grammar &&
                              sentence.grammar.operations &&
                              sentence.grammar.operations.some(
                                (op) => op.start1 === i
                              );

                            const pronunciationClass =
                              word.pronunciation > 80
                                ? styles.green
                                : word.pronunciation >= 50
                                  ? styles.yellow
                                  : styles.red;

                            return (
                              <span
                                key={i}
                                className={`${pronunciationClass} ${
                                  isCorrected ? styles.corrected : ''
                                }`}
                              >
                                {isIncorrect ? (
                                  <del>{word.word}</del>
                                ) : (
                                  word.word
                                )}{' '}
                                {isIncorrect && isCorrected ? (
                                  <span className={styles.correctedWord}>
                                    {sentence.grammar.corrected?.split(' ')[i]}{' '}
                                  </span>
                                ) : null}
                              </span>
                            );
                          })}
                        </p>
                      )
                    )}
                  </TextCard>
                  <div className={styles.note}>
                    <p>Ghi chú:</p>
                    <p>
                      <del className={styles.red}>hyphenated word</del> cho biết
                      từ này dùng sai ngữ pháp.
                    </p>
                    <p>
                      <span className={styles.red}>red word</span> cho biết bạn
                      phát âm chưa tốt, điểm nhận được từ 0-50.
                    </p>
                    <p>
                      <span className={styles.yellow}>yellow word</span> cho
                      biết bạn phát âm trung bình, điểm nhận được từ 50-80.
                    </p>
                    <p>
                      <span className={styles.green}>green word</span> cho biết
                      bạn phát âm rất tốt, điểm nhận được từ 80-100.
                    </p>
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

export default SpeakingAssessment;
