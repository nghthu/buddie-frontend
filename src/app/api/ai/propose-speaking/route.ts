import { NextResponse } from 'next/server';

export const POST = async function paraphrase(req: Request) {
  try {
    const reqData = await req.json();
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/ai/propose-speaking`,
      {
        method: 'POST',
        headers: req.headers,
        body: JSON.stringify({
          topic: reqData.topic,
        }),
      }
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
};
