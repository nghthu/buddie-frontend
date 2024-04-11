'use client';

import 'regenerator-runtime/runtime';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import styles from '@/styles/pages/speaking/Practice.module.scss';
import { Button } from 'antd';
import { AudioOutlined, EllipsisOutlined } from '@ant-design/icons';
import TextCard from '@/components/TextCard';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const mimeType: string = 'audio/webm';

const PracticeSpeaking = ({ params }: { params: { part: string } }) => {
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
  const router = useRouter();

  // dummy
  const question_groups = {
    is_single_question: true,
    question_groups_info: {
      question_groups_duration: 0,
      question_groups_prompt:
        'In this first part, the examiner will ask you some questions about yourself. DO NOT give out real personal information on your answers.',
      question_groups_recording: '',
      question_groups_image_urls: [],
    },
    questions: [
      {
        question_number: 1,
        question_type: 'speaking',
        question_prompt: "What's your name?",
        question_image_urls: [],
        question_duration: 0,
        question_preparation_time: 5,
        question_recording: '',
      },
      {
        question_number: 2,
        question_type: 'speaking',
        question_prompt: 'Which town or city do you come from?',
        question_image_urls: [],
        question_duration: 0,
        question_preparation_time: 5,
        question_recording: '',
      },
      {
        question_number: 3,
        question_type: 'speaking',
        question_prompt: "What's the best thing about living there?",
        question_image_urls: [],
        question_duration: 0,
        question_preparation_time: 5,
        question_recording: '',
      },
      {
        question_number: 4,
        question_type: 'speaking',
        question_prompt: 'How do you plan your time in a day?',
        question_image_urls: [],
        question_duration: 0,
        question_preparation_time: 5,
        question_recording: '',
      },
      {
        question_number: 5,
        question_type: 'speaking',
        question_prompt: 'Is it easy to manage time for you?',
        question_image_urls: [],
        question_duration: 0,
        question_preparation_time: 5,
        question_recording: '',
      },
      {
        question_number: 6,
        question_type: 'speaking',
        question_prompt: 'When do you find it hard to allocate time?',
        question_image_urls: [],
        question_duration: 0,
        question_preparation_time: 5,
        question_recording: '',
      },
      {
        question_number: 7,
        question_type: 'speaking',
        question_prompt: 'Do you like being busy?',
        question_image_urls: [],
        question_duration: 0,
        question_preparation_time: 5,
        question_recording: '',
      },
    ],
  };

  question_groups.questions.unshift({
    question_number: 0,
    question_type: 'mic test',
    question_prompt:
      'Trước khi bắt đầu, hãy kiểm tra micro của bạn bằng cách nhấn vào nút bên dưới và ghi âm.',
    question_image_urls: [],
    question_duration: 0,
    question_preparation_time: 5,
    question_recording: '',
  });

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

  const startRecording = async (streamData: MediaStream) => {
    setRecordingStatus('recording');
    if (streamData) {
      const media = new MediaRecorder(streamData, { mimeType });
      mediaRecorder.current = media;
      mediaRecorder.current.start();
      let localAudioChunks: Blob[] = [];
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

  const nextHandler = () => {
    if (currentQuestion === 0) {
      setCurrentQuestion(1);
      setInstruction(false);
    } else {
      setCurrentAnswer(null);
      setAudio(null);
      resetTranscript();
      if (currentAnswer) {
        setAnswers((prevAnswers) => [...prevAnswers, currentAnswer]);
      }
      if (currentQuestion < question_groups.questions.length - 1) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      } else if (currentQuestion === question_groups.questions.length - 1) {
        // handle submit
        console.log('submit');
      }
    }
  };

  return (
    <>
      {!instruction && (
        <>
          <div className={styles.question}>
            <img
              className={styles.logo}
              src="/images/logo/main.svg"
            />
            <p>{question_groups.question_groups_info.question_groups_prompt}</p>
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
            <p>{question_groups.questions[currentQuestion].question_prompt}</p>
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
          >
            {transcript}
          </TextCard>
          <div className={styles['action-btn']}>
            <Button onClick={() => router.push('/ielts/speaking')}>
              Thoát
            </Button>
            <Button onClick={nextHandler}>
              {currentQuestion !== 0 &&
                currentQuestion !== question_groups.questions.length - 1 &&
                'Tiếp theo'}
              {currentQuestion === 0 && 'Bắt đầu'}
              {currentQuestion === question_groups.questions.length - 1 &&
                'Kết thúc'}
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default PracticeSpeaking;
