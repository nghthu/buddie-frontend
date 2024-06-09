import { Checkbox, ConfigProvider } from 'antd';
import styles from '@/styles/components/questionLayouts.module.scss';
interface test_answer {
  test_id: string;
  parts: {
    _id: string;
    part_number: number;
    question_groups: {
      _id: string;
      questions: {
        _id: string;
        answer_result: {
          user_answer: string | string[];
        };
      }[];
    }[];
  }[];
}
export default function MultiChoiceLayout(props: {
  question?: string;
  options?: string[];
  answers: string[];
  partId: string;
  questionGroupsId: string;
  questionId: string;
  questionIndex: number | string;
  setAnswer: React.Dispatch<React.SetStateAction<test_answer>>;
  userAnswer: string | string[] | undefined;
}) {
  const indexes = [];
  for (let i = 0; i < props.answers.length; i++) {
    indexes.push(Number(props.questionIndex) + i);
  }
  let questionIndexes = '';
  for (let i = 0; i < indexes.length; i++) {
    if (i === indexes.length - 1) {
      questionIndexes += indexes[i];
    } else {
      questionIndexes += indexes[i] + ' - ';
    }
  }
  function handleSetAnswer(checkedValues: string[]) {
    // props.setAnswer((prev) => ({
    //   ...prev,
    //   [props.questionIndex]: checkedValues,
    // }));
    props.setAnswer((prev) => {
      const temp = { ...prev };
      // search for the right part
      const temp_part = temp['parts'].find(
        (part: { _id: string }) => part._id === props.partId
      );
      const temp_question_group = temp_part?.question_groups.find(
        (question_group: { _id: string }) =>
          question_group._id === props.questionGroupsId
      );
      const temp_question = temp_question_group?.questions.find(
        (question: { _id: string }) => question._id === props.questionId
      );
      if (temp_question) {
        temp_question.answer_result.user_answer = checkedValues;
      }
      return temp;
    });
  }
  if (props.options) {
    const formattedOptions = props.options.map((option: string, index) => {
      return { label: index + 1, value: option };
    });
    const multiChoiceGroup = (
      <Checkbox.Group
        onChange={(checkedValues: string[]) => {
          handleSetAnswer(checkedValues);
        }}
        options={formattedOptions}
        className={styles.multiChoiceGroup}
        defaultValue={props.userAnswer as string[] | undefined}
      ></Checkbox.Group>
    );

    const multiChoiceWrapper = (
      <div className={styles.multiChoiceWrapper}>
        <h3 style={{ whiteSpace: 'pre-wrap' }}>{props.question}</h3>
        <h3
          style={{
            whiteSpace: 'pre-wrap',
            fontWeight: '400',
            fontSize: '1.7rem',
          }}
        >
          Câu {questionIndexes}
        </h3>
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
