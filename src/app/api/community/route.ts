import chalk from 'chalk';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const offset = searchParams.get('offset');
  const limit = searchParams.get('limit');
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/questions?offset=${offset}&limit=${limit}`,
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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    // formdata.append('audio', fileInput.files[0], '[PROXY]');
    // formdata.append('image', fileInput.files[0], '[PROXY]');
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/questions`,
      {
        method: 'POST',
        headers: req.headers,
        body: formData,
      }
    );
    const dataRes = await response.json();
    console.log(chalk.bgCyan('Question submission response:'), dataRes);
    return NextResponse.json(dataRes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}
