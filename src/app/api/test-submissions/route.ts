import { NextResponse } from 'next/server';
import chalk from 'chalk';

export const GET = async function getTestSubmissionById(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);

    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/test-submissions?offset=${searchParams.get('offset')}&limit=${searchParams.get('limit')}`,
      {
        headers: req.headers,
      }
    );
    const data = await response.json();
    console.log(chalk.bgYellow('Get Test Submission List:'), data);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
};

export const POST = async function createTestSubmission(req: Request) {
  try {
    const reqData = await req.json();
    console.log('reqData', reqData);
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/test-submissions`,
      {
        method: 'POST',
        headers: req.headers,
        body: JSON.stringify(reqData),
      }
    );
    const data = await response.json();
    console.log(chalk.bgBlueBright('Create Test Submission Response:'), data);
    return NextResponse.json(data.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
};
