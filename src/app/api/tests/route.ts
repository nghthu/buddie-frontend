import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    //const queryString = `${process.env.API_BASE_URL}/api/v1/tests`;
    console.log('a');
    const queryString = `${process.env.API_BASE_URL}/api/v1/tests/661b5d4b0d4e11e6b2817f1b`;
    try {
        const response = await fetch(
          queryString,
          {
            method: 'GET'
          }
        );
        const data = await response.json();
        console.log(data);
        return NextResponse.json(data);
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error });
      }
}