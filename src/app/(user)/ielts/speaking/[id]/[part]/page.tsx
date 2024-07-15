'use client';

import 'regenerator-runtime/runtime';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import styles from '@/styles/pages/speaking/Practice.module.scss';
import { Button } from 'antd';
import { AudioOutlined, EllipsisOutlined } from '@ant-design/icons';
import TextCard from '@/components/TextCard';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Checkbox } from 'antd';
import type { CheckboxProps } from 'antd';
import { auth } from '@/lib';
import { User } from 'firebase/auth';
import { Spin } from 'antd';
import useSWR from 'swr';
import { DoubleRightOutlined } from '@ant-design/icons';
import { CloseChatContext } from '@/components/CloseChatContext';
import BuddieSupport from '@/components/BuddieSupport';
import SpeakingFunctionMenu from '@/components/SpeakingFunctionMenu';
import clsx from 'clsx';

const mimeType: string = 'audio/webm';

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

interface Part {
  part_duration: number;
  part_image_urls: string[];
  part_number: number;
  part_prompt: string;
  part_recording: string;
  _id: string;
  question_groups: QuestionGroup[];
}

interface AnswerResult {
  user_answer: string;
}

interface Answer {
  _id: string;
  answer_result: AnswerResult;
  audio: Blob;
  transcript: string;
}

interface AudioResponse {
  key: string;
  filename: string;
}

