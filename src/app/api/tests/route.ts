import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page');
  const test_type = searchParams.get('test_type');
  const search = searchParams.get('search');
  const isbuddie = searchParams.get('isbuddie');
  //const queryString = `${process.env.API_BASE_URL}/api/v1/ai/synonyms?word=speed`;
  const offset = page ? (Number(page) - 1) : 0;
  let queryString = `${process.env.API_BASE_URL}/api/v1/tests?limit=10&offset=${offset}&access=public&is_buddie_test=${isbuddie}`;
  if (test_type) {
    queryString += `&test_type=${test_type}`;
  }
  if (search) {
    const encodedSearch = encodeURIComponent(search);
    queryString += `&keyword=${encodedSearch}`;
  }
  //const queryString = `${process.env.API_BASE_URL}/api/v1/tests/661b5d4b0d4e11e6b2817f1b`;
  //console.log(queryString);

  try {
    const response = await fetch(
      queryString,
      {
        method: 'GET',
        headers: request.headers
      }
    );
    const data = await response.json();
    //console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}