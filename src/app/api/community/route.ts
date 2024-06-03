import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const offset = searchParams.get('offset');
  const limit = searchParams.get('limit');
  const text = searchParams.get('text');
  let queryString = `${process.env.API_BASE_URL}/api/v1/questions?offset=${offset}&limit=${limit}`;
  if (text) {
    const encodedSearch = encodeURIComponent(text);
    queryString += `&text=${encodedSearch}`;
  }
  try {
    const response = await fetch(queryString, {
      method: 'GET',
      headers: request.headers,
    });
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
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/questions`,
      {
        method: 'POST',
        headers: {
          authorization: req.headers.get('authorization') ?? '',
        },
        body: formData,
      }
    );
    const dataRes = await response.json();
    return NextResponse.json(dataRes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}