const PracticeSpeaking = ({
  params,
}: {
  params: { id: string; part: string };
}) => {
  const [currentPart, setCurrentPart] = useState(0);
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState('inactive');
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<Blob | null>(null);
  const [instruction, setInstruction] = useState(true);
  const [wantToSubmit, setWantToSubmit] = useState(false);
  const [testData, setTestData] = useState<QuestionGroup | null>(null);
  const [disable, setDisable] = useState(false);
  const [submitAnswers, setSubmitAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatRequests, setChatRequests] = useState<
    Array<{ avatar: string; request: string; response: string }>
  >([]);
  const [isChatProcessing, setIsChatProcessing] = useState(false);
  const [selection, setSelection] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const router = useRouter();
  const user = auth.currentUser;
  let finalPart = 0;

  const { data, isLoading } = useSWR(
    { url: `/api/tests/${params.id}`, user },
    fetcher
  );

  finalPart = data?.parts.length - 1;

  if (data && testData === null) {
    console.log(data);
    let dataOfTest = data.parts[0].question_groups[0];
    if (params.part !== 'all') {
      dataOfTest = data.parts[Number(params.part) - 1].question_groups[0];
    } else {
      setCurrentPart(0);
    }
    dataOfTest.questions.unshift({
      question_number: 0,
      question_type: 'mic test',
      question_prompt:
        'Trước khi bắt đầu, hãy kiểm tra micro của bạn bằng cách nhấn vào nút bên dưới và ghi âm.',
      question_image_urls: [],
      question_duration: 0,
      question_preparation_time: 5,
      question_recording: '',
    });
    setTestData(dataOfTest);
  }

  const startRecording = async (streamData: MediaStream) => {
    setRecordingStatus('recording');
    setDisable(true);
    if (streamData) {
      const media = new MediaRecorder(streamData, { mimeType });
      mediaRecorder.current = media;
      mediaRecorder.current.start();
      const localAudioChunks: Blob[] = [];
      mediaRecorder.current.ondataavailable = (event) => {
        if (typeof event.data === 'undefined') return;
        if (event.data.size === 0) return;
        localAudioChunks.push(event.data);
      };
      setAudioChunks(localAudioChunks);
    }
  };

  const stopRecording = () => {
    setDisable(false);
    SpeechRecognition.stopListening();
    setRecordingStatus('inactive');
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudio(audioUrl);
        setAudioChunks([]);
        setCurrentAnswer(audioBlob);
      };
    }
  };

  const getMicrophonePermission = async () => {
    if ('MediaRecorder' in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        setPermission(true);
        setStream(streamData);
        startRecording(streamData);
        listenContinuously();
        resetTranscript();
      } catch (err) {
        alert((err as Error).message);
      }
    } else {
      alert('API MediaRecorder không được hỗ trợ trong trình duyệt của bạn.');
    }
  };

  const recordHandler = () => {
    if (!permission) {
      getMicrophonePermission();
    } else {
      if (recordingStatus === 'inactive') {
        if (stream) {
          startRecording(stream);
          listenContinuously();
          resetTranscript();
        }
      } else if (recordingStatus === 'recording') {
        stopRecording();
      }
    }
  };

  if (
    typeof window !== 'undefined' &&
    !SpeechRecognition.browserSupportsSpeechRecognition()
  ) {
    console.log(
      'Speech Recognition không được hỗ trợ trong trình duyệt của bạn.'
    );
    return null;
  }

  const listenContinuously = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US',
    });
  };

  const startHandler = () => {
    setInstruction(true);
  };

  const nextHandler = async () => {
    if (currentQuestion === 0) {
      setCurrentQuestion(1);
      setInstruction(false);
    } else {
      if (testData) {
        if (currentAnswer && wantToSubmit) {
          console.log('kkk', testData), currentQuestion;
          setSubmitAnswers((prevAnswers) => [
            ...prevAnswers,
            {
              _id: testData.questions[currentQuestion]._id,
              answer_result: { user_answer: '' },
              audio: currentAnswer,
              transcript: transcript,
            },
          ]);
          console.log('logcheck2', submitAnswers, submitAnswers);
        }
        if (currentQuestion < testData.questions.length - 1) {
          console.log('logcheck', currentQuestion);
          setCurrentQuestion((prevQuestion) => prevQuestion + 1);
        } else if (currentQuestion === testData.questions.length - 1) {
          // handle submit
          console.log('submit');
          const token = await user?.getIdToken();
          const formData = new FormData();

          submitAnswers.forEach((answer) => {
            formData.append(`audios`, answer.audio, `{${answer._id}.webm`);
          });
          console.log(currentPart);
          formData.append('part', (currentPart + 1).toString());
          formData.append('testId', params.id);

          await fetch(`/api/file`, {
            method: 'POST',
            headers: {
              authorization: `Bearer ${token}`,
            },
            body: formData,
          });
        }
      }
    }
    setAudio(null);
    setCurrentAnswer(null);
    resetTranscript();
  };

  const nextPartHandler = async () => {
    const nextPart = currentPart + 1;
    setCurrentPart((prevPart) => prevPart + 1);
    setTestData(data.parts[nextPart].question_groups[0]);
    setCurrentQuestion(1);
    // handle submit
    console.log('submit');
    const token = await user?.getIdToken();
    const formData = new FormData();

    submitAnswers.forEach((answer) => {
      formData.append(`audios`, answer.audio, `{${answer._id}.webm`);
    });
    console.log(currentPart);
    formData.append('part', (currentPart + 1).toString());
    formData.append('testId', params.id);

    const response = await fetch(`/api/file`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseData: AudioResponse[] =
      (await response.json()) as AudioResponse[];

    submitAnswers.forEach((answer) => {
      const answerId = answer._id;

      responseData.forEach((item) => {
        const filename = item.filename;
        if (filename.includes(answerId)) {
          // Perform your logic here if filename matches
          console.log(
            `Match found for answer ID ${answerId} with filename ${filename}`
          );
          // Example logic: Update UI or perform additional actions
        }
      });
    });

    const structuredAnswers = {
      test_id: data._id,
      parts: data.parts.map((part: Part, index: number) => ({
        part_number: index + 1,
        _id: part._id,
        question_groups: part.question_groups.map(
          (questionGroup: QuestionGroup) => ({
            _id: questionGroup._id,
            questions: questionGroup.questions.map((question) => {
              const userAnswer = submitAnswers.find(
                (answer) => answer._id === question._id
              );
              let audioKey = '';
              if (userAnswer) {
                responseData.forEach((item) => {
                  const filename = item.filename;
                  if (filename.includes(userAnswer._id)) {
                    audioKey = item.key;
                  }
                });
              }

              return {
                _id: question._id,
                answer_result: {
                  user_answer: audioKey ? audioKey : '',
                },
              };
            }),
          })
        ),
      })),
    };

    console.log('ddd', structuredAnswers);
  };

  const setSubmitHandler: CheckboxProps['onChange'] = (e) => {
    setWantToSubmit(e.target.checked);
  };

  const submitHandler = async () => {
    setIsSubmitting(true);
    if (currentAnswer && wantToSubmit && testData) {
      setSubmitAnswers((prevAnswers) => [
        ...prevAnswers,
        {
          _id: testData.questions[currentQuestion]._id,
          answer_result: { user_answer: '' },
          audio: currentAnswer,
          transcript: transcript,
        },
      ]);
      const token = await user?.getIdToken();
      const formData = new FormData();

      formData.append('part', params.part);
      formData.append('testId', params.id);
      formData.append('audios', currentAnswer, 'answer.webm');

      const response = await fetch(`/api/file`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData: AudioResponse[] =
        (await response.json()) as AudioResponse[];

      const structuredAnswers = {
        test_id: data._id,
        parts: data.parts
          .map((part: Part, index: number) => ({
            part_number: index + 1,
            _id: part._id,
            question_groups: part.question_groups.map(
              (questionGroup: QuestionGroup) => ({
                _id: questionGroup._id,
                questions: [
                  {
                    _id: testData.questions[currentQuestion]._id,
                    answer_result: {
                      user_answer: responseData[0].key,
                      transcript: transcript,
                    },
                  },
                ],
              })
            ),
          }))
          .filter((part: Part) => part.part_number === 2),
      };

      console.log('logcheck2', structuredAnswers);

      const submissionResponse: Response = await fetch(
        `/api/test-submissions`,
        {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(structuredAnswers),
        }
      );

      const submissionData = await submissionResponse.json();
      router.push(
        `/result?speaking=true&testId=${params.id}&testSubmissionId=${submissionData._id}&part=${params.part}`
      );

      console.log('Send Answer: ', structuredAnswers);
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

  const callProposeSpeakingAPI = async () => {
    const token = await user?.getIdToken();

    const response = await fetch('/api/ai/propose-speaking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        topic: selection,
      }),
    });

    const data = await response.json();
    console.log(data);
    return data;
  };

  const showChat = async (message: string) => {
    setIsChatProcessing(true);
    setMenuVisible(false);

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

    if (message === 'Đề xuất ý nói') {
      apiResponse = await callProposeSpeakingAPI();
      request.response = apiResponse.data.proposed;
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

  if (isLoading) return <Spin size="large" />;

  const isAllPart = params.part === 'all';
  // console.log(
  //   testData?.questions,
  //   testData?.questions.length - 1,
  //   currentQuestion
  // );

  const isLastQuestionOfPart =
    currentQuestion === (testData?.questions && testData.questions.length - 1);
  const isFinalPart = currentPart === finalPart;

  return (
    <>
      {!instruction && (
        <>
          <div className={styles.question}>
            <img
              className={styles.logo}
              src="/images/logo/main.svg"
            />
            {testData?.question_groups_info.question_groups_prompt ? (
              <p>{testData?.question_groups_info.question_groups_prompt}</p>
            ) : (
              <p>
                Please remember not to reveal any personal information during
                the speaking test.
              </p>
            )}
          </div>
          <Button
            className={styles.next}
            onClick={startHandler}
          >
            Tiếp theo
          </Button>
        </>
      )}
      {instruction && (
        <div className={styles['test-content']}>
          <div
            className={clsx(
              styles['question-content'],
              !chatVisible ? styles['full-width'] : ''
            )}
          >
            <div
              className={styles.question}
              onClick={hideMenu}
            >
              <img
                className={styles.logo}
                src="/images/logo/main.svg"
              />
              <div
                className={styles['question-prompt']}
                onContextMenu={showMenu}
              >
                {testData?.questions[currentQuestion]?.question_prompt}
              </div>
              {currentQuestion > 0 && (
                <Checkbox
                  onChange={setSubmitHandler}
                  className={styles['set-submit']}
                >
                  Nộp câu này
                </Checkbox>
              )}
            </div>
            <Button
              className={styles['audio-btn']}
              onClick={recordHandler}
            >
              {recordingStatus === 'inactive' && <AudioOutlined />}
              {recordingStatus === 'recording' && <EllipsisOutlined />}
            </Button>
            {audio ? (
              <div className={styles['audio-container']}>
                <audio
                  src={audio}
                  controls
                ></audio>
              </div>
            ) : null}
            <TextCard
              width="50%"
              height="170px"
              className={styles.transcription}
            >
              {transcript}
            </TextCard>
            <div className={styles['action-btn']}>
              <Button onClick={() => router.push('/ielts')}>Thoát</Button>

              {currentQuestion === 0 &&
                (!isAllPart || (isAllPart && currentPart === 0)) && (
                  <Button onClick={nextHandler}>Bắt đầu</Button>
                )}

              {((currentQuestion !== 0 &&
                currentPart === 0 &&
                !isLastQuestionOfPart) ||
                (!isLastQuestionOfPart && currentPart !== 0)) && (
                <Button
                  onClick={nextHandler}
                  disabled={disable}
                >
                  <DoubleRightOutlined />
                </Button>
              )}

              {isLastQuestionOfPart && isAllPart && (
                <Button
                  onClick={nextPartHandler}
                  disabled={disable}
                >
                  Phần thi tiếp theo
                </Button>
              )}

              {isLastQuestionOfPart &&
                (!isAllPart || (isAllPart && isFinalPart)) && (
                  <Button
                    onClick={submitHandler}
                    disabled={disable || !(currentAnswer && wantToSubmit)}
                    loading={isSubmitting}
                  >
                    Nộp bài
                  </Button>
                )}
            </div>
            <SpeakingFunctionMenu
              visible={menuVisible}
              position={menuPosition}
              onMenuItemClick={showChat}
            />
            <div />
          </div>
          {chatVisible && (
            <div className={styles['BS-content']}>
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
      )}
    </>
  );
};

export default PracticeSpeaking;
