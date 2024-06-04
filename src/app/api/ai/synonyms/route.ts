import { NextResponse, NextRequest } from 'next/server';

export const GET = async function synonyms(req: NextRequest) {
  try {
    const word = req.nextUrl.searchParams.get('word');

    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/ai/synonyms?word=${word}`,
      {
        method: 'GET',
        headers: req.headers,
      }
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
};
