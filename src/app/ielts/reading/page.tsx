'use client';

import BuddieSuport from '@/components/BuddieSupport';
import WebButton from '@/components/WebButton';
import SkillHeader from '@/components/SkillHeader';
import TextCard from '@/components/TextCard';
import React, { useState } from 'react';
import ReadingLayout from '@/components/ReadingLayout';
const IeltsReading = () => {
  const [activePart, setActivePart] = useState("landing");
  const [testTime, setTestTime] = useState("20:00");
  const changePart = (part: string) => {
    setActivePart(part);
  }
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTestTime(event.target.value);
  }
  // get question as whole, keep parts:[....] only
  // process the question to parts
  // pass each part's data to the ReadingLayout
  if (activePart === "landing") {
    return (
      <>
        <SkillHeader title={"Luyện tập IELTS Reading"}></SkillHeader>
        <div style={{ paddingLeft: "8%", paddingRight: "8%", fontSize: "2rem" }}>
          <TextCard width="100%" height="auto" backgroundColor="#F5F6FA">
            <p style={{ marginBottom: "2rem" }}>
              Phần thi IELTS Reading gồm 3 bài đọc dài khác nhau, viết theo nhiều văn phong khác nhau, có độ khó tăng dần (bài đọc đầu tiên là dễ nhất).
            </p>
            <p>
              Mỗi bài đọc sẽ có không quá 900 từ, bạn có thể chọn thời gian giới hạn khi luyện tập Reading với Buddie.
            </p>
          </TextCard>
          <div style={{ marginBottom: "2rem" }}></div>
          <TextCard width="100%" height="auto" backgroundColor="white" display={"flex"} justifyContent={"center"}>
            <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", width: "100%", justifyContent: "center" }}>
              <label htmlFor="testTime">Chọn thời gian</label>
              <select onChange={handleSelectChange} id="testTime" style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
                <option value="20:00">20 phút</option>
                <option value="30:00">30 phút</option>
                <option value="60:00">60 phút</option>
                <option value="99:99">Không giới hạn</option>
              </select>
            </div>
            <WebButton text="Bắt đầu" onClick={() => changePart("part1")} />
          </TextCard>
        </div>
      </>
    );
  };
  if (activePart === "part1") {
    return (
      <>
        <SkillHeader title={"Luyện tập IELTS Reading"} countdownTime={testTime}></SkillHeader>
        {/* chừa props để truyền data của part đó vào */}
        <ReadingLayout paddingLeft={"2%"} paddingRight={"2%"} setState={()=>changePart("part2")}/>
      </>
    );
  };
  if (activePart === "part2") {
    return (
      <>
        <SkillHeader title={"Luyện tập IELTS Reading"} countdownTime={testTime}></SkillHeader>
      </>
    );
  };
  if (activePart === "part3") {
    return (
      <>
        <SkillHeader title={"Luyện tập IELTS Reading"} countdownTime={testTime}></SkillHeader>
      </>
    );
  };
};

export default IeltsReading;
