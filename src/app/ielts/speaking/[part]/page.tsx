'use client';

// import 'regenerator-runtime/runtime';
import styles from '@/styles/pages/speaking/Practice.module.scss';
import { Button } from 'antd';
import { AudioOutlined, EllipsisOutlined } from '@ant-design/icons';
import TextCard from '@/components/TextCard';
import { useEffect, useRef, useState } from 'react';
import useSpeechRecognition from '@/hooks/useSpeechRecognitionHook';

const mimeType: string = 'audio/webm';

const PracticeSpeaking = ({ params }: { params: { part: string } }) => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [recordingStatus, setRecordingStatus] = useState('inactive');
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audio, setAudio] = useState<string | null>(null);

  // const {
  //   text,
  //   isListening,
  //   startListening,
  //   stopListening,
  //   hasRecognitionSupport,
  // } = useSpeechRecognition();

  const DUMMY_QUESTION = {};

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
      };
    }
  };

  const recordHandler = () => {
    if (!permission) {
      getMicrophonePermission();
    } else {
      if (recordingStatus === 'inactive') {
        if (stream) startRecording(stream);
      } else if (recordingStatus === 'recording') {
        stopRecording();
      }
    }
  };

  return (
    <>
      <div className={styles.question}>
        <img
          className={styles.logo}
          src="/images/logo.png"
        />
        <p>
          Trước khi bắt đầu, hãy kiểm tra micro của bạn bằng cách nhấn vào nút
          bên dưới và ghi âm.
        </p>
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

      {/* {hasRecognitionSupport ? (
        <>
          <div>
            <button onClick={startListening}>start listening</button>
          </div>
          <div>
            <button onClick={stopListening}>stop listening</button>
          </div>
          {isListening ? <div>currently listening</div> : null}
          {text}
        </>
      ) : (
        <h1>Your browser has no speech recognition support</h1>
      )} */}

      <TextCard
        width="50%"
        height="170px"
      >
        aaaa.
      </TextCard>
    </>
  );
};

export default PracticeSpeaking;
