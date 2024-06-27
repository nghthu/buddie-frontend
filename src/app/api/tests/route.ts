import { uploadBuffer } from '@/lib';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page');
  const test_type = searchParams.get('test_type');
  const search = searchParams.get('search');
  const isbuddie = searchParams.get('isbuddie');
  //const queryString = `${process.env.API_BASE_URL}/api/v1/ai/synonyms?word=speed`;
  const offset = page ? Number(page) - 1 : 0;
  let queryString = `${process.env.API_BASE_URL}/api/v1/tests?limit=10&offset=${offset}&access=public&is_buddie_test=${isbuddie}`;
  if (test_type) {
    queryString += `&test_type=${test_type}`;
  }
  if (search) {
    const encodedSearch = encodeURIComponent(search);
    queryString += `&keyword=${encodedSearch}`;
  }
  //const queryString = `${process.env.API_BASE_URL}/api/v1/tests/661b5d4b0d4e11e6b2817f1b`;
  //console.log(queryString);

  try {
    const response = await fetch(queryString, {
      method: 'GET',
      headers: request.headers,
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}

type Part = {
  part_number: number;
  part_duration: number | null;
  part_prompt: string;
  question_groups: Array<QuestionGroup>;
};

type QuestionGroup = {
  is_single_question: boolean;
  question_groups_info: {
    question_groups_duration: number | null;
    question_groups_prompt: string;
  };
  questions: Array<Question>;
};

type Question = {
  question_number: number;
  question_type: string;
  question_prompt: string;
  question_duration: number | null;
  question_preparation_time: number | null;
};

export const POST = async function createTest(req: Request) {
  try {
    const reqData = await req.formData();
    const test = JSON.parse(reqData.get('test') as string);
    const testRecordingFile = reqData.get('test_recording') as File;
    const partRecordingFiles = reqData.getAll('part_recording') as File[];
    const partImages = reqData.getAll('part_images') as File[];
    const questionGroupRecordingFiles = reqData.getAll(
      'question_group_recording'
    ) as File[];
    const questionGroupImages = reqData.getAll(
      'question_group_images'
    ) as File[];
    const questionRecordingFiles = reqData.getAll(
      'question_recording'
    ) as File[];
    const questionImages = reqData.getAll('question_images') as File[];

    test.duration = test.duration ? test.duration * 60 : null;
    test.parts.forEach((part: Part) => {
      part.question_groups.forEach((questionGroup: QuestionGroup) => {
        questionGroup.questions.forEach((question: Question) => {
          question.question_duration = question.question_duration
            ? question.question_duration * 60
            : null;
        });
        questionGroup.question_groups_info.question_groups_duration =
          questionGroup.question_groups_info.question_groups_duration
            ? questionGroup.question_groups_info.question_groups_duration * 60
            : null;
      });
      part.part_duration = part.part_duration ? part.part_duration * 60 : null;
    });

    if (testRecordingFile) {
      const downloadUrl = await uploadBuffer(
        Buffer.from(await testRecordingFile.arrayBuffer()),
        `tests/${uuid()}/${testRecordingFile.name}`
      );
      test.test_recording = downloadUrl;
    }

    const uploadTasks: Promise<void>[] = [];

    if (partRecordingFiles.length > 0) {
      partRecordingFiles.forEach((partRecordingFile) => {
        if (partRecordingFile) {
          uploadTasks.push(
            (async () => {
              const downloadUrl = await uploadBuffer(
                Buffer.from(await partRecordingFile.arrayBuffer()),
                `tests/${uuid()}/${partRecordingFile.name}`
              );
              const partIndex =
                parseInt(partRecordingFile.name.split('-')[1].split('.')[0]) -
                1;
              test.parts[partIndex].part_recording = downloadUrl;
            })()
          );
        }
      });
    }

    if (partImages.length > 0) {
      partImages.forEach((partImage) => {
        if (partImage) {
          uploadTasks.push(
            (async () => {
              const downloadUrl = await uploadBuffer(
                Buffer.from(await partImage.arrayBuffer()),
                `tests/${uuid()}/${partImage.name}`
              );
              const partIndex = parseInt(partImage.name.split('-')[1]) - 1;

              const part = test.parts[partIndex];
              if (!Array.isArray(part.part_image_urls)) {
                part.part_image_urls = [];
              }
              part.part_image_urls.push(downloadUrl);
            })()
          );
        }
      });
    }

    if (questionGroupRecordingFiles.length > 0) {
      questionGroupRecordingFiles.forEach((questionGroupRecordingFile) => {
        if (questionGroupRecordingFile) {
          uploadTasks.push(
            (async () => {
              const downloadUrl = await uploadBuffer(
                Buffer.from(await questionGroupRecordingFile.arrayBuffer()),
                `tests/${uuid()}/${questionGroupRecordingFile.name}`
              );

              const partIndex =
                parseInt(questionGroupRecordingFile.name.split('-')[1]) - 1;
              const questionGroupIndex =
                parseInt(
                  questionGroupRecordingFile.name.split('-')[2].split('.')[0]
                ) - 1;

              test.parts[partIndex].question_groups[
                questionGroupIndex
              ].question_groups_info.question_group_recording = downloadUrl;
            })()
          );
        }
      });
    }

    if (questionGroupImages.length > 0) {
      questionGroupImages.forEach((questionGroupImage) => {
        if (questionGroupImage) {
          uploadTasks.push(
            (async () => {
              const downloadUrl = await uploadBuffer(
                Buffer.from(await questionGroupImage.arrayBuffer()),
                `tests/${uuid()}/${questionGroupImage.name}`
              );
              const partIndex =
                parseInt(questionGroupImage.name.split('-')[1]) - 1;
              const questionGroupIndex =
                parseInt(questionGroupImage.name.split('-')[2]) - 1;

              const questionGroup =
                test.parts[partIndex].question_groups[questionGroupIndex];
              if (!Array.isArray(questionGroup.question_group_images)) {
                questionGroup.question_groups_info.question_groups_image_urls =
                  [];
              }
              questionGroup.question_groups_info.question_groups_image_urls.push(
                downloadUrl
              );
            })()
          );
        }
      });
    }

    if (questionGroupRecordingFiles.length > 0) {
      questionRecordingFiles.forEach((questionRecordingFile) => {
        if (questionRecordingFile) {
          uploadTasks.push(
            (async () => {
              const downloadUrl = await uploadBuffer(
                Buffer.from(await questionRecordingFile.arrayBuffer()),
                `tests/${uuid()}/${questionRecordingFile.name}`
              );

              const partIndex =
                parseInt(questionRecordingFile.name.split('-')[1]) - 1;
              const questionGroupIndex =
                parseInt(questionRecordingFile.name.split('-')[2]) - 1;
              const questionIndex =
                parseInt(
                  questionRecordingFile.name.split('-')[3].split('.')[0]
                ) - 1;

              test.parts[partIndex].question_groups[
                questionGroupIndex
              ].questions[questionIndex].question_recording = downloadUrl;
            })()
          );
        }
      });
    }

    if (questionImages.length > 0) {
      questionImages.forEach((questionImage) => {
        if (questionImage) {
          uploadTasks.push(
            (async () => {
              const downloadUrl = await uploadBuffer(
                Buffer.from(await questionImage.arrayBuffer()),
                `tests/${uuid()}/${questionImage.name}`
              );

              const partIndex = parseInt(questionImage.name.split('-')[1]) - 1;
              const questionGroupIndex =
                parseInt(questionImage.name.split('-')[2]) - 1;
              const questionIndex =
                parseInt(questionImage.name.split('-')[3]) - 1;

              const question =
                test.parts[partIndex].question_groups[questionGroupIndex]
                  .questions[questionIndex];

              if (!Array.isArray(question.question_image_urls)) {
                question.question_image_urls = [];
              }
              question.question_image_urls.push(downloadUrl);
            })()
          );
        }
      });
    }

    await Promise.all(uploadTasks);

    const response = await fetch(`${process.env.API_BASE_URL}/api/v1/tests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.get('Authorization') || '',
      },
      body: JSON.stringify({test}),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
};
