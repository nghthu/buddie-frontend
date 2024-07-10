import { NextResponse, NextRequest } from 'next/server';

export const PUT = async function updateTest(req: NextRequest) {
  try {
    const testId = req.nextUrl.searchParams.get('testId');
    const reqData = await req.json();
    const response = await fetch(`${process.env.API_BASE_URL}/api/v1/tests/${testId}`, {
      method: 'PUT',
      headers: req.headers,
      body: JSON.stringify(reqData),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
};