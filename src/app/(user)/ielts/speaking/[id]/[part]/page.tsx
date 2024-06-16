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
// import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { DoubleRightOutlined } from '@ant-design/icons';

const mimeType: string = 'audio/webm';
// const mimeType: string = 'audio/mpeg';
// const ffmpeg = createFFmpeg({ log: true });

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
  const [answers, setAnswers] = useState<Blob[]>([]);
  const [instruction, setInstruction] = useState(true);
  const [wantToSubmit, setWantToSubmit] = useState(false);
  const [testData, setTestData] = useState<QuestionGroup | null>(null);
  // const [mp3audio, setMp3Audio] = useState<string | null>(null);
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

  // async function convertWebmToMp3(webmBlob: Blob): Promise<Blob> {
  //   const ffmpeg = createFFmpeg({ log: false });
  //   await ffmpeg.load();

  //   const inputName = 'input.webm';
  //   const outputName = 'output.mp3';

  //   const arrayBuffer = await new Response(webmBlob).arrayBuffer();

  //   ffmpeg.FS('writeFile', inputName, new Uint8Array(arrayBuffer));

  //   await ffmpeg.run('-i', inputName, outputName);

  //   const outputData = ffmpeg.FS('readFile', outputName);
  //   const outputBlob = new Blob([outputData.buffer], { type: 'audio/mp3' });

  //   return outputBlob;
  // }

  const startRecording = async (streamData: MediaStream) => {
    setRecordingStatus('recording');
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
      if (currentAnswer && wantToSubmit) {
        console.log('logcheck2');
        setAnswers((prevAnswers) => [...prevAnswers, currentAnswer]);

        // send test api
        const token = await user?.getIdToken();

        // const mp3Blob = await convertWebmToMp3(currentAnswer);

        const formData = new FormData();

        // --------- start uncomment the following-------------------------------
        // formData.append('speaking_audio', currentAnswer, 'answer.webm');
        // formData.append('speaking_part', '1');
        // formData.append('audio_type', 'mp3');
        // formData.append(
        //   'question',
        //   testData.questions[currentQuestion].question_prompt
        // );
        //------------------end uncomment-------------------------------------------

        await fetch(`/api/ai/assess-speaking`, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      }
      // --------- start uncomment the following-------------------------------
      // if (currentQuestion < testData.questions.length - 1) {
      //   console.log('logcheck', currentQuestion);
      //   setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      // } else if (currentQuestion === testData.questions.length - 1) {
      //   // handle submit
      //   console.log('submit');
      // }
      //------------------end uncomment-------------------------------------------

      setCurrentAnswer(null);
      setAudio(null);
      resetTranscript();
    }
  };

  const nextPartHandler = () => {
    const nextPart = currentPart + 1;
    setCurrentPart((prevPart) => prevPart + 1);
    setTestData(data.parts[nextPart].question_groups[0]);
    setCurrentQuestion(0);
  };

  const setSubmitHandler: CheckboxProps['onChange'] = (e) => {
    setWantToSubmit(e.target.checked);
  };

  const submitHandler = () => {
    console.log(answers);
  };

  if (isLoading) return <Spin size="large" />;

  const isAllPart = params.part === 'all';
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
            <p>{testData?.question_groups_info.question_groups_prompt}</p>
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
        <>
          <div className={styles.question}>
            <img
              className={styles.logo}
              src="/images/logo/main.svg"
            />
            <p className={styles['question-prompt']}>
              {testData?.questions[currentQuestion].question_prompt}
            </p>
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
            <div className="audio-container">
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

            {currentQuestion !== 0 && !isLastQuestionOfPart && (
              <Button onClick={nextHandler}>
                <DoubleRightOutlined />
              </Button>
            )}

            {isLastQuestionOfPart && isAllPart && (
              <Button onClick={nextPartHandler}>Phần thi tiếp theo</Button>
            )}

            {isLastQuestionOfPart &&
              (!isAllPart || (isAllPart && isFinalPart)) && (
                <Button onClick={submitHandler}>Nộp bài</Button>
              )}
          </div>
        </>
      )}
    </>
  );
};

export default PracticeSpeaking;