import DropdownLayout from "./DropdownLayout";
import MultiChoiceLayout from "./MultiChoiceLayout";
import ReadingContextLayout from "./ReadingContextLayout";
import SingleChoiceLayout from "./SingleChoiceLayout";
import TextCard from "./TextCard";
import WebButton from "./WebButton";


export default function ReadingLayout(props: { context?: string, questionsAndAnswers?: string, paddingLeft?: string, paddingRight?: string, setState: React.MouseEventHandler<HTMLDivElement> }) {
    // const questionTypes = ["single choice", "multiple choice", "fill in the blank", "dropdown"];
    // get a part's data, get the questions
    // decide which question type to display for each question
    // props are for demo only
    const questionTypes = ["single choice", "multiple choice", "fill in the blank", "dropdown"]
    return (
        <div style={{ display: "flex", gap: "1rem", paddingLeft: props.paddingLeft, paddingRight: props.paddingRight, fontSize: "2rem" }}>

            <TextCard width={"60%"} height={"calc(100vh - 140px"} backgroundColor={"#F5F6FA"}>
                <ReadingContextLayout />
            </TextCard>
            {/* logic xử lý chọn kiểu câu hỏi để display
            Có thể sẽ gọn lại do dùng .map hoặc array để loop qua data và render 
            phần dưới đây chỉ để demo ui, không mang tính chất dùng thật*/}
            <div style={{ width: "40%", height: "calc(100vh - 140px)", overflowY: "scroll", display: "flex", flexDirection: "column", gap: "2rem" }}>

                <TextCard width={"100"} height={"auto"} display="flex">
                    <SingleChoiceLayout question="question1" options={["option1", "option2", "option3"]} />
                    <SingleChoiceLayout question="question2" options={["option1", "option2", "option3"]} />
                </TextCard>
                <TextCard width={"100"} height={"auto"}>
                    <MultiChoiceLayout question="question3" options={["option1", "option2", "option3"]} />
                    <MultiChoiceLayout question="question4" options={["option1", "option2", "option3", "option4", "option5"]} />
                </TextCard>
                <TextCard width={"100"} height={"auto"}>
                    <DropdownLayout question="question5" options={["option1", "option2", "option3"]} />
                    <DropdownLayout question="question6" options={["option1", "option2", "option3"]} />
                </TextCard>
                <TextCard width={"100"} height={"auto"}>
                    Buddie's response goes here
                </TextCard>
                <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
                    <WebButton text="Previous" backgroundColorNumber="2" onClick={() => { }} />
                    <WebButton text="Next" onClick={props.setState} />
                </div>

            </div>
        </div>
    )
}