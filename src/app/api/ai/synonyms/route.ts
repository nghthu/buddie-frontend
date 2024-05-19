import { NextResponse } from 'next/server';

export const GET = async function synonyms(req: Request, word: string) {
  try {
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
