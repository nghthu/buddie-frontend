import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { uploadBuffer } from '@/lib';

export async function GET(
  request: Request,
  { params }: { params: { testId: string } }
) {
  const testId = params.testId;
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/tests/${testId}`,
      {
        method: 'GET',
        headers: request.headers,
      }
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
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

export const PUT = async function updateTest(req: NextRequest, { params }: { params: { testId: string } }) {
  try {
    const testId = params.testId;
    const reqData = await req.formData();
    const test = JSON.parse(reqData.get('test') as string);
    const testRecordingFile = reqData.get('test_recording') as File;
    const partRecordingFiles = reqData.getAll('part_recording') as File[];
    const partImages = reqData.getAll('part_images') as File[];
    const questionGroupRecordingFiles = reqData.getAll(
      'question_groups_recording'
    ) as File[];
    const questionGroupImages = reqData.getAll(
      'question_groups_images'
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
              ].question_groups_info.question_groups_recording = downloadUrl;
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
              if (!Array.isArray(questionGroup.question_groups_info.question_groups_image_urls)) {
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

    console.log(test);

    console.log(test.parts[0].question_groups[0]);

    console.log(test.parts[0].question_groups[0].questions[0]);
    const response = await fetch(`${process.env.API_BASE_URL}/api/v1/tests/${testId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.get('Authorization') || '',
      },
      body: JSON.stringify(test),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
};

export async function DELETE(req: NextRequest, { params }: { params: { testId: string } }) {
  try {
    const testId = params.testId;
    const response = await fetch(`${process.env.API_BASE_URL}/api/v1/tests/${testId}`, {
      method: 'DELETE',
      headers: {
        Authorization: req.headers.get('Authorization') || '',
      },
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
};
