import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { testId: string } }) {
    const testId=params.testId;
    try {
        const response = await fetch(
          `https://q40nfgqaj4.execute-api.ap-southeast-2.amazonaws.com/api/v1/tests/${testId}`,
          {
            method: 'GET'
          }
        );
    
        const data = await response.json();
        return NextResponse.json(data);
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error });
      }
}