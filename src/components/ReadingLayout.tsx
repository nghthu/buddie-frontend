import ReadingContextLayout from "./ReadingContextLayout";
import SingleChoiceStyle from "./SingleChoiceStyle";
import TextCard from "./TextCard";
import WebButton from "./WebButton";


export default function ReadingLayout(props: { context?: string, questionsAndAnswers?: string, paddingLeft?: string, paddingRight?: string }) {
    const questionTypes = ["single choice", "multiple choice", "fill in the blank", "dropdown"];
    return (
        <div style={{ display: "flex", gap: "1rem", paddingLeft: props.paddingLeft, paddingRight: props.paddingRight, fontSize: "2rem" }}>

            <TextCard width={"60%"} height={"auto"} backgroundColor={"#F5F6FA"}>
                <ReadingContextLayout />
            </TextCard>

            <div style={{ width: "40%", height: "auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
                <TextCard width={"100"} height={"auto"} display="flex">
                    <h3>Question1</h3>
                    <SingleChoiceStyle question="question1" options="option1" />
                    <SingleChoiceStyle question="question1" options="option2" />
                    <SingleChoiceStyle question="question1" options="option3" />

                    <h3>Question2</h3>
                    <SingleChoiceStyle question="question2" options="option1" />
                    <SingleChoiceStyle question="question2" options="option2" />
                    <SingleChoiceStyle question="question2" options="option3" />
                    <SingleChoiceStyle question="question2" options="option4" />
                </TextCard>
                <TextCard width={"100"} height={"auto"}>
                    Buddie's response goes here
                </TextCard>
                <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
                    <WebButton text="Previous" backgroundColorNumber="2" onClick={() => { }} />
                    <WebButton text="Next" onClick={() => { }} />
                </div>
            </div>
        </div>
    )
}