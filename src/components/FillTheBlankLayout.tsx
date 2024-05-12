import { Input } from 'antd';
import styles from '@/styles/components/questionLayouts.module.scss';
interface test_answer {
    test_id: string,
    parts: {
        _id: string,
        question_groups: {
            _id: string,
            questions: {
                _id: string,
                answer_result: {
                    user_answer: string|string[]
                }
            }[]
        }[]
    }[]
}
export default function FillTheBlankLayout(props: {
    question?: string;
    answer: string;
    partId: string;
    questionGroupsId: string;
    questionId: string;
    questionIndex: number | string;
    setAnswer: React.Dispatch<React.SetStateAction<test_answer>>;
    userAnswer: string|undefined|string[];
}) {
    function handleSetAnswer(e: React.ChangeEvent<HTMLInputElement>) {
        // props.setAnswer((prev) => ({
        //     ...prev,
        //     [props.questionIndex]: e.target.value,
        // }));
        props.setAnswer((prev) => {
            const temp = { ...prev };
            // search for the right part
            const temp_part = temp['parts'].find((part: { _id: string }) => part._id === props.partId);
            const temp_question_group = temp_part?.question_groups.find((question_group: { _id: string }) => question_group._id === props.questionGroupsId);
            const temp_question = temp_question_group?.questions.find((question: { _id: string }) => question._id === props.questionId);
            if (temp_question) {
                temp_question.answer_result.user_answer = e.target.value;
            }
            return temp
        });
    }
    return (
        <div className={styles.fillTheBlankWrapper}>
            Câu {props.questionIndex}
            <h3 style={{ whiteSpace: "pre-wrap" }}>{props.question}</h3>

            <Input defaultValue={props.userAnswer as string|undefined} onChange={handleSetAnswer} placeholder="Nhập câu trả lời tại đây" />
        </div>
    );
}