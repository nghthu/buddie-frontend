import { NextResponse } from 'next/server';
import chalk from 'chalk';

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
