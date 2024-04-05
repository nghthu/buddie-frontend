'use client';
import { Button } from "antd";
import DropdownLayout from "./DropdownLayout";
import MultiChoiceLayout from "./MultiChoiceLayout";
import ReadingContextLayout from "./ReadingContextLayout";
import SingleChoiceLayout from "./SingleChoiceLayout";
import FillTheBlankLayout from "./FillTheBlankLayout";
import TextCard from "./TextCard";

import questionLayouts from '@/styles/components/questionLayouts.module.scss';
import textCardStyles from '@/styles/components/TextCard.module.scss';
import buttonStyles from '@/styles/components/WebButton.module.scss';
import clsx from "clsx";
import BuddieSuport from "./BuddieSupport";

interface data {
    part_number: number,
    part_duration: number,
    part_recording: string,
    part_prompt: string,
    part_image_urls: Array<string>,
    question_groups: Array<object>;
}

export default function ReadingLayout(props: { context?: string, questionsAndAnswers?: string, paddingLeft?: string, paddingRight?: string, setPrevState: React.MouseEventHandler<HTMLDivElement>, setNextState: React.MouseEventHandler<HTMLDivElement>, data: data, setAnswer: Function }) {
    const questionGroups = props.data["question_groups"].map((questionGroup: any, index: number) => {
        const questions = questionGroup["questions"].map((question: any, index: number) => {
            return (<>
                {question["question_type"] === "single_choice" && <SingleChoiceLayout question={question["question_prompt"]} options={question["options"]} answer={question["answer"]} questionIndex={question["question_number"]} />}
                {question["question_type"] === "multiple_choice" && <MultiChoiceLayout question={question["question_prompt"]} options={question["options"]} answers={question["answer"]} questionIndex={question["question_number"]} />}
                {question["question_type"] === "selection" && <DropdownLayout question={question["question_prompt"]} options={question["options"]} answer={question["answer"]} questionIndex={question["question_number"]} />}
                {question["question_type"] === "completion" && <FillTheBlankLayout question={question["question_prompt"]} answer={question["answer"]} questionIndex={question["question_number"]} />}
            </>
            )
        });
        return <TextCard width={"100"} height={"auto"} className={"cardFlex"}>
            {questionGroup["question_groups_info"]["question_groups_prompt"] && <h3 style={{ whiteSpace: "pre-wrap" }}>{questionGroup["question_groups_info"]["question_groups_prompt"]}</h3>}
            {questionGroup["question_groups_info"]["question_groups_image_urls"] && questionGroup["question_groups_info"]["question_groups_image_urls"].length > 0 && <>
                {questionGroup["question_groups_info"]["question_groups_image_urls"].map((url: string, index: number) => {
                    return <img key={index} src={url} alt={"question group image"} style={{ width: "100%", height: "auto" }} />
                })}
            </>}
            {questions}
        </TextCard>
    });
    return (
        <div style={{ display: "flex", gap: "1rem", paddingLeft: props.paddingLeft, paddingRight: props.paddingRight, fontSize: "2rem" }}>
            <div className={questionLayouts.contextWrapper}>
                <TextCard width={"100%"} height={"100%"} className={clsx(textCardStyles["card_background-color_very-light-grey"], textCardStyles["card_overflow_scroll"])}>
                    <ReadingContextLayout context={props.data.part_prompt} />
                </TextCard>
                <div style={{ display: "flex", width: "100%", justifyContent: "space-around" }}>
                    <Button className={clsx(buttonStyles.webButton, "ant-btn-red")} type={"primary"} onClick={() => { }}>Kết thúc</Button>
                    <Button className={buttonStyles.webButton} type={"primary"} onClick={() => { }}>Nộp bài</Button>
                </div>
            </div>
            <div className={questionLayouts.questionContainer}>
                {questionGroups}
                <TextCard width={"100"} height={"auto"}>
                    <BuddieSuport />
                </TextCard>
                <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
                    <Button className={clsx(buttonStyles.webButton, "ant-btn-red")} type={"primary"} onClick={props.setPrevState}>Phần trước</Button>
                    <Button className={buttonStyles.webButton} type={"primary"} onClick={props.setNextState}>Phần tiếp theo</Button>
                </div>

            </div>
        </div>
    )
}