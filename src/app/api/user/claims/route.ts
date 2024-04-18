import { ResponseData } from '@/common';
import { NextResponse } from 'next/server';

export interface UserCustomClaims {
  admin: boolean;
  standard_request_count: number;
  pro_request_count: number;
}

export const POST = async function setCustomClaims(req: Request) {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/v1/user/claims`,
      {
        method: 'POST',
        headers: req.headers,
      }
    );

    const data: ResponseData<UserCustomClaims> = await response.json();
    return NextResponse.json(data);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(error);
  }
};
