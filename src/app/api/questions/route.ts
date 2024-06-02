import { NextResponse } from 'next/server';
import chalk from 'chalk';

export const POST = async function createQuestion(req: Request) {
  try {
    const formData = await req.formData();
    console.log(chalk.yellowBright('form data'), formData);
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/questions`,
      {
        method: 'POST',
        headers: {
          Authorization: req.headers.get('Authorization') ?? '',
        },
        body: formData,
      }
    );
    const data = await response.json();
    console.log(chalk.bgCyan('Create Question Response:'), data.data);
    return NextResponse.json(data.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
};
