import { ConfigProvider, Select } from 'antd';
import styles from '@/styles/components/questionLayouts.module.scss';
export default function DropdownLayout(props: { question?: string, options?: string[], answer?: string, questionIndex?: number | string, setAnswer?: Function}) {
    if (props.options) {
        const selecOptions = props.options.map((option: string, index: number) => {
            return { label: option, value: option };
        });
        const select = <Select className={styles.dropdownGroup} defaultValue={props.options[0]} onChange={() => { }} options={selecOptions} />;
        return (
            <ConfigProvider theme={{
                "components": {
                    "Select": {
                        "fontSize": 20
                    }
                }
            }}>
                <div className={styles.dropdownWrapper}><h3>{props.question}</h3>{select}</div>
            </ConfigProvider>
        )
    } else {
        return (<></>)
    }
}   