import { ConfigProvider, Radio, RadioChangeEvent } from 'antd';
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
export default function SingleChoiceLayout(props: {
  question?: string;
  options?: string[];
  questionIndex: number | string;
  partId: string;
  questionGroupsId: string;
  questionId: string;
  setAnswer: React.Dispatch<React.SetStateAction<test_answer>>;
  userAnswer: string | undefined | string[];
}) {
  function handleSetAnswer(e: RadioChangeEvent) {
    props.setAnswer((prev) => {
      const temp = { ...prev };

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
        temp_question.answer_result.user_answer = e.target.value;
      }
      return temp;
    });
  }
  if (props.options) {
    const singleChoiceOptions = props.options.map((option: string) => {
      return (
        <div
          key={option}
          className={styles.singleChoice}
        >
          <Radio
            key={option + '<div></div>'}
            className={styles.radio}
            name={props.question}
            value={option}
          >
            {' '}
            {option}
          </Radio>
        </div>
      );
    });
    const singleChoiceGroup = (
      <Radio.Group
        defaultValue={props.userAnswer as string | undefined}
        onChange={(e: RadioChangeEvent) => handleSetAnswer(e)}
        className={styles.singleChoiceGroup}
      >
        {...singleChoiceOptions}
      </Radio.Group>
    );

    const singleChoiceWrapper = (
      <div className={styles.singleChoiceWrapper}>
        <h3
          style={{
            whiteSpace: 'pre-wrap',
            fontWeight: '500',
            fontSize: '1.7rem',
          }}
        >
          Câu {props.questionIndex}. {props.question}
        </h3>
        {singleChoiceGroup}
      </div>
    );

    return (
      <>
        <ConfigProvider
          theme={{
            components: {
              Radio: {
                colorPrimary: '#10a9a0',
                radioSize: 20,
              },
            },
          }}
        >
          {singleChoiceWrapper}
        </ConfigProvider>
      </>
    );
  } else {
    return <></>;
  }
}
