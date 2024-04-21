
import { ConfigProvider, Radio, RadioChangeEvent } from "antd";
import styles from '@/styles/components/questionLayouts.module.scss';

export default function SingleChoiceLayout(props: {
    question?: string,
    options?: string[],
    answer: string,
    questionIndex: number | string,
    setAnswer: React.Dispatch<React.SetStateAction<object>>,
    userAnswer: string|undefined|string[];
}) {
    function handleSetAnswer(e: RadioChangeEvent) {
        props.setAnswer((prev) => ({
            ...prev,
            [props.questionIndex]: e.target.value,
        }));
    }
    if (props.options) {
        const singleChoiceOptions = props.options.map((option: string) => {
            return <div key={option} className={styles.singleChoice}>

                <Radio key={option + "<div></div>"} className={styles.radio} name={props.question} value={option}> {option}</Radio>

            </div>;
        });
        const singleChoiceGroup = <Radio.Group defaultValue={props.userAnswer as string|undefined} onChange={(e: RadioChangeEvent) => handleSetAnswer(e)} className={styles.singleChoiceGroup}>{...singleChoiceOptions}</Radio.Group>;

        const singleChoiceWrapper = <div className={styles.singleChoiceWrapper}><h3 style={{ whiteSpace: "pre-wrap", fontWeight:'500',fontSize:'1.7rem' }}>Câu {props.questionIndex}. {props.question}</h3>{singleChoiceGroup}</div>;

        return (
            <><ConfigProvider
                theme={{
                    components: {
                        Radio: {
                            colorPrimary: "#10a9a0",
                            radioSize: 20
                        }
                    }
                }}>
                {singleChoiceWrapper}
            </ConfigProvider>
            </>
        )
    } else {
        return (<></>)
    }
}   