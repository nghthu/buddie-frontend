import { Checkbox, ConfigProvider } from 'antd';
import styles from '@/styles/components/questionLayouts.module.scss';

export default function MultiChoiceLayout(props: {
  question?: string;
  options?: string[];
  answers: string[];
  questionIndex: number | string;
  setAnswer: React.Dispatch<React.SetStateAction<object>>;
  userAnswer: string | string[] | undefined;
}) {
  const indexes = [];
  for (let i = 0; i < props.answers.length; i++) {
    indexes.push(Number(props.questionIndex) + i);
  }
  let questionIndexes="";
  for (let i = 0; i < indexes.length; i++) {
    if (i === indexes.length - 1) {
      questionIndexes += indexes[i];
    } else {
      questionIndexes += indexes[i] + " - ";
    }
  }
  function handleSetAnswer(checkedValues: string[]) {
    props.setAnswer((prev) => ({
      ...prev,
      [props.questionIndex]: checkedValues,
    }));
  }
  if (props.options) {
    const multiChoiceGroup = (
      <Checkbox.Group
        onChange={(checkedValues: string[]) => { handleSetAnswer(checkedValues) }}
        options={props.options}
        className={styles.multiChoiceGroup}
        defaultValue={props.userAnswer as string[] | undefined}
      ></Checkbox.Group>
    );

    const multiChoiceWrapper = (
      <div className={styles.multiChoiceWrapper}>
        <h3 style={{ whiteSpace: 'pre-wrap' }}>{props.question}</h3>
        <h3 style={{ whiteSpace: 'pre-wrap' }}>Câu {questionIndexes}</h3>
        {multiChoiceGroup}
      </div>
    );

    return (
      <>
        <ConfigProvider
          theme={{
            components: {
              Checkbox: {
                colorPrimary: '#10a9a0',
                controlInteractiveSize: 20,
                colorPrimaryHover: '#D5F4ED',
              },
            },
          }}
        >
          {multiChoiceWrapper}
        </ConfigProvider>
      </>
    );
  } else {
    return <></>;
  }
}
