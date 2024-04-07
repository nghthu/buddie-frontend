'use client';

import TextCard from '@/components/TextCard';
import { Input, Radio, Checkbox, Col, Row, Button } from 'antd';
import styles from '@/styles/pages/listening/Practice.module.scss';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AudioPlayer from '@/components/AudioPlayer';

const question_groups = [
  {
    is_single_question: false,
    question_groups_info: {
      question_groups_duration: 0,
      question_groups_prompt:
        'Circle the correct letter, A, B, C or D.\nExample\nWhat is Thomas’s new home phone number?\nA. 9731 4322\nB. 9813 4562\n(C). 9452 3456\nD, 9340 2367',
      question_groups_recording: '',
      question_groups_image_urls: [],
    },
    questions: [
      {
        question_number: 1,
        question_type: 'single_choice',
        question_prompt: '',
        question_image_urls: [
          'https://ieltsonlinetests.com/sites/default/files/fileman/Uploads/9/7/6.1.png',
        ],
        question_duration: 0,
        options: ['Image A', 'Image B', 'Image C', 'Image D'],
        answer: '1',
      },
      {
        question_number: 2,
        question_type: 'single_choice',
        question_prompt: '',
        question_image_urls: [
          'https://ieltsonlinetests.com/sites/default/files/fileman/Uploads/9/7/6.1%20(1).png',
        ],
        question_duration: 0,
        options: ['Image A', 'Image B', 'Image C', 'Image D'],
        answer: '1',
      },
      {
        question_number: 3,
        question_type: 'single_choice',
        question_prompt: 'When will Ken leave?',
        question_image_urls: [],
        question_duration: 0,
        options: [
          'now',
          "in ten minutes' time",
          "at 10 o'clock",
          'in 30 minutes',
        ],
        answer: '1',
      },
      {
        question_number: 4,
        question_type: 'single_choice',
        question_prompt: '',
        question_image_urls: [
          'https://ieltsonlinetests.com/sites/default/files/fileman/Uploads/9/7/6.2.png',
        ],
        question_duration: 0,
        options: ['Image A', 'Image B', 'Image C', 'Image D'],
        answer: '1',
      },
      {
        question_number: 5,
        question_type: 'single_choice',
        question_prompt: 'How many people will they meet there?',
        question_image_urls: [],
        question_duration: 0,
        options: ['none', 'three', 'tow', 'a group'],
        answer: '1',
      },
      {
        question_number: 6,
        question_type: 'single_choice',
        question_prompt: 'How much will the evening cost?',
        question_image_urls: [],
        question_duration: 0,
        options: [
          'nothing',
          'hust the fares',
          'less than $40.00',
          'more than $40.00',
        ],
        answer: '1',
      },
      {
        question_number: 7,
        question_type: 'single_choice',
        question_prompt: 'What time does Megan plan to come home?',
        question_image_urls: [],
        question_duration: 0,
        options: [
          'before midnight',
          'after midnight',
          'on the last bus',
          'tomorrow morning',
        ],
        answer: '1',
      },
    ],
  },
  {
    is_single_question: false,
    question_groups_info: {
      question_groups_duration: 0,
      question_groups_prompt: 'Write ONE NUMBER for each answer',
      question_groups_recording: '',
      question_groups_image_urls: [
        'https://up-anh.vi-vn.vn/img/1712072332_83ea195c88141d53693e5a7dcf192829.png',
      ],
    },
    questions: [
      {
        question_number: 8,
        question_type: 'completion',
        question_prompt: '',
        question_image_urls: [],
        question_duration: 0,
        options: [],
        answer: '8',
      },
      {
        question_number: 9,
        question_type: 'completion',
        question_prompt: '',
        question_image_urls: [],
        question_duration: 0,
        options: [],
        answer: '9',
      },
      {
        question_number: 10,
        question_type: 'completion',
        question_prompt: '',
        question_image_urls: [],
        question_duration: 0,
        options: [],
        answer: '10',
      },
    ],
  },
];

const ListeningPractice = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    new Array(question_groups.length).fill(null)
  );
  const router = useRouter();

  const aswerChangehandler = (questionNumber: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[questionNumber - 1] = answer;
    setAnswers(newAnswers);
    console.log(newAnswers);
  };

  const submitHandler = () => {
    console.log(answers);
  };

  return (
    <>
      {/* <TextCard
        width="60%"
        height="100%"
      >
        <h4>Câu 1/10:</h4>
        <p>
          Perkin's early interest in science led him to conduct chemistry
          experiments in his makeshift laboratory at home.
        </p>
        <img src="https://ieltsonlinetests.com/sites/default/files/fileman/Uploads/9/7/6.1.png" />
        <Radio.Group
          // onChange={selectPartHandler}
          value={1}
          className={styles.answers}
        >
          <Radio value={1}>Phần 1</Radio>
          <Radio value={2}>Phần 2</Radio>
          <Radio value={3}>Phần 3</Radio>
        </Radio.Group>

        <Checkbox.Group
          style={{ width: '100%' }}
          // onChange={onChange}
        >
          <Col>
            <Row>
              <Checkbox value="A">A</Checkbox>
            </Row>
            <Row>
              <Checkbox value="B">B</Checkbox>
            </Row>
            <Row>
              <Checkbox value="C">C</Checkbox>
            </Row>
          </Col>
        </Checkbox.Group>
      </TextCard> */}

      <AudioPlayer audioUrl="https://media.intergreat.com/Audio/Mock_Test_2018/11/Practice%20Test%201.mp3" />

      <TextCard
        width="100%"
        height="auto"
      >
        {question_groups.map((group, index) => (
          <div key={index}>
            <h4 className={styles['question-prompt']}>
              {group.question_groups_info.question_groups_prompt}
            </h4>
            {group.question_groups_info.question_groups_image_urls.map(
              (imageUrl, imageIndex) => (
                <img
                  key={imageIndex}
                  src={imageUrl}
                  alt={`Question ${index + 1}`}
                />
              )
            )}
            {group.questions.map((question) => (
              <div key={question.question_number}>
                <h5>
                  Câu hỏi {question.question_number}: {question.question_prompt}
                </h5>
                {question.question_image_urls.map((imageUrl, imageIndex) => (
                  <img
                    key={imageIndex}
                    src={imageUrl}
                    alt={`Question ${question.question_number}`}
                  />
                ))}
                {question.question_type === 'completion' ? (
                  <Input
                    placeholder="Nhập câu trả lời"
                    onChange={(e) =>
                      aswerChangehandler(
                        question.question_number,
                        e.target.value
                      )
                    }
                  />
                ) : (
                  <Radio.Group
                    className={styles.answers}
                    value={answers[question.question_number - 1]}
                    onChange={(e) =>
                      aswerChangehandler(
                        question.question_number,
                        e.target.value
                      )
                    }
                  >
                    {question.options.map((option, optionIndex) => (
                      <Radio
                        key={optionIndex}
                        value={optionIndex + 1}
                      >
                        {option}
                      </Radio>
                    ))}
                  </Radio.Group>
                )}
              </div>
            ))}
          </div>
        ))}
      </TextCard>

      <div className={styles['action-btn']}>
        <Button onClick={() => router.push('/ielts/listening')}>Thoát</Button>
        <Button onClick={submitHandler}>Kết thúc</Button>
      </div>
      {/* </div> */}
      {/* <div className={styles['right-part']}>
    
        <Input placeholder="Bạn có thể ghi chú ở đây" />
      </div> */}
    </>
  );
};

export default ListeningPractice;
