import { NextResponse } from 'next/server';
import chalk from 'chalk';

export const POST = async function sendAnswer(req: Request) {
  try {
    const formData = await req.formData();

    console.log(chalk.bgYellow('req'), formData);

    const headers = new Headers();
    const authorizationHeader = req.headers.get('authorization');
    if (authorizationHeader) {
      headers.append('Authorization', authorizationHeader);
    }

    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/ai/assess-speaking`,
      {
        method: 'POST',
        headers: headers,
        body: formData,
      }
    );

    const data = await response.json();
    console.log(chalk.bgCyan('res'), data);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
};
