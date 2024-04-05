import { Checkbox, ConfigProvider } from 'antd';
import styles from '@/styles/components/questionLayouts.module.scss';
export default function MultiChoiceLayout(props: { question?: string, options?: string[], answers?: string, questionIndex?: number | string, setAnswer?: Function}) {
    if (props.options) {
        const multiChoiceGroup = <Checkbox.Group onChange={() => { }} options={props.options} className={styles.multiChoiceGroup}></Checkbox.Group>;

        const multiChoiceWrapper = <div className={styles.multiChoiceWrapper}><h3 style={{whiteSpace:"pre-wrap"}}>{props.question}</h3>{multiChoiceGroup}</div>;

        return (
            <>
                <ConfigProvider
                    theme={{
                        components: {
                            Checkbox: {
                                colorPrimary: "#10a9a0",
                                controlInteractiveSize: 20,
                                colorPrimaryHover: "#D5F4ED",
                                fontSize:20
                            }
                        }
                    }}>
                    {multiChoiceWrapper}
                </ConfigProvider>
            </>
        )
    } else {
        return (<></>)
    }
}   