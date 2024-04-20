import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { testId: string } }) {
    const testId=params.testId;
    try {
        const response = await fetch(
          `${process.env.API_BASE_URL}/api/v1/tests/${testId}`,
          {
            method: 'GET',
            headers: request.headers
          }
        );
        const data = await response.json();
        return NextResponse.json(data);
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error });

      }
}