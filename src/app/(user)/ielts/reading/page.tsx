'use client';

import SkillHeader from '@/components/SkillHeader';
import TextCard from '@/components/TextCard';
import React, { useState } from 'react';

import textCardStyles from '@/styles/components/TextCard.module.scss';
import styles from '@/styles/components/WebButton.module.scss';

import clsx from 'clsx';
import { Button, Select } from 'antd';
import Link from 'next/link';

const IeltsReading = () => {
  const [testTime, setTestTime] = useState('20:00');

  const handleSelectChange = (value: string) => {
    setTestTime(value);
  };
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
            <Select
              defaultValue="unlimited"
              style={{ width: 170 }}
              onChange={handleSelectChange}
              options={[
                { value: '15', label: '15 phút' },
                { value: '30', label: '30 phút' },
                { value: '45', label: '45 phút' },
                { value: '60', label: '60 phút' },
                { value: 'unlimited', label: 'Không giới hạn' },
              ]}
            />
          </div>
          <Link href={`/ielts/reading/661b5d4b0d4e11e6b2817f1b/1?time=${testTime}`}>
            <Button
              className={styles.webButton}
              type={'primary'}
              onClick={() => { }}
            >
              Bắt đầu
            </Button>
          </Link>
        </TextCard>
      </div>
    </>
  );
};
export default IeltsReading;
