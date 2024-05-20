import { ConfigProvider, Select } from 'antd';
import styles from '@/styles/components/questionLayouts.module.scss';
interface test_answer {
  test_id: string;
  parts: {
    _id: string;
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
export default function DropdownLayout(props: {
  question?: string;
  options?: string[];
  answer: string;
  partId: string;
  questionGroupsId: string;
  questionId: string;
  questionIndex: number | string;
  setAnswer: React.Dispatch<React.SetStateAction<test_answer>>;
  userAnswer: string | undefined | string[];
}) {
  function handleSetAnswer(value: string) {
    // props.setAnswer((prev) => ({
    //         ...prev,
    //         [props.questionIndex]: value,
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
        temp_question.answer_result.user_answer = value;
      }
      return temp;
    });
  }
  if (props.options) {
    const selecOptions = props.options.map((option: string) => {
      return { label: option, value: option };
    });
    const select = (
      <Select
        className={styles.dropdownGroup}
        defaultValue={props.userAnswer as string | undefined}
        onChange={(value: string) => {
          handleSetAnswer(value);
        }}
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
