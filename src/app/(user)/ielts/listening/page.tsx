'use client';

import TextCard from '@/components/TextCard';
import styles from '@/styles/pages/listening/Listening.module.scss';
import { Button, RadioChangeEvent, Select } from 'antd';
import { Radio } from 'antd';
import Link from 'next/link';
import { useState } from 'react';

const Listening = () => {
  const [value, setValue] = useState(1);

  const selectPartHandler = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  const selectTimeHandler = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <>
      <div className={styles.introduction}>
        <p>
          IELTS Listening có 4 phần nhỏ, mỗi phần tương ứng với 1 audio để nghe.
        </p>
        <ul>
          <li>
            Phần 1: một đoạn hội thoại giữa 2 người về một chủ đề hằng ngày.
          </li>
          <li>Phần 2: một đoạn độc thoại về một chủ đề xã hội hàng ngày.</li>
          <li>
            Phần 3: một đoạn hội thoại giữa nhiều người (2 - 4 người) về một chủ
            đề học thuật.
          </li>
          <li>Phần 4: một đoạn độc thoại về một chủ đề học thuật.</li>
        </ul>
        <p>
          Mỗi audio chỉ phát 1 lần duy nhất. Mỗi phần sẽ có đúng 10 câu hỏi
          thuộc một hay nhiều dạng khác nhau.
        </p>
        <img src="/images/logo/main.svg" />
      </div>
      <TextCard
        width="70%"
        height="80%"
      >
        <div className={styles.select}>
          <p>Chọn phần:</p>
          <Radio.Group
            onChange={selectPartHandler}
            value={value}
          >
            <Radio value={1}>Phần 1</Radio>
            <Radio value={2}>Phần 2</Radio>
            <Radio value={3}>Phần 3</Radio>
            <Radio value={4}>Phần 4</Radio>
            <Radio value={5}>Tất cả</Radio>
          </Radio.Group>
        </div>

        <div className={styles.select}>
          <p>Chọn thời gian:</p>
          <Select
            defaultValue="0"
            style={{ width: 170 }}
            onChange={selectTimeHandler}
            options={[
              { value: '15', label: '15 phút' },
              { value: '30', label: '30 phút' },
              { value: '45', label: '45 phút' },
              { value: '60', label: '60 phút' },
              { value: '0', label: 'Không giới hạn' },
            ]}
          />
        </div>

        <Link href={`/ielts/listening/part-${value}`}>
          <Button className={styles['start-btn']}>Bắt đầu</Button>
        </Link>
      </TextCard>
    </>
  );
};

export default Listening;
