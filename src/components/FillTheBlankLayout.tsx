import { Input } from 'antd';

export default function FillTheBlankLayout(props: {
    question?: string;
    answer: string;
    questionIndex: number | string;
    setAnswer: React.Dispatch<React.SetStateAction<object>>;
    userAnswer: string|undefined|string[];
}) {
    function handleSetAnswer(e: React.ChangeEvent<HTMLInputElement>) {
        props.setAnswer((prev) => ({
            ...prev,
            [props.questionIndex]: e.target.value,
        }));
    }
    return (
        <div>
            Câu {props.questionIndex}
            <h3 style={{ whiteSpace: "pre-wrap" }}>{props.question}</h3>

            <Input defaultValue={props.userAnswer as string|undefined} onChange={handleSetAnswer} placeholder="Nhập câu trả lời tại đây" />
        </div>
    );
}