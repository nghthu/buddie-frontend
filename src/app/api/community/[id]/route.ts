import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await req.json();
    console.log(formData);
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/questions/${params.id}`,
      {
        method: 'PUT',
        headers: {
          authorization: req.headers.get('authorization') ?? '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
