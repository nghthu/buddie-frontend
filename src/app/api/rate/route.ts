import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();

    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/test-reviews`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: req.headers.get('authorization') ?? '',
        },
        body: JSON.stringify({
          test_id: reqBody.test_id,
          star: reqBody.star,
        }),
      }
    );
    const dataRes = await response.json();

    return NextResponse.json(dataRes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}
