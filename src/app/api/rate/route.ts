import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const get = await fetch(
      `${process.env.API_BASE_URL}/api/v1/test-reviews?offset=0&limit=10&test_id=${reqBody.test_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: req.headers.get('authorization') ?? '',
        },
      }
    ).then((res) => res.json());
    console.log(get.data);
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
    console.log(dataRes);
    return NextResponse.json(dataRes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}
