import chalk from 'chalk';
import { NextResponse } from 'next/server';

export const GET = async function getTestSubmissionById(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/test-submissions/${params.id}`,
      {
        headers: req.headers,
      }
    );
    const data = await response.json();
    console.log(chalk.bgCyan('Get Test Submission By ID Response:'), data);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
};
