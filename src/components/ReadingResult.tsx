interface Question {
  answer_result: {
    user_answer: string | string[];
    assess: boolean;
    is_correct: boolean;
  };
  _id: string;
}

interface QuestionGroup {
  questions: Question[];
  _id: string;
}

interface Part {
  question_groups: QuestionGroup[];
  _id: string;
}

interface TestData {
  user_id: string;
  test_id: string;
  question_count: number;
  correct_answer_count: number;
  score: number;
  parts: Part[];
  _id: string;
  created_at: string;
  updated_at: string;
  __v: number;
}
interface questionAndAnswer {
  index: number | number[];
  question: string;
  answer: string | string[];
  userAnswer: string | string[];
}
interface Props {
  fetchedData: TestData | undefined;
  questionAndAnswer: questionAndAnswer[];
}
export default function ReadingResult({
  fetchedData,
  questionAndAnswer,
}: Props) {
  console.log(fetchedData);
  console.log(questionAndAnswer);
  return <></>;
}
