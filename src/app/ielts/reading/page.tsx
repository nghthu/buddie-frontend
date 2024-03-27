'use client';

import BuddieSuport from '@/components/BuddieSupport';
import WebButton from '@/components/WebButton';
import SkillHeader from '@/components/SkillHeader';
import TextCard from '@/components/TextCard';
import { useState } from 'react';
const IeltsReading = () => {
  const [activePart, setActivePart] = useState("landing");
  return (
    <>
      <SkillHeader title={"Luyện tập IELTS Reading"} countdownTime={"99:99"}></SkillHeader>
      <div style={{paddingLeft:"8%",paddingRight:"8%",fontSize:"2rem"}}>
        <TextCard width="100%" height="auto" backgroundColor="#F5F6FA">
            <p style={{marginBottom:"2rem"}}>
            Phần thi IELTS Reading gồm 3 bài đọc dài khác nhau, viết theo nhiều văn phong khác nhau, có độ khó tăng dần (bài đọc đầu tiên là dễ nhất).
          </p>
          <p>
            Mỗi bài đọc sẽ có không quá 900 từ, bạn có thể chọn thời gian giới hạn khi luyện tập Reading với Buddie.
          </p>
        </TextCard>
        <div style={{marginBottom:"2rem"}}></div>
        <TextCard width="100%" height="auto" backgroundColor="white" display={"flex"} justifyContent={"center"}>
          <div style={{display:"flex",gap:"2rem",marginBottom:"2rem",width:"100%",justifyContent:"center"}}>
            <label htmlFor="testTime">Chọn thời gian</label>
            <select id="testTime" style={{paddingLeft:"1rem",paddingRight:"1rem"}}>
              <option  value="20:00">20 phút</option>
              <option  value="30:00">30 phút</option>
              <option  value="60:00">60 phút</option>
              <option  value="99:99">Không giới hạn</option>
            </select>
          </div>
          <WebButton text="Bắt đầu" />
        </TextCard>
      </div>
    </>
  );
};

export default IeltsReading;
