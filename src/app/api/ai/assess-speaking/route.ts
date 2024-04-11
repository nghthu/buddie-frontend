import { NextResponse } from 'next/server';

export const POST = async function sendAnswers(req: Request) {
  try {
    const reqData = await req.json();
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/ai/assess-speaking`,
      {
        method: 'POST',
        body: JSON.stringify({
          speaking_part: 1,
          audio_type: 'mp3',
          question: reqData.question,
          speaking_audio: reqData.speakingAudio,
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
