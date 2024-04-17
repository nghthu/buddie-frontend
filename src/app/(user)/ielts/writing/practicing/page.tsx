'use client';

import { useState, useRef, useEffect } from 'react';
import CountdownClock from '@/components/CountdownClock';
import styles from '@/styles/pages/writing/Writing.module.scss';
import WritingFunctionMenu from '@/components/WritingFunctionMenu';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import BuddieSupport from '@/components/BuddieSupport';
import { CloseChatContext } from '@/components/CloseChatContext';
import { auth } from '@/lib';

type PartData =
  | {
      part_number: number;
      part_duration: number;
      part_recording: string;
      part_prompt: string;
      part_image_urls: string[];
      question_groups: any[];
    }
  | undefined;

export default function PracticePage() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [chatVisible, setChatVisible] = useState(false);
  const searchParams = useSearchParams();
  const part = searchParams.get('part');
  const [selection, setSelection] = useState<string>('');
  const [chatRequests, setChatRequests] = useState<
    Array<{ avatar: string; request: string; response: string }>
  >([]);
  const [partData, setPartData] = useState<PartData>(undefined);
  const [resultData, setResultData] = useState<
    Array<{ topic: string; content: string }>
  >([]);
  const user = auth.currentUser;

  //Dummy data
  const partsData = {
    parts: [
      {
        part_number: 1,
        part_duration: 1200,
        part_recording: '',
        part_prompt: '',
        part_image_urls: [],
        question_groups: [
          {
            is_single_question: true,
            question_groups_info: {},
            questions: [
              {
                question_number: 1,
                question_type: 'writing',
                question_prompt:
                  'You should spend about 20 minutes on this task.\n\nThe bar chart below describes some changes about the percentage of people were born in Australia and who were born outside Australia living in urban, rural and town between 1995 and 2010.\nSummarise the information by selecting and reporting the main features and make comparisons where relevant.\nYou should write at least 150 words.',
                question_image_urls: [
                  'https://iotcdn.oss-ap-southeast-1.aliyuncs.com/2021-12/Platypus-01_0.png',
                ],
                question_duration: 1200,
              },
            ],
          },
        ],
      },
      {
        part_number: 2,
        part_duration: 2400,
        part_recording: '',
        part_prompt: '',
        part_image_urls: [],
        question_groups: [
          {
            is_single_question: true,
            question_groups_info: {},
            questions: [
              {
                question_number: 2,
                question_type: 'writing',
                question_prompt:
                  'You should spend about 40 minutes on this task.\nRich countries often give money to poorer countries, but it does not solve poverty. Therefore, developed countries should give other types of help to the poor countries rather than financial aid. To what extent do you agree or disagree?\nYou should write at least 250 words.',
                question_image_urls: [],
                question_duration: 2400,
              },
            ],
          },
        ],
      },
    ],
  };

  const question =
    partData?.question_groups[0].questions[
      Math.floor(Math.random() * partData.question_groups[0].questions.length)
    ];

  useEffect(() => {
    let partData;
    if (part === '1' || part === 'all') {
      partData = partsData.parts.find((p) => p.part_number === 1);
    } else if (part === '2') {
      partData = partsData.parts.find((p) => p.part_number === 2);
    }

    setPartData(partData);
  }, [part]);

  useEffect(() => {
    localStorage.setItem('resultData', JSON.stringify(resultData));
  }, [resultData]);

  const handleDoneButtonClick = () => {
    if (question && textareaRef.current) {
      setResultData((prevResults) => [
        ...prevResults,
        {
          topic: question?.question_prompt,
          content: textareaRef.current?.value || '',
        },
      ]);
    }
    console.log(resultData);
  };

  const showMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    let newSelection = '';
    if ((event.target as Element).tagName === 'TEXTAREA') {
      newSelection =
        '"' +
          textareaRef.current?.value.substring(
            textareaRef.current?.selectionStart || 0,
            textareaRef.current?.selectionEnd || 0
          ) +
          '"' || '';
    } else if ((event.target as Element).tagName === 'DIV') {
      newSelection = '"' + window.getSelection()?.toString() + '"' || '';
    }

    if (newSelection != '""') {
      setSelection(newSelection);
      setMenuVisible(true);
      setMenuPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const hideMenu = () => {
    setMenuVisible(false);
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

  const showChat = async (message: string) => {
    let apiResponse;
    let request = {
      avatar: '/images/avatar.jpg',
      request: message + ' ' + selection,
      response: 'Đang xử lý... đợi Buddie chút nhé!',
    };

    setChatRequests((prevRequests) => [...prevRequests, request]);
    setChatVisible(true);

    if (message === 'Dịch') {
      request.response = 'Đang dịch...';
    }

    if (message === 'Viết lại') {
      apiResponse = await callParaphraseAPI(
        question?.question_prompt,
        selection
      );
      request.response = apiResponse.data.paraphrased;
    }

    setChatRequests((prevRequests) => {
      let newRequests = [...prevRequests];
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
          IETLS Writing Task {partData?.part_number}
        </h2>

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
              {question?.question_prompt}
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
                  You should spend about 20 minutes on this task
                </p>
              </div>
              <CountdownClock />
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
              <Link href="/ielts/writing">
                <button className={styles.redButton}>Thoát</button>
              </Link>

              <Link
                href={
                  part === 'all'
                    ? '/ielts/writing/practicing?part=2'
                    : {
                        pathname: '/ielts/writing/result',
                      }
                }
              >
                <button
                  className={styles.primaryButton}
                  onClick={handleDoneButtonClick}
                >
                  Xong
                </button>
              </Link>
            </div>
          </div>

          {chatVisible && (
            <div>
              <CloseChatContext.Provider value={hideChat}>
                <BuddieSupport requests={chatRequests} />
              </CloseChatContext.Provider>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
