
import { ConfigProvider, Radio } from "antd";
import styles from '@/styles/components/questionLayouts.module.scss';
export default function SingleChoiceLayout(props: { question?: string, options?: string[], answer?: string, questionIndex?: number | string, setAnswer?: Function }) {
    if (props.options) {
        const singleChoiceOptions = props.options.map((option: string, index: number) => {
            return <div key={option} className={styles.singleChoice}>

                <Radio key={option + "<div></div>"} className={styles.radio} name={props.question} value={option}> {option}</Radio>

            </div>;
        });
        const singleChoiceGroup = <Radio.Group onChange={() => { }} className={styles.singleChoiceGroup}>{...singleChoiceOptions}</Radio.Group>;

        const singleChoiceWrapper = <div className={styles.singleChoiceWrapper}><h3 style={{ whiteSpace: "pre-wrap" }}>{props.question}</h3>{singleChoiceGroup}</div>;

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