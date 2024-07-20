import chalk from 'chalk';
import { NextResponse } from 'next/server';

export const GET = async function getUserReport(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);

    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/users/${params.userId}/reports?month=${searchParams.get('month')}&year=${searchParams.get('year')}`,
      {
        headers: req.headers,
      }
    );
    const data = await response.json();
    console.log(chalk.bgCyan('Get User Report Response:'), data);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
};
