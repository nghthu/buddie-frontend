import { ConfigProvider, Select } from 'antd';
import styles from '@/styles/components/questionLayouts.module.scss';

export default function DropdownLayout(props: {
    question?: string;
    options?: string[];
    answer: string;
    questionIndex: number | string;
    setAnswer: React.Dispatch<React.SetStateAction<object>>;
    userAnswer: string|undefined|string[];
}) {
    function handleSetAnswer(value: string) {
        props.setAnswer((prev) => ({
                ...prev,
                [props.questionIndex]: value,            
        }));
    }
    if (props.options) {
        const selecOptions = props.options.map((option: string) => {
            return { label: option, value: option };
        });
        const select = (
            <Select
                className={styles.dropdownGroup}
                defaultValue={props.userAnswer as string|undefined}
                onChange={(value:string) => {handleSetAnswer(value) }}
                options={selecOptions}
            />
        );
        return (
            <ConfigProvider
                theme={{
                    components: {
                        Select: {},
                    },
                }}
            >
                <div className={styles.dropdownWrapper}>
                    Câu {props.questionIndex}
                    <h3>{props.question}</h3>
                    {select}
                </div>
            </ConfigProvider>
        );
    } else {
        return <></>;
    }
}
