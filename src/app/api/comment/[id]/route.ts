import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get('page'));
  const testId = params.id;
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/test-comments?test_id=${testId}&offset=${(page - 1) * 20}&limit=20`,
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
