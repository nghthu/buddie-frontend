import { NextResponse } from 'next/server';

export const POST = async function assessWriting(req: Request) {
  try {
    const reqData = await req.json();
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/ai/assess-writing`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'essay',
          topic: reqData.topic,
          content: reqData.content,
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
