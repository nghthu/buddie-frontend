'use client';

import { useState, useRef, useEffect } from 'react';
// import CountdownClock from '@/components/CountdownClock';
import styles from '@/styles/pages/writing/Writing.module.scss';
import WritingFunctionMenu from '@/components/WritingFunctionMenu';
import Link from 'next/link';
import BuddieSupport from '@/components/BuddieSupport';
import { CloseChatContext } from '@/components/CloseChatContext';
import { auth } from '@/lib';
import { Button, Spin } from 'antd';
import { useRouter } from 'next/navigation';

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

type PartData =
  | {
      part_number: number;
      part_duration: number;
      part_recording: string;
      part_prompt: string;
      part_image_urls: string[];
      question_groups: QuestionGroup[];
    }
  | undefined;

export default function PracticePage({
  params,
}: {
  params: { id: string; part: string };
}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [chatVisible, setChatVisible] = useState(false);
  const part = params.part;
  const [selection, setSelection] = useState<string>('');
  const [chatRequests, setChatRequests] = useState<
    Array<{ avatar: string; request: string; response: string }>
  >([]);
  const [partData, setPartData] = useState<PartData>(undefined);
  const [resultData, setResultData] = useState<
    Array<{ topic: string; content: string }>
  >([]);
  const [isChatProcessing, setIsChatProcessing] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = auth.currentUser;
  const router = useRouter();

  const getPartData = async () => {
    const token = await user?.getIdToken();

    const response = await fetch(`/api/tests/${params.id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    return result.data;
  };

  const question =
    partData?.question_groups[0].questions[
      Math.floor(Math.random() * partData.question_groups[0].questions.length)
    ];

  useEffect(() => {
    setIsDataLoading(true);

    const fetchPartData = async () => {
      const data = await getPartData();
      let partData;
      if (data && data.parts) {
        if (part === '1' || part === 'all') {
          partData = data.parts.find(
            (p: { part_number: number }) => p.part_number === 1
          );
        } else if (part === '2') {
          partData = data.parts.find(
            (p: { part_number: number }) => p.part_number === 2
          );
        }
      }

      setPartData(partData);
      setIsDataLoading(false);
    };

    fetchPartData();
  }, [part]);

  useEffect(() => {
    localStorage.setItem('resultData', JSON.stringify(resultData));
  }, [resultData]);

  const handleDoneButtonClick = async () => {
    setLoading(true);
    const userAnswer = textareaRef.current?.value || '';
    if (question && textareaRef.current) {
      setResultData((prevResults) => [
        ...prevResults,
        {
          topic: question?.question_prompt,
          content: textareaRef.current?.value || '',
        },
      ]);
    }

    let submittedAnswers;

    if (part == 'all'){
      const part1Answer = partData?.question_groups.map((group) => ({
        _id: group._id,
        part_number: 1,
        question_groups: [
          {
            _id: group._id,
            questions: group.questions.map((q) => ({
              _id: q._id,
              answer_result: {
                user_answer: userAnswer,
              },
            })),
          },
        ],
      }));

      localStorage.setItem('part1Answer', JSON.stringify(part1Answer));

      router.push(`/ielts/writing/${params.id}/2`);
    } else {
      if (part == '1') {
        submittedAnswers = {
          test_id: params.id,
          parts: partData?.question_groups.map((group) => ({
            _id: group._id,
            part_number: part,
            question_groups: [
              {
                _id: group._id,
                questions: group.questions.map((q) => ({
                  _id: q._id,
                  answer_result: {
                    user_answer: userAnswer,
                  },
                })),
              },
            ],
          })),
        };
      } else if (part == '2') {
        const part1Answer = JSON.parse(localStorage.getItem('part1Answer') || '[]');
        console.log('part1Answer', part1Answer);
  
        if (part1Answer[0].question_groups[0].questions[0].answer_result.user_answer === '') {
          submittedAnswers = {
            test_id: params.id,
            parts: partData?.question_groups.map((group) => ({
              _id: group._id,
              part_number: part,
              question_groups: [
                {
                  _id: group._id,
                  questions: group.questions.map((q) => ({
                    _id: q._id,
                    answer_result: {
                      user_answer: userAnswer,
                    },
                  })),
                },
              ],
            })),
          };
        } else {
          submittedAnswers = {
            test_id: params.id,
            parts: [
              ...part1Answer,
              {
                _id: partData?.question_groups[0]._id,
                part_number: part,
                question_groups: [
                  {
                    _id: partData?.question_groups[0]._id,
                    questions: partData?.question_groups[0].questions.map((q) => ({
                      _id: q._id,
                      answer_result: {
                        user_answer: userAnswer,
                      },
                    })),
                  },
                ],
              },
            ],
          };
        }
      }
  
      console.log('submit', submittedAnswers);
        const token = await user?.getIdToken();
    
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
          `/result?writing=true&testId=${params.id}&testSubmissionId=${responseData._id}&part=${params.part}`
        );
    } 
  };

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
    console.log(data);
    return data;
  };

  const callParaphraseAPI = async (topic: string, content: string) => {
    const token = await user?.getIdToken();

    const response = await fetch('/api/ai/paraphrase-writing/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: 'essay',
        topic: topic,
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
      if (question && question.question_prompt)
        apiResponse = await callParaphraseAPI(
          question?.question_prompt,
          selection
        );
      request.response = apiResponse.data.paraphrased;
      setIsChatProcessing(false);
    }

    if (message === 'Từ đồng nghĩa') {
      apiResponse = await callSynonymsAPI(selection);
      request.response = apiResponse.data.synonyms.join(', ');
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

  const hideChat = () => {
    setChatVisible(false);
  };

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.title}>
          IELTS Writing Task {partData?.part_number}
        </h2>

        {isDataLoading ? (
          <Spin size="large" />
        ) : (
          <div
            className={`${styles.practiceContainer} ${
              chatVisible ? styles.chatVisible : styles.chatHidden
            }`}
            onClick={hideMenu}
          >
            <div className={styles.taskContainer}>
              <div
                className={styles.task}
                onContextMenu={showMenu}
              >
                {question?.question_prompt.split('.').slice(1).join('.')}
              </div>

              {part !== '2' && (
                <div className={styles.imgContainer}>
                  <img
                    src={question?.question_image_urls[0]}
                    alt="IELTS Writing Task 1"
                  />
                  <WritingFunctionMenu
                    visible={menuVisible}
                    position={menuPosition}
                    onMenuItemClick={showChat}
                  />
                </div>
              )}
              <div className={styles.answerHeader}>
                <div className={styles.instruction}>
                  <img
                    className={styles.instructionImg}
                    src="/images/logo/main.svg"
                    alt=""
                  />
                  <p className={styles.textPracticing}>
                    {question?.question_prompt.split('.')[0]}
                  </p>
                </div>
                {/* <CountdownClock /> */}
              </div>
              <div className={styles.answerContainer}>
                <p className={styles.textPracticing}>Trả lời:</p>
                <textarea
                  ref={textareaRef}
                  className={styles.answerInput}
                  onContextMenu={showMenu}
                />
                <WritingFunctionMenu
                  visible={menuVisible}
                  position={menuPosition}
                  onMenuItemClick={showChat}
                />
              </div>
              <div className={styles.practiceButtonContainer}>
                <Link href="/ielts">
                  <button className={styles.redButton}>Thoát</button>
                </Link>

                <Button
                  onClick={handleDoneButtonClick}
                  loading={loading}
                >
                  Xong
                </Button>
              </div>
            </div>

            {chatVisible && (
              <div>
                {/* 
                  - hideChat(){setChatVisible(false);} 
                  - requests: Array<{ avatar: user?.photoURL; request: 'Người dùng nhắn'; response: 'Buddie trả lời' }>
                  - Thêm request vào chatRequests: 
                  1. Tạo request
                  2. Call API để lấy response
                  3. setChatRequests để thêm request vào chatRequests
                  - setRequests: props này để setChatRequests của nút dịch câu trả lời
                  - isProcessing: props này để tắt nút dịch câu trả lời khi đang xử lý
                  - setIsProcessing: props này để setIsChatProcessing(false) khi xử lý xong
                 */}
                <CloseChatContext.Provider value={hideChat}>
                  <BuddieSupport
                    requests={chatRequests}
                    setRequests={setChatRequests}
                    isProcessing={isChatProcessing}
                    setIsProcessing={setIsChatProcessing}
                  ></BuddieSupport>
                </CloseChatContext.Provider>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
