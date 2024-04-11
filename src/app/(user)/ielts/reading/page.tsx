'use client';
import jsonDummyData from './reading.json';

import SkillHeader from '@/components/SkillHeader';
import TextCard from '@/components/TextCard';
import React, { useState } from 'react';
import ReadingLayout from '@/components/ReadingLayout';
import textCardStyles from '@/styles/components/TextCard.module.scss';
import styles from '@/styles/components/WebButton.module.scss';
import clsx from 'clsx';
import { Button } from 'antd';

const IeltsReading = () => {
  const [activePart, setActivePart] = useState('landing');
  const [testTime, setTestTime] = useState('20:00');
  const [answers, setAnswers] = useState({}); // {1: "A", 2: ["B","C"], 3: "False", 4:"arthitis"}
  const changePart = (part: string) => {
    setActivePart(part);
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTestTime(event.target.value);
  };
  if (activePart === 'landing') {
    return (
      <>
        <SkillHeader title={'Luyện tập IELTS Reading'}></SkillHeader>
        <div style={{ paddingLeft: '8%', paddingRight: '8%' }}>
          <TextCard
            width="100%"
            height="auto"
            className={textCardStyles['card_background-color_very-light-grey']}
          >
            <p style={{ marginBottom: '2rem' }}>
              Phần thi IELTS Reading gồm 3 bài đọc dài khác nhau, viết theo
              nhiều văn phong khác nhau, có độ khó tăng dần (bài đọc đầu tiên là
              dễ nhất).
            </p>
            <p>
              Mỗi bài đọc sẽ có không quá 900 từ, bạn có thể chọn thời gian giới
              hạn khi luyện tập Reading với Buddie.
            </p>
          </TextCard>

          <div style={{ marginBottom: '2rem' }}></div>

          <TextCard
            width="100%"
            height="auto"
            className={clsx(
              textCardStyles['card_background-color_white'],
              textCardStyles['cardFlex_Justify_center']
            )}
          >
            <div
              style={{
                display: 'flex',
                gap: '2rem',
                marginBottom: '2rem',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <label htmlFor="testTime">Chọn thời gian</label>
              <select
                onChange={handleSelectChange}
                id="testTime"
                style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
              >
                <option value="20:00">20 phút</option>
                <option value="30:00">30 phút</option>
                <option value="60:00">60 phút</option>
                <option value="unlimited">Không giới hạn</option>
              </select>
            </div>
            <Button
              className={styles.webButton}
              type={'primary'}
              onClick={() => changePart('1')}
            >
              Bắt đầu
            </Button>
          </TextCard>
        </div>
      </>
    );
  }
  const jsonData = JSON.parse(JSON.stringify(jsonDummyData));

  const parts = jsonData['parts'].map((part: any) => {
    const prevPart = Math.max(part['part_number'] - 1, 1);
    const nextPart = Math.min(
      part['part_number'] + 1,
      jsonData['parts'].length
    );
    return (
      <>
        {activePart === String(part['part_number']) && (
          <>
            <ReadingLayout
              paddingLeft={'2%'}
              paddingRight={'2%'}
              setPrevState={() => changePart(String(prevPart))}
              setNextState={() => changePart(String(nextPart))}
              data={part}
              setAnswer={() => setAnswers({ ...answers })}
            />
          </>
        )}
      </>
    );
  });
  return (
    <>
      <SkillHeader
        title={'Luyện tập IELTS Reading'}
        countdownTime={testTime}
      />
      {parts}
    </>
  );
};

export default IeltsReading;
