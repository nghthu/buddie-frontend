import { NextResponse } from 'next/server';
import chalk from 'chalk';

export const PUT = async function updateQuestion(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reqData = await req.json();

    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/questions/${params.id}`,
      {
        method: 'POST',
        headers: req.headers,
        body: JSON.stringify(reqData),
      }
    );
    const data = await response.json();
    console.log(chalk.bgCyan('Update Question Response:'), data.data);
    return NextResponse.json(data.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
};
