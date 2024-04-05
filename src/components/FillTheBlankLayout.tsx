import { Input } from 'antd';

export default function FillTheBlankLayout(props: { question?: string, answer?: string, questionIndex?: number | string, setAnswer?: Function}) {
    return (
        <div>
            <h3 style={{whiteSpace:"pre-wrap"}}>{props.question}</h3>
            {props.questionIndex}
            <Input placeholder="Nhập câu trả lời tại đây" />
        </div>
    );
}